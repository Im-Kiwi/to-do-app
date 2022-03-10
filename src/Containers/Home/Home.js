import React from 'react'
import { Row, Col, Image } from 'react-bootstrap'
import { Button, Container, Typography, Zoom, Box, Stack, Grid, useMediaQuery } from '@mui/material'
import { CheckBoxRounded, CheckBoxOutlined, Copyright } from '@mui/icons-material'
import { useDispatch } from 'react-redux'


// -------- importing contents from other files -----------
import classes from './Home.module.css'
import UserAccount from '../UserAccount/UserAccount'
import { homeImage, calendar, createLabel, filterInbox } from '../../ToImageStore/pathToImages'
import useModal from '../../hooks/useModal'
import { authActions } from '../../Store/Reducers/auth'
import { createAccount } from '../../Identifiers/identifiers'

const Home = () => {

    const dispatch = useDispatch()

    const responsive = useMediaQuery('(max-width : 410px)')

    const [ , modalShowHandler , ] = useModal(createAccount)

    // method to show sign up modal
    const showSignUpModal = () => {
        dispatch(authActions.isSignIn(false))
        modalShowHandler()
    }

    return (
        <div>
            <Container maxWidth = 'lg'>
                <Row className = {[classes.rowContainer].join(' ')}>
                    <Col xs = {12} md = {6} className = {classes.secondCol}>
                        <Zoom in = {true}>
                            <Stack direction = 'row' justifyContent = 'center'>
                                <Image                         
                                    className = {[classes.mainImage].join(' ')} 
                                    src = {homeImage}
                                    alt = 'a lady preparing her schedule' 
                                />                        
                            </Stack>
                        </Zoom>
                    </Col>
                    <Col xs = {12} md = {6} className = {[classes.thirdCol, ''].join(' ')}>
                        <Zoom in = {true}>
                            <Box className = {classes.textContainer}>
                                <header className = {classes.headerSection}>
                                    <Typography className = {classes.headerOne} variant = 'h2'>Kill Procrastination</Typography>
                                    <Typography className = {classes.headerTwo} variant = 'h3'>Stay Organized</Typography>
                                    <Typography variant = 'h5' className = {['mt-5', classes.text].join(' ')}>The shorter way to do many things is to only do one thing at a time.</Typography>
                                </header>
                                <Button 
                                    className = {['mt-5', classes.getStarted].join(' ')}
                                    size = 'large' 
                                    variant = 'contained'
                                    onClick = {showSignUpModal}
                                >
                                    Get Started
                                </Button>
                            </Box>
                        </Zoom>
                    </Col>
                </Row>
            </Container>
            <div className = {classes.secondRowCont}>
                <Container maxWidth = 'lg'>
                    <Row >
                        <Col xs = {12} md = {6} className = 'text-center mb-3'>
                            <Zoom in = {true} style = {{transitionDelay : '300ms'}}>
                                <Stack direction = 'column' sx = {{height : '100%'}} alignItems = 'center' justifyContent = 'center'>
                                    <Grid container className = 'mb-3' spacing = {1}>
                                        <Grid item xs = {1}>
                                            <CheckBoxRounded className = 'text-light' sx = {{fontSize : '2.3rem', color : '#f03658 !important'}} />   
                                        </Grid>
                                        <Grid item xs = {11}>
                                            <Typography
                                                variant = {responsive ? 'h5' : 'h4'}
                                                className = 'text-light'
                                                sx = {{fontFamily : 'Josefin Sans, sans-serif'}}
                                            >
                                                Chose a date to create task with the help of calendar.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing = {1}>
                                        <Grid item xs = {1}>
                                            <CheckBoxRounded className = 'text-light' sx = {{fontSize : '2.3rem', color : '#f03658 !important'}} />
                                        </Grid>
                                        <Grid item xs = {11}>
                                            <Typography
                                                variant = {responsive ? 'h5':'h4'}
                                                className = 'text-light'
                                                sx = {{fontFamily : 'Josefin Sans, sans-serif'}}
                                            >
                                                Making multiple tasks for different days becomes easier.
                                            </Typography>
                                        </Grid>
                                    </Grid>                                
                                </Stack>
                            </Zoom>
                        </Col>
                        <Col xs = {12} md = {6}>
                            <Zoom in = {true} style = {{transitionDelay : '300ms'}}>
                                <Stack direction = 'row' justifyContent = 'center'>
                                    <Image rounded className = {classes.calendarImage} src = {calendar} alt = 'calendar' />                    
                                </Stack>
                            </Zoom>
                        </Col>
                    </Row>                               
                </Container>
            </div>  
            <div className = {classes.thirdRowCont}>
                <Container maxWidth = 'lg'>
                    <Row>
                        <Col xs = {12} md = {6} className = 'mb-3'>
                            <Zoom in = {true} style = {{transitionDelay : '400ms'}}>
                                <Stack direction = 'row' justifyContent = 'center'>
                                    <Image rounded className = {classes.createLabelImage} src = {createLabel} alt = 'create label' />                    
                                </Stack>
                            </Zoom>
                        </Col>
                        <Col xs = {12} md = {6} className = 'text-center'>
                            <Zoom in = {true} style = {{transitionDelay : '400ms'}}>
                                <Stack direction = 'column' sx = {{height : '100%'}} alignItems = 'center' justifyContent = 'center'>
                                    <Grid container spacing = {1} className = 'mb-3'>
                                        <Grid item xs = {1}>
                                            <CheckBoxOutlined sx = {{fontSize : '2.3rem', color : '#f03658'}} />
                                        </Grid>
                                        <Grid item xs = {11}>
                                            <Typography
                                                variant = {responsive ? 'h5' : 'h4'}
                                                className = 'text-dark text-center'
                                                sx = {{fontFamily : 'Josefin Sans, sans-serif'}}
                                            >
                                                While creating tasks, you can also add a tag or label to that task.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing = {1}>
                                        <Grid item xs = {1}>
                                            <CheckBoxOutlined sx = {{fontSize : '2.3rem', color : '#f03658'}} />                                            
                                        </Grid>
                                        <Grid item xs = {11}>
                                            <Typography
                                                variant = {responsive ? 'h5' : 'h4'}                                            
                                                className = 'text-dark'
                                                sx = {{fontFamily : 'Josefin Sans, sans-serif'}}
                                            >
                                                Once you create label, it will be saved so that it can be used again without creating it again.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Zoom>
                        </Col>
                    </Row>                               
                </Container>
            </div>
            <div className = {classes.fourthRowCont}>
                <Container maxWidth = 'lg'>
                    <Row  >
                        <Col xs = {12} md = {6} className = 'text-center mb-3'>
                            <Zoom in = {true} style = {{transitionDelay : '400ms'}}>
                                <Stack direction = 'column' sx = {{height : '100%'}} alignItems = 'center' justifyContent = 'center'>
                                    <Grid container spacing = {1} className = 'mb-3'>
                                        <Grid item xs = {1}>
                                            <CheckBoxRounded sx = {{fontSize : '2.3rem', color : '#1d2a30'}}/>
                                        </Grid>
                                        <Grid item xs = {11}> 
                                            <Typography
                                                variant = {responsive ? 'h5' : 'h4'}
                                                className = 'text-light'
                                                sx = {{fontFamily : 'Josefin Sans, sans-serif'}}
                                            >
                                                Inbox will gonna hold all of your tasks, upcoming tasks, history etc.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing = {1}>
                                        <Grid item xs = {1}>
                                            <CheckBoxRounded sx = {{fontSize : '2.3rem', color : '#1d2a30'}}/>
                                        </Grid>
                                        <Grid item xs = {11}>
                                            <Typography
                                                variant = {responsive ? 'h5' : 'h4'}
                                                className = 'text-light'
                                                sx = {{fontFamily : 'Josefin Sans, sans-serif'}}
                                            >
                                                You can filter the tasks by date or labels in inbox
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Stack>                        
                            </Zoom>
                        </Col>
                        <Col xs = {12} md = {6}>
                            <Zoom in = {true} style = {{transitionDelay : '400ms'}}>
                                <Stack direction = 'row' justifyContent = 'center'>
                                    <Image rounded className = {classes.inboxImage} src = {filterInbox} alt = 'inbox' />                    
                                </Stack>                    
                            </Zoom>
                        </Col>
                    </Row>                               
                </Container>
            </div> 
            <footer className= {[classes.footerContainer].join(' ')}>
                <Stack direction = 'row' justifyContent = 'center'>
                <Copyright sx = {{fontSize : '1.2rem', color : '#6c757d'}} />
                <Typography 
                    variant = 'caption' 
                    sx = {{color : '#6c757d'}}>
                        copyright {new Date().getFullYear()},
                </Typography>
                <Typography 
                    variant = 'caption' 
                    className = 'ms-2' 
                    sx = {{color : '#6c757d'}}>
                        developed by Rahul Rana (kiwi)
                </Typography>
                </Stack>
            </footer>               
            <UserAccount />
        </div>
    )
}

export default Home