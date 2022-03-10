import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Stack, useMediaQuery, Chip, IconButton, Popover, TextField, List, ListItem, ListItemButton, Tooltip  } from '@mui/material'
import { CancelOutlined, LocalOffer, Clear, Add  } from '@mui/icons-material'
import axios from 'axios'
import { v4 as uniqueId } from 'uuid'

// ------------ importing from other files -------------------
import { allTasksAction } from '../../../Store/Reducers/allTasks'
import classes from './LabelForm.module.css'


const LabelForm = () => {

    const dispatch = useDispatch()
    
    const smBreakPoint = useMediaQuery('(max-width : 410px)')   // setting a breakpoing for responsiveness

    const [anchorEl, setAnchorEl] = useState(null) // to control the popup menu

    const currentLabel = useSelector(state => state.allTasks.currentLabel)
    const totalLabels = useSelector(state => state.allTasks.totalLabels)
    const showLabel = useSelector(state => state.allTasks.showLabel)
    const userId = useSelector(state => state.auth.userId)

    // displaying the create label on clicking the label icon
    const clickLabelHandler = (event) => {
        setAnchorEl(event.currentTarget)
        dispatch(allTasksAction.updateShowLabel(true))
    }

    //to close the create label popover
    const closeLabelHandler = () => {
        setAnchorEl(null)
        dispatch(allTasksAction.updateCurrentLabel(''))
    }

    // to add label into the task
    const addLabelHandler = async() => {
        const sendLabel = {
            name : currentLabel,
            userId : userId
        }

        const findLabel = totalLabels.findIndex(label => label.name === currentLabel)

        if (currentLabel.length !== 0 && findLabel) {
            await axios.post(`https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/labels-${userId}.json`, sendLabel)
            setAnchorEl(null)
            dispatch(allTasksAction.updateShowLabel(false))
            dispatch(allTasksAction.updateIsDone(true))
        }
    }

    // to delete a label on clicking the close button of the label
    const deleteLabelHandler = (event) => {
        dispatch(allTasksAction.updateShowLabel(true))
        dispatch(allTasksAction.updateCurrentLabel(''))
    }

    // this method will execute once the user click on a label in the list of labels
    const clickAvailLabelHandler = (label) => {
        dispatch(allTasksAction.updateCurrentLabel(label))
        dispatch(allTasksAction.updateShowLabel(false))
        setAnchorEl(null)
    }

    // to delete label from the label list
    const deleteLabelListHandler = (id) => {
        try {
            console.log('hello')
            axios.delete(`https://to-do-app-kiwi-default-rtdb.asia-southeast1.firebasedatabase.app/labels-${userId}/${id}.json`)
                .then(() => {
                    dispatch(allTasksAction.updateIsDone(true))
                })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>                                       
            {showLabel ? // to show the label icon or the label name (if its already selected by the user)
                <Tooltip title = 'Add Label'>
                    <IconButton 
                        size = 'small'
                        sx = {{color : '#f03658'}}
                        onClick = {(event) => clickLabelHandler(event)}
                    >
                        <LocalOffer /> 
                    </IconButton>
                </Tooltip>
            :
                <Chip 
                    className = {[classes.label, smBreakPoint ? 'mx-auto' : ''].join(' ')}
                    size = 'small' 
                    label = {currentLabel}
                    onDelete = {deleteLabelHandler}
                    deleteIcon = {<CancelOutlined sx = {{color : '#f8f9fa !important'}} />}
                />
            }
            <Popover
                open = {Boolean(anchorEl)}
                onClose = {closeLabelHandler}
                anchorEl = {anchorEl} 
                anchorOrigin = {{vertical : 'bottom', horizontal : 'left'}}
                transformOrigin = {{vertical : 'top', horizontal : 'right'}} 
            >                                
                <Stack className = 'p-2' direction = 'column'>
                    <TextField                                         
                        sx = {{width : 250}}
                        label = 'Create label'
                        onChange = {(event) => dispatch(allTasksAction.updateCurrentLabel(event.target.value))}
                        size = 'small' 
                        value = {currentLabel}
                        InputProps = {{
                            endAdornment : (
                                <IconButton onClick = {addLabelHandler}>
                                    <Add />
                                </IconButton>
                            )
                        }}
                    /> 
                </Stack>                                       
                <List sx = {{overflowY : 'auto', maxHeight : 150, mb : 1}} >                                           
                    {totalLabels.map(label => (                                                
                        <ListItem key = {uniqueId()} disablePadding>
                            <ListItemButton
                                onClick = {() => clickAvailLabelHandler(label.name)}
                            >
                                {label.name}
                            </ListItemButton>
                            <IconButton 
                                className = 'me-3'
                                onClick = {() => deleteLabelListHandler(label.id)}
                            >                                                         
                                <Clear sx = {{width : 20}} />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>                                                                                 
            </Popover>
        </>
    )
}

export default LabelForm