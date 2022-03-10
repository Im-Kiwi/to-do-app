import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { IconButton, Menu, MenuItem, Stack, Divider, Typography, Container, Button, Alert, Box } from "@mui/material"
import { Modal } from 'react-bootstrap'
import { AccountCircle, Logout, PersonRemove } from "@mui/icons-material"
import axios from 'axios'

// -------------------- importing from other files ------------------------
import { authActions } from '../../Store/Reducers/auth'
import { popUpAction } from '../../Store/Reducers/popUp'
import { transitionAction } from '../../Store/Reducers/transition'
import useModal from '../../hooks/useModal'
import classes from './UserProfile.module.css'
import { delAccount } from '../../Identifiers/identifiers'
import { loadingActions } from '../../Store/Reducers/loading' 
import Loading from '../Loading/Loading'


const UserProfile = () => {

    const dispatch = useDispatch()
    const history = useHistory()

    const [anchorEl, setAnchorEl] = useState(null)

    // this custom hook controls the modal
    const [deleteAccountModal, modalShowHandler, modalCloseHandler] = useModal(delAccount)

    const token = useSelector(state => state.auth.token)
    const userDataId = useSelector(state => state.auth.userDataId)
    const userId = useSelector(state => state.auth.userId)
    const userName = useSelector(state => state.auth.userName)
    const deleteLoading = useSelector(state => state.loading.deleteLoading)

    // method to logout the user
    const logoutHandler = useCallback(() => {
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        localStorage.removeItem('token')
        setAnchorEl(null) // to close the popup menu
        dispatch(authActions.logout())
        dispatch(popUpAction.toggleShow(false)) // after log out, make sure modal (sign in/up form) doesn't appear
        dispatch(transitionAction.updateSlideNav(false)) // for transition effect on menu bar component
        dispatch(loadingActions.updateUserAuthLoading(false))
        history.push('/')
    }, [dispatch, history])

    // this useEffect will execute after 1 hour which will logout the user automatically as the token in firebas expires after 1 hour
    useEffect(() => {
        const expireToken = setTimeout(() => {
            logoutHandler()
        }, 3600000)
        
        return () => {
            clearTimeout(expireToken)
        }
    }, [logoutHandler])

    const closePopOver = () => {
        setAnchorEl(null) // closing popover once clicked on the "delete account"
        modalShowHandler()
    }

    // this method will delete the account of user once user confirms to delete it
    const deleteAccount = async () => {
        const sendToken = {
            idToken : token
        }
        dispatch(loadingActions.updateDeleteLoading(true))
        const sendRequests = [
            axios.delete(`https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/users/${userDataId}.json`),
            axios.delete(`https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/tasks-${userId}.json`),  
            axios.delete(`https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/labels-${userId}.json`)     
        ]
        
        await axios.all(sendRequests)
        await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyCRUNR-_upS19C88ASWZU8Hei0aQHUtm8E`, sendToken)
        // logging out at the end when user and its details are deleted
        logoutHandler()        
        modalCloseHandler()
        dispatch(loadingActions.updateDeleteLoading(false))
    }

    return (
        <Stack direction = 'column' justifyContent = 'center'>
            <IconButton onClick = {(event) => setAnchorEl(event.currentTarget)}>
                <Stack direction = 'column'>
                    <AccountCircle className = 'text-light' sx = {{fontSize : '6rem'}} />
                    <Typography
                        variant = 'h6' 
                        className = 'text-light text-center mb-1'
                        sx = {{fontFamily : 'ZCOOL QingKe HuangYou, cursive;'}}
                    >
                        {userName}
                    </Typography>
                </Stack>
            </IconButton>
            <Divider sx = {{width : 190, color : 'white'}} />
            <Menu
                anchorEl = {anchorEl}
                open = {Boolean(anchorEl)}
                onClose = {() => setAnchorEl(null)}
                anchorOrigin = {{
                    vertical :'bottom',
                    horizontal :'center'
                }}
                transformOrigin = {{
                    vertical : 'top',
                    horizontal : 'center'
                }}
            >                
                <MenuItem onClick = {logoutHandler}>
                    <Logout sx = {{mr : 1}} />Sign Out
                </MenuItem>
                <MenuItem onClick = {closePopOver}>
                    <PersonRemove sx = {{mr : 1}} />Delete Account
                </MenuItem>
            </Menu>

            <Modal 
                show = {deleteAccountModal}
                style={{marginTop : 120}}
                onHide = {modalCloseHandler}
            >
                <Container maxWidth = 'sm' className = 'p-3'>
                        {deleteLoading ?
                            <Loading confirmDelete = {true} />
                        :
                            <>
                                <Typography variant = 'h6'>Are you sure to delete your account ? </Typography>
                                <Alert severity = 'warning' sx = {{mt : 2}}>
                                    Warning! You won't be able to recover your account once you delete
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
                            onClick = {deleteAccount}                     
                        >
                            Yes
                        </Button>
                    </Box>
                </Container>
            </Modal>
        </Stack>
    )
}

export default React.memo(UserProfile)