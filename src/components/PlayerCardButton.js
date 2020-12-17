import React from 'react'
import {getCard} from '../Utils.js'

class PlayerCardButton extends React.Component {
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

        let suitMap = {H: 'hearts', D: 'diamonds', C: 'clubs', S: 'spades', J: 'joker'};
        let className = "card card-" + suitMap[card.suit] + " card-" + card.number;
        if (selected) {
            className += " hover:border-gray-300 focus:outline-none text-lg";
        } else {
            className += " hover:border-gray-300 focus:outline-none";
        }
        className = className.toLowerCase();

        // NOTE:  pre-cards css, selected then not selected
        // className="focus:outline-none w-14 h-20 mx-3 rounded-md text-sm bg-gray-200 border-4 border-red-300 hover:border-red-300 focus:outline-none"
        // className="focus:outline-none w-14 h-20 mx-3 rounded-md text-sm bg-gray-200 border-4 border-gray-200 hover:border-gray-300 focus:outline-none"

        return (
            <div className="py-2">
                {/*{card.number}{card.suit}*/}
                <div onClick={() => this.handleCardClick(card)} className={className}><span> </span></div>
            </div>
        )
    }    
}

export default PlayerCardButton