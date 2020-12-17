import React from 'react'
import PlayerRow from './PlayerRow'
import YanivButton from './YanivButton'
import ScoreDisplay from './ScoreDisplay'
import IdDisplay from "./IdDisplay";
import {getPoints} from '../Utils.js'
import ReadyButton from "./ReadyButton";

class PlayerInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleCardClick = this.handleCardClick.bind(this);
    }

    handleCardClick(card) {
        let newSelectedCards = this.props.selectedCards;
        if (newSelectedCards.includes(card)) {
            newSelectedCards.splice(newSelectedCards.indexOf(card), 1);
        } else {
            newSelectedCards.push(card);
        }
        this.props.onCardClick(newSelectedCards);
    }

    handleYanivClick() {
        this.props.onYanivClick();
    }

    handleReadyClick() {
        this.props.onReadyClick();
    }

    render() {
        let points = getPoints(this.props.player.hand);

        return (
            <div className="flex flex-col">
                <div className="flex items-center justify-center">
                    <PlayerRow paused={this.props.paused} player={this.props.player} onCardClick={this.handleCardClick} />
                </div>
                <div className="flex items-center justify-center pt-6">
                    <span className="text-red-500 px-2 font-bold">{this.props.player.points}</span>
                    {this.props.turn === this.props.player.turn
                        ?
                        <div className="bg-green-400"><IdDisplay id={this.props.player.id}/></div>
                        :
                        <div className=""><IdDisplay id={this.props.player.id}/></div>
                    }
                    {this.props.turn === this.props.player.turn
                        ?
                        <div className="bg-green-400 pl-2"><ScoreDisplay score={this.props.player.score} /></div>
                        :
                        <div className="pl-2"><ScoreDisplay score={this.props.player.score} /></div>
                    }
                    {points <= 5 && !this.props.paused &&
                        <div onClick={() => this.handleYanivClick()} className="pl-4"><YanivButton /></div>
                    }
                    {this.props.paused &&
                        <div onClick={() => this.handleReadyClick()} className="pl-4"><ReadyButton/></div>
                    }
                </div>
                <div className="pt-6 text-red-500">{this.props.errorMessage}</div>
            </div>
        )
    }    
}

export default PlayerInput
