import {useState} from "react"

function ChatsSidePanel ({ users, userName, socket, setUserNameAlreadySelected, userNameAlreadySelected, currentChat, setCurrentChat }) {
    const [peerIcon, setPeerIcon] = useState(null)
    function displayPeerIcon (event) {
        if (users.find(a => a.userName === event.target.value)) {
            setPeerIcon(() => event.target.value)
        }
        if (!event.target.value) setPeerIcon(() => null)
    }
    function createPeerWindow (chatter) {
        setCurrentChat(() => chatter)
    }
    return (
        <div id="chats-side">
            <input id="chats-side-searchUser" type="text" placeholder="searchUser" onChange={displayPeerIcon}/>
            {
                peerIcon ? <button id="peerIcon" className="buttons" onClick={() => createPeerWindow(peerIcon)}>{peerIcon}</button> : null
            }
            <div id="chats-side-chatButtons">
                My Chats
                <ul id="chats-side-list">
                    <li><button className="buttons"onClick={() => createPeerWindow('general')}>general</button></li>
                    {users.map((a, i) => <button className="buttons" onClick={() => createPeerWindow(a.userName)} key={i}>{a.userName}</button>)}
                </ul>
            </div>
        </div>
    )
}

export default ChatsSidePanel