import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userAuthLoading : false, // showing spinner unless request gets success or fail
    showMore : false, // to dynamcally display'show more'/'show less' button
    deleteLoading : false // showing spinner when confirming delete
}

const loadingReducer = createSlice({
    name : 'Loading',
    initialState,
    reducers : {
        updateUserAuthLoading (state, action) {
            state.userAuthLoading = action.payload
        },
        updateShowMore (state, action) {
            state.showMore = action.payload
        },
        updateDeleteLoading(state, action) {
            state.deleteLoading = action.payload
        }
    }
})

export const loadingActions = loadingReducer.actions

export default loadingReducer