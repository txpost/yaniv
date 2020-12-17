import React from 'react'
import {getCard} from '../Utils.js'

function OpponentCard(props) {
    let card = getCard(props.card);

    return (
        <li><div className="card back">*</div></li>
    )
}

export default OpponentCard
