import React from "react"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom"

const SignIn = ({token, setToken, setUserName, setUserID, socket, setUserNameAlreadySelected}) => {
  const navigate = useNavigate()
    async function loginHandler () {
        const userName = document.getElementById('signin-userName').value
        const password = document.getElementById('signin-password').value

        const response = await fetch('http://localhost:8000/api/login',
          {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ userName, password })
          })
      
        const creds = await response.json()
        console.log('creds', creds)
        if (response.status === 200) {

          setUserName(() => creds.user_name)
          setUserID(() => creds.user_id)
          setToken(() => creds.accessToken)
          localStorage.setItem('userName', JSON.stringify(creds.user_name))
          localStorage.setItem('userID', JSON.stringify(creds.user_id))
          localStorage.setItem('token', JSON.stringify(creds.accessToken))
          setUserNameAlreadySelected(true)
          navigate('/chats')
          window.location.reload()

        } else {
          document.querySelector('body').innerHTML = creds
        }
      }
      
    return (
        <>
            <label>User Name</label>
            <input type="text" id="signin-userName"/>
            <label>Password</label>
            <input id="signin-password" name="password" type="password"/>
            <input type="button" id="signin-submit" onClick={loginHandler} defaultValue="Signin"/>
            <button id="signin-guestSignin" >Sign in as guest</button>
        </>  
    )
}

export default SignIn

