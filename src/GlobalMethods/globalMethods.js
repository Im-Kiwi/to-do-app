
 // 'at' in variable refering @
const atQuery = /@/g
const dotQuery = /\./g

const checkBeforeAt = new RegExp(/\w@\w/)

const checkBeforeDot = new RegExp(/\.\./)

let atScan, dotScan

// this method help to validate email address when user fills the signup form
export const checkEmail = (email, validMode, isSignIn) => {

    let errorObj = {
        message : '',
        isError : false
    }

    // checking whether email contains @ or . or not 
    if (email.length !== 0) {
        atScan = email.match(atQuery) //will return the array containing the matched '@'
        dotScan = email.match(dotQuery) // will return array containing the matched '.'
    }

    // to check whether strings in the form of alphabet surrounds '@' or '.'
    const beforeAtScan = checkBeforeAt.test(email)
    const beforeDotScan = checkBeforeDot.test(email)

    // to check whether there is '.' after '@'
    const posOfAt = email.search(/@/) // here 'At' in the variable refers to @
    // if '@' is present in the email then trying to find out the position of that '@' so that the email string can be sliced later
    if (posOfAt >= 0) {
        const subStr = email.slice(posOfAt) // slicing the email from the position of '@' to the end
        const scanSubStr = subStr.match(/\./g)

        if (scanSubStr && validMode) {
            if (scanSubStr.length !== 1) {
                errorObj.message = 'Invalid Email. Please mention correct email'
                errorObj.isError = true
            }
        } else if (!scanSubStr && validMode) {
            errorObj.message = 'Invalid Email. Please mention correct email'
            errorObj.isError = true
        }
    }


    // setting the condition which will help to validate email in signup form
    if (validMode && email.length === 0) {
        errorObj.message = 'Please mention your email address'
        errorObj.isError = true
    } else if (validMode && !isSignIn) {
        if (!beforeAtScan) {
            errorObj.message = 'Invalid Email. Please mention correct email'
            errorObj.isError = true
        } else if (beforeDotScan) {
            errorObj.message = 'Invalid Email. Please mention correct email'
            errorObj.isError = true
        } else if (atScan && dotScan) {
            if (atScan.length > 1) {
                errorObj.message = 'Invalid Email. Please mention correct email'
                errorObj.isError = true
            }
        } else if (!atScan && !dotScan) {
            errorObj.message = 'Invalid Email. Please mention correct email'
            errorObj.isError = true
        } else {
            errorObj.message = ''
            errorObj.isError = false
        }
    } 

    return errorObj
}


// showing dynamic error messages for password input
export const checkPassword = (password, validMode, isSignIn) => {
    let passError = {
        status : false,
        message : ''
    }

    if (validMode && !isSignIn && password.length > 0 && password.length < 6) {
        passError.status = true
        passError.message = 'Password should contain atleast 6 characters'
    } else if (validMode && password.length === 0) {
        passError.status = true
        passError.message = 'Please mention your Password'
    }

    return passError
}

// to display error message dynamically below user name input field
export const checkUserName = (userName, validMode, isUserNameExist, exist) => {

    let userNameError = {
        status : false, 
        message : ''
    }

    if (userName.length === 0 && validMode) {
        userNameError.status = true
        userNameError.message = 'Please mention the user name'
    } else if (userName.length > 0 && validMode && isUserNameExist === exist) {
        userNameError.status = true
        userNameError.message = 'User name already exist'
    }

    return userNameError
}