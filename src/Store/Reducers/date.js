import { createSlice } from '@reduxjs/toolkit'

const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August','September', 'October', 'November', 'December']

const currentDate = new Date()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()
const currentNumericDay = currentDate.getDate()
const currentDay = currentDate.getDay()

const initialState = {
    selectedYear : {
        year : currentYear
    },
    selectedMonth : {
        id : currentMonth,
        month : months[currentMonth]
    },
    selectedDay : {
        date : currentNumericDay,
        day : day[currentDay]
    }
}

const dateReducer = createSlice({
    name : 'Date',
    initialState,
    reducers : {
        changeMonth(state, action) {
            state.selectedMonth.id = action.payload
            state.selectedMonth.month = months[action.payload]
        },
        changeYear(state, action) {
            state.selectedYear.year = action.payload
        },
        getDate(state, action) {
            state.selectedDay.date = action.payload.date
            state.selectedDay.day = day[action.payload.day]
        }
    }
})

export const dateActions = dateReducer.actions
export default dateReducer