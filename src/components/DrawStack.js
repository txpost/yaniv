import React from 'react'
import {getCard} from "../Utils";

function DrawStack(props) {

    function handleClick() {
        if (props.paused || props.drawStack === undefined || props.drawStack.length === 0) {return;}
        props.onDrawStackClick();
    }

    let label;
    if (props.drawStack.length > 0) {
        label = <label onClick={handleClick} className="card back">*</label>;
    } else {
        label = <label className="text-md w-16 h-24 mx-4 rounded-md bg-white border-4 border-gray-200 focus:outline-none">

                </label>;
    }

    return (
        <div className="playingCards faceImages simpleCards">
            {label}
        </div>
    )
}

export default DrawStack
