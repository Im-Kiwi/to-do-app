import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// --------- importing contents from other file ----------------
import { authActions } from '../../Store/Reducers/auth'
import UserForm from '../../Components/UserForm/UserForm'
import { formActions } from '../../Store/Reducers/userForm'
import { errorActions } from '../../Store/Reducers/error'
import { exist, notExist } from '../../Identifiers/identifiers'
import { popUpAction } from '../../Store/Reducers/popUp'
import { loadingActions } from '../../Store/Reducers/loading'

const UserAccount = () => {
    const dispatch = useDispatch()
    const isSignIn = useSelector(state => state.auth.isSignIn)
    
    // bringing data from the redux store
    const emailAddress = useSelector(state => state.userForm.emailAddress)
    const password = useSelector(state => state.userForm.password)
    const confirmPass = useSelector(state => state.userForm.confirmPassword)
    const userName = useSelector(state => state.userForm.userName)
    const validMode = useSelector(state => state.userForm.validMode)
    const isEmailInvalid = useSelector(state => state.error.isEmailInvalid)
    const isPassInvalid = useSelector(state => state.error.isPassInvalid)
    const [fading, setFading] = useState(true) // for fading animation
    const [isPassMatch, setIsPassMatch] = useState(false) // to check whether the password and the confirm pass matches
    const [isUserNameExist, setIsUserNameExist] = useState('') // to find out whether the username already exist or not while signing up


    // common method created to send the login and signup information to the server
    const fetchHandler = async (url, second_url) => {
        const accountDetail = {
            email : emailAddress,
            password : password,
            returnSecureToken : true
        }
        try {
            dispatch(loadingActions.updateUserAuthLoading(true))                
            const sendInfo = await axios.post(url, accountDetail)            
            if (!isSignIn && sendInfo.data) {
                const user = {
                    userName : userName,
                    userId : sendInfo.data.localId,
                    email : sendInfo.data.email
                }
                //sending the user's details to database                    
                const response =  await axios.post(second_url, user)
                return response.data
            } else {
                return sendInfo.data
            }
        } catch(err) {
            dispatch(loadingActions.updateUserAuthLoading(false))                

            if (err.response) {
                dispatch(errorActions.updateWrongCeredentials(true)) // if the user mentioned wrong info in while loging in then wrongCeredential will set to true                
                dispatch(errorActions.updateSignUpError(err.response.data.error.errors[0].message))
            } else {
                dispatch(errorActions.updateNoNetwork(true))
            }
        }                
    }

    // this will handle the fade animation and also toggle the display of signup and login form
    const fadingHandler = () => {
        setFading(false)
        setTimeout(() => {
            setFading(true)
            dispatch(errorActions.updateWrongCeredentials(false))
            setIsUserNameExist('')

            if (isSignIn) {
                dispatch(authActions.isSignIn(false))
            } else {
                dispatch(authActions.isSignIn(true))
            }
            // reseting the email and password
            dispatch(formActions.changeEmail(''))
            dispatch(formActions.changePassword(''))
            dispatch(formActions.changeConfirmPassword(''))
            dispatch(formActions.changeUserName(''))  

            dispatch(formActions.changeValidMode(false))
            dispatch(authActions.updateSignUpSuccess(false)) // to disable the successful message after creating an account         
        }, 200)
    }

    // submiting the sign up information to the server and also for login  
    const submitHandler = async(event) => {        
        event.preventDefault()  // to prevent the reloading of the page
        dispatch(formActions.changeValidMode(true)) // valid mode will be true once user clicks on signup/signin button
        
        if (!isSignIn) {      // if user is in sign up page
            setIsUserNameExist('')
            // to check whether userName already exists
            if (userName.length !== 0) {
                let isUserName = []

                try {
                    const findUser = await axios.get(`${process.env.REACT_APP_SEND_REQ_TO_DB}/users.json?orderBy="userName"&equalTo="${userName}"`)
                    isUserName = Object.keys(findUser.data)
                } catch(err) {
                    console.log('error, unable to validate the user name')
                }                   
                if (isUserName.length === 0) {
                    setIsUserNameExist(notExist) // if user name doesnt exist in database                  
                } else {
                    setIsUserNameExist(exist) // if username exist in database
                    console.log('user name already taken')
                }
            }

            // whether password and confirm password matches
                if (password === confirmPass ) {
                    setIsPassMatch(true)
                } else {
                    setIsPassMatch(false)
                }
        }
    }
    console.log(process.env)
    // signing up
    useEffect(() => {
        if (validMode && !isSignIn) {
            if ( !isEmailInvalid && !isPassInvalid && isPassMatch && isUserNameExist === notExist ) {
                (async () => {
                    const url = `${process.env.REACT_APP_SIGN_UP_URL}key=${process.env.REACT_APP_FIREBASE_KEY}`
                    const second_url = `${process.env.REACT_APP_SEND_REQ_TO_DB}/users.json`                   
                    const response = await fetchHandler(url, second_url)
                    
                    if (response) {                                                                     
                        // reseting the email, user name and password 
                        dispatch(formActions.changeEmail(''))
                        dispatch(formActions.changePassword(''))
                        dispatch(formActions.changeConfirmPassword(''))
                        dispatch(formActions.changeUserName(''))

                        dispatch(formActions.changeValidMode(false))   
                        dispatch(errorActions.updateWrongCeredentials(false)) // reseting the error message when user fills wrong info during signup/login
                        dispatch(errorActions.updateNoNetwork(false)) // removing no network error modal
                        dispatch(loadingActions.updateUserAuthLoading(false)) // to remove the spinner
                        dispatch(authActions.updateSignUpSuccess(true)) // successful message will be displayed once account is created 
                    }
                })();
            }
        } else if (validMode && isSignIn && emailAddress.length > 0 && password.length > 0) {
            (async () => {
                const url = `${process.env.REACT_APP_SIGN_IN_URL}key=${process.env.REACT_APP_FIREBASE_KEY}`
                const response = await fetchHandler(url)                
                // reseting the email and password and closing modal too
                dispatch(formActions.changeEmail(''))
                dispatch(formActions.changePassword(''))
                dispatch(formActions.changeConfirmPassword(''))
                dispatch(formActions.changeValidMode(false))
                //retrieving the userName and storing the token, userId and userName in local storage
                if (response) {
                    dispatch(errorActions.updateWrongCeredentials(false))
                    dispatch(errorActions.updateNoNetwork(false))
                    //retrieving the username from the database
                    const secondURL = `${process.env.REACT_APP_SEND_REQ_TO_DB}/users.json?orderBy="userId"&equalTo="${response.localId}"`
                    try {
                        const getUserName = await axios.get(secondURL)
                        const responseKey = Object.keys(getUserName.data)                        
                        // saving the token, userId and name in localstorage
                        localStorage.setItem('userId', response.localId)
                        localStorage.setItem('token', response.idToken)
                        localStorage.setItem('userName', getUserName.data[responseKey[0]].userName)
                        dispatch(popUpAction.toggleShow(false))
                        dispatch(authActions.getUserDetail())
                    } catch(err) {
                        dispatch(errorActions.updateWrongCeredentials(true))
                    }
                }
            })();
        }
    }, [validMode, userName, dispatch, isEmailInvalid, isPassInvalid, isPassMatch, isUserNameExist, isSignIn])

    return (
        <main className = 'mt-5'>
            <UserForm
                fading = {fading}
                fadingHandler = {fadingHandler}
                submitHandler = {submitHandler}
                isUserNameExist = {isUserNameExist}
                isPassMatch = {isPassMatch}
            />
        </main>
    )
}

export default UserAccount