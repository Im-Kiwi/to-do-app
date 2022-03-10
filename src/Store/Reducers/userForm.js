import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    emailAddress : '',
    password : '',
    confirmPassword : '',
    userName : '',
    validMode : false,   //this is used to make sure that when signup and login buttons are clicked only then the ceredentials will be checked
}

const formReducer = createSlice({
    name : 'userForm',
    initialState,
    reducers : {
        changeEmail(state, action) {
            state.emailAddress = action.payload
        },
        changePassword(state, action) {
            state.password = action.payload
        },
        changeConfirmPassword(state, action) {
            state.confirmPassword = action.payload
        },
        changeUserName(state, action) {
            state.userName = action.payload
        },
        changeValidMode(state, action) {
            state.validMode = action.payload
        }        
    }
})

export const formActions = formReducer.actions
export default formReducer