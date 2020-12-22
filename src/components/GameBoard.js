import React, {useEffect, useReducer, useState} from 'react'
import OpponentList from './OpponentList.js'
import PlayerInput from './PlayerInput.js'
import PlayArea from './PlayArea.js'
import {deal, shuffle, getRandomInt, getBestPlay, getPoints, areCardsPlayable, getCard} from '../Utils.js'
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

    useEffect(() => {
        let interval = null;
        if (!paused && turn !== 0) {
            interval = setInterval(() => handleTimeout(), 3000);
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
        // slap down if clicked card matches discard pile top card
        if (discardPile.length > 0) {
            let topCard = discardPile[discardPile.length - 1];
            if (getCard(topCard).number === getCard(card).number && turn !== players[0].turn) {
                slapDownCard(card, players[0]);
                return;
            }
        }

        // console.log('selectedCards: ' + cards);
        setSelectedCards(cards);
    }

    function slapDownCard(card, player) {

        // add card to the discard pile
        let newDiscardPile = discardPile;
        newDiscardPile.push(card);

        // remove cards from the player's hand
        let playerIndex = players.indexOf(player);
        let newPlayer = players[playerIndex];
        newPlayer.hand.splice(newPlayer.hand.indexOf(card), 1);

        newPlayer.points = getPoints(newPlayer.hand);

        let newPlayers = players;
        newPlayers[playerIndex] = newPlayer;

        let newSelectedCards = selectedCards;
        if (newSelectedCards.includes(card)) {
            newSelectedCards.splice(newSelectedCards.indexOf(card), 1);
        }

        setDiscardPile(newDiscardPile);
        setPlayers(newPlayers);
        setErrorMessage('');
        setSelectedCards(newSelectedCards);

        forceUpdate();
    }

    function playCards(cards, player) {
        // add cards to the discard pile
        let newCards = cards;
        if (cards.length > 1) {
            // let mappedCards = cards.map((a, b) => getPoints([a]) - getPoints([b]));
            // console.log(mappedCards);
            let maxValue = Math.max.apply(Math, cards.map((a) => getPoints([a])));
            for (let i = 0; i < newCards.length; i++) {
                if (getPoints([newCards[i]]) === maxValue) {
                    newCards.push(newCards.splice(i, 1)[0]);
                    break;
                }
            }
            // let convertedCards = getCards(newCards);
            // console.log(convertedCards);
        }

        let newDiscardPile = discardPile;
        newDiscardPile = newDiscardPile.concat(newCards);
        // if (newCards.length > 1) {
        //     console.log(getCards(newDiscardPile));
        // }

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

        setDiscardPile(newDiscardPile);
        setPlayers(newPlayers);
        setErrorMessage('');
        setTurn(getNextTurn());
    }

    function drawFromDiscardPile() {
        let newDiscardPile = discardPile;
        const card = newDiscardPile.pop();
        addCardToPlayerHand(card, players[turn]);

        setDiscardPile(newDiscardPile);
    }

    function drawFromDrawStack() {
        let newDrawStack = drawStack;
        const card = newDrawStack.pop();
        addCardToPlayerHand(card, players[turn]);

        setDrawStack(newDrawStack);
    }

    function addCardToPlayerHand(card, player) {
        let playerIndex = players.indexOf(player);
        let newPlayer = players[playerIndex];

        newPlayer.hand.push(card);

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
            clearInterval();
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
        setTurn(getNextTurn());
        setPaused(false);
        setSelectedCards([]);
    }

    function getNextTurn() {
        let newTurn = turn;
        newTurn + 1 >= players.length ? newTurn = 0 : newTurn = newTurn + 1;
        return newTurn;
    }

    return (
        <div className="flex items-center justify-center flex-col bg-white">
            <div className="border-b-2 p-8">
                <OpponentList paused={paused} turn={turn} players={players} />
            </div>
            <div className="border-b-2 p-8">
                <PlayArea
                    discardPile={discardPile}
                    drawStack={drawStack}
                    onDiscardPileClick={() => handleDiscardPileClick()}
                    onDrawStackClick={() => handleDrawStackClick()}
                    paused={paused}
                />
            </div>
            <div className="p-8">
                <PlayerInput
                    onAutoPlayClick={() => handleAutoPlayClick()}
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
