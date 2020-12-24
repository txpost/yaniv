import React from "react";

function ChatInput(props) {

    return (
        <input className="p-1 w-full border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
               type="text" placeholder="Type a message..."
               maxLength="250"
        />
    )
}

export default ChatInput