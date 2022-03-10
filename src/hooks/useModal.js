import { useSelector, useDispatch } from 'react-redux'

//---------- importing from other files --------------
import { formActions } from '../Store/Reducers/userForm'
import { errorActions } from '../Store/Reducers/error'
import { popUpAction } from '../Store/Reducers/popUp'
import { clearAll, createAccount, delAccount, errorFlag } from '../Identifiers/identifiers'
import { loadingActions } from '../Store/Reducers/loading'
import { authActions } from '../Store/Reducers/auth'

const useModal = (props) => {

    const dispatch = useDispatch()

    const showInboxModal = useSelector(state => state.popUp.showInboxModal)
    const showModal = useSelector(state => state.popUp.showModal)
    const deleteAccountModal = useSelector(state => state.popUp.showDelAccModal)
    const showErrorModal = useSelector(state => state.popUp.showErrorModal)


    // this method will display modal
    const modalShowHandler = () => {
        if (props === clearAll) {
            dispatch(popUpAction.toggleInboxModal(true))
        } else if (props === createAccount) {
            dispatch(popUpAction.toggleShow(true))
        } else if (props === delAccount) {
            dispatch(popUpAction.updateDelAccModal(true))
        } else if (props === errorFlag) {
            dispatch(popUpAction.updateErrorModal(true))
        }
    }

    // it will close the modal
    const modalCloseHandler = () => {
        if (props === clearAll) {
            dispatch(popUpAction.toggleInboxModal(false))
        } else if (props === createAccount) {
            dispatch(popUpAction.toggleShow(false))
            dispatch(formActions.changeValidMode(false))
            dispatch(errorActions.updateWrongCeredentials(false))
            dispatch(errorActions.updateNoNetwork(false))
            dispatch(formActions.changeEmail(''))
            dispatch(formActions.changeUserName(''))
            dispatch(formActions.changePassword(''))
            dispatch(formActions.changeConfirmPassword(''))
            dispatch(loadingActions.updateUserAuthLoading(false)) 
            dispatch(authActions.updateSignUpSuccess(false))               
        } else if (props === delAccount) {
            dispatch(popUpAction.updateDelAccModal(false))
        } else if (props === errorFlag) {
            dispatch(popUpAction.updateErrorModal(false))
            dispatch(errorActions.updateNoNetwork(false))
        }
    }

    // dynamically returning the values and methods
    if (props === clearAll) {
        return [showInboxModal, modalShowHandler, modalCloseHandler]
    } else if (props === createAccount) {
        return [
            showModal,
            modalShowHandler,
            modalCloseHandler,
        ]
    } else if (props === delAccount) {
        return [
            deleteAccountModal,
            modalShowHandler,
            modalCloseHandler
        ]
    } else if (props === errorFlag) {
        return [
            showErrorModal,
            modalShowHandler,
            modalCloseHandler
        ]
    }
}

export default useModal