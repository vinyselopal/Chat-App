import React, { useState, useContext, useEffect } from "react"
import ChatsHeader from "../components/ChatsHeader.jsx"
import ChatsSidePanel from "../components/ChatsSidePanel.jsx"
import ChatsMain from "../components/ChatsMain.jsx"


const ChatRoom = ({userName}) => {
    

    return (
        <div>
            <ChatsHeader />
            <ChatsSidePanel />
            <ChatsMain userName={userName}/>
            
            
        </div>  
    )
}

export default ChatRoom

