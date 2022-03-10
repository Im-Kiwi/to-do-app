import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'

//--------- contents importing from other files --------------
import { allTasksAction } from '../Store/Reducers/allTasks'
import useModal from './useModal'
import { clearAll, errorFlag } from '../Identifiers/identifiers'
import { loadingActions } from '../Store/Reducers/loading'

const useMethods = () => {
    
    const dispatch = useDispatch()
    const showTasks = useSelector(state => state.allTasks.totalTasks)
    const userId = useSelector(state => state.auth.userId)

    const [ , modalShowHandler, ] = useModal(errorFlag) // to show network error message modal 
    const [ , , modalCloseHandler] = useModal(clearAll) // custom hook to show confirm delete modal

    const day = new Date().getDate()
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    
    
     // method to delete a task
    const deleteTaskHandler = (task) => {
        const taskId = task.id
        axios.delete(`https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/tasks-${userId}/${taskId}.json`)
            .then(() => {  
                dispatch(allTasksAction.updateIsDone(true))    
            }).catch(() => {
                modalShowHandler()
            })
    }
    
    // this method helps to check and uncheck the checkbox of a particular task
    const checkTaskHandler = (task) => {
        const taskId = task.id
        const isPending = task.isPending
        const taskIndex = showTasks.findIndex(item => item.id === taskId) // finding task's index which is going to update
        if (isPending) {
            dispatch(allTasksAction.updateTask({isPending : false, id : taskIndex}))
            axios.put(`https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/tasks-${userId}/${taskId}/isPending.json`, 'false')
                .then().catch(() => {
                    modalShowHandler()
                })
        } else {
            dispatch(allTasksAction.updateTask({isPending : true, id : taskIndex}))
            axios.put(`https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/tasks-${userId}/${taskId}/isPending.json`, 'true')
                .then().catch(() => {
                    modalShowHandler()
                })
        }
    }

    // the old task will be added to the current day if forward button is clicked    
    const forwardTaskHandler = task => {
        const userId = task.userId
        const text = task.task
        const taskId = task.id
        const createAt = new Date().getTime()
        const createFor = new Date(year, month, day).getTime()
        const time = `${day}-${month+1}-${year}`
        const updatedTask = {
            ...task,
            task : text,
            createAt : createAt,
            createFor : createFor,
            day : day,
            month : month,
            time : time,
            year : year,
        }
        axios.put(`https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/tasks-${userId}/${taskId}.json`, updatedTask)
            .then(res => {
                console.log('task forwarded')
                dispatch(allTasksAction.updateIsDone(true))
            }).catch(() => {
                modalShowHandler()
            })
    }

    // this method is used to delete all tasks of specific day / clear all tasks
    const deleteEntireTasks = async (isHistory, isDay, tasksOfDay) => { 
        dispatch(loadingActions.updateDeleteLoading(true))
        const url = `https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/tasks-${userId}`
        const today = new Date(year, month, day).getTime()
        const nextDay = new Date(year, month, day + 1).getTime()

        let filterTasks = []

        if (isDay) { // if its true means user clicked on the delete button which will delete all tasks of that day
            filterTasks = tasksOfDay
        } else if (isHistory) {
            filterTasks = showTasks.filter(task => task.createFor < today)
        } else {
            filterTasks = showTasks.filter(task => task.createFor > nextDay)
        }
        
        const getIds = filterTasks.map(task => task.id) // getting firebase database ids of tasks 
        const axiosArray = getIds.map(id => axios.delete(url + `/${id}.json`))
        
        try {
            await axios.all(axiosArray)
            dispatch(allTasksAction.updateIsDone(true))
            dispatch(loadingActions.updateDeleteLoading(false))
            modalCloseHandler() // to close the confirm delete modal
        } catch (err) {
            modalShowHandler() // to show network error modal
            modalCloseHandler() // to close the confirm delete modal
            dispatch(loadingActions.updateDeleteLoading(false))
        }
    }

    return [
        deleteTaskHandler,
        checkTaskHandler,
        forwardTaskHandler,
        deleteEntireTasks
    ]
}

export default useMethods