import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { Container, Typography, Box, Button, Alert } from '@mui/material'
import { useLocation } from 'react-router'

//----------- importing contents from other files------------
import classes from './Inbox.module.css'
import InboxAccordion from '../InboxAccordion/InboxAccordion'
import InboxSelect from '../../Components/InboxSelect/InboxSelect'
import useModal from '../../hooks/useModal'
import useMethods from '../../hooks/useMethods'
import { clearAll } from '../../Identifiers/identifiers'
import DisplayErrors from '../../Components/DisplayErrors/DisplayErrors'
import Loading from '../../Components/Loading/Loading'

const currentDay = new Date().getDate()
const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear() 

const Inbox = () => {
    const { pathname } = useLocation()

    const [showModal, modalShowHandler, modalCloseHandler] = useModal(clearAll) //contains methods and values to control modal

    /* to delete tasks of the day or to clear the entire tasks depending upon which button user clicked either 'clear all' or
    'clear history' button or delete button to delete all tasks of a specific day*/
    const [cleanSpecific, setCleanSpecific] = useState({status : false, tasksToDelete : []})


    // custom hooks which contains the method like deleting task and checkbox controlling method of task
    const [deleteTaskHandler, checkTaskHandler, forwardTaskHandler, deleteEntireTasks] = useMethods()

    const allTasks = useSelector(state => state.allTasks.totalTasks)
    const userName = useSelector(state => state.auth.userName)
    const selectYear = useSelector(state => state.selectData.selectYear)
    const selectMonth = useSelector(state => state.selectData.selectMonth)
    const selectDay = useSelector(state => state.selectData.selectDay)
    const selectLabel = useSelector(state => state.selectData.selectLabel)
    const showEditTaskForm = useSelector(state => state.allTasks.editZone.editTaskFlag)
    const deleteLoading = useSelector(state => state.loading.deleteLoading)

    const pathToHistory = `/${userName}/inbox/history`
    const pathToUpcoming = `/${userName}/inbox/upcoming-tasks`
    const pathToToday = `/${userName}/inbox/today-tasks`
    const pathToTomo = `/${userName}/inbox/tomorrow-tasks`

    // collecting the time (creation time) of all tasks in an array
    const allTimeStamps = allTasks.map(task => {
        return task.time
    })

    // initially an empty array but later will consist of date of the task with no duplication
    const nonDupTimeStamps = []

    // removing the duplication of time stamps (creation time) of task
    const removeDup = new Set(allTimeStamps)
    
    for (let val of removeDup) { // storing the non duplication values inside an empty array
        nonDupTimeStamps.push(val)
    }



    // adding more detail in the non duplication time stamps like day month and year
    const detailedTimeStamps = nonDupTimeStamps.map(time => {
        const findTask = allTasks.find(task => task.time === time)
        return {
            day : findTask.day, 
            month : findTask.month,
            year : findTask.year,
            time : time,
            createdAt : findTask.createAt,
            createFor : findTask.createFor,
            id :findTask.id
        }
    })

    const nextDay = new Date(currentYear, currentMonth, currentDay + 1).getTime()
    const todayDate = new Date(currentYear, currentMonth, currentDay).getTime()

    // filtering time stamps based on the past & present/future
    let updatedTimeStamps = detailedTimeStamps.filter(time => {
        if ( pathname === pathToToday) {
            if (todayDate === time.createFor) {
                return time
            } else {
                return null
            }
        } else if (pathname === pathToTomo) {
            if (nextDay === time.createFor) {
                return time
            } else {
                return null
            }
        } else if (pathname === pathToUpcoming) {
            if (time.createFor > nextDay) {
                return time
            } else {
                return null
            }
        } else if (pathname === pathToHistory) {
            if (time.createFor < todayDate) {
                return time
            } else {
                return null
            }
        } else {
            return null
        }
        
    }).sort((a,b) => {      // after filtering, the array is later sorted bosed on the creation of tasks
        if (pathname === pathToHistory) {
            return b.createFor - a.createFor
        } else {
            return a.createFor - b.createFor
        }
    }) 

    return ( 
        <>
            <Container maxWidth = 'xl' className = ''>
                <InboxSelect 
                    pathname = {pathname}
                    updatedTimeStamps = {updatedTimeStamps}
                />
                <div className = {classes.accordionContainer}>
                    <InboxAccordion
                        updatedTimeStamps = {updatedTimeStamps}
                        modalShowHandler = {modalShowHandler}
                        deleteTaskHandler = {deleteTaskHandler}
                        checkTaskHandler = {checkTaskHandler}
                        forwardTaskHandler = {forwardTaskHandler}
                        allTasks = {allTasks}
                        selectYear = {selectYear}
                        selectMonth = {selectMonth}
                        selectDay = {selectDay}
                        selectLabel = {selectLabel}
                        userName = {userName}
                        setCleanSpecific = {setCleanSpecific}
                        showEditTaskForm = {showEditTaskForm}
                    />
                </div>
            </Container>
            <Modal 
                show = {showModal}
                style={{marginTop : 120}}
                onHide = {modalCloseHandler}
            >
                <Container maxWidth = 'sm' className = 'p-3'>
                    {deleteLoading ? 
                        <Loading confirmDelete = {true} />
                    :
                     <>
                        <Typography variant = 'h6'>Are you sure to delete ? </Typography>
                        <Alert severity = 'warning' sx = {{mt : 2}}>
                            Warning! You won't be able to recover your tasks you created once you delete
                        </Alert>                    
                     </>
                    }
                    <Box sx = {{mt : 3}}>
                        <Button 
                            className = {['float-end', classes.rejectButton].join(' ')}                          
                            size = 'small'
                            variant = 'contained'
                            onClick = {modalCloseHandler}
                        >
                            No
                        </Button>
                        <Button 
                            className = {['float-end me-2', classes.acceptButton].join(' ')} 
                            size = 'small'
                            variant = 'contained'
                            color = 'success'                      
                            onClick = {() => {                                                            
                                // to make sure that only those tasks gets deleted depending upon the button user clicked
                                if (pathname === pathToHistory) {
                                    deleteEntireTasks(true, cleanSpecific.status, cleanSpecific.tasksToDelete)
                                } else {
                                    deleteEntireTasks(false, cleanSpecific.status, cleanSpecific.tasksToDelete)
                                }
                            }}                        
                        >
                            Yes
                        </Button>
                    </Box>
                </Container>
            </Modal>
            <DisplayErrors />
        </>           
    )
}

export default Inbox