import React from 'react'
import {getCard} from '../Utils.js'

function OpponentCard(props) {
    let card = getCard(props.card);

    let suitMap = {H: 'hearts', D: 'diamonds', C: 'clubs', S: 'spades', J: 'joker'};
    let className = "card card-" + suitMap[card.suit] + " card-" + card.number + " flex items-center text-xs";
    className += " card-facedown";
    className = className.toLowerCase();

    return (
        <div>
            <div className={className}><span> </span></div>
            {/*{card.number}{card.suit}*/}
        </div>
    )
}

export default OpponentCard
