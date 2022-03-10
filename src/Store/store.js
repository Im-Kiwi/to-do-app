import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Reducers/auth'
import allTasks from './Reducers/allTasks'
import dateReducer from './Reducers/date'
import formReducer from './Reducers/userForm'
import popUpReducer from './Reducers/popUp'
import selectDataReducer from './Reducers/selectData'
import transitionReducer from './Reducers/transition'
import errorReducer from './Reducers/error'
import loadingReducer from './Reducers/loading'

const store = configureStore({
    reducer : {
        auth : authReducer.reducer,
        allTasks : allTasks.reducer,
        date : dateReducer.reducer,
        userForm : formReducer.reducer,
        popUp : popUpReducer.reducer,
        selectData : selectDataReducer.reducer,
        transition : transitionReducer.reducer,
        error : errorReducer.reducer,
        loading : loadingReducer.reducer
    }
})

export default store
