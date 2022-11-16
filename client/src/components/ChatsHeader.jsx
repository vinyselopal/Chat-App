import { useNavigate } from "react-router-dom"

function ChatsHeader ({setUserName, socket, userName}) {
    const navigate = useNavigate()
    async function handleLogout () {
        const response = await fetch('http://localhost:8000/api/logout')
        setUserName("")
        localStorage.clear()
        socket.disconnect()
        navigate('/')
      }

    return (
        <div className="chats-header">
            {/* <div id="chats-searchbar">search</div> */}
            <h3 id="chats-header-title">Chat Box-{userName}</h3>
            <button className="buttons" value="logout" id="logout" onClick={handleLogout}>logout</button>


        </div>
    )
}
export default ChatsHeader