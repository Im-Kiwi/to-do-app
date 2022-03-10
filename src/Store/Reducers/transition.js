import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    inboxGrow : false, // adding grow transition on inbox component
    zoomButtons : {status : false, id : null}, // for zooming buttons of task from when hovering
    slideCalendar : ({status : false, direction : 'up'}),
    fadeTasks : false, // adding transition effect on tasks when date button on the calendar is clicked
    toggleFade : false, // making sure to toggle the value if the user click on the date button on calendar so that the transition effect takes place everytime button is clicked
    slideNav : false
}

const transitionReducer = createSlice({
    name : 'Transition Reducer',
    initialState,
    reducers : {
        updateInboxGrow (state, action) {
            state.inboxGrow = action.payload
        },
        updateZoomButtons (state, action) {
            state.zoomButtons.status = action.payload.status
            state.zoomButtons.id = action.payload.id
        },
        updateSlideCal (state, action) {
            state.slideCalendar.status = action.payload.status
            state.slideCalendar.direction = action.payload.direction
        },
        updateSlideCalStatus (state, action) {
            state.slideCalendar.status = action.payload
        },
        updateFadeTasks (state, action) {
            state.fadeTasks = action.payload
        },
        updateSlideNav (state, action) {
            state.slideNav = action.payload
        }, 
        updateToggleFade (state, action) {
            state.toggleFade = action.payload
        }
        
    }
})

export const transitionAction = transitionReducer.actions

export default transitionReducer