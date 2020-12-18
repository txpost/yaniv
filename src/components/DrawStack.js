import React from 'react'

function DrawStack(props) {

    function handleClick() {
        // if (props.paused || props.drawStack === undefined || props.drawStack.length === 0) {
        //     return;
        // }
        props.onDrawStackClick();
    }

    let label;
    if (props.drawStack.length > 0) {
        label = <div onClick={handleClick} className="selectable cursor-pointer card back">*</div>;
    } else {
        label = <div onClick={handleClick} className="selectable cursor-pointer text-md flex items-center justify-center w-16 h-20 mx-3 rounded-md bg-white border-4 border-gray-200 hover:border-gray-300 focus:outline-none">
                    shuffle
                </div>;
    }

    return (
        <div className="playingCards faceImages simpleCards">
            {label}
        </div>
    )
}

export default DrawStack
