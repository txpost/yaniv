import React from 'react'
import PlayerCardButton from './PlayerCardButton'

function PlayerRow(props) {
    let playerRow = [];

    function handleCardClick(card) {
        props.onCardClick(card);
    }

    for(let card of props.player.hand) {
        playerRow.push(<PlayerCardButton paused={props.paused} key={card} card={card} onCardClick={() => handleCardClick(card)} />);
    }
    
    return (
        <div className="flex flex-wrap items-center justify-center" >
            {playerRow}            
        </div>
    )
}

export default PlayerRow
