import React, { useState, useContext, useEffect } from "react"
import ChatsHeader from "../components/ChatsHeader.jsx"
import ChatsSidePanel from "../components/ChatsSidePanel.jsx"
import ChatsMain from "../components/ChatsMain.jsx"


const ChatRoom = ({userName, socket, setUserNameAlreadySelected, usernameAlreadySelected}) => {
    

    return (
        <div id="chatsPage">
            <ChatsHeader/>
            <ChatsSidePanel />
            <ChatsMain userName={userName} socket={socket} setUserNameAlreadySelected={setUserNameAlreadySelected} usernameAlreadySelected={usernameAlreadySelected}/>
            
            
        </div>  
    )
}

export default ChatRoom

