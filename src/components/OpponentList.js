import React from 'react'
import OpponentRow from './OpponentRow'

function OpponentList(props) {

    let opponents = [];
    for (let i = 0; i < props.players.length; i++) {
        if (i === 0) {continue}
        opponents.push(<OpponentRow paused={props.paused} key={i} player={props.players[i]} turn={props.turn} />)
    }

    return (
        <div className="flex flex-wrap content-center">
            {opponents}
        </div>
    )
}

export default OpponentList
