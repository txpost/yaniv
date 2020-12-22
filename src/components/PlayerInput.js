import React from 'react'
import PlayerRow from './PlayerRow'
import YanivButton from './YanivButton'
import ScoreDisplay from './ScoreDisplay'
import IdDisplay from "./IdDisplay";
import {getPoints} from '../Utils.js'
import ReadyButton from "./ReadyButton";

function PlayerInput(props) {

    function handleCardClick(card) {
        let newSelectedCards = props.selectedCards;
        if (newSelectedCards.includes(card)) {
            newSelectedCards.splice(newSelectedCards.indexOf(card), 1);
        } else {
            newSelectedCards.push(card);
        }
        props.onCardClick(newSelectedCards, card);
    }

    function handleYanivClick() {
        props.onYanivClick();
    }

    function handleReadyClick() {
        props.onReadyClick();
    }

    return (
        <div className="flex flex-col">
            <div className="">
                <PlayerRow selectedCards={props.selectedCards} paused={props.paused} player={props.player} onCardClick={(card) => handleCardClick(card)} />
            </div>
            <div className="flex items-center justify-center pt-6">
                {props.turn === props.player.turn
                    ?
                    <div className="bg-yellow-300"><IdDisplay id={props.player.id}/></div>
                    :
                    <div className=""><IdDisplay id={props.player.id}/></div>
                }
                <span className="pl-2"><ScoreDisplay score={props.player.score} /></span>
                {props.paused &&
                <span className="text-red-500 font-bold pl-2">{props.player.points}</span>
                }
                {getPoints(props.player.hand) <= 5 && !props.paused &&
                    <div onClick={() => handleYanivClick()} className="pl-4"><YanivButton /></div>
                }
                {props.paused &&
                    <div onClick={() => handleReadyClick()} className="pl-4"><ReadyButton/></div>
                }
            </div>
            <div className="pt-6 text-red-500">{props.errorMessage}</div>
        </div>
    )
}

export default PlayerInput
