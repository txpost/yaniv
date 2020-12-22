import React from 'react'
import OpponentCard from './OpponentCard'
import ScoreDisplay from './ScoreDisplay'
import IdDisplay from './IdDisplay'
// import {getCard} from "../Utils";

function OpponentRow(props) {
    let opponentRow = [];
    for(let card of props.player.hand) {
        opponentRow.push(<OpponentCard key={card} card={card}/>);
    }

    // let handDisplay = '';
    // let card;
    // for (let i = 0; i < props.player.hand.length; i++) {
    //     card = getCard(props.player.hand[i]);
    //     handDisplay += card.number + card.suit + ', ';
    // }

    return (
        <div className="px-8">
            <div className="flex items-center justify-center py-3">
                {props.turn === props.player.turn
                    ?
                    <div className="bg-yellow-300"><IdDisplay id={props.player.id}/></div>
                    :
                    <div className=""><IdDisplay id={props.player.id}/></div>
                }
                <div className="pl-2"><ScoreDisplay score={props.player.score} /></div>
                {props.paused &&
                    <span className="text-red-500 pl-2 font-bold">{props.player.points}</span>
                }
            </div>
            <div className="-space-x-12 flex flex-wrap items-center playingCards faceImages simpleCards">
                {opponentRow}
            </div>            
            {/*<div>{handDisplay}</div>*/}
        </div>
    )
}

export default OpponentRow