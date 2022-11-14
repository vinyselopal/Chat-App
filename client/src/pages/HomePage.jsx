import React, { useState, useContext, useEffect } from "react"
import io from "socket.io-client"
import { useNavigate } from "react-router-dom"
import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"
const socket = io('ws://localhost:8000', {auth: {
    token: '123'
    }
})

const HomePage = ({setUserName, socket, setUserNameAlreadySelected, setUserID}) => {
    const [tab, setTab] = useState('signup')
    return (
        <div>
            <div>Chatter-G</div>
            <div className="home-tabs">
                <button onClick={() => setTab('signin')}>Sign In</button>
                <button onClick={() => setTab('signup')}>Sign Up</button>
                <div>
                    { tab === 'signup' ? < SignUp setUserName={setUserName} setUserID={setUserID}/> : <SignIn setUserName={setUserName} socket={socket} setUserNameAlreadySelected={setUserNameAlreadySelected} setUserID={setUserID}/> }
                </div>
            </div>
            
        </div>
    )
} 

export default HomePage