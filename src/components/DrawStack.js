import React from 'react'

function DrawStack(props) {

    function handleClick() {
        if (props.paused || props.drawStack === undefined || props.drawStack.length === 0) {return;}
        props.onDrawStackClick();
    }

    let className;
    if (props.drawStack === undefined || props.drawStack.length === 0) {
        className="focus:outline-none w-24 h-36 mx-4 rounded-md text-md bg-white border-4 border-gray-200 hover:border-gray-300";
    } else {
        className = "card card-facedown text-md hover:border-gray-300 focus:outline-none";
    }
    className = className.toLowerCase();

    return (
        <div>
            <div onClick={handleClick} className={className}><span> </span></div>
        </div>        
    )
}

export default DrawStack
