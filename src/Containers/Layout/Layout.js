import React, { useEffect, useState, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { IconButton, Fab, Box, Zoom } from '@mui/material'
import { MenuRounded, KeyboardArrowUpRounded } from '@mui/icons-material'
import axios from 'axios'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

//----------- importing contents from other files ----------------
import Home from '../Home/Home'
import { authActions } from '../../Store/Reducers/auth'
import NavigationBar from '../NavigationBar/NavigationBar'
import classes from './Layout.module.css'
import { allTasksAction } from '../../Store/Reducers/allTasks'
import { transitionAction } from '../../Store/Reducers/transition'
import Loading from '../../Components/Loading/Loading'
import useModal from '../../hooks/useModal'
import { errorFlag } from '../../Identifiers/identifiers'

// ------------ applying lazy routing -------------------
const Dashboard = React.lazy(() => import('../Dashboard/Dashboard'))
const Inbox = React.lazy(() => import('../Inbox/Inbox.js'))

const Layout = () => {

    const dispatch = useDispatch()

    // to store the boolean value of scroll position
    const [scrollPos, setScrollPos] = useState(false)

    const [, modalShowHandler, ] = useModal(errorFlag) // using the custom hook useModal to control the modal

    const isLogIn = useSelector(state => state.auth.isLogIn)
    const token = useSelector(state => state.auth.token)
    const userName = useSelector(state => state.auth.userName)
    const userId = useSelector(state => state.auth.userId)
    const isDone = useSelector(state => state.allTasks.isDone)

    const history = useHistory()
    const { pathname } = useLocation()

    // when the page renders this useEffect will execute which will update the redux state slice consisting token, userid, user name
    useEffect(() => {
        dispatch(authActions.getUserDetail())
    }, [dispatch])

    useScrollPosition(({_, currPos}) => { // useScrollPosition is used to fetch the current value of the scroll position
        if (currPos.y < 0) {
            setScrollPos(true)
        } else {
            setScrollPos(false)
        }
    })

    // if the token is true then that means user is logged in thus changing the URL which will contain the user name
    useEffect(() => {
        if (token && pathname === '/') {
            history.push(`/${userName}/create-task`)
        }
    }, [history, isLogIn, userName, token, pathname])

    useEffect(() => {
        // fetching all tasks from the database 
        (async () => {
            dispatch(allTasksAction.updateIsDone(false))
            try {
                const tasksURL = `${process.env.REACT_APP_SEND_REQ_TO_DB}/tasks-${userId}.json`
                const labelURL = `${process.env.REACT_APP_SEND_REQ_TO_DB}/labels-${userId}.json`
                const fetchTasks = axios.get(tasksURL)
                const fetchLabels = axios.get(labelURL)
                const sendRequests = await axios.all([fetchTasks, fetchLabels])
                const responseTasks = sendRequests[0].data
                const responseLabels = sendRequests[1].data
                let tasks = []
                let labels = []
                for (let key in responseTasks) {
                    tasks.push({...responseTasks[key], id : key})
                }
                
                for(let key in responseLabels) {
                    labels.push({...responseLabels[key], id : key})
                }
                
                dispatch(allTasksAction.showTasks(tasks))
                dispatch(allTasksAction.showLabels(labels))

            } catch(err) {
                console.log('could not fetch the task')    
                modalShowHandler()
            }
        })();

        // fetching the log in user database id
        (async () => {
            const url = `${process.env.REACT_APP_SEND_REQ_TO_DB}/users.json`
            const response = await axios.get(url + `?orderBy="userName"&equalTo="${userName}"`)
            const userDataId = Object.keys(response.data)[0]
            dispatch(authActions.updateUserDataId(userDataId))
        })();

    }, [dispatch, userId, isDone, userName, modalShowHandler])

    return (
        <Box>
            <Box id = 'toTop'></Box>
            {token ? 
                <IconButton  //hamburger button
                    sx = {{
                        position : 'absolute',
                        ml : 2, mt : 1,
                    }}
                    className = 'border'
                    variant = 'outlined'                
                    onClick = {() => {
                        dispatch(transitionAction.updateSlideNav(true))
                    }}
                >
                    <MenuRounded sx = {{fontSize : '2rem'}} />
                </IconButton>
            : null
            }
            <NavigationBar />
            <Switch>                
                <Route path = '/:userName/create-task'>     
                    <Row className = 'mx-0 justify-content-center'>
                        <Col xs = {2} lg = {2} className = {classes.extraCol}> </Col>
                        <Col>
                            {token ?
                                <Suspense fallback = {<Loading dashboard = {true} />}>
                                    <Dashboard />  
                                </Suspense>
                            : null}                                                                                                  
                        </Col>
                    </Row>                   
                </Route> 
                <Route exact path = '/'>
                    {token ? null : <Home /> }
                </Route>
                    <Route 
                        path = {[
                            '/:userName/inbox/today-tasks',
                            '/:userName/inbox/tomorrow-tasks',
                            '/:userName/inbox/upcoming-tasks',
                            '/:userName/inbox/history'
                        ]}
                    >
                        <Row className = 'm-0 justify-content-center'>
                            <Col xs = {2} className = {classes.extraCol}></Col> 
                            <Col>
                                <Suspense fallback = {<Loading inbox = {true} />}>
                                    {token ? <Inbox /> : null}
                                </Suspense>                   
                            </Col>
                        </Row>
                    </Route>                            
            </Switch> 
            {scrollPos ?  // using scrollPos value to dynamically show the button
                <Zoom 
                    in = {scrollPos}
                >
                    <Fab // up button which will scroll the page to top
                        href = '#toTop'      
                        size = 'small'
                        className = {classes.toTop}
                    >
                        <KeyboardArrowUpRounded className = 'text-light' />
                    </Fab> 
                </Zoom>
            : 
                <Zoom 
                    in = {scrollPos}
                >
                    <Fab
                        href='#toTop' 
                        className = {classes.toTop}
                        size = 'small'
                    >
                        <KeyboardArrowUpRounded className='text-light' />
                    </Fab> 
                </Zoom>
            }               
        </Box>
    )
}

export default Layout
