import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectYear : '',
    selectMonth : '',
    selectDay : '',
    selectLabel : []
}

const selectDataReducer = createSlice({
    name : 'select data',
    initialState,
    reducers : {
        changeYear (state, action) {
            state.selectYear = action.payload
        },
        changeMonth (state, action) {
            state.selectMonth = action.payload
        },
        changeDay (state, action) {
            state.selectDay = action.payload
        },
        initialLabel (state, action) {
            state.selectLabel = action.payload
        } ,
        changeLabel (state, action) {
            const temp = [...state.selectLabel]
            temp[action.payload.id] = action.payload.value
            state.selectLabel = temp 
        }
    }
})

export const selectDataActions = selectDataReducer.actions
export default selectDataReducer