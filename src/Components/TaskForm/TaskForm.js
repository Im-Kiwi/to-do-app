import { useDispatch, useSelector } from 'react-redux'
import { Row, Container } from 'react-bootstrap'
import { IconButton, TextField, Stack, Button, useMediaQuery, Tooltip } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';

//---------importing from other files
import classes from './TaskForm.module.css'
import { allTasksAction } from '../../Store/Reducers/allTasks'
import LabelForm from './LabelForm/LabelForm'
import useModal from '../../hooks/useModal';
import { errorFlag } from '../../Identifiers/identifiers';

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()
const currentDay = new Date().getDate()

const TaskForm = () => {

    const dispatch = useDispatch()

    const smBreakPoint = useMediaQuery('(max-width : 410px)')

    const currentTask = useSelector(state => state.allTasks.currentTask) // contains the current task mentioned in the input of task create box
    const currentLabel = useSelector(state => state.allTasks.currentLabel)
    const showCreateTask = useSelector(state => state.allTasks.showCreateTask)
    const editTaskFlag = useSelector(state => state.allTasks.editZone.editTaskFlag)
    const editTaskId = useSelector(state => state.allTasks.editZone.editTaskID)
    const userId = useSelector(state => state.auth.userId)
    const year = useSelector(state => state.date.selectedYear)
    const month = useSelector(state => state.date.selectedMonth)
    const date = useSelector(state => state.date.selectedDay)

    const [ , modalShowHandler, ] = useModal(errorFlag)

    // this method will handle the change in the input tag 
    const changeHandler = (event) => {
        dispatch(allTasksAction.updateCurrentTask(event.target.value))
    }

    //this method will show the form when click on the add button
    const displayFormHandler = () => {
        dispatch(allTasksAction.showCreateTask(true))
        dispatch(allTasksAction.updateShowLabel(true))
    }

    // to close the entire form of creating task
    const closeFormHandler = () => {
        dispatch(allTasksAction.showCreateTask(false))
        dispatch(allTasksAction.editZoneHandler({editTaskFlag : false, editTaskID : null}))
        dispatch(allTasksAction.updateCurrentTask(''))
        dispatch(allTasksAction.updateCurrentLabel(''))
        dispatch(allTasksAction.updateShowLabel(true))
    }

    // adding a new/updated task to the database
    const addTaskHandler = async () => {
        const createFor = new Date(year.year, month.id, date.date).getTime()
        const createAt = new Date().getTime()
        if (currentTask.length !== 0) {
            const tasks = {
                userId : userId,
                time : `${date.date}-${month.id+1}-${year.year}`,
                day: date.date,
                month: month.id,
                year: year.year,
                task : currentTask,
                isPending : true,
                createAt : createAt,
                createFor : createFor,
                label : currentLabel
            }

            const updatedTask = {
                task : currentTask,
                label : currentLabel
            }
            if (editTaskFlag) {
                try {
                    await axios.patch(`${process.env.REACT_APP_SEND_REQ_TO_DB}/tasks-${userId}/${editTaskId}.json`, updatedTask)
                } catch(err) {
                    modalShowHandler()
                }
            } else {
                try {
                    await axios.post(`${process.env.REACT_APP_SEND_REQ_TO_DB}/tasks-${userId}.json`, tasks)
                } catch(err) {
                    modalShowHandler()
                }
            }
            
            dispatch(allTasksAction.updateCurrentTask(''))
            dispatch(allTasksAction.updateCurrentLabel(''))
            dispatch(allTasksAction.updateIsDone(true))
            dispatch(allTasksAction.showCreateTask(false))
            dispatch(allTasksAction.editZoneHandler({editTaskFlag : false, editTaskID : null}))
        }
    }

     // dynamically showing Add task button which will display the form to add task
    let showAddTaskButton = false
    if ( year.year === currentYear && month.id === currentMonth && date.date >= currentDay) {
        showAddTaskButton = true
    }else if (year.year > currentYear) {
        showAddTaskButton = true
    } else if (year.year >= currentYear && month.id > currentMonth) {
        showAddTaskButton = true
    } 


    return (
        <div className = 'mt-2'>
            {showAddTaskButton ? 
                <div className = 'text-center mx-auto'>                    
                    {showCreateTask ? 
                        <Row className = {['mt-5 mx-auto', classes.taskRow].join(' ')}>
                            <Container>
                                <TextField fullWidth
                                    label = 'Enter your task' 
                                    type = 'text' 
                                    value = {currentTask}  
                                    onChange = {changeHandler}  
                                    size = 'small'
                                />  
                                <Stack justifyContent = {smBreakPoint ? 'center' : 'flex-end'} 
                                    direction = {smBreakPoint ? 'column' : 'row'} 
                                    sx = {{mt : 1, float : 'right', width : '100%'}}>  
                                    <LabelForm />
                                    
                                    <Button 
                                        className = {['text-light', classes.add, smBreakPoint ? 'mx-auto' : ''].join(' ')}
                                        variant = 'contained'                                        
                                        color = 'info'                                                          
                                        onClick = {addTaskHandler}
                                    >
                                        Add
                                    </Button>
                                    <Button 
                                        className = {['text-light', classes.cancel, smBreakPoint ? 'mx-auto' : ''].join(' ')}
                                        variant = 'contained'
                                        onClick = {closeFormHandler}                                        
                                    >
                                        Cancel
                                    </Button>                                    
                                </Stack>                                
                            </Container>
                        </Row>
                        : 
                        <Tooltip title = 'Create Task'>
                            <IconButton 
                                className = {[classes.addTaskButton, 'mx-auto'].join(' ')} 
                                onClick = {displayFormHandler}
                            >
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </div>
            :
                null            
            }
        </div>
    )
}

export default TaskForm