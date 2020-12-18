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

        let suitMap = {H: 'hearts', D: 'diams', C: 'clubs', S: 'spades', J: 'joker'};
        mappedSuit = suitMap[card.suit];
        className = "selectable cursor-pointer card rank-" + card.number + " " + mappedSuit;
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
        label = <div onClick={handleClick} className={className}>
                    <div className="rank">{card.number}</div>
                    {suitDiv}
                </div>
    } else {
        label = <div className="flex items-center justify-center text-sm w-16 h-20 mx-3 rounded-md bg-white border-4 border-gray-200 focus:outline-none">
                    discard pile
                </div>
    }

    return (
        <div className="playingCards faceImages simpleCards">
            {label}
        </div>
    )
}

export default DiscardPile
