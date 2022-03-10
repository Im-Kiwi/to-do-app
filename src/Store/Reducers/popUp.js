import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showModal : false,
    showInboxModal : false,
    showDelAccModal : false,
    showErrorModal : false
}

const popUpReducer = createSlice({
    name : 'modal reducer',
    initialState,
    reducers : {
        toggleShow(state, action) {
            state.showModal = action.payload
        },
        toggleInboxModal (state, action) {
            state.showInboxModal = action.payload
        },
        updateDelAccModal (state, action) {
            state.showDelAccModal = action.payload
        },
        updateErrorModal (state, action) {
            state.showErrorModal = action.payload
        }
    }
})

export const popUpAction = popUpReducer.actions

export default popUpReducer 