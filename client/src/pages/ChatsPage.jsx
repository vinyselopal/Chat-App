import React, { useState, useContext, useEffect } from "react"
import ChatsHeader from "../components/ChatsHeader.jsx"
import ChatsSidePanel from "../components/ChatsSidePanel.jsx"
import ChatsMain from "../components/ChatsMain.jsx"


const ChatRoom = ({token, setToken, userID, setUserID, userName, setUserName, socket, setUserNameAlreadySelected, usernameAlreadySelected, users, setUsers, currentChat, setCurrentChat}) => {

    return (
        <div id="chatsPage">
            <ChatsHeader userID={userID} setUserID={setUserID} setUserName={setUserName} socket={socket} userName={userName}/>
            <div id="chats-lower-window">
            <ChatsSidePanel userID={userID} setUserID={setUserID} userName={userName} socket={socket} setUserNameAlreadySelected={setUserNameAlreadySelected} usernameAlreadySelected={usernameAlreadySelected} users={users} setUsers={setUsers} currentChat={currentChat} setCurrentChat={setCurrentChat}/>
            <ChatsMain token={token} setToken={setToken} userID={userID} setUserID={setUserID} userName={userName} socket={socket} setUserNameAlreadySelected={setUserNameAlreadySelected} usernameAlreadySelected={usernameAlreadySelected} users={users} setUsers={setUsers} currentChat={currentChat} setCurrentChat={setCurrentChat}/>
            </div>
            
        </div>  
    )
}

export default ChatRoom

