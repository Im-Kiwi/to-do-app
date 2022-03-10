import { useEffect } from 'react'
import { FormControl, InputLabel, Select, MenuItem, IconButton, Stack, Box, Container, useMediaQuery } from '@mui/material'
import { v4 as uniqueId } from 'uuid'
import { useSelector, useDispatch } from 'react-redux'
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// ------------ importing contents from other file ------------
import { selectDataActions } from '../../Store/Reducers/selectData'
import { year, month, day } from '../../Identifiers/identifiers'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const InboxSelect = ({pathname, updatedTimeStamps}) => {

    const dispatch = useDispatch()

    const changeDirection = useMediaQuery('(max-width : 375px)') // set the responsive breakpoint

    const selectYear = useSelector(state => state.selectData.selectYear)
    const selectMonth = useSelector(state => state.selectData.selectMonth)
    const selectDay = useSelector(state => state.selectData.selectDay)
    const userName = useSelector(state => state.auth.userName)

    useEffect(() => {
        dispatch(selectDataActions.changeYear(''))
        dispatch(selectDataActions.changeMonth(''))
        dispatch(selectDataActions.changeDay(''))
    }, [pathname, dispatch])

    
    // containing the years of every tasks
    const yearSet = updatedTimeStamps.map(time => {
        return time.year
    })

    // method to create the array of time of different time unit
    const manipulateTimeSet = (timeUnit) => {
        let monthSet, filterMonth, filterDay, daySet = [] 
        
        if (selectYear !== '') {
            filterMonth = updatedTimeStamps.filter(time => time.year === selectYear)
            monthSet = filterMonth.map(month => month.month)
        }

        if (selectMonth !== '') {
            filterDay = filterMonth.filter(time => time.month === selectMonth )
            daySet = filterDay.map(time => time.day)
        }


        let uniqueTimeSet = []
        let nonRepeat
        if (timeUnit === month) {
            nonRepeat = new Set(monthSet)
        } else if (timeUnit === day) {
            nonRepeat = new Set(daySet)
        } else {
            nonRepeat = new Set(yearSet)
        }
    
        for (let value of nonRepeat) {
            uniqueTimeSet.push(value)
        }

        return uniqueTimeSet
    }

    // getting the arrays of unique values of years, months, days
    const uniqueYears = manipulateTimeSet()
    const uniqueMonths = manipulateTimeSet(month)
    const uniqueDays = manipulateTimeSet(day)

    // method to control the changes in select tag
    const selectChangeHandler = (timeUnit, event) => {
        dispatch(selectDataActions.initialLabel([]))
        if (timeUnit === year) {
            dispatch(selectDataActions.changeYear(event.target.value))
        } else if (timeUnit === month) {
            dispatch(selectDataActions.changeMonth(event.target.value))
        } else if (timeUnit === day) {
            dispatch(selectDataActions.changeDay(event.target.value))
        }
    }
    
    // to reset the select tags
    const resetClickHandler = () => {
        dispatch(selectDataActions.changeYear(''))
        dispatch(selectDataActions.changeMonth(''))
        dispatch(selectDataActions.changeDay(''))
        dispatch(selectDataActions.initialLabel([]))
    }
    

    return (
        <>
            {(pathname === `/${userName}/inbox/upcoming-tasks` || pathname === `/${userName}/inbox/history`) && updatedTimeStamps.length !== 0 ? 
                <Container sx = {{mt : 10}} maxWidth = 'sm'>
                    <Stack 
                        direction = {changeDirection ? 'column' : 'row'} 
                        justifyContent = 'center' 
                        spacing={1}
                    >   
                        <FormControl fullWidth  size='small'>
                            <InputLabel id = 'year-select'>Year</InputLabel>
                            <Select 
                                labelId = 'year-select'
                                label = 'Year'
                                value = {selectYear}
                                onChange = {event => selectChangeHandler(year, event)}
                            >
                                {uniqueYears.map(year => {
                                    return <MenuItem key = {uniqueId()} value = {year}>{year}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth
                            size='small' 
                            disabled = {selectYear === '' ? true : false}
                        >
                            <InputLabel id = 'month-select'>Month</InputLabel>
                            <Select                            
                                labelId = 'month-select'
                                label = 'Month'
                                value = {selectMonth}
                                onChange = {event => selectChangeHandler(month, event)}
                            >
                                {uniqueMonths.map(month => <MenuItem key = {uniqueId()} value = {month}>{MONTHS[month]}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size='small' disabled = {selectMonth === '' ? true : false} >
                            <InputLabel id = 'day-select'>Day</InputLabel>
                            <Select 
                                labelId = 'day-select'
                                label = 'Day'
                                value = {selectDay}
                                onChange = {event => selectChangeHandler(day, event)}
                            >
                                {uniqueDays.map(day => <MenuItem key = {uniqueId()} value = {day}>{day}</MenuItem>)}
                            </Select>
                        </FormControl>
                        {selectYear ? // reset button will appear once user select from the select year tag
                            <div className = 'mx-auto'>
                                <IconButton
                                    onClick = {resetClickHandler}
                                >
                                    <RestartAltIcon />
                                </IconButton>
                            </div>
                        :
                            null
                        }
                    </Stack>                                  
                </Container>                
            :
                <Box sx = {{height : 50}}></Box>} 
        </>
    )
}

export default InboxSelect