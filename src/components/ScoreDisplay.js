import React from 'react'

function ScoreDisplay(props) {
    return (
        <div className="text-green-600 font-bold">
            {props.score}
        </div>
    )
}

export default ScoreDisplay
