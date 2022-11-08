import io from "socket.io-client"
import React, {useState} from "react"
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

socket.onAny((event, ...args) => {
    console.log(event, args)
})

const App = () => {
    const user = localStorage.getItem('userName')
    const [userName, setUserName] = useState(user ? user : "")
    return (
        <>
        <Routes>
            <Route path="/" element={<HomePage setUserName={setUserName}/>} />
            <Route path="/chats" element={<ChatsPage userName={userName} setUserName={setUserName} socket={socket}/>} />
        </Routes>
            
        {/* {
                !userName ? <Login setUserName={setUserName}/> : <ChatBox userName={userName}/>
        } */}
            
        </>
    )
}

export default App