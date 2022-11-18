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

const socket = io('ws://localhost:8000', {autoConnect: false})



const App = () => {
    const getUserName = JSON.parse(localStorage.getItem('userName'))
    const getUsers = JSON.parse(localStorage.getItem('users'))
    const getUserID = JSON.parse(localStorage.getItem('userID'))
    const getToken = JSON.parse(localStorage.getItem('token'))
    const [userName, setUserName] = useState(getUserName || '')
    const [userID, setUserID] = useState(getUserID || '')
    const [userNameAlreadySelected, setUserNameAlreadySelected] = useState(false)
    const [token, setToken] = useState(getToken || '')
    const [users, setUsers] = useState(getUsers || [])
    const [currentChat, setCurrentChat] = useState('general')

    return (
        <>
        <Routes>
            <Route path="/" element={<HomePage token={token} setToken={setToken} setUserID={setUserID} setUserName={setUserName} socket={socket} setUserNameAlreadySelected={setUserNameAlreadySelected} />} />
            <Route path="/chats" element={<ChatsPage token={token} setToken={setToken} userID={userID} setUserID={setUserID} userName={userName} setUserName={setUserName} socket={socket}setUserNameAlreadySelected={setUserNameAlreadySelected} usernameAlreadySelected={userNameAlreadySelected} users={users} setUsers={setUsers} currentChat={currentChat} setCurrentChat={setCurrentChat}/>} />
        </Routes>
            
        {/* {
                !userName ? <Login setUserName={setUserName}/> : <ChatBox userName={userName}/>
        } */}
            
        </>
    )
}

export default App