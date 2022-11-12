import React, { useState, useContext, useEffect } from "react"
import ChatsHeader from "../components/ChatsHeader.jsx"
import ChatsSidePanel from "../components/ChatsSidePanel.jsx"
import ChatsMain from "../components/ChatsMain.jsx"


const ChatRoom = ({userName, setUserName, socket, setUserNameAlreadySelected, usernameAlreadySelected, users, setUsers, currentChat, setCurrentChat}) => {

    return (
        <div id="chatsPage">
            <ChatsHeader setUserName={setUserName} socket={socket} userName={userName}/>
            <div id="chats-lower-window">
            <ChatsSidePanel userName={userName} socket={socket} setUserNameAlreadySelected={setUserNameAlreadySelected} usernameAlreadySelected={usernameAlreadySelected} users={users} setUsers={setUsers} currentChat={currentChat} setCurrentChat={setCurrentChat}/>
            <ChatsMain userName={userName} socket={socket} setUserNameAlreadySelected={setUserNameAlreadySelected} usernameAlreadySelected={usernameAlreadySelected} users={users} setUsers={setUsers} currentChat={currentChat} setCurrentChat={setCurrentChat}/>
            </div>
            
        </div>  
    )
}

export default ChatRoom

