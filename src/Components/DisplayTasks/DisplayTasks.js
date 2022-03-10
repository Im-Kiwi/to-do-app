import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Checkbox, Chip, Stack, useMediaQuery, Box, Typography, Zoom, Tooltip } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded';
import EditIcon from '@mui/icons-material/Edit';

// --------- importing contents from other files -----------
import classes from './DisplayTasks.module.css'
import { allTasksAction } from '../../Store/Reducers/allTasks'
import { transitionAction } from '../../Store/Reducers/transition';

const DisplayTasks = props => {
    const dispatch = useDispatch()

    const matched = useMediaQuery('(min-width : 300px) and (max-width : 400px)') // creating responsive breakpoint

    const taskId = useSelector(state => state.transition.zoomButtons.id)
    const zoomFlag = useSelector(state => state.transition.zoomButtons.status)

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDay = new Date().getDate()

    let dynamicButton
    let dynamicButtonClass = null

    // method to edit task
    const editTaskHandler = () => {
        dispatch(allTasksAction.showCreateTask(true))   
        dispatch(allTasksAction.updateShowLabel(false))     
        dispatch(allTasksAction.updateCurrentTask(props.task.task))
        dispatch(allTasksAction.updateCurrentLabel(props.task.label))
        dispatch(allTasksAction.editZoneHandler({
            editTaskFlag : true, 
            editTaskID : props.task.id, 
            editTaskTime : props.task.createFor
        }))
    }

    // method to start the transition effect once user hover on each tasks
    const hoverButtons = (hover) => {
        if (hover) {
            dispatch(transitionAction.updateZoomButtons({status : true, id : props.task.id}))
        } else {
            dispatch(transitionAction.updateZoomButtons({status : false, id : null}))
        }
    }
    

    // to show delete and forward button under a task if its an old task
    const delAndForwButton = (
        <Box sx = {{position : 'relative', bottom : 7}}>
            <Zoom in = {props.task.id === taskId ? zoomFlag : false}>
                <Tooltip title = 'delete'>
                    <IconButton
                        onClick = {() => props.deleteTaskHandler(props.task)} 
                    >
                        <DeleteOutlineIcon sx = {{fontSize : '1.4rem'}} />
                    </IconButton> 
                </Tooltip>
            </Zoom>
            {props.task.isPending ?   // make sure to display forward button below each task only when the task is pending
                <Zoom 
                    in = {props.task.id === taskId ? zoomFlag : false}
                    style = {{transitionDelay : zoomFlag ? '150ms' : '0ms'}}
                >   
                    <Tooltip title = 'forward task to current day'>
                        <IconButton 
                            onClick = {() => props.forwardTaskHandler(props.task)}
                            className = {dynamicButtonClass}
                        >
                            <ForwardRoundedIcon sx = {{fontSize : '1.4rem'}} />
                        </IconButton>            
                    </Tooltip>
                </Zoom>
            :
                null
            }            
        </Box>                        
    )

    // to show delete and edit button if the task is a current day task or future task
    const deleteButton = (
        <Box sx = {{position : 'relative', bottom : 7}}>
            <Zoom 
                in = {props.task.id === taskId ? zoomFlag : false}
            >
                <Tooltip title = 'delete'>
                    <IconButton
                        onClick = {() => props.deleteTaskHandler(props.task)} 
                    >
                        <DeleteOutlineIcon sx = {{fontSize : '1.4rem'}} />
                    </IconButton> 
                </Tooltip>
            </Zoom>
            <Zoom
                in = {props.task.id === taskId ? zoomFlag : false}
                style = {{transitionDelay : zoomFlag ? '150ms' : '0ms'}}
            >   
                <Tooltip title = 'edit'>
                    <IconButton 
                        onClick = {() => editTaskHandler(props.task.id)}
                    >
                        <EditIcon sx = {{fontSize : '1.4rem'}} />
                    </IconButton>        
                </Tooltip>
            </Zoom>
        </Box>
    )

    // to check whether the task are old or not, if its old then forward & delete buttons otherwise delete & edit buttons will appear
    if (props.task.year < currentYear) {
        dynamicButton = delAndForwButton
    } else if (props.task.year === currentYear && props.task.month < currentMonth) {
        dynamicButton = delAndForwButton
    } else if (props.task.year === currentYear && props.task.month === currentMonth && props.task.day < currentDay) {
        dynamicButton = delAndForwButton
    } else {
        dynamicButton = deleteButton
    }

    return (
        <>
            <Box onMouseEnter = {() => hoverButtons(true)} onMouseLeave = {() => hoverButtons()}>  
                <Stack direction = 'row' alignItems = ''>
                    <Checkbox 
                        aria-label = 'checkbox' 
                        color = 'success' 
                        onChange = {() => props.checkTaskHandler(props.task)}                        
                        checked = {!props.isPending}
                        className = {classes.checkbox}
                        size = {matched ? 'small' : 'medium'}
                    />
                    <Box className = {['mt-2',].join(' ')}>
                        <Typography 
                            // here classeName is set dynamically according to the task completion
                            className = {[!props.isPending ? classes.strikeTask : null, classes.text].join(' ')}
                        >
                            {props.task.task}
                        </Typography>
                    </Box>
                </Stack>
                <Stack 
                    direction = 'row' 
                    justifyContent = 'flex-start' 
                    alignItems = 'flex-start'
                    sx = {{ml : 5}}
                >
                    <Chip
                        sx = {{borderColor : '#f03658', color : '#f03658', fontSize : '0.75rem', maxWidth : 75}} 
                        size = 'small' 
                        label = {props.task.label !== '' ? props.task.label : 'no label'} 
                        variant = 'outlined' />
                    {dynamicButton}
                </Stack>          
            </Box>  
        </>
    )
}

export default DisplayTasks