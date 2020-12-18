import React from 'react'
import OpponentCard from './OpponentCard'
import ScoreDisplay from './ScoreDisplay'
import IdDisplay from './IdDisplay'

function OpponentRow(props) {
    let opponentRow = [];
    for(let card of props.player.hand) {
        opponentRow.push(<OpponentCard key={card} card={card}/>);
    }
    
    return (
        <div className="px-8">
            <div className="flex items-center justify-center p-3">
                {props.turn === props.player.turn
                    ?
                    <div className="bg-green-400"><IdDisplay id={props.player.id}/></div>
                    :
                    <div className=""><IdDisplay id={props.player.id}/></div>
                }
                {props.turn === props.player.turn
                    ?
                    <div className="bg-green-400 pl-2"><ScoreDisplay score={props.player.score} /></div>
                    :
                    <div className="pl-2"><ScoreDisplay score={props.player.score} /></div>
                }
            </div>
            <div className="flex flex-wrap items-center playingCards faceImages simpleCards">
                <ul className="hand">
                    {opponentRow}
                </ul>
            </div>
            {props.paused &&
                <div className="text-red-500 px-2 font-bold">{props.player.points}</div>
            }
        </div>
    )
}

export default OpponentRow