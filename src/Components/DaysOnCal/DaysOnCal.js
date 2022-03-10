
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uniqueId} from 'uuid'
import { useMediaQuery } from '@mui/material'

// ------------importing from other files ------------
import classes from './DaysOnCal.module.css'
import { allTasksAction } from '../../Store/Reducers/allTasks'
import { dateActions } from '../../Store/Reducers/date'
import { transitionAction } from '../../Store/Reducers/transition'

const currentDay = new Date().getDate()

const DaysOnCalendar = props => {

    const dispatch = useDispatch()

    const matched = useMediaQuery('(max-width : 992px)')

    const totalTasks = useSelector(state => state.allTasks.totalTasks)
    const selectedMonth = useSelector(state => state.date.selectedMonth)
    const selectedYear = useSelector(state => state.date.selectedYear)
    const aDate = useSelector(state => state.date.selectedDay)
    const toggleFade = useSelector(state => state.transition.toggleFade)

    // this method will gonna display the (date dd-mm-yy) in the create task section when click on the day in the calender
    const clickDateHandler = (date) => {
        const day = new Date(selectedYear, selectedMonth, date).getDay() // return that day of the week in number format
        dispatch(dateActions.getDate({date : date, day : day}))
        dispatch(allTasksAction.showCreateTask(false))
        dispatch(allTasksAction.updateCurrentTask(''))
        dispatch(allTasksAction.updateCurrentLabel(''))
        dispatch(transitionAction.updateFadeTasks(false))

        if (toggleFade) {
            dispatch(transitionAction.updateToggleFade(false))
        } else {
            dispatch(transitionAction.updateToggleFade(true))
        }
        
        if (matched) {
            props.setOpenCalendar(false)
            console.log('hello')
        }
    }

    //displaying days on calender
    let daysOnCalendar = props.days.map((day) => {
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        // checking whether are there any task set if yes then it will return true
        let isTask = totalTasks.find(task => {
            if (day === task.day && selectedMonth.id === task.month && selectedYear.year === task.year) {
                return true
            } else {
                return null
            }
        })

        let disableDay = false
        let dynamicClass

        // this method is to change the color of day in calendar depending upon whether all tasks are pending or not
        // if atleast one task is pending of that day then that day on calender will appear in red color otherwise green 
        function buttonContainedTask () {
            let pendingStatus = false
            totalTasks.filter(task => {
                if (task.day === day && task.month === selectedMonth.id && task.year === selectedYear.year) {
                    return task
                } else {
                    return null
                }
            }).forEach(task => {
                if (task.isPending) {
                    pendingStatus = true                    
                }
            })
            
            if (pendingStatus) {
                return 'text-danger fw-bolder'
            } else {
                return 'text-success fw-bolder'
            }
        }

        // dynamically changing the className
        const currentDate = new Date().getTime()
        const dateToComp = new Date(selectedYear.year, selectedMonth.id, day).getTime()
        if (day === '') {
            dynamicClass = classes.disableButton
        } else if (day === currentDay && currentMonth === selectedMonth.id && currentYear === selectedYear.year) {
            dynamicClass = [classes.gridButton, classes.activeDay].join(' ')
        } else if (day === aDate.date) {
            dynamicClass = [classes.gridButton, classes.activeButton, isTask ? buttonContainedTask() : null].join(' ')
        } else if (dateToComp < currentDate) {
            dynamicClass = [classes.deadButton, isTask ? buttonContainedTask() : null].join(' ')
            if (isTask) {   // 
                disableDay = false
            } else {
                disableDay = true
            }
        } else if (dateToComp > currentDate) {
            dynamicClass = [classes.gridButton, isTask ? buttonContainedTask() : null].join(' ')
        }      

        return (
            <div key = {uniqueId()} className = {classes.gridItem}>
                <button                     
                    disabled = {disableDay}
                    onClick = {() => clickDateHandler(day)}
                    className = {dynamicClass}>
                    {day}
                </button>    
            </div>
        )
    })

    return (
        <div className = {classes.gridContainer}>
            {daysOnCalendar}
        </div> 
    )
}

export default DaysOnCalendar