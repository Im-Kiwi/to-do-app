import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uniqueId } from 'uuid'
import { Row, Col } from 'react-bootstrap'
import { IconButton, Slide } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

//--------importing files----------
import classes from './Calendar.module.css'
import * as globalVariables from '../../Identifiers/identifiers'
import { dateActions } from '../../Store/Reducers/date'
import DaysOnCalendar from '../../Components/DaysOnCal/DaysOnCal'
import { transitionAction } from '../../Store/Reducers/transition';
import { useEffect } from 'react';

const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const Calendar = props => {
    const dispatch = useDispatch()

    const containerRef = useRef(null)

    const selectedMonth = useSelector(state => state.date.selectedMonth)
    const selectedYear = useSelector(state => state.date.selectedYear)
    const slideCalendar = useSelector(state => state.transition.slideCalendar.status)
    const slideDirection = useSelector(state => state.transition.slideCalendar.direction)


    useEffect(() => {
        dispatch(transitionAction.updateSlideCalStatus(true))  // for transition effect on calendar
    }, [selectedMonth, selectedYear, dispatch])

    let days = []
    
    const firstDayOfMonth = new Date(selectedYear.year, selectedMonth.id).getDay() // shows the day of the start of the month
    
    let count = 1 
    let daysInMonth // how many days are in a month

    const newMonth = new Date(selectedYear.year, selectedMonth.id, 31).getMonth()
    const leapMonth = new Date(selectedYear.year, 1, 29).getMonth()
    // setting condition for how many days are in a month
    if (newMonth === selectedMonth.id) {
        daysInMonth = 30
    } else if (selectedMonth.id === 1 && leapMonth === selectedMonth.id ) {
        daysInMonth = 28
    } else if (selectedMonth.id === 1 && leapMonth !== selectedMonth.id) {
        daysInMonth = 27
    } else {
        daysInMonth = 29
    }

    // this for loop helps to display the days in a month
    for (let i=0; i<=41; i++) {       
        if (i >= firstDayOfMonth && i <= daysInMonth+firstDayOfMonth) {
            days.push(count)
            count++;
        } else {
            days.push('')
        }
    }

    // this methods helps to change the month by clicking on forward and backward button
    const monthYearHandler = (mode) => {
        const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth()).getTime()
        
        if (mode === globalVariables.forward) {
            dispatch(transitionAction.updateSlideCal({status : false, direction : 'left'})) // for transition effect on calendar

            const month = new Date(selectedYear.year, selectedMonth.id + 1).getTime()
            dispatch(dateActions.changeMonth(new Date(selectedYear.year, selectedMonth.id + 1).getMonth()))
            dispatch(dateActions.changeYear(new Date(selectedYear.year, selectedMonth.id + 1).getFullYear()))
            if (month === currentMonth) {
                dispatch(dateActions.getDate({
                    date : new Date().getDate(),
                    day : new Date().getDay()
                }))    
            } else if (month < currentMonth) {
                dispatch(dateActions.getDate({date : null, day : null }))                                                   
            } else {
                dispatch(dateActions.getDate({
                    date : new Date(selectedYear.year, selectedMonth.id + 1).getDate(),
                    day : new Date(selectedYear.year, selectedMonth.id +1).getDay()
                }))
            }
        } else {
            dispatch(transitionAction.updateSlideCal({status : false, direction : 'right'})) // for transition effect on calendar

            const month = new Date(selectedYear.year, selectedMonth.id - 1).getTime()
            dispatch(dateActions.changeMonth(new Date(selectedYear.year, selectedMonth.id - 1).getMonth()))
            dispatch(dateActions.changeYear(new Date(selectedYear.year, selectedMonth.id - 1).getFullYear()))
            if (month === currentMonth) {
                dispatch(dateActions.getDate({
                    date : new Date().getDate(),
                    day : new Date().getDay()
                }))    
            } else if (month < currentMonth) {
                dispatch(dateActions.getDate({date : null, day : null }))                                                   
            } else {
                dispatch(dateActions.getDate({
                    date : new Date(selectedYear.year, selectedMonth.id - 1).getDate(),
                    day : new Date(selectedYear.year, selectedMonth.id - 1).getDay()
                }))
            }
        }
        
        
    }

    return (
        <div ref = {containerRef} className = {[classes.calendarContainer].join('')}>
            <Row className = {[classes.YearAndMonths, 'text-light'].join(' ')}> 
                <Col xs={3}>
                    <IconButton 
                        onClick = {monthYearHandler} 
                        sx = {{color : '#f8f9fa'}}
                    >
                        <NavigateBeforeIcon />    
                    </IconButton>                
                </Col>
                <Col>
                    {selectedMonth.month} {selectedYear.year}
                </Col>
                <Col xs = {3}>
                    <IconButton
                        className = {classes.next}  
                        onClick = {() => monthYearHandler(globalVariables.forward)} 
                        sx = {{color : '#f8f9fa'}}
                    >
                        <NavigateNextIcon />
                    </IconButton>                
                </Col>
            </Row> 
            {slideCalendar ?  // using this for the transition effect to takes place
                <Slide direction = {slideDirection} in = {slideCalendar} mountOnEnter unmountOnExit container = {containerRef.current}>
                    <div>
                        <div className = {['text-center', classes.weekContainer].join(' ')}>
                            {week.map(day => {
                                return <div className = {classes.week}  key = {uniqueId()}><strong>{day}</strong></div>
                            })}
                        </div>
                        <hr style = {{backgroundColor : '#3d405b', height : '2px'}}></hr>                     
                        <DaysOnCalendar days = {days} setOpenCalendar = {props.setOpenCalendar} />          
                    </div>                           
                </Slide>                  
            : null
            }
        </div>
    )
}

export default Calendar