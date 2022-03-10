import { useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { Fab, useMediaQuery, Collapse, Grow } from '@mui/material'
import { BorderColor, EventAvailable } from '@mui/icons-material'

// ------------importing files---------------
import classes from './Dashboard.module.css'
import TaskCreation from '../TaskCreation/TaskCreation'
import Calendar from '../Calendar/Calendar'


const Dashboard = () => {

    const matched = useMediaQuery('(min-width : 992px)') // creating a responsive breakpoint

    const [openCalendar, setOpenCalendar] = useState(false)

    return (
        <Grow in = {true}>
            <Container>
                <div className = {[classes.taskContainer].join(' ')} >
                    <Container>
                        {matched ? // used this condition to dynamically showing the component at a certain responsive breakpoint
                            null
                        :
                            <Fab 
                                className = {[classes.calendarIcon, 'border'].join(' ')}
                                color = 'secondary'
                                onClick = {() => setOpenCalendar(v => !v)}
                            >   
                                {openCalendar ? 
                                    <BorderColor sx = {{mt : 2, fontSize : '1.5rem'}} />    
                                :
                                    <EventAvailable sx = {{mt : 2.5, fontSize : '1.8rem'}} />                                    
                                }
                            </Fab>
                        }
                        <Row className = {[classes.row].join(' ')} >
                            <Col className = {['d-lg-block', !openCalendar ? 'd-none' : null].join(' ')} >
                                {matched ?
                                    <Calendar />
                                :   
                                    <Collapse in = {openCalendar}> 
                                        <Calendar setOpenCalendar = {setOpenCalendar} />
                                    </Collapse>
                                    
                                }
                            </Col>
                            <Col className = {[!openCalendar ? null : 'd-none', 'd-lg-block'].join(' ')}>
                                {matched ?
                                    <TaskCreation />
                                :
                                    <Collapse in = {!openCalendar}>
                                        <TaskCreation />                                                        
                                    </Collapse>
                                }
                            </Col>
                        </Row>            
                    </Container>
                </div>
            </Container>
        </Grow>
    )
}

export default (Dashboard)