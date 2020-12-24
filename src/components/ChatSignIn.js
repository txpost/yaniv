import React from "react";
import firebase from "firebase";

function ChatSignIn(props) {

    const auth = firebase.auth();

    const signInWithGoogle = () => {
        console.log('do the sign up');
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <div className="p-4">
            <button onClick={signInWithGoogle} className="w-full px-4 py-1 rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
                Sign in to chat
            </button>
        </div>
    )
}

export default ChatSignIn