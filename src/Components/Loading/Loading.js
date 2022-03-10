import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Container } from '@mui/material'
// ------------ importing from other files ---------------
import classes from './Loading.module.css'

const Loading = props => {

    const { pathname } = useLocation()

    const userName = useSelector(state => state.auth.userName)

    // holds the pathname of the components
    const paths = {
        todayTask : `/${userName}/inbox/today-tasks`,
        nextDayTask : `/${userName}/inbox/tomorrow-tasks`,
        upcoming : `/${userName}/inbox/upcoming-tasks`,
        history : `/${userName}/inbox/history`
    }

    let loading

    // dynamically showing the spinner depending upon whether it satisfies the conditions
    if (props.userForm || props.confirmDelete) {
        loading = <div className = {classes.loader}></div>
    } else if (props.dashboard) {
        loading = (
            <Container>
                <div style = {{width : '100%', marginTop : '40%'}}>                   
                    <div className = {classes.loader}></div>
                </div>
            </Container>
        )
    } else if (props.inbox) {
        if (pathname === paths.todayTask || pathname === paths.nextDayTask) {
            loading = (
                <Container maxWidth = 'xl'>
                    <div style = {{marginTop : '40%'}}>                        
                        <div className = {classes.loader}></div>
                    </div>
                </Container>
            ) 
        } else if (pathname === paths.history || pathname === paths.upcoming) {
            loading = (
                <Container maxWidth = 'xl'>
                    <div style = {{marginTop : '40%'}}>                        
                        <div className = {classes.loader}></div>
                    </div>                    
                </Container>
            )
        }
    }

    return (
        <div>
            {loading}
        </div>
    )

}

export default Loading