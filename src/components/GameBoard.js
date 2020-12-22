import React, {useEffect, useReducer, useState} from 'react'
import OpponentList from './OpponentList.js'
import PlayerInput from './PlayerInput.js'
import PlayArea from './PlayArea.js'
import {
    deal,
    shuffle,
    getRandomInt,
    getBestPlay,
    getPoints,
    areCardsPlayable,
    getCard,
    getNextTurn
} from '../Utils.js'
import '../css/cards.css';
import '../cards.css';

function GameBoard() {

    let game = deal(4);
    const [players, setPlayers] = useState(game.players);
    const [discardPile, setDiscardPile] = useState([]);
    const [drawStack, setDrawStack] = useState(game.deck);
    const [turn, setTurn] = useState(getRandomInt(0, game.players.length));
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);
    const [paused, setPaused] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [lastPlayedCards, setLastPlayedCards] = useState([]);

    useEffect(() => {
        let interval = null;
        if (!paused && turn !== 0) {
            interval = setInterval(() => handleTimeout(), 1500);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    });

    function handleTimeout() {
        // 1 second = 1000
        handleAutoPlayClick()
    }

    function handleDiscardPileClick() {
        if (discardPile.length === 0) {
            return;
        }

        handlePlayClick(selectedCards, 0);
    }

    function handleDrawStackClick() {
        if (drawStack.length === 0) {
            let newDiscardPile = discardPile;
            let topCard = newDiscardPile.pop();
            newDiscardPile = shuffle(newDiscardPile);

            setDrawStack(newDiscardPile);
            setDiscardPile([topCard]);
            return;
        }
        handlePlayClick(selectedCards, 1);
    }

    function handlePlayClick(cards, drawPile) {

        if (players[0].turn !== turn) {
            setErrorMessage("not your turn");
            return;
        } else if (cards.length === 0) {
            setErrorMessage("you need to select cards to play");
            return;
        }

        let isPlayable = areCardsPlayable(cards);
        if (!isPlayable) {
            setErrorMessage("you can't play those cards");
            return;
        }

        if (drawPile === 0) {
            drawFromDiscardPile();
            playCards(cards, players[turn]);
        } else {
            drawFromDrawStack();
            playCards(cards, players[turn]);
        }

        setSelectedCards([]);
    }

    function handleCardClick(cards, card) {

        if (discardPile.length > 0) {
            let topCard = discardPile[discardPile.length - 1];

            // slap down if clicked card was just picked up card from draw stack and matches discard pile top card
            if (getCard(topCard).number === getCard(card).number &&
                turn === getNextTurn(players[0].turn) &&
                card === players[0].hand[players[0].hand.length - 1] &&
                players[0].lastDrawPile === 2)
            {
                slapDownCard(card, players[0]);
                return;
            }

            // slap down (add on) if adding to a straight
            if (lastPlayedCards.length >= 3 && (topCard + 1) === card && getCard(topCard).number !== 'K')
            {
                slapDownCard(card, players[0]);
                return;
            }

            // slap down (add on) if completing a set
            if (lastPlayedCards.length + cards.length === 4) {
                let combined = lastPlayedCards.concat(cards);
                let allSame = true;
                let firstNumber = getCard(combined[0]).number;
                for (let i = 1; i < combined.length; i++) {
                    if (getCard(combined[i]).number !== firstNumber) {
                        allSame = false;
                        break;
                    }
                }
                if (allSame) {
                    slapDownCard(cards, players[0]);
                    return;
                }
            }
        }

        // console.log('selectedCards: ' + cards);
        setSelectedCards(cards);
    }

    function slapDownCard(card, player) {

        let newDiscardPile;
        let newPlayers;
        let newSelectedCards;
        let newLastPlayedCards;

        // slap down is a set add-on
        if (card.length > 1) {
            let cards = card;

            // add cards to the discard pile
            newDiscardPile = discardPile.concat(cards);

            // remove cards from the player's hand
            let playerIndex = players.indexOf(player);
            let newPlayer = players[playerIndex];
            for (let i = 0; i < cards.length; i++) {
                newPlayer.hand.splice(newPlayer.hand.indexOf(cards[i]), 1);
            }

            // update player points in hand
            newPlayer.points = getPoints(newPlayer.hand);

            // update overall player status
            newPlayers = players;
            newPlayers[playerIndex] = newPlayer;

            // update selected cards
            newSelectedCards = [];

            // update last played cards pile
            newLastPlayedCards = lastPlayedCards.concat(cards);
        } else {
            // add card to the discard pile
            newDiscardPile = discardPile;
            newDiscardPile.push(card);

            // remove cards from the player's hand
            let playerIndex = players.indexOf(player);
            let newPlayer = players[playerIndex];
            newPlayer.hand.splice(newPlayer.hand.indexOf(card), 1);

            newPlayer.points = getPoints(newPlayer.hand);

            newPlayers = players;
            newPlayers[playerIndex] = newPlayer;

            newSelectedCards = selectedCards;
            if (newSelectedCards.includes(card)) {
                newSelectedCards.splice(newSelectedCards.indexOf(card), 1);
            }

            newLastPlayedCards = lastPlayedCards;
            newLastPlayedCards.push(card);
        }

        setDiscardPile(newDiscardPile);
        setPlayers(newPlayers);
        setErrorMessage('');
        setSelectedCards(newSelectedCards);
        setLastPlayedCards(newLastPlayedCards);

        forceUpdate();
    }

    function playCards(cards, player) {
        // add cards to the discard pile
        let newCards = cards;
        if (newCards.length > 1) {

            let numberMap = {0: 0, A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13};
            newCards.sort((a, b) => numberMap[getCard(a).number] - numberMap[getCard(b).number]);

            // let convertedCards = getCards(newCards);
            // if (getPoints([convertedCards[0]] > getPoints([convertedCards[convertedCards.length]]))) {
            //     console.log(convertedCards[0]);
            //     console.log(convertedCards[convertedCards.length]);
            //     newCards.reverse();
            // }
        }

        let newDiscardPile = discardPile;
        newDiscardPile = newDiscardPile.concat(newCards);

        // remove cards from the player's hand
        let playerIndex = players.indexOf(player);
        let newPlayer = players[playerIndex];

        for (let i = 0; i < cards.length; i++) {
            if (newPlayer.hand.includes(cards[i])) {
                newPlayer.hand.splice(newPlayer.hand.indexOf(cards[i]), 1);
            }
        }

        newPlayer.points = getPoints(newPlayer.hand);

        let newPlayers = players;
        newPlayers[playerIndex] = newPlayer;

        // let fakeCards = [22,35,52];
        // let numberMap = {0: 0, A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13};
        // fakeCards.sort((a, b) => numberMap[getCard(a).number] - numberMap[getCard(b).number]);

        setLastPlayedCards(newCards);
        setDiscardPile(newDiscardPile);
        setPlayers(newPlayers);
        setErrorMessage('');
        setTurn(getNextTurn(turn, players.length));
    }

    function drawFromDiscardPile() {
        let newDiscardPile = discardPile;
        const card = newDiscardPile.pop();
        addCardToPlayerHand(card, players[turn], 1);

        setDiscardPile(newDiscardPile);
    }

    function drawFromDrawStack() {
        let newDrawStack = drawStack;
        const card = newDrawStack.pop();
        addCardToPlayerHand(card, players[turn], 2);

        setDrawStack(newDrawStack);
    }

    function addCardToPlayerHand(card, player, drawPile) {
        let playerIndex = players.indexOf(player);
        let newPlayer = players[playerIndex];
        newPlayer.hand.push(card);
        newPlayer.lastDrawPile = drawPile;

        let newPlayers = players;
        newPlayers[playerIndex] = newPlayer;

        setPlayers(newPlayers);
    }

    function handleAutoPlayClick() {
        if (drawStack.length === 0) {
            setErrorMessage("draw stack is empty");
            return;
        }

        let player = players[turn];

        // auto call yaniv for the current player
        if (player.points <= 5) {
            // clearInterval();
            callYaniv(player);
            return;
        }

        // play the current player's "best" cards
        let currentPlayerHand = player.hand;
        const bestPlay = getBestPlay(currentPlayerHand, discardPile, 3);
        bestPlay.drawPile === 1 ? drawFromDiscardPile() : drawFromDrawStack();
        playCards(bestPlay.cards, player);
    }

    function handleYanivClick() {
        // TODO: eventually will need to replace 0 with id of client player
        callYaniv(players[0]);
    }

    function callYaniv(player) {
        let yanivPlayer = player;

        if (yanivPlayer.turn !== turn) {
            setErrorMessage("not your turn");
            return;
        }

        let newPlayers = players;
        let asafCalled = false;
        for (let i = 0; i < newPlayers.length; i++) {
            if (newPlayers[i] === yanivPlayer) {continue;}

            let opponent = newPlayers[i];
            if (opponent.points > yanivPlayer.points) {
                opponent.score += opponent.points;
            } else if (opponent.points <= yanivPlayer.points && !asafCalled) {
                yanivPlayer.score += 35;
                asafCalled = true;
            }
            newPlayers[i] = opponent;
        }

        // cut score in half if player reaches exactly 100 or 200
        for (let i = 0; i < newPlayers.length; i++) {
            if (newPlayers[i].score === 100 || newPlayers[i].score === 200) {
                newPlayers[i].score = newPlayers[i].score / 2;
            }
        }

        setPlayers(newPlayers);
        setPaused(true);
    }

    function handleReadyClick() {

        // check for game over
        let gameOver = false;
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.score > 200) {
                gameOver = true;
                break;
            }
        }

        // deal cards
        let newPlayers = players;
        let newDeal = deal(4);
        for (let i = 0; i < newDeal.players.length; i++) {
            newPlayers[i].hand = newDeal.players[i].hand;
            newPlayers[i].points = newDeal.players[i].points;
            if (gameOver) {
                newPlayers[i].score = 0;
            } else if (newPlayers[i].score === 100 || newPlayers[i].score === 200) {
                newPlayers[i].score = newPlayers[i].score / 2;
            }
        }

        setPlayers(newPlayers);
        setDiscardPile([]);
        setDrawStack(newDeal.deck);
        setTurn(getNextTurn(turn, players.length));
        setPaused(false);
        setSelectedCards([]);
    }

    return (
        <div className="flex items-center justify-center flex-col bg-white">
            <div className="border-b-2 py-8">
                <OpponentList paused={paused} turn={turn} players={players} />
            </div>
            <div className="border-b-2 py-8">
                <PlayArea
                    discardPile={discardPile}
                    drawStack={drawStack}
                    onDiscardPileClick={() => handleDiscardPileClick()}
                    onDrawStackClick={() => handleDrawStackClick()}
                    paused={paused}
                    lastPlayedCards={lastPlayedCards}
                />
            </div>
            <div className="py-8">
                <PlayerInput
                    player={players[0]}
                    errorMessage={errorMessage}
                    turn={turn}
                    onCardClick={(cards, card) => handleCardClick(cards, card)}
                    onYanivClick={() => handleYanivClick()}
                    onReadyClick={() => handleReadyClick()}
                    selectedCards={selectedCards}
                    paused={paused}
                />
            </div>
        </div>
    )
}

export default GameBoard
