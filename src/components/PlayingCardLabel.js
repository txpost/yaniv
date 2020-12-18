import React from 'react';
import {getCard} from "../Utils";

class PlayingCardLabel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        }
    }

    handleCardClick(card) {
        if (this.props.paused) {return;}
        let isSelected = !this.state.selected;
        this.setState({selected: isSelected});
        this.props.onCardClick(card);
    }

    render() {
        const card = getCard(this.props.card);
        const selected = this.state.selected;

        let suitMap = {H: 'hearts', D: 'diams', C: 'clubs', S: 'spades', J: 'joker'};
        let mappedSuit = suitMap[card.suit];
        let className = "selectable cursor-pointer card rank-" + card.number + " " + mappedSuit;
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
                    <label onClick={() => this.handleCardClick()} className={className}>
                        <div className="rank">{card.number}</div>
                        {suitDiv}
                    </label>
                </strong>
        } else {
            render =
                <div onClick={() => this.handleCardClick()} className={className}>
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
}

export default PlayingCardLabel;