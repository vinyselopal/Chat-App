import React, { useState, useContext, useEffect } from "react"


function ChatsMain ({userName, socket, userNameAlreadySelected, setUserNameAlreadySelected, users, setUsers, currentChat, setCurrentChat}) {
    const [allChats, setAllChats] = useState(JSON.parse(localStorage.getItem('allChats')) || [])
    const [chats, setChats] = useState([])
    const [myMessage, setMyMessage] = useState('')
    function setMessage (event) {
        setMyMessage(() => event.target.value)
    } 
    
    function sendGeneralMessage (event) {
        if (event.key !== 'Enter') return
        const timeStamp = new Date()
        const parsedTime = timeStamp.toLocaleTimeString().split(' ')[0]
        const messageObj = {
            message: myMessage,
            timestamp: parsedTime,
            user_name: userName
        }
        socket.emit('message', messageObj)
        event.target.value = ''
    }
    function sendPrivateMessage (event) {
        if (event.key !== 'Enter') return
        const timeStamp = new Date()
        const parsedTime = timeStamp.toLocaleTimeString().split(' ')[0]
        const messageObj = {
            message: myMessage,
            timestamp: parsedTime,
            user_name: userName
        }
    
        socket.emit('private message', {content: messageObj, to: users.find(a => a.userName === currentChat).userID})
        event.target.value = ''
    }
    useEffect( () => {
        setChats(() => {
            const chatObj = allChats ? allChats.find(a => a.chatter === currentChat) : null
            return chatObj ? chatObj.chat : []
            
        })
    }, [currentChat]) // removed allChats from dependencies riskily

    useEffect(() => {
        localStorage.setItem('chats', JSON.stringify(chats))
    }, [chats])
    useEffect(
        () => {
                socket.auth = {userName}
                setUserNameAlreadySelected(() => true)

                socket.connect("connect_error", (error) => {
                })

                socket.on("connect", () => {
                    console.log('socket connected')
                    const transport = socket.io.engine.transport.name; // in most cases, "polling"
                    console.log('transport', transport)
                    socket.io.engine.on("upgrade", () => {
                        const upgradedTransport = socket.io.engine.transport.name; // in most cases, "websocket"
                        console.log('upgradedTransport', upgradedTransport)
                    })
                })

                socket.on("disconnect", (reason) => {
                    console.log('Socket disconnect due to:', reason)
                })
                socket.on("user connected", (user) => {
                    // initReactiveProperties(user)
                    console.log('user connected', user)
                    const savedUser = users.find(a => a.userName === user.userName)
                    if (!savedUser) {
                        setUsers((users) => [...users, user])
                    }
                    else {
                        savedUser.userID = user.userID
                        const filteredUsers = users.filter(a => a.userName !== user.userName)
                        setUsers(() => [...filteredUsers, savedUser])
                    }
                    localStorage.setItem('users', JSON.stringify(users))

                })

                socket.on('new users', (users) => {
                    setUsers(users)
                })
                socket.on("users", (users) => {
                    setUsers(() => users)
                    localStorage.setItem('users', JSON.stringify(users))
                })
                socket.on('message', message => {
                    const getChats = JSON.parse(localStorage.getItem('chats' || []))
                    console.log('message', message)
                    setChats([...getChats, message])
                    setAllChats((allChats) => { // useEffect only has access to initial state
                        const general = allChats.find(a => a.chatter === "general")
                        general.chat = [...general.chat, message]
                        return [...allChats]
                    })
                    localStorage.setItem('allChats', JSON.stringify(allChats))
                })
                socket.on('messages', messages => {

                    setAllChats((allChats) => [...allChats, {chatter: 'general', chat: messages}])
                    localStorage.setItem('allChats', JSON.stringify(allChats))
                    setChats(() => messages)
                })
            
                socket.on('private message', ({content, from}) => {
                    console.log({content, from})
                    const chatterObj = users.find(a => a.userID === from)
                    const chatterName = chatterObj.userName

                    let chatObj = allChats ? allChats.find(a => a.chatter === chatterName) : null // set chatter of all chats
                    console.log('chatObj', chatObj)
                    if (chatObj === null) console.log('chatObj is null')
                    chatObj = chatObj.chat ? {...chatObj, chat: [...chat, content]} : {chat: [content], chatter: chatterName}
                    const filteredAllChats = allChats.filter(a => a.chatter !== chatterName)

                    setAllChats(() => {
                        const preAllChats = [...filteredAllChats, chatObj]
                        console.log('pre changing all chats', preAllChats)
                        return preAllChats
                    })
                    localStorage.setItem('allChats', JSON.stringify(allChats))
                    console.log(allChats)
                })
            
            return () => {
                socket.off("users")
                socket.off('message')
                socket.off('messages')
                socket.off('user connected')
                socket.off('private message')
                socket.off('connect')
                socket.off('connect_error')
                socket.off('disconnect')
            }
        },  [])
    return (
        <div id="chats-main">
            <div id="chats-main-header">
                <div id="chats-main-peerName"><h3>{currentChat}</h3></div>
                {/* <button id="chats-main-peerProfile">their image</button> */}
            </div>
            
            <div id="chats-main-window">
                <ul id="chats-main-list">
                    {chats ? chats.map((msg, index) => {
                        return <li key={index} id="message"><div id="msg-upper"><div id="user_name"><p id="user_name-text">{msg.user_name}</p></div><div id="msg"><p id="msg-text">{msg.message}</p></div></div><div id="msg-lower"><div>{msg.timestamp}</div></div></li>
                    }) : null}
                </ul>
            </div>
            <input id="chats-main-type" type="text" onChange={setMessage} onKeyDown={currentChat === "general" ? sendGeneralMessage : sendPrivateMessage} placeholder="Say something nice.."/>
            
            
        </div>
    )
}

export default ChatsMain