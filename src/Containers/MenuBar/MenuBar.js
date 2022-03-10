import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import {Box, Stack, List, ListItemButton, ListItemText, Collapse, useMediaQuery, Backdrop, Slide} from '@mui/material'
import { DoneAllRounded, BorderColorRounded, InboxRounded, ExpandMore, ExpandLess, Today, NextPlan, Upcoming, History } from '@mui/icons-material'

// ------------- importing from other files -----------------
import classes from './MenuBar.module.css'
import UserProfile from '../../Components/UserProfile/UserProfile'
import { transitionAction } from '../../Store/Reducers/transition'
import { selectDataActions } from '../../Store/Reducers/selectData'
import { allTasksAction } from '../../Store/Reducers/allTasks'
import { loadingActions } from '../../Store/Reducers/loading'

const MenuBar = () => {
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const enableDrawer = useMediaQuery('(max-width : 1200px)') // created a breakpoint for making app responsive

    const [open, setOpen] = useState(true) // holds the value to toggle expansion of inbox list item

    const [selectList, setSelectList] = useState(0) // to control the tabs

    const userName = useSelector(state => state.auth.userName)
    const slideNav = useSelector(state => state.transition.slideNav) // for transition effect
    
    // object which holds the path names
    const paths = {
        createTask : `/${userName}/create-task`,
        todayTask : `/${userName}/inbox/today-tasks`,
        nextDayTask : `/${userName}/inbox/tomorrow-tasks`,
        upcoming : `/${userName}/inbox/upcoming-tasks`,
        history : `/${userName}/inbox/history`
    }

    useEffect(() => {
        dispatch(transitionAction.updateInboxGrow(true)) // for transition effect in Inbox component

        // making sure that once user click on a tab that tab becomes active and stays active if user reloads the page
        switch(pathname) {
            case paths.createTask:
                setSelectList(0)
                break;
            case paths.todayTask:
                setSelectList(1)
                break;
            case paths.nextDayTask:
                setSelectList(2)
                break;
            case paths.upcoming:
                setSelectList(3)
                break;
            case paths.history:
                setSelectList(4)
                break;
            default:
                setSelectList(0)
        }
    }, [pathname, dispatch, paths.createTask, paths.todayTask, paths.nextDayTask, paths.upcoming, paths.history])

    // stop displaying the edit task form when clicked on the navigation
    // also making sure to dispatch showCreateTask button only in the case when user click on "create task" navigation
    // and also resetting the select tags in upcoming-task and history page
    const clickTabHandler = (isCreateTaskPage, path, isHistory) => {
        dispatch(transitionAction.updateSlideNav(false))
        dispatch(loadingActions.updateShowMore(false)) 
        
        /*this first if statement is to make sure that the selectLabel property shouldn't reset if the user is clicking on the 
        same navigation button multiple times */
        if (pathname !== path) {
            dispatch(selectDataActions.initialLabel([]))
            dispatch(transitionAction.updateInboxGrow(false)) 
        } 

        /* the edit task form isnt available for history tasks thus dispatch will only happen if the user click on other tabs 
        then history */
        if (!isHistory) {
            dispatch(allTasksAction.editZoneHandler({editTaskFlag : false, editTaskID : null}))
        }
        /*to show the add task button icon only for some pages when click on the tabs */
        if (isCreateTaskPage) {
            dispatch(allTasksAction.showCreateTask(false))
        }
    }

    const menu = (
        <Box className = {classes.logInNavigation}>
            <Stack  
                direction = 'row'
                className= {[classes.logInLogo, 'rounded mt-4'].join(' ')}
            >
                <DoneAllRounded sx = {{color : '#f8f9fa', fontSize : '2rem'}} />
                <h1 
                    style = {{
                        color : '#f03658', 
                        fontSize: '2.5rem', 
                        fontWeight : 600, 
                        fontFamily: 'Skranji, cursive'
                    }}>
                        to do
                </h1>
            </Stack>

            <Stack direction = 'row' sx = {{width : "100%", mt : 2}} justifyContent = 'center'>
                <UserProfile />
            </Stack> 
            
            <List component = 'nav' className = 'mt-3 h-100'>
                <Link className = {classes.link} to = {paths.createTask} >
                    <ListItemButton 
                        selected = {selectList === 0}
                        className = {['text-light', selectList ===  0 ? classes.linkButton : null].join(' ')}
                        onClick = {(event) => clickTabHandler(true,paths.createTask, false)}
                    >
                        <ListItemText className = {classes.listItem}>
                            <BorderColorRounded sx = {{mr:1}} />
                            CREATE TASK                                
                        </ListItemText>
                    </ListItemButton>
                </Link>
                <ListItemButton
                    className = 'text-light'
                    onClick = {() => setOpen(v => !v)}
                >
                    <ListItemText>
                        <InboxRounded sx = {{mr : 1}} />
                        INBOX                                
                    </ListItemText>
                    {open ? <ExpandMore /> : <ExpandLess />}
                </ListItemButton>
                <Collapse in = {open} className = 'position-absolute w-100'>
                    <List component = 'nav'>
                        <Link className = {classes.link} to = {paths.todayTask}>
                            <ListItemButton 
                                selected = {selectList === 1}
                                className = {['text-light ms-3', selectList === 1 ? classes.linkButton : null].join(' ')}
                                onClick = {(event) => clickTabHandler(false, paths.todayTask, false, event, 1)}                                        
                            >
                                <ListItemText>
                                    <Today sx = {{mr : 1}} />
                                    Today tasks                                       
                                </ListItemText>                                    
                            </ListItemButton>
                        </Link>
                        <Link className = {classes.link} to = {paths.nextDayTask}>                                            
                            <ListItemButton 
                                selected = {selectList === 2}
                                className = {['text-light ms-3', selectList === 2 ? classes.linkButton : null].join(' ')}
                                onClick = {(event) => clickTabHandler(false, paths.nextDayTask, false, event, 2)}
                            >
                                <ListItemText>
                                    <NextPlan sx = {{mr : 1}} />
                                    Next Day tasks
                                </ListItemText>                                    
                            </ListItemButton>
                        </Link>
                        <Link className = {classes.link} to = {paths.upcoming}>
                            <ListItemButton 
                                selected = {selectList === 3}
                                className = {['text-light ms-3', selectList === 3 ? classes.linkButton : null].join(' ')}
                                onClick = {(event) => clickTabHandler(false, paths.upcoming, false, event, 3)}                                        
                            >
                                <ListItemText>
                                    <Upcoming sx = {{mr : 1}} />
                                    Upcoming tasks                                        
                                </ListItemText>                                    
                            </ListItemButton>
                        </Link>
                        <Link className = {classes.link} to = {paths.history}>
                            <ListItemButton 
                                selected = {selectList === 4}
                                className = {['text-light ms-3', selectList === 4 ? classes.linkButton : null].join(' ')}
                                onClick = {(event) => clickTabHandler(false, paths.history, true, event, 4)}
                            >
                                <ListItemText>
                                    <History sx = {{mr : 1}} />
                                    History                                        
                                </ListItemText>
                            </ListItemButton>
                        </Link>                                
                    </List>
                </Collapse>
            </List>
        </Box>
    )

    let drawer
    if (enableDrawer) {
            drawer = (
                <div>
                    <Slide 
                        direction = 'right' in = {slideNav}
                    >
                        {menu}
                    </Slide>
                    <Backdrop 
                        open = {slideNav} sx = {{zIndex : 100}}
                        onClick = {() => {
                            dispatch(transitionAction.updateSlideNav(false))
                        }}      
                    ></Backdrop>                        
                </div>                
            )            
    } else {
        drawer = menu
    }

    return (
        <>
            {drawer}
        </>
    )
}

export default MenuBar