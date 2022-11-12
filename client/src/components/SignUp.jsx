import React from "react"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom"

const SignUp = ({setUserName}) => {
    async function signupHandler (event) {
        const userName = document.getElementById('signup-userName').value
        const password = document.getElementById('signup-password').value
        const response = await fetch(
          'http://localhost:8000/api/register',
          {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ userName, password })
          }
        )
        const message = await response.json()
        if (response.ok) window.location.href = 'http://localhost:8000/static/login_page'
        else {
          document.querySelector('body').innerHTML = message
        }
      }
      
    return (
        <>
            <label>User Name</label>
            <input type="text" id="signup-userName"/>
            <label>Password</label>
            <input id="signup-password" name="password" type="password"/>
            <label>Confirm Password</label>
            <input id="signup-confirmPassword" name="password" type="password" /><span><button>show</button></span>
            <label>Upload your picture</label>
            <input type="file" id="signup-imageUpload" name="imageUpload" />
            <input type="button" id="signup-submit" onClick={signupHandler} defaultValue="Signup"/>
        </>  
    )
}

export default SignUp

