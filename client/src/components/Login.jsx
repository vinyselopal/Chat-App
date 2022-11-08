import React from "react"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom"

const Login = ({setUserName}) => {
    async function loginHandler () {
        const userName = document.getElementById('userName').value
        const password = document.getElementById('password').value
        const response = await fetch('http://localhost:8000/api/login',
          {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ userName, password })
          })
      
        const creds = await response.json()
        console.log(creds)
        if (response.status === 200) {
          setUserName(creds.user_name)
        } else {
          document.querySelector('body').innerHTML = creds
        }
      }
      
    return (
        <>
            <h1>Login</h1>
            <input type="text" id="userName"/>
            <input id="password" name="password" type="password"/>
            <input type="button" id="submit" onClick={loginHandler} value="Login"/>
        </>  
    )
}

export default Login

