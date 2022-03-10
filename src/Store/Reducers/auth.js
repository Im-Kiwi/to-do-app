import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token : '',
    userId : '',
    userName : '',
    isLogIn : false,    // state to check whether the user loggeIn or logged out
    isSignIn : false,   // state to check whether user opened sign in form or sign up form
    userDataId : '', // containing the databse id of the user in database
    signUpSuccess : false
}

const authReducer = createSlice({
    name : 'Authentication',
    initialState,
    reducers : {
        getUserDetail(state) {
            let token = localStorage.getItem('token')
            let userId = localStorage.getItem('userId')
            let userName = localStorage.getItem('userName')
            state.token = token
            state.userId = userId
            state.userName = userName
            state.isLogIn = true
        },

        logout(state) {
            state.token = ''
            state.userId = ''
            state.userName = ''
            state.isLogIn = false
        },

        isSignIn(state, action) {
            state.isSignIn = action.payload
        },

        logIn(state) {
            state.isLogIn = true
        },

        updateUserDataId (state, action) {
            state.userDataId = action.payload
        },
        updateSignUpSuccess (state, action) {
            state.signUpSuccess = action.payload
        }
    }
})

export const authActions = authReducer.actions
export default authReducer