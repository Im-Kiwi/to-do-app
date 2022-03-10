import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uniqueId } from 'uuid'
import { Row, Col } from 'react-bootstrap'
import { IconButton, Fade} from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

//-------- importing contents from other files--------------
import classes from './TaskCreation.module.css'
import TaskForm from '../../Components/TaskForm/TaskForm';
import useMethods from '../../hooks/useMethods'
import DisplayTasks from '../../Components/DisplayTasks/DisplayTasks'
import { dateActions } from '../../Store/Reducers/date'
import { transitionAction } from '../../Store/Reducers/transition';
import DisplayErrors from '../../Components/DisplayErrors/DisplayErrors'

const TaskCreator = () => {
    const dispatch = useDispatch()

    const [deleteTaskHandler, checkTaskHandler, forwardTaskHandler] = useMethods()

    // these all data are brought from the redux store
    const showTasks = useSelector(state => state.allTasks.totalTasks) // this contains the tasks created by the user
    const year = useSelector(state => state.date.selectedYear)
    const month = useSelector(state => state.date.selectedMonth)
    const date = useSelector(state => state.date.selectedDay)
    const fadeTrans = useSelector(state => state.transition.fadeTasks)
    const toggleFade = useSelector(state => state.transition.toggleFade)

    useEffect(() => {
        dispatch(transitionAction.updateFadeTasks(true)) // transition effect will be enabled
    }, [date.date, toggleFade, dispatch])

    // filtering the tasks according to the date the task was created
    const filteredTasks = showTasks.filter(task => {
        const timeStamp = `${date.date}-${month.id+1}-${year.year}`
        return timeStamp === task.time
    })

    // sorting the task based on the creation
    const sortedTasks = filteredTasks.sort((a, b) => b.createAt - a.createAt)

    let addSuffix

        if (date.date) {
            addSuffix = date.date.toString()
            if (addSuffix === '11' || addSuffix === '12' || addSuffix === '13') {
                addSuffix = addSuffix + 'th'
            } else if (addSuffix[addSuffix.length - 1] === '1') {
                addSuffix = addSuffix + 'st'
            } else if (addSuffix[addSuffix.length - 1] === '2')  {
                addSuffix = addSuffix + 'nd'
            } else if (addSuffix[addSuffix.length - 1] === '3') {
                addSuffix = addSuffix + 'rd'
            } else {
                addSuffix = addSuffix + 'th'
            }
        }


    // method to change day of the month by clicking on forward and backward button 
    const changeDateHandler = (mode) => { 
        dispatch(transitionAction.updateFadeTasks(false)) // transition effect will initially disabled on tasks
        
        const currentDay = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()
        const selectedDay = new Date(year.year, month.id, date.date).getTime()
        let incrementDay = new Date(year.year, month.id, date.date + 1).getTime()
        let decrementDay = new Date(year.year, month.id, date.date - 1).getTime()

        const finalResult = []

        if (selectedDay <= currentDay) {
            // filtering tasks if time for which the task assigned is less then the current time
            const filteredTasks = showTasks.filter(task => task.createFor < currentDay).map(task => {
                return task.createFor
            }).sort((a,b) => b - a)
    
            const removeDup = new Set(filteredTasks) // removing the duplicated time from the filtered tasks

            for (let val of removeDup) {        // storing the unique values inside a new empty array
                finalResult.push(val)
            }
            
            /* finding the index of the value of the array depending upon the selected day value, if both matches then index of
            that value will be returned */
            const getIndex = finalResult.findIndex(ms => ms === selectedDay) 
            
            if (finalResult.length === 0) {
                decrementDay = currentDay
            } else if (selectedDay === currentDay) {
                decrementDay = finalResult[0]                
            } else if (selectedDay === finalResult[0]) {
                incrementDay = currentDay
                decrementDay = finalResult[getIndex + 1]
            } else if (selectedDay === finalResult[finalResult.length - 1]) {
                incrementDay = finalResult[finalResult.length - 2]
                // making sure to disable the transition when user reaches to the oldest date containing tasks
                dispatch(transitionAction.updateFadeTasks(true)) 
            } else if (selectedDay < currentDay) {
                decrementDay = finalResult[getIndex + 1]
                incrementDay = finalResult[getIndex - 1]
            }  
        }

        if (mode) {
            const dayOfMonth = new Date(incrementDay).getDate()
            const dayOfWeek = new Date(incrementDay).getDay()
            const newMonth = new Date(incrementDay).getMonth()
            const newYear = new Date(incrementDay).getFullYear()
            dispatch(dateActions.getDate({date : dayOfMonth, day : dayOfWeek}))   
            dispatch(dateActions.changeMonth(newMonth))
            dispatch(dateActions.changeYear(newYear))    

        } else if (!mode && selectedDay !== finalResult[finalResult.length - 1]) {
            const dayOfMonth = new Date(decrementDay).getDate()
            const dayOfWeek = new Date(decrementDay).getDay()
            const newMonth = new Date(decrementDay).getMonth()
            const newYear = new Date(decrementDay).getFullYear()

            dispatch(dateActions.getDate({date : dayOfMonth, day : dayOfWeek}))
            dispatch(dateActions.changeMonth(newMonth))
            dispatch(dateActions.changeYear(newYear))            
        }
    }
    
    return (
        <div className = {[classes.taskContainer].join(' ')}>
            <Row className = {['text-center text-light', classes.showDate].join(' ')}>                
                <Col xs = {2} className = 'p-0'>
                    <IconButton 
                        onClick = {() => changeDateHandler(false)}
                        sx = {{color : '#f8f9fa'}}
                    >
                        <NavigateBeforeIcon />
                    </IconButton>
                </Col>
                <Col>
                    {date.date ? `${addSuffix} ${month.month} ${year.year}` : 'select a day'}                
                </Col>
                <Col xs = {2} className = 'p-0'>
                    <IconButton 
                        onClick = {() => changeDateHandler(true)}
                        sx = {{color : '#f8f9fa'}}
                    >
                        <NavigateNextIcon />
                    </IconButton>
                </Col>
            </Row>
            {fadeTrans ?
                <div className = {[classes.taskCollection].join(' ')}>
                    <Fade in = {true}>
                        <div>                              
                            {sortedTasks.map(task => (
                                <div key = {uniqueId()} className = {classes.tasks}>  
                                    <DisplayTasks
                                        key = {uniqueId()}
                                        isPending = {task.isPending}
                                        task = {task}
                                        deleteTaskHandler = {deleteTaskHandler}
                                        checkTaskHandler = {checkTaskHandler}
                                        forwardTaskHandler = {forwardTaskHandler}
                                        /> 
                                </div>
                            ))}                            
                        </div>
                    </Fade>
                </div>
            : 
            null
            }
            <TaskForm />  
            <DisplayErrors />          
        </div>
    )
}

export default TaskCreator