import React, { useState, useContext, useEffect } from "react"
import socketio from "socket.io-client"
// import { socket, SocketContext } from "../context/socket"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom"

const socket = socketio('ws://localhost:8000', {auth: {
    token: '123'
  }})


const ChatRoom = ({userName}) => {
    // const socket = useContext(SocketContext)
    // console.log(socket)
    const [chats, setChats] = useState([])
    const [myMessage, setMyMessage] = useState('')

    socket.on('messages', messages => {
        console.log('messages', messages)
        messages = messages.map(msg => `${msg.user_name} said ${msg.message} at ${msg.timestamp}`) // client side
        setChats(chats => messages)
    })

    useEffect(
        () => {
(async function anon () { await 
    socket.on("connection", () => {
        console.log('socket connected')
    })
    
    socket.on('message', message => {
    console.log('message', message)
    message = `${message.userName} said ${message.message} at ${message.timeStamp}`
    console.log("chats", chats, "more", [...chats, message])
    setChats(chats => [...chats, message])

})
})()


return () => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('pong')
}
        }, []    
    )

    return (
        <div>
            <h1>ChatRoom</h1>
            <ul>
                {chats.map((msg, index) => {
                    console.log(chats)
                    return <li key={index}>{msg}</li>
                })}
            </ul>
            <input type="text" onChange={(event) => {
                setMyMessage(myMessage => event.target.value)
                console.log(myMessage)
            }} onKeyDown={(event) => {
                if (event.key !== 'Enter') return
  const timeStamp = new Date()
  const parsedTime = timeStamp.toLocaleTimeString().split(' ')[0]
  console.log("userName", userName)
  const messageObj = {
    message: myMessage,
    timeStamp: parsedTime,
    userName
  }
  socket.emit('message', messageObj)

//   socket.on('connection', function (socket) {
//     socket.emit('message', messageObj)
//     socket.disconnect()
//   })
  
  event.target.value = ''
            }}/>
            <button value="logout">logout</button>
        </div>  
    )
}

export default ChatRoom

