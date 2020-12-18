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
            <div className="flex justify-center align-center items-center">
                {/*<div className="pr-3">Discard Pile ({props.discardPile.length})</div>*/}
                <DiscardPile
                    onDiscardPileClick={handleDiscardPileClick}
                    discardPile={props.discardPile}
                    paused={props.paused}
                />
                <DrawStack
                    onDrawStackClick={handleDrawStackClick}
                    drawStack={props.drawStack}
                    paused={props.paused}
                />
                {/*<div className="pl-3" >Draw Stack ({props.drawStack.length})</div>*/}
            </div>
        </div>
    )
}

export default PlayArea
