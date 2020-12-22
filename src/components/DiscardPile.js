import React from 'react'
import {getCard} from '../Utils.js'

function DiscardPile (props) {

    function handleClick() {
        if (props.paused || props.discardPile === undefined || props.discardPile.length === 0) {return;}
        props.onDiscardPileClick();
    }

    let mappedSuit;
    let className;
    let suitDiv;
    let label;
    let discards;

    if (props.discardPile.length > 0) {

        let cards = props.lastPlayedCards;

        let suitMap = {H: 'hearts', D: 'diams', C: 'clubs', S: 'spades', J: 'joker'};
        discards = [];

        for (let i = 0; i < cards.length; i++) {
            let card = getCard(cards[i]);
            mappedSuit = suitMap[card.suit];
            className = "discard card rank-" + card.number + " " + mappedSuit;
            if (cards[i] === 52) {
                className += " little";
            } else if (cards[i] === 53) {
                className += " big";
            }
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
            if (i === (cards.length - 1)) {
                className += " selectable cursor-pointer";
                label =
                    <div key={cards[i]} onClick={handleClick} className={className}>
                        <div className="rank">{card.number}</div>
                        {suitDiv}
                    </div>
            } else {
                label =
                    <div key={cards[i]} className={className}>
                        <div className="rank">{card.number}</div>
                        {suitDiv}
                    </div>
            }
            discards.push(label);
        }
    } else {
        discards = <div className="flex items-center justify-center text-sm w-16 h-20 mx-3 rounded-md bg-white border-4 border-gray-200 focus:outline-none">
                    discard pile
                </div>
    }

    return (
        <div className="-space-x-12">
            {discards}
        </div>
    )
}

export default DiscardPile
