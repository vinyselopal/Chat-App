import React, { useState, useContext, useEffect } from "react"


function ChatsMain ({userName, socket, userNameAlreadySelected, setUserNameAlreadySelected}) {
    const [chats, setChats] = useState([])
    const [myMessage, setMyMessage] = useState('')
    const [users, setUsers] = useState([])
    function setMessage (event) {
        setMyMessage(() => event.target.value)
        console.log(myMessage)
    } 
    
    function sendMessage (event) {
        if (event.key !== 'Enter') return
        const timeStamp = new Date()
        const parsedTime = timeStamp.toLocaleTimeString().split(' ')[0]
        console.log('userName', userName)
        const messageObj = {
            message: myMessage,
            timeStamp: parsedTime,
            userName
        }
        socket.emit('message', messageObj)
        event.target.value = ''
    }
    function privateMessaging () {
        const userName = 'b'
        const user = users.filter(a => a.userName = userName)[0]
        if (user) {
            socket.emit("private message", {
                content: 'hi',
                to: user.userID
            })
        }
    }
    privateMessaging()

    
    useEffect(
        () => {
                socket.auth = {userName}
                setUserNameAlreadySelected(() => true)

                socket.connect()

                socket.on("connect", () => {
                    console.log('socket connected')
                })

                socket.on("user connected", (user) => {
                    // initReactiveProperties(user)
                    setUsers(() => [...users, user])
                })
                socket.on("users", (users) => {
                    console.log("users", users) // users will have current user as well, due to io.emit('users')
                    setUsers(() => users)
                })
                socket.on('message', message => {
                    console.log('message', message)
                    message = `${message.userName} said ${message.message} at ${message.timeStamp}`
                    setChats(chats => [...chats, message])
                })
                socket.on('messages', messages => {
                    console.log('messages', messages)
                    messages = messages.map(msg => `${msg.user_name} said ${msg.message} at ${msg.timestamp}`) // client side
                    setChats(chats => messages)
                })
            
                socket.on('private message', ({content, from}) => {
                    console.log({content, from})
                })
            
            return () => {
                socket.off("users")
                socket.off('message')
                socket.off('messages')
            }
        },  [])
    return (
        <div id="chats-main">
            <div id="chats-main-header">
                <div id="chats-main-peerName">Here goes their name</div>
                <button id="chats-main-peerProfile">their image</button>
            </div>
            
            <div id="chats-main-window">
                <ul id="chats-main-list">
                    {chats.map((msg, index) => {
                        console.log(chats)
                        return <li key={index}>{msg}</li>
                    })}
                </ul>
                <input type="text" onChange={setMessage} onKeyDown={sendMessage} placeholder="Say something nice.."/>
            </div>
            
        </div>
    )
}

export default ChatsMain