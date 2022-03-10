import React, { useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, FormControl, InputLabel, Select, MenuItem, Stack, Box,
    useMediaQuery, IconButton, Button, Typography, Grow, Container } from '@mui/material';
import { DeleteForever, DateRange, ClearAllRounded } from '@mui/icons-material'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uniqueId } from 'uuid'
import { useLocation } from 'react-router-dom'


// ------------ imports contents from other files -------------
import DisplayTasks from '../../Components/DisplayTasks/DisplayTasks';
import TaskForm from '../../Components/TaskForm/TaskForm';
import { selectDataActions } from '../../Store/Reducers/selectData';
import classes from './InboxAccordion.module.css'
import { noTasks } from '../../ToImageStore/pathToImages';
import { loadingActions } from '../../Store/Reducers/loading';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/* customizing the mui theme so as to change the mode of the form control to dark which will result the form control to 
appear in white color */
const customTheme = createTheme({
    palette : {
        mode : 'dark'
    }
})

const InboxAccordion = props => {
    const { pathname } = useLocation()
    const dispatch = useDispatch()
    const changeDirection = useMediaQuery('(max-width : 504px)')

    const inboxGrow = useSelector(state => state.transition.inboxGrow) // value to control the transition effect
    const showMore = useSelector(state => state.loading.showMore)


    // using this in conditional statement to display the task form on an accordion at a time when click on the edit task button
    const timeOfCreation = useSelector(state => state.allTasks.editZone.editTaskTime)

    let finalTimeStamps = [...props.updatedTimeStamps]

    // array will filter depending upon the value in date select tag in inbox page
    if (props.selectYear !== '' && props.selectMonth !== '' && props.selectDay !== '') {
        finalTimeStamps = props.updatedTimeStamps.filter(time => {
            return time.year === props.selectYear && time.month === props.selectMonth && time.day === props.selectDay
        })
    } else if (props.selectYear !== '' && props.selectMonth !== '') {
        let filterByYear = props.updatedTimeStamps.filter(time => time.year === props.selectYear)
        finalTimeStamps = filterByYear.filter(time => time.month === props.selectMonth)
    } else if (props.selectYear !== '') {
        finalTimeStamps = props.updatedTimeStamps.filter(time => time.year === props.selectYear)
    }

    if (!showMore && finalTimeStamps.length > 3) {
        finalTimeStamps = props.updatedTimeStamps.filter((data, id) => {
            if (id <= 3) {
                return data
            } else {
                return null
            }
        })
    }    

    // by default the value in select label tag will be 'All'
    const selectLabelsOptions = finalTimeStamps.map(() => {
        return 'All'
    })

    // the 'check' here is used to make sure the useEffect executes if its value becomes 'true'
    let check = false
    if (selectLabelsOptions.length !== 0) {
        check = true
    }
    /*this useEffect will execute when the selectLabelsOptions array will be non empty and once its non empty then 'check' will
    be set to true and also this useEffect will gonna run depends upon the other dependencies too */
    useEffect(() => {
        dispatch(selectDataActions.initialLabel(selectLabelsOptions))
    }, [check, dispatch, pathname, props.selectYear, props.selectMonth, props.selectDay, showMore])


    const selectLabelHandler = (event, id) => {
        if (props.selectLabel !== 'All') {
            const findId = props.selectLabel.findIndex( (_,labelId) => labelId === id )
            dispatch(selectDataActions.changeLabel({value : event.target.value, id : findId}))

        }
    }
    
    // displaying multiple accordion containing the tasks/day 
    const taskInInbox = finalTimeStamps.map((time, id) => {
        const tasksOfDay = props.allTasks.filter(task => task.time === time.time) // no. of tasks of that day
        let dateInStr = tasksOfDay[0].day.toString()
        let lastEl = dateInStr.length-1
        
        // make sure to add 'st','nd','rd','th' after the last digit of date 
        if (dateInStr === '11' || dateInStr === '12' || dateInStr === '13') {
            dateInStr = dateInStr + 'th'
        } else if (dateInStr[lastEl] === '1') {
            dateInStr = dateInStr + 'st'
        } else if (dateInStr[lastEl] === '2')  {
            dateInStr = dateInStr + 'nd'
        } else if (dateInStr[lastEl] === '3') {
            dateInStr = dateInStr + 'rd'
        } else {
            dateInStr = dateInStr + 'th'
        }

        // to display the tasks of the day by task's label
        const filterByLabel = tasksOfDay.filter(task => {
            if (props.selectLabel[id] === 'All') {
                return task
            } else if (props.selectLabel[id] === 'no label') {
                return task.label === ''
            } else if (props.selectLabel[id] === task.label) {
                return task.label === props.selectLabel[id]
            } else {
                return null
            }
        })

        // this below block of code is to create an array and include non repeated labels so as to show it as options in select tag
        let uniqueLabels = []
        const labels = tasksOfDay.map(label => {
            if (label.label === '') {
                return 'no label'
            } else {
                return label.label
            }
        })
        const removeDup = new Set(labels)

        for (let val of removeDup) {
            uniqueLabels.push(val)
        }

        return (
            <Accordion expanded = {true} key = {uniqueId()}   className = 'mb-3'>
                <AccordionSummary sx = {{backgroundColor : '#1d2a30', cursor : 'default !important'}}> 
                    <Stack 
                        direction = {changeDirection ? 'column' : 'row'} 
                        sx = {{width : '100%'}} 
                        justifyContent = 'space-between'
                        alignItems = 'center'
                        spacing = {3}
                    >
                        <Box 
                            className = {['text-light', changeDirection ? 'mx-auto' : '', classes.date].join(' ')}
                        >
                            <DateRange className = 'me-1' /> 
                            {dateInStr} {MONTHS[tasksOfDay[0].month]} {tasksOfDay[0].year}
                        </Box>
                        <Box className = {changeDirection ? 'mx-auto' : ''}>
                            <ThemeProvider theme = {customTheme}>
                                <FormControl 
                                    sx = {{width : 'auto', minWidth : 100, maxWidth : 190}}
                                    size = 'small'
                                    variant = 'outlined'
                                >
                                    <InputLabel className='text-light' id = 'show label' >Show by label</InputLabel>
                                    <Select                                        
                                        labelId = 'show label'                     
                                        label = 'Show by label'    
                                        onChange = {event => selectLabelHandler(event, id)}
                                        value = {props.selectLabel.length === 0 ? '' : props.selectLabel[id]}
                                    >
                                        <MenuItem value = 'All'>All</MenuItem>
                                        {uniqueLabels.map(label => {
                                            return <MenuItem key = {uniqueId()} value = {label}>{label}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </ThemeProvider>
                        </Box>                        
                            <IconButton
                                className = 'text-light border'
                                onClick = {() => {
                                    props.modalShowHandler()
                                    props.setCleanSpecific({status : true, tasksToDelete : tasksOfDay})
                                }}
                            >
                                <DeleteForever />
                            </IconButton>
                    </Stack>                                    
                </AccordionSummary>
                <AccordionDetails>
                    <div className = {classes.taskContainer}>
                        {filterByLabel.map(dayTask => {
                            return (                                
                                <div key = {uniqueId()}>                            
                                    <DisplayTasks 
                                        task = {dayTask}
                                        isPending = {dayTask.isPending}
                                        checkTaskHandler = {props.checkTaskHandler}
                                        deleteTaskHandler = {props.deleteTaskHandler}
                                        forwardTaskHandler = {props.forwardTaskHandler}
                                    />                                   
                                </div>
                            )
                        })}
                    </div>
                </AccordionDetails>
                {props.showEditTaskForm && time.createFor === timeOfCreation ? // to show the task form below all tasks
                    <Container className = 'mb-4'>
                        <TaskForm />
                    </Container>
                :
                    null
                }
            </Accordion>
        )
    })

    return (
        <>
        {/* dynamically displaying clear all button for the particular path */}
            { (pathname === `/${props.userName}/inbox/history` || pathname === `/${props.userName}/inbox/upcoming-tasks`) && finalTimeStamps.length !== 0 ?
                <Stack direction = 'row' justifyContent = 'flex-end'>
                    <Button 
                        sx = {{color : '#1d2a30'}} 
                        variant = 'text' 
                        disableRipple 
                        size = 'small'
                        onClick = {() => {
                            props.modalShowHandler() 
                            props.setCleanSpecific({status : false, tasksOfDay : []})
                        }}
                    >
                            <ClearAllRounded />
                            <Typography variant = 'subtitle2'>clear all</Typography>
                    </Button>                                            
                </Stack>
            : 
                null
            }   
            { finalTimeStamps.length === 0 ? // applying the transition effect only when the array is empty
                <Grow in = {inboxGrow}>
                    {inboxGrow ? 
                        <Stack direction = 'column'>
                            <Image className = 'mx-auto' fluid src = {noTasks} alt = 'no tasks' width = {450} height = {450} />
                            { pathname === `/${props.userName}/inbox/history` ?
                                <Typography variant= 'h4' className = 'text-center mt-5'>
                                    No History
                                </Typography>
                            :
                                <Typography variant= 'h4' className = 'text-center mt-5'>
                                    No available tasks
                                </Typography>
                            }
                        </Stack>
                    : 
                        <div></div>
                    }
                </Grow>
            :   
                <Grow in = {inboxGrow}>
                    {inboxGrow ? 
                        <div>
                            {taskInInbox}
                        </div>
                    : 
                        <div></div>                
                    }
                </Grow>
            }           
                {finalTimeStamps.length >= 4 ? // to display the button once satisfies the condition
                    <Box sx = {{textAlign : 'center', mb : 3 }}>
                        {showMore ? 
                            <Button 
                                className = {classes.showMoreButton}
                                variant = 'contained' 
                                onClick = {() => dispatch(loadingActions.updateShowMore(false))}
                            >
                                    show less
                            </Button>  
                            :
                            <Button 
                                onClick = {() => {
                                    dispatch(loadingActions.updateShowMore(true)) 
                                    dispatch(selectDataActions.initialLabel([])) //to reset the label select tag options                       
                                }}
                                variant = 'contained'
                                className = {classes.showLessButton}
                            >
                                show more
                            </Button>
                        }
                    </Box>
                :
                    null
                }
        </>
    )
}

export default InboxAccordion