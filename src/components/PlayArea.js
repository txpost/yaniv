import React from 'react'
import DiscardPile from './DiscardPile'
import DrawStack from './DrawStack'

function PlayArea(props) {

    function handleDiscardPileClick() {
        props.onDiscardPileClick();
    }

    function handleDrawStackClick() {
        props.onDrawStackClick();
    }

    return (
        <div>
            <div className="space-x-3 flex justify-center align-center items-center playingCards faceImages simpleCards">
                {/*<div className="pr-3">Discard Pile ({props.discardPile.length})</div>*/}
                <DrawStack
                    onDrawStackClick={handleDrawStackClick}
                    drawStack={props.drawStack}
                    paused={props.paused}
                />
                <DiscardPile
                    onDiscardPileClick={handleDiscardPileClick}
                    discardPile={props.discardPile}
                    paused={props.paused}
                    lastPlayedCards={props.lastPlayedCards}
                />
                {/*<div className="pl-3" >Draw Stack ({props.drawStack.length})</div>*/}
            </div>
        </div>
    )
}

export default PlayArea
