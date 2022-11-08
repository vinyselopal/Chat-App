import { useNavigate } from "react-router-dom"

function ChatsHeader () {
    const navigate = useNavigate()
    async function handleLogout () {
        const response = await fetch('http://localhost:8000/api/logout')
        localStorage.setItem('userName', null)
        navigate('/')
      }

    return (
        <div className="chats-header">
            <div id="chats-searchbar">search</div>
            <div id="chats-title">Chatter-G</div>
            <div id="chats-notifications">notif</div>
            <div id="chats-menu">menu
            <button value="logout" onClick={handleLogout}>logout</button>

            </div>

        </div>
    )
}
export default ChatsHeader