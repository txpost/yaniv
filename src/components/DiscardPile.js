import React from 'react'
import {getCard} from '../Utils.js'

function DiscardPile (props) {

    function handleClick() {
        if (props.paused || props.discardPile === undefined || props.discardPile.length === 0) {return;}
        props.onDiscardPileClick();
    }

    let card;
    if (props.discardPile.length > 0) {
        card = getCard(props.discardPile[props.discardPile.length - 1]);
    }

    let suitMap = {H: 'hearts', D: 'diamonds', C: 'clubs', S: 'spades', J: 'joker'};
    let className;
    if (props.discardPile === undefined || props.discardPile.length === 0) {
        className="text-md w-20 h-28 mx-4 rounded-md bg-white border-4 border-gray-200 focus:outline-none";
    } else {
        className = "card card-" + suitMap[card.suit] + " card-" + card.number + " text-md hover:border-gray-300 focus:outline-none";
    }
    className = className.toLowerCase();

    return (
        <div>
            <div onClick={handleClick} className={className}><span> </span></div>
        </div>
    )
}

export default DiscardPile
