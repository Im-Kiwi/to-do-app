import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wrongCeredentials : false, // if user tries to send wrong info then this flag will raise
    noNetwork : false,
    isEmailInvalid : false, 
    isPassInvalid : false,
    signUpError : '' // set to true when error occurs due to 
}

const errorReducer = createSlice({
    name : 'error',
    initialState,
    reducers : {
        updateWrongCeredentials (state, action) {
            state.wrongCeredentials = action.payload
        },
        updateNoNetwork(state, action) {
            state.noNetwork = action.payload
        },
        updateIsEmailInvalid(state, action) {
            state.isEmailInvalid = action.payload
        },
        updateIsPassInvalid(state, action) {
            state.isPassInvalid = action.payload
        },
        updateSignUpError(state, action) {
            state.signUpError = action.payload
        }
    }

})

export const errorActions = errorReducer.actions

export default errorReducer