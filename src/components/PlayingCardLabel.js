import React from 'react';
import {getCard} from "../Utils";

function PlayingCardLabel(props) {
    const card = getCard(props.card);
    // const selected = props.selected;

    let suitMap = {H: 'hearts', D: 'diams', C: 'clubs', S: 'spades', J: 'joker'};
    let mappedSuit = suitMap[card.suit];
    let className = "card rank-" + card.number + " " + mappedSuit;
    className = className.toLowerCase();
    let suitDiv;
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

    // if (selected) {
    //     className += " hover:border-gray-300 focus:outline-none text-lg";
    // } else {
    //     className += " hover:border-gray-300 focus:outline-none";
    // }

    return (
        <label className={className}>
            <div className="rank">{card.number}</div>
            {suitDiv}
        </label>
    );
}

export default PlayingCardLabel;