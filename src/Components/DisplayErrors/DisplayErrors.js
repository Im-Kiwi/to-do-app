import { Modal } from 'react-bootstrap'
import { Alert } from '@mui/material'

// ------------------ importing from other files -----------------
import useModal from '../../hooks/useModal'
import { errorFlag } from '../../Identifiers/identifiers'

const DisplayErrors = () => {
    
    // custom hook to control modal
    const [showErrorModal, , modalCloseHandler] = useModal(errorFlag)

    return (
        <Modal 
            show = {showErrorModal} 
            onHide = {modalCloseHandler}
            style = {{marginTop : 120}}
        >
            <Modal.Header closeButton className="fw-bolder text-danger">NETWORK ERROR!</Modal.Header>
            <Modal.Body>
                <Alert severity="error">
                    Please check your internet connection and try again
                </Alert>
            </Modal.Body>
        </Modal>
    )
}

export default DisplayErrors