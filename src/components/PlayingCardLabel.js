import React, {useState} from 'react';
import {getCard} from "../Utils";

function PlayingCardLabel(props) {
    const [selected, setSelected] = useState(false);

    function handleCardClick() {
        if (props.paused) {return;}
        let isSelected = !selected;
        setSelected(isSelected);
        props.onCardClick(props.card);
    }

    const card = getCard(props.card);

    let suitMap = {H: 'hearts', D: 'diams', C: 'clubs', S: 'spades', J: 'joker'};
    let mappedSuit = suitMap[card.suit];
    let className = "selectable cursor-pointer card rank-" + card.number + " " + mappedSuit;
    if (props.card === 52) {
        className += " little";
    } else if (props.card === 53) {
        className += " big";
    }
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

    let render;
    if (selected) {
        // className += " selected";
        render =
            <strong>
                <label onClick={() => handleCardClick()} className={className}>
                    <div className="rank">{card.number}</div>
                    {suitDiv}
                </label>
            </strong>
    } else {
        render =
            <div onClick={() => handleCardClick()} className={className}>
                <div className="rank">{card.number}</div>
                {suitDiv}
            </div>
    }

    return (
        <div className="playingCards faceImages simpleCards">
            {render}
        </div>
    );
}

export default PlayingCardLabel;