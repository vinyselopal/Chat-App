import React, {useState} from "react"
import { SocketContext, socket} from "./context/socket"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom"

import Register from "./components/Register"
import Login from "./components/Login"
import ChatBox from "./components/ChatRoom" 

const App = () => {
    const [userName, setUserName] = useState('')
    return (
        <>
        <SocketContext.Provider value={socket}>
        {
                !userName ? <Login setUserName={setUserName}/> : <ChatBox userName={userName}/>
        }

        </SocketContext.Provider>
            
        </>
    )
}

export default App