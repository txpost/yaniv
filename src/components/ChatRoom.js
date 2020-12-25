import React, {useState} from "react";
import ChatMessage from "./ChatMessage";
import firebase from "firebase";
import {useCollectionData} from "react-firebase-hooks/firestore";

function ChatRoom(props) {

    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);


    const [messages] = useCollectionData(query, {idField: 'id'});
    const [formValue, setFormValue] = useState('');

    const sendMessage = async(e) => {
        e.preventDefault();

        const {uid} = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid
        })

        setFormValue('');
    }

    return (
        <div>
            {auth.currentUser && <span className="absolute right-4">{auth.currentUser.displayName}</span> }
            <div className="bg-indigo-500 p-4 text-white mb-2 w-full">
                Chat
                {auth.currentUser && <button className="underline absolute right-4" onClick={() => auth.signOut()}>Logout</button> }
            </div>
            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
            <form onSubmit={sendMessage} className="p-4 absolute bottom-0 w-full">
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} className="p-1 w-full border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" type="text" placeholder="Type a message..." maxLength="250" />
            </form>
        </div>
    )
}

export default ChatRoom