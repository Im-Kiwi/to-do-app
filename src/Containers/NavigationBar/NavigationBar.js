import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Navbar } from 'react-bootstrap'
import { Stack, Fab, useMediaQuery } from '@mui/material'
import { DoneAllRounded, Login, PersonAddAlt } from '@mui/icons-material'

//--------------- importing content from other file -----------
import { authActions } from '../../Store/Reducers/auth'
import classes from './NavigationBar.module.css'
import { popUpAction } from '../../Store/Reducers/popUp'
import MenuBar from '../MenuBar/MenuBar'

const NavigationBar = () => {  
    const dispatch = useDispatch()

    const responsive = useMediaQuery('(max-width : 575px)')

    const token = useSelector(state => state.auth.token) // contains the user token once user sign's in
    
    // witl open the log in modal
    const logInHandler = () => {
        dispatch(popUpAction.toggleShow(true))
        dispatch(authActions.isSignIn(true))        
    }

    // will open the sign up modal
    const signUpHandler = () => {
        dispatch(popUpAction.toggleShow(true))
        dispatch(authActions.isSignIn(false))
    }

    return (
        <>  
            {!token ?                 
                <Navbar variant = 'light' expand = 'sm' className = {[classes.navbar].join(' ')}>
                    <Container>
                        <Navbar.Brand className = ''>
                            <Stack direction = 'row'>
                                <DoneAllRounded sx = {{fontSize : '2rem', color : '#1d2a30'}} />
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
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls= 'open-canvas' />
                        <Navbar.Collapse id = 'open-canvas'>
                            <Stack direction = {responsive ? 'column' : 'row'} 
                                justifyContent = {responsive ? null : 'flex-end'}
                                sx = {{ 
                                    width : responsive ? 150 : '100%',
                                }}
                                className = 'mx-auto'
                            >                            
                                <Fab 
                                    className = {[classes.logInButton].join(' ')}
                                    size = 'small' 
                                    variant = 'extended'
                                    aria-label = 'sign in'
                                    color = 'success'
                                    sx = {{mr : 1, padding : 1.5, mb : responsive ? 1 : null, height : responsive ? 30 : null, width : responsive ? 120 : null}}
                                    onClick = {logInHandler}
                                >
                                    <Login sx = {{mr : 1}} />
                                    Log In
                                </Fab>
                                <Fab 
                                    className = {[classes.signUpButton].join(' ')}
                                    size = 'small' 
                                    variant = 'extended'
                                    aria-label = 'sign up'
                                    color = 'info'
                                    sx = {{mr : 1, padding : 1.5, height : responsive ? 30 : null, width : responsive ? 120 : null}}
                                    onClick = {signUpHandler}
                                >
                                    <PersonAddAlt sx = {{mr : 1}} />
                                    Sign Up
                                </Fab>
                            </Stack>
                        </Navbar.Collapse>                        
                    </Container>
                </Navbar>
            :
                <MenuBar />                 
            }  
        </>        
    )
}
        
export default React.memo(NavigationBar) 