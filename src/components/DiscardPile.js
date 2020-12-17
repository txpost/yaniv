import React from 'react'
import {getCard} from '../Utils.js'

function DiscardPile (props) {

    function handleClick() {
        if (props.paused || props.discardPile === undefined || props.discardPile.length === 0) {return;}
        props.onDiscardPileClick();
    }

    let card;
    let mappedSuit;
    let className;
    let suitDiv;
    let label
    if (props.discardPile.length > 0) {
        card = getCard(props.discardPile[props.discardPile.length - 1]);

        let suitMap = {H: 'hearts', D: 'diamonds', C: 'clubs', S: 'spades', J: 'joker'};
        mappedSuit = suitMap[card.suit];
        className = "card rank-" + card.number + " " + mappedSuit;
        className = className.toLowerCase();
        switch (card.suit) {
            case 'H':
                suitDiv = <div className="suit">&hearts;</div>;
                break;
            case 'D':
                suitDiv = <div className="suit">&diams;</div>;
                break;
            case 'C':
                suitDiv = <div className="suit">&clubs;</div>;
                break;
            case 'S':
                suitDiv = <div className="suit">&spades;</div>;
                break;
            case 'J':
                suitDiv = <div className="suit">Joker</div>;
                break;
            default:
                break;
        }
        label = <label onClick={handleClick} className={className}>
                    <div className="rank">{card.number}</div>
                    {suitDiv}
                </label>
    } else {
        label = <div className="text-md w-16 h-24 mx-4 rounded-md bg-white border-4 border-gray-200 focus:outline-none">

                </div>
    }

    return (
        <div className="playingCards faceImages simpleCards">
            {label}
        </div>
    )
}

export default DiscardPile
