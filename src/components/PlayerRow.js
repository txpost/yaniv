import React from 'react'
// import PlayerCardButton from './PlayerCardButton'
import PlayerCardLabel from './PlayingCardLabel'

function PlayerRow(props) {
    let playerRow = [];

    function handleCardClick(card) {
        props.onCardClick(card);
    }

    for(let card of props.player.hand) {
        // playerRow.push(<PlayerCardButton paused={props.paused} key={card} card={card} onCardClick={() => handleCardClick(card)} />);
        playerRow.push(<PlayerCardLabel paused={props.paused} key={card} card={card} onCardClick={(card) => handleCardClick(card)} />);
    }
    
    return (
        <div className="space-x-3 flex items-center justify-center flex-wrap" >
            {playerRow}
        </div>
    )
}

export default PlayerRow
