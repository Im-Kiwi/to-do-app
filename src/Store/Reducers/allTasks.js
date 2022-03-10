import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTask : "",
    currentLabel : "",
    isDone : false, // to check whether the action taken on task by the user is done, action like deleting, forwarding, labeling a task
    totalTasks : [],
    totalLabels : [],
    showCreateTask : false,  // to show/hide the task form when clicked on the + button
    showLabel : false,
    editZone : { // use to update the task of particular id
        editTaskFlag : false,
        editTaskID : null,
        editTaskTime : null
    },
}

const allTasks = createSlice({
    name : "All Tasks",
    initialState,
    reducers : {
        updateCurrentTask(state, action) { 
            state.currentTask = action.payload 
        },
        updateCurrentLabel(state, action) {
            state.currentLabel = action.payload
        },
        updateIsDone(state, action) {
            state.isDone = action.payload
        },
        addTask(state, action) { // to add task in the state
            state.totalTasks = [...state.totalTasks, action.payload]
        },          
        showTasks(state, action) {
            state.totalTasks = [...action.payload]
        },
        showLabels(state, action) {
            state.totalLabels = action.payload
        },
        updateTask(state, action) {         
            state.totalTasks[action.payload.id].isPending = action.payload.isPending
        },
        updateShowLabel (state, action) {
            state.showLabel = action.payload
        },
        showCreateTask(state, action) {
            state.showCreateTask = action.payload
        },
        editZoneHandler(state, action) {
            state.editZone.editTaskFlag = action.payload.editTaskFlag
            state.editZone.editTaskID = action.payload.editTaskID
            state.editZone.editTaskTime = action.payload.editTaskTime
        },
    }
})

export const allTasksAction = allTasks.actions

export default allTasks