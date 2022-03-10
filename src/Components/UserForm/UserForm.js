import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { TextField, Button, Link as LinkButton, Fade, Stack, Alert } from '@mui/material'
import { DoneAllRounded } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'

// ------- importing contents from other files ---------
import { formActions } from '../../Store/Reducers/userForm'
import { errorActions } from '../../Store/Reducers/error'
import classes from './UserForm.module.css'
import { exist, createAccount } from '../../Identifiers/identifiers'
import {checkEmail, checkPassword, checkUserName} from '../../GlobalMethods/globalMethods'
import useModal from '../../hooks/useModal'
import Loading from '../Loading/Loading'

const UserForm = props => {
    const dispatch = useDispatch()

    // this custom hook controls modal
    const [showModal, ,modalCloseHandler] = useModal(createAccount)

    const isSignIn = useSelector(state => state.auth.isSignIn)
    const userName = useSelector(state => state.userForm.userName)
    const emailAddress = useSelector(state => state.userForm.emailAddress)
    const password = useSelector(state => state.userForm.password)
    const confirmPass = useSelector(state => state.userForm.confirmPassword)
    const validMode = useSelector(state => state.userForm.validMode)
    const wrongCeredentials = useSelector(state => state.error.wrongCeredentials)
    const signUpError = useSelector(state => state.error.signUpError)
    const noNetwork = useSelector(state => state.error.noNetwork)
    const userAuthLoading = useSelector(state => state.loading.userAuthLoading)
    const signUpSuccess = useSelector(state => state.auth.signUpSuccess)
    
    // method to control the change in email input tag
    const emailChangeHandler = (event) => {
        dispatch(formActions.changeEmail(event.target.value.trim()))
        dispatch(formActions.changeValidMode(false))
        dispatch(errorActions.updateWrongCeredentials(false))
        dispatch(errorActions.updateNoNetwork(false))                   
    }

    // to control the change in password input tag
    const passwordChangeHandler = (event) => {
        dispatch(formActions.changePassword(event.target.value.trim()))
        dispatch(formActions.changeValidMode(false))
        dispatch(errorActions.updateWrongCeredentials(false))
        dispatch(errorActions.updateNoNetwork(false))                   
    }

    // method to control confirm password input tag
    const confirmPassChangeHandler = (event) => {
        dispatch(formActions.changeConfirmPassword(event.target.value.trim()))
        dispatch(formActions.changeValidMode(false))
    }

    // control the user name input tag
    const userNameChangeHandler = (event) => {
        dispatch(formActions.changeUserName(event.target.value.trim()))
        dispatch(formActions.changeValidMode(false))
    }

    // to check whether email is valid or not during signup
    const validateEmail = checkEmail(emailAddress, validMode, isSignIn)
    const validatePass = checkPassword(password, validMode, isSignIn)
    const validateUserName = checkUserName(userName, validMode, props.isUserNameExist, exist)

    // sending the info to the redux store about whether the info in signup form is correct or not
    useEffect(() => {
        if (validMode) {
            if (validateEmail.isError) {
                dispatch(errorActions.updateIsEmailInvalid(true))
            } else {
                dispatch(errorActions.updateIsEmailInvalid(false))
            }
        
            if (validatePass.isError) {
                dispatch(errorActions.updateIsPassInvalid(true))
            } else {
                dispatch(errorActions.updateIsPassInvalid(false))
            }
        }
    }, [validateEmail, validatePass, validMode, dispatch])

    // showing error messages which will occur either due to network failure or when user insert wrong information or information which already exists in database
    let alertMessage
    if (wrongCeredentials) {
        if (isSignIn) {
            alertMessage = <Alert severity = 'error' className = 'mb-2'>Wrong Information. Please insert valid info</Alert>
        } else {
            if (signUpError === 'EMAIL_EXISTS') {
                alertMessage = (
                    <Alert severity = 'error' className = 'mb-2'>Email already exist</Alert>
                )    
            } else {
                alertMessage = (
                    <Alert severity = 'error' className = 'mb-2'>Can't able to create account at this moment, please try again later</Alert>
                )
            }
        }
    } else if (noNetwork) {
        alertMessage = <Alert severity = 'error' className = 'mb-2'>Network Error, please check your network connection</Alert>
    }

    return (
        <Modal className = {[classes.cardContainer].join(' ')} show = {showModal} onHide = {modalCloseHandler}>
            <Fade in = {props.fading}>
                <section className = 'p-4'>
                    <Modal.Header>
                        <Stack direction = 'column' justifyContent = 'center' sx = {{width : '100%'}}>
                            <Stack direction = 'row' justifyContent = 'center' sx = {{mb : 4}}>
                                <DoneAllRounded sx = {{fontSize : '2rem', color : '#1d2a30'}} />
                                <h1 style = {{
                                    color : '#f03658', 
                                    fontSize: '2.5rem', 
                                    fontWeight : 600, 
                                    fontFamily: 'Skranji, cursive'
                                }}>to do</h1>
                            </Stack>
                            <div className = 'mx-auto'>
                                <h3>{isSignIn ? 'Log In' : 'Create Account'}</h3>
                                <p className = {[classes.isSignIn].join(' ')} >
                                    {isSignIn ? "Don't have an account ?" : "Already have an account ?"}  
                                    <LinkButton
                                        className = {classes.linkButton}
                                        onClick = {() => {
                                            props.fadingHandler()
                                        }}
                                    > 
                                        {isSignIn ? ' Sign Up' : ' Log In'}
                                    </LinkButton>
                                </p>
                            </div>                            
                        </Stack>
                    </Modal.Header>
                    <Modal.Body>
                        {userAuthLoading ? // shows the loading animation before the request for user authentication is successfull
                            <Loading userForm = {true}/>
                        :
                            <>
                                {signUpSuccess ? 
                                    <Alert severity = 'success' variant = 'outlined'>Your account is successfully created</Alert>
                                :
                                    <form 
                                        onSubmit = {event => {
                                            props.submitHandler(event)
                                        }} 
                                        className = {classes.form}>
                                            {alertMessage}
                                        {!isSignIn ?
                                            <div className = 'mb-3'>
                                                <TextField
                                                    error = {validateUserName.status}
                                                    helperText = {validateUserName.message}
                                                    className = {classes.input}
                                                    type = 'text'
                                                    variant = 'standard'
                                                    label = 'User Name'
                                                    onChange = {event => userNameChangeHandler(event)}
                                                    value = {userName}
                                                />
                                            </div>
                                        :
                                        null
                                        }
                                        <div className = 'mb-3'>                                
                                            <TextField 
                                                error = {validateEmail.isError}
                                                helperText = {validateEmail.message}
                                                className = {classes.input} 
                                                type = 'text' 
                                                variant = 'standard' 
                                                label = 'Email Address'
                                                onChange = {event => emailChangeHandler(event)}
                                                value = {emailAddress}/>
                                        </div>
                                        <div  className = 'mb-3'>
                                            <TextField 
                                                error = {validatePass.status}
                                                helperText = {validatePass.message}
                                                className = {classes.input} 
                                                variant = 'standard' 
                                                type = 'password' 
                                                label = 'Password'
                                                onChange = {event => passwordChangeHandler(event)}
                                                value = {password} />
                                        </div>
                                        {isSignIn ? null :
                                            <div  className = 'mb-3'>
                                                <TextField 
                                                    error = {!props.isPassMatch && validMode ? true : false}
                                                    helperText = {!props.isPassMatch && validMode ? 'password does not match' : null}
                                                    className = {classes.input} 
                                                    variant = 'standard' 
                                                    type = 'password' 
                                                    label = 'Confirm Password'
                                                    onChange = {event => confirmPassChangeHandler(event)}
                                                    value = {confirmPass} />
                                            </div>
                                        }
                                        <Button                                 
                                            type = 'submit' 
                                            className = {classes.enrollButton} 
                                            variant = 'contained' 
                                            color = 'secondary'
                                        >
                                                {isSignIn ?                                                    
                                                    'Log In'
                                                :   'Sign Up'}
                                        </Button>
                                    </form>
                                }
                            </>
                        }
                    </Modal.Body>
                </section>
            </Fade>
        </Modal>
    )
}

export default UserForm

