## PREVIEW THE PROJECT [**HERE**]

---

## INTRODUCTION

- To do app helps you to create tasks which you want to do on that day or in the upcoming days
- This app will help to make you stay organized

## ABOUT THIS APP

- This app includes calendar which will help you to pick whatever day you want to create your task.
- There is also a feature of creating labels for your task so that you can categorize your task with labels.
- There is an inbox feature consisting of all your tasks (old, new tasks).
- All your progress will be saved and your can check back anytime.
- Authentication feature is added into this app so that user can enjoy the feature once he/she gets authenticated.

## TOOLS USED TO MAKE THIS PROJECT

- This app is made with the help of react library
- For the backend, firebase backend server is used with API endpoints
- Material-ui, React-bootstrap, Bootstrap frameworks are used for styling and transitioning

## HOW TO RUN THIS PROJECT

- If you want to run this project in your system then you need to download by clicking on the green "code" button or create a clone using `git clone` command from your terminal.
- Once you cloned or downloaded successfully, extract the zip file (if u chose the download option) and then go to the terminal reach to your project directory and type `npm install`, this will install all the resources or helping libraries which will help to run this project.
- If your cloned the project then type `npm install` directly.
- After that type `npm start` in your terminal to run this project.

## IMPORTANT NOTE

- Well as firebase backend server is used, so you need to create an account in the [**firebase**](https://firebase.google.com/).
- Then you generate an api key which then can we used in the app.
- Also you need to create a realtime database in firebase and use the api endpoints to connect the database with app.
- To use the key and then endpoints, all you have to do is to create a `.env` file and inside that you have to mention the below:

REACT_APP_FIREBASE_KEY = `your api key`
REACT_APP_SIGN_IN_URL = https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?
REACT_APP_SIGN_UP_URL = https://identitytoolkit.googleapis.com/v1/accounts:signUp?
REACT_APP_SEND_REQ_TO_DB = `your realtime database url`
REACT_APP_DELETE_ACC_URL = https://identitytoolkit.googleapis.com/v1/accounts:delete

- Some url's are already mentioned above as it is common for all.
