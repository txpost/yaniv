import React from 'react'
import OpponentList from './OpponentList.js'
import PlayerInput from './PlayerInput.js'
import PlayArea from './PlayArea.js'
import {deal, shuffle, getRandomInt, getBestPlay, getPoints, areCardsPlayable} from '../Utils.js'
import '../css/cards.css';

class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        let game = deal(4);
        this.state = {
            players: game.players,
            discardPile: [],
            drawStack: game.deck,
            turn: getRandomInt(0, game.players.length), // represents the deal index of the player whose turn it is
            errorMessage: "",
            selectedCards: [],
            paused: false
        }
    }

    componentDidMount() {
        this.startInterval();
    }

    componentWillUnmount() {
        this.clearInterval();
    }

    startInterval() {
        this.clearInterval();
        this.interval = setInterval(() => this.handleTimeout(), 500);
    }

    clearInterval() {
        clearInterval(this.interval)
    }

    handleTimeout() {
        // 1 second = 1000
        if (this.state.turn !== 0) {
            this.handleAutoPlayClick()
        } else {
            this.clearInterval();
        }
    }

    handleDiscardPileClick() {
        if (this.state.discardPile.length === 0) {
            return;
        }
        this.handlePlayClick(this.state.selectedCards, 0);
    }

    handleDrawStackClick() {
        if (this.state.drawStack.length === 0) {
            let discardPile = this.state.discardPile;
            let topCard = discardPile.pop();
            discardPile = shuffle(discardPile);
            this.setState({
                drawStack: discardPile,
                discardPile: [topCard]
            })
            return;
        }
        this.handlePlayClick(this.state.selectedCards, 1);
    }

    handlePlayClick(cards, drawPile) {
        if (this.state.players[0].turn !== this.state.turn) {
            this.setState({errorMessage: "not your turn"})
            return;
        } else if (cards.length === 0) {
            this.setState({errorMessage: "you need to select cards to play"})
            return;
        }

        let isPlayable = areCardsPlayable(cards);
        if (!isPlayable) {
            this.setState({errorMessage: "you can't play those cards"})
            return;
        }

        if (drawPile === 0) {
            this.drawFromDiscardPile();
            this.playCards(cards, this.state.players[this.state.turn]);
        } else {
            this.drawFromDrawStack();
            this.playCards(cards, this.state.players[this.state.turn]);
        }

        this.setState({
            selectedCards: []
        })

        this.startInterval();
    }

    handleCardClick(cards) {
        console.log('selectedCards: ' + cards);
        this.setState({selectedCards: cards})
    }

    playCards(cards, player) {
        // add cards to the discard pile
        let newDiscardPile = this.state.discardPile;
        newDiscardPile = newDiscardPile.concat(cards);

        // remove cards from the player's hand
        let playerIndex = this.state.players.indexOf(player);
        let newPlayer = this.state.players[playerIndex];

        for (let i = 0; i < cards.length; i++) {
            if (newPlayer.hand.includes(cards[i])) {
                newPlayer.hand.splice(newPlayer.hand.indexOf(cards[i]), 1);
            }
        }

        newPlayer.points = getPoints(newPlayer.hand);

        let newPlayers = this.state.players;
        newPlayers[playerIndex] = newPlayer;

        this.setState({
            discardPile: newDiscardPile,
            players: newPlayers,
            errorMessage: "",
            turn: this.getNextTurn()
        })
    }

    drawFromDiscardPile() {
        let newDiscardPile = this.state.discardPile;
        const card = newDiscardPile.pop();
        this.addCardToPlayerHand(card, this.state.players[this.state.turn]);

        this.setState({
            discardPile: newDiscardPile
        })
    }

    drawFromDrawStack() {
        let newDrawStack = this.state.drawStack;
        const card = newDrawStack.pop();
        this.addCardToPlayerHand(card, this.state.players[this.state.turn]);

        this.setState({
            drawStack: newDrawStack
        })
    }

    addCardToPlayerHand(card, player) {
        let playerIndex = this.state.players.indexOf(player);
        let newPlayer = this.state.players[playerIndex];

        newPlayer.hand.push(card);

        let newPlayers = this.state.players;
        newPlayers[playerIndex] = newPlayer;

        this.setState({
            players: newPlayers
        })
    }

    handleAutoPlayClick() {
        if (this.state.drawStack.length === 0) {
            this.setState({errorMessage: "draw stack is empty"});
            return;
        }

        let player = this.state.players[this.state.turn];

        // auto call yaniv for the current player
        if (player.points <= 5) {
            this.clearInterval();
            this.callYaniv(player);
            return;
        }

        // play the current player's "best" cards
        let currentPlayerHand = player.hand;
        const bestPlay = getBestPlay(currentPlayerHand, this.state.discardPile, 3);
        bestPlay.drawPile === 1 ? this.drawFromDiscardPile() : this.drawFromDrawStack();
        this.playCards(bestPlay.cards, player);
    }

    handleYanivClick() {
        // TODO: eventually will need to replace 0 with id of client player
        this.callYaniv(this.state.players[0]);
    }

    callYaniv(player) {
        let yanivPlayer = player;

        if (yanivPlayer.turn !== this.state.turn) {
            this.setState({errorMessage: "not your turn"})
            return;
        }

        let newPlayers = this.state.players;
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

        this.setState({
            players: newPlayers,
            paused: true
        })
    }

    handleReadyClick() {

        // deal cards
        let newPlayers = this.state.players;
        let newDeal = deal(4);
        for (let i = 0; i < newDeal.players.length; i++) {
            newPlayers[i].hand = newDeal.players[i].hand;
            newPlayers[i].points = newDeal.players[i].points;
        }

        this.setState({
            players: newPlayers,
            discardPile: [],
            drawStack: newDeal.deck,
            turn: this.getNextTurn(),
            paused: false,
            selectedCards: []
        })

        // start interval
        this.startInterval();
    }

    getNextTurn() {
        let turn = this.state.turn;
        turn + 1 >= this.state.players.length ? turn = 0 : turn = turn + 1;
        return turn;
    }

    render() {
        return (
            <div className="flex items-center justify-center flex-col bg-white">
                <div className="border-b-2 p-8">
                    <OpponentList paused={this.state.paused} turn={this.state.turn} players={this.state.players} />
                </div>
                <div className="border-b-2 p-8">
                    <PlayArea
                        discardPile={this.state.discardPile}
                        drawStack={this.state.drawStack}
                        onDiscardPileClick={() => this.handleDiscardPileClick()}
                        onDrawStackClick={() => this.handleDrawStackClick()}
                        paused={this.state.paused}
                    />
                </div>
                <div className="p-8">
                    <PlayerInput
                        onAutoPlayClick={() => this.handleAutoPlayClick()}
                        player={this.state.players[0]}
                        errorMessage={this.state.errorMessage}
                        turn={this.state.turn}
                        onCardClick={(cards) => this.handleCardClick(cards)}
                        onYanivClick={() => this.handleYanivClick()}
                        onReadyClick={() => this.handleReadyClick()}
                        selectedCards={this.state.selectedCards}
                        paused={this.state.paused}
                    />
                </div>
            </div>
        )
    }
}

export default GameBoard
