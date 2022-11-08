import socketio from "socket.io-client"
import React from "react"
const SOCKET_URL = "http://localhost:8000"

export const socket = socketio(SOCKET_URL, {
    auth: "123",
    transports: ['websocket']
})
export const SocketContext = React.createContext()