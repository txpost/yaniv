import React from "react";
import firebase from "firebase";

function ChatMessage(props) {

    const {text, uid} = props.message;

    const auth = firebase.auth();

    // const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    // return (
    //     <div className={`message ${messageClass}`}>
    //         <p>{text}</p>
    //     </div>
    // )

    return (
        <div className="px-4 py-1 border-b-1 border-gray-300">
            {/* <span className="text-green-600 pr-1">{displayName}:</span> */}
            {text}
        </div>
    )
}

export default ChatMessage