import React, {useEffect} from "react";
import firebase from "firebase";
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from "react-firebase-hooks/auth";
import ChatSignIn from "./ChatSignIn";
import ChatRoom from "./ChatRoom";

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyAf6lVb7Fa8w2y4YF3CmwuAZdmHzkCXmYY",
        authDomain: "yaniv-de8e1.firebaseapp.com",
        projectId: "yaniv-de8e1",
        storageBucket: "yaniv-de8e1.appspot.com",
        messagingSenderId: "931495841814",
        appId: "1:931495841814:web:77bffb9bc7cb69af76e537"
    })
} else {
    firebase.app();
}

const auth = firebase.auth();

function Chat() {
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (!user) {
            auth.signInAnonymously().then(function (result) {
                if (!result.user.displayName) {
                    result.user.updateProfile({
                        displayName: 'Anonymous' + Math.floor(Math.random() * 999)
                    }).then();
                }
            });
        }
    });

    return (
        <div className="bg-gray-200 h-screen text-left relative border-r-2 border-indigo-500">
            <section>
                <ChatRoom />
                {/*{user ? <ChatRoom /> : <ChatSignIn />}*/}
            </section>
        </div>
    )
}

export default Chat;