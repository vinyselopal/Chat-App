import React, { useState, useContext, useEffect } from "react"


function ChatsMain ({token, setToken, userID, setUserID, userName, socket, userNameAlreadySelected, setUserNameAlreadySelected, users, setUsers, currentChat, setCurrentChat}) {
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
        console.log('userID', userID)
        const messageObj = {
            message: myMessage,
            timestamp: parsedTime,
            user_id: userID,
            user_name: userName,
            room_id: 'general',
            recipient: 0
        }
        socket.emit('message', messageObj)
        event.target.value = ''
        window.location.reload()
    }
    function sendPrivateMessage (event) {
        if (event.key !== 'Enter') return
        const timeStamp = new Date()
        const parsedTime = timeStamp.toLocaleTimeString().split(' ')[0]
        const recipient = users.find(a => a.userName === currentChat)
        console.log('recipient', recipient)
        const roomID = `${userID}:${recipient.userID}`

        const messageObj = {
            message: myMessage,
            timestamp: parsedTime,
            user_name: userName,
            user_id: userID,
            room_id: roomID,
            recipient: recipient.userID
        }
        socket.emit('private message', {content: messageObj, userID: recipient.userID})
        
        const allChats = JSON.parse(localStorage.getItem('allChats'))
        console.log(allChats)
        let chatObj = allChats.find(a => a.chatter === currentChat) || {chat: [], chatter: currentChat} // set chatter of all chats
        console.log('chatObj', chatObj)
        chatObj = {...chatObj, chat: [...chatObj.chat, messageObj]}
        const filteredAllChats = allChats.filter(a => a.chatter !== currentChat)
        setAllChats([...filteredAllChats, chatObj])
        event.target.value = ''
        window.location.reload()

    }
    useEffect( () => {
        const getAllChats = JSON.parse(localStorage.getItem('allChats'))
        setChats(() => {
            let chatObj = getAllChats ? getAllChats.find(a => a.chatter === currentChat) : null
            return chatObj ? chatObj.chat : []
            
        })
    }, [currentChat]) // removed allChats from dependencies riskily


    useEffect(() => {
        localStorage.setItem('chats', JSON.stringify(chats))
        console.log(chats)
    }, [chats])

    useEffect(() => {
        localStorage.setItem('allChats', JSON.stringify(allChats))
    }, [allChats])

    useEffect(
        () => {
            console.log('sunas', userNameAlreadySelected, 'token', token)

            if (userNameAlreadySelected || token) {
                console.log('token when suas is true', token)
                socket.auth = {token}
                socket.connect()
                
            }
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
                        setUsers(() => [...filteredUsers, user])

                    }
                    localStorage.setItem('users', JSON.stringify(users))

                })

                socket.on('new users', (users) => {
                    console.log('users on new users event')
                    setUsers(users)
                })
                socket.on("users", (users) => {
                    setUsers(() => users)
                    localStorage.setItem('users', JSON.stringify(users))
                })
                socket.on('message', message => {
                    const allChats = JSON.parse(localStorage.getItem('allChats'))
                    const getChats = JSON.parse(localStorage.getItem('chats' || []))
                    console.log('message', message)
                    setAllChats((allChats) => { // useEffect only has access to initial state
                        const general = allChats.find(a => a.chatter === "general") || {chatter: 'general', chat: []}
                        general.chat = [...general.chat, message]
                        return [...allChats]
                    })
                    localStorage.setItem('allChats', JSON.stringify(allChats))
                })
                socket.on('messages', messages => {
                    console.log('messages event')
                    const getAllChats = JSON.parse(localStorage.getItem('allChats'))
                    console.log('allChats on messages event', getAllChats)
                    if (!getAllChats.length) {
                        console.log('getAllChats is empty')

                        const generalMessages = {chatter: 'general', chat: messages.filter(a => a.room_id === 'general')}
                        const restMessages = messages.filter(a => a.room_id !== 'general')
                        const tempArr = []
                        for (let message of restMessages) {
                            const chatterObj = tempArr.find(obj => obj.chatter === message.user_name)
                            if (chatterObj) chatterObj.chat.push(message)
                            else tempArr.push({chatter: message.user_name, chat: [message]})

                        }
                        console.log('tempArr', tempArr)
                        setAllChats(() => [generalMessages, ...tempArr])
                    }
                    else {
                        setAllChats((allChats) => [...allChats, {chatter: 'general', chat: messages}])
                    }
                })
            
                socket.on('private message', ({content, from}) => {
                    console.log('priv', {content, from})
                    const users = JSON.parse(localStorage.getItem('users'))
                    console.log(users)
                    const chatterObj = users.find(a => a.userName=== from)
                    const chatterName = chatterObj.userName
                    const allChats = JSON.parse(localStorage.getItem('allChats'))
                    console.log(allChats)
                    let chatObj = allChats.find(a => a.chatter === chatterName) || {chat: [], chatter: chatterName} // set chatter of all chats
                    console.log('chatObj', chatObj)
                    chatObj = {...chatObj, chat: [...chatObj.chat, content]}
                    const filteredAllChats = allChats.filter(a => a.chatter !== chatterName)

                    const preAllChats = [...filteredAllChats, chatObj]
                    console.log('pre changing all chats', preAllChats)

                    setAllChats(() => {
                        return preAllChats
                    })

                    if (currentChat === chatterName) setChats([...chats, content])
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
        },  [users, userNameAlreadySelected]) // added dependency users
    return (
        <div id="chats-main">
            <div id="chats-main-header">
                <div id="chats-main-peerName"><h3>{currentChat}</h3></div>
                {/* <button id="chats-main-peerProfile">their image</button> */}
            </div>
            
            <div id="chats-main-window">
                <ul id="chats-main-list">
                    {chats ? chats.map((msg, index) => {
                        if (msg.user_name === userName) {
                            return <li key={index} id="message"><div id="msg-self-upper"><div id="user_name"><p id="user_name-text">{msg.user_name}</p></div><div id="msg"><p id="msg-text">{msg.message}</p></div></div><div id="msg-self-lower"><div>{msg.timestamp}</div></div></li>
                        }
                        else {
                            return <li key={index} id="message"><div id="msg-upper"><div id="user_name"><p id="user_name-text">{msg.user_name}</p></div><div id="msg"><p id="msg-text">{msg.message}</p></div></div><div id="msg-lower"><div>{msg.timestamp}</div></div></li>
                        }
                    }) : null}
                </ul>
            </div>
            <input id="chats-main-type" type="text" onChange={setMessage} onKeyDown={currentChat === "general" ? sendGeneralMessage : sendPrivateMessage} placeholder="Say something nice.."/>
            
            
        </div>
    )
}

export default ChatsMain