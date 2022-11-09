import io from "socket.io-client"
import React, {useEffect, useState} from "react"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom"

import "./styles/index.css"
import ChatsPage from "./pages/ChatsPage" 
import HomePage from "./pages/HomePage"

const socket = io('ws://localhost:8000', {auth: {
    token: '123'
    }
})



const App = () => {
    const user = localStorage.getItem('userName')
    const [userName, setUserName] = useState(user ? user : "")
    const [userNameAlreadySelected, setUserNameAlreadySelected] = useState(false)

    useEffect(() => {
        socket.onAny((event, ...args) => {
            console.log(event, args)
        })
        
        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                setUserNameAlreadySelected(false)
            }
        })

        
        return () => {
            socket.off("connect_error")
        }
    }, [])
    return (
        <>
        <Routes>
            <Route path="/" element={<HomePage setUserName={setUserName} socket={socket} setUserNameAlreadySelected={setUserNameAlreadySelected}/>} />
            <Route path="/chats" element={<ChatsPage userName={userName} setUserName={setUserName} socket={socket}setUserNameAlreadySelected={setUserNameAlreadySelected} usernameAlreadySelected={userNameAlreadySelected}/>} />
        </Routes>
            
        {/* {
                !userName ? <Login setUserName={setUserName}/> : <ChatBox userName={userName}/>
        } */}
            
        </>
    )
}

export default App