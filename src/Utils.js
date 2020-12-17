export const getCard = (cardNumber) => {
    const hearts = Array.from(Array(13).keys());
    const diamonds = Array.from({length: 13}, (_, i) => i + 13);
    const clubs = Array.from({length: 13}, (_, i) => i + 26);
    const spades = Array.from({length: 13}, (_, i) => i + 39);
    const jokers = [52, 53];

    let suit = '';
    let number = cardNumber;
    if (hearts.includes(cardNumber)) {
        suit = 'H';
    } else if (diamonds.includes(cardNumber)) {
        suit = 'D';
        number = number - 13;
    } else if (clubs.includes(cardNumber)) {
        suit = 'C';
        number = number - 26;
    } else if (spades.includes(cardNumber)) {
        suit = 'S';
        number = number - 39;
    } else if (jokers.includes(cardNumber)) {
        suit = 'J';
        number = '-1';
    }

    if (number === 0 ) {
        number = 'A';
    } else if (number === 10) {
        number = 'J';
    } else if (number === 11) {
        number = 'Q';
    } else if (number === 12) {
        number = 'K';
    } else if (number === -1) {
        number = 0;
    } else {
        number++;
    }

    return {number: number, suit: suit}
}

export const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export const deal = (numberOfPlayers) => {
    // cars 52 and 53 are jokers
    let deck = Array.from(Array(54).keys());
    deck = shuffle(deck);

    let players = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        players.push({
            id: 'Player ' + i,
            score: 0,
            hand: buildHand(5),
            turn: i,
            points: 0
        })
    }
    for (let i = 0; i < players.length; i++) {
        players[i].points = getPoints(players[i].hand);
    }

    function buildHand(numberOfCards) {
        let hand = [];
        for (let index = 0; index < numberOfCards; index++) {
            hand.push(deck.pop());
        }
        return hand;
    }

    return {players: players, deck: deck};
}

export const getRandomInt = (start, count) => {
    // start = inclusive, end = exclusive
    return Math.floor(Math.random() * count) + start;
}

const  numberToValueMap = {0: 0, A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 10, Q: 10, K: 10};

export const getPoints = (hand) => {
    let points = 0;
    for (let i = 0; i < hand.length; i++) {
        let card = getCard(hand[i]);
        let amount = numberToValueMap[card.number];
        points += amount;
    }
    return points;
}

export const getBestPlay = (hand, discardPile, playStyle) => {
    let bestPlay;
    let matrix = getMatrix(hand);

    switch (playStyle) {
        case 0:
            // play single random card, pickup from draw stack
            bestPlay = {
                cards: [hand[getRandomInt(0, hand.length)]],
                drawPile: 2
            }
            break;
        case 1:
            // play the best set (matching numbers) or highest card, pickup from draw stack
            let bestSet = getBestSet(hand, matrix);
            bestPlay = {
                cards: bestSet,
                drawPile: 2
            }
            break;
        case 2:
            // play the best run (3+ same suit and in order) or highest card, pickup from draw stack
            let bestRun = getBestRun(hand, matrix);
            if (bestRun.length === 0) {
                bestRun = [hand[getRandomInt(0, hand.length)]];
            }
            bestPlay = {
                cards: bestRun,
                drawPile: 2
            }
            break;
        default:
            // play first card, pickup from draw stack
            bestPlay = {
                cards: [hand[0]],
                drawPile: 2
            }
            break;
    }

    // play best run or best set (whichever seems better), pickup from draw stack
    let bestHand;
    let bestSet = getBestSet(hand, matrix);
    let bestRun = getBestRun(hand);
    let bestSetPoints = getPoints(bestSet);
    let bestRunPoints = getPoints(bestRun);

    if (bestSetPoints >= bestRunPoints) {
        bestHand = bestSet;
    } else {
        bestHand = bestRun;
    }

    console.log('bestSet: ' + bestSet + ' = ' + bestSetPoints + ' | ' +
        'bestRun: ' + bestRun + ' = ' + bestRunPoints + ' | ' +
        'bestPlay: '  + bestHand + ' = ' + getPoints(bestHand));
    console.log('--------------------')

    bestPlay = {
        cards: bestHand,
        drawPile: 2
    }

    return bestPlay;
}

function getBestRun(hand) {
    let hearts = [];
    let diamonds = [];
    let clubs = [];
    let spades = [];
    let jokers = [];

    for (let i = 0; i < hand.length; i++) {
        let card = getCard(hand[i]);
        switch (card.suit) {
            case "H":
                hearts.push(hand[i]);
                break;
            case "D":
                diamonds.push(hand[i]);
                break;
            case "C":
                clubs.push(hand[i]);
                break;
            case "S":
                spades.push(hand[i]);
                break;
            case "J":
                jokers.push(hand[i]);
                break;
            default:
                break;
        }
    }
    
    let totals = [hearts, diamonds, clubs, spades];
    totals = totals.sort(((a, b) => b.length - a.length));
    // totals = totals.filter(a => a.length === totals[0].length);

    let bestCards = [];

    for (let i = 0; i < totals.length; i++) {
        let bestCardsWithJokers = totals[i].concat(jokers);
        if (areCardsPlayable(totals[i])) {
            bestCards = totals[i];
            break;
        } else if (jokers.length === 1 && areCardsPlayable(bestCardsWithJokers)) {
            bestCards = bestCardsWithJokers;
            break;
        } else if (jokers.length === 2 && areCardsPlayable(totals[i].concat(jokers[0]))) {
            bestCards = totals[i].concat(jokers[0]);
            break;
        } else if (jokers.length === 2 && areCardsPlayable(bestCardsWithJokers)) {
            bestCards = bestCardsWithJokers;
            break;
        }
    }

    if (bestCards.length <= 1) {
        let highCard = getCard(hand[0]);
        let value = numberToValueMap[highCard.number];
        bestCards = [hand[0]];
        for (let i = 1; i < hand.length; i++) {
            let card = getCard(hand[i]);
            let v = numberToValueMap[card.number];
            if (v > value) {
                value = v;
                bestCards = [hand[i]];
            }
        }
    }

    return bestCards;
}

function getBestSet(hand, matrix) {
    let sum = (r, a) => r.map((b, i) => a[i] + b);
    let sets = matrix.reduce(sum);
    let largestCombo = Math.max.apply(Math, sets);
    let highestIndex = 0;
    for (let i = 0; i < sets.length; i++) {
        if (sets[i] === largestCombo) {highestIndex = i}
    }
    let bestSet = []
    let numberMap = {0: 0, A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13};
    for (let i = 0; i < hand.length; i++) {
        if (numberMap[getCard(hand[i]).number] === highestIndex) {bestSet.push(hand[i])}
    }
    return bestSet;
}

function getMatrix(hand) {

    // A,2,3,4,5,6,7,8,9,10,J,Q,K,Joker
    let matrix = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    let suitMap = {J: 0, H: 1, D: 2, C: 3, S: 4}
    let numberMap = {0: 0, A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13};

    for (let i = 0; i < hand.length; i++) {
        let card = getCard(hand[i]);
        let suitIndex = suitMap[card.suit];
        let numberIndex = numberMap[card.number];
        matrix[suitIndex][numberIndex]++;
    }

    return matrix;
}

export const areCardsPlayable = (cards) => {
    // requirements: single card || 3+ cards in order with same suit || 2+ cards with same number
    let numberMap = {0: 0, A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13};
    let mappedCards = [];
    for (let i = 0; i < cards.length; i++) {
        let newCard = getCard(cards[i]);
        newCard.number = numberMap[newCard.number];
        mappedCards.push(newCard);
    }

    let sameNumbers = false;
    let sameSuitsAndInSequence = false;

    if (mappedCards.length >= 2) {
        sameNumbers = areCardsSameNumber(mappedCards);
    }

    if (mappedCards.length >= 3) {
        sameSuitsAndInSequence = areCardsSameSuitAndInSequence(mappedCards);
    }

    let isValid = false;
    if (cards.length === 1 || sameNumbers || sameSuitsAndInSequence) {isValid = true;}

    return isValid;
}

function areCardsSameSuitAndInSequence(cards) {
    let isValid = true;

    // 3+ cards with same suit and in order
    let suit = '';
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].suit !== 'J') {suit = cards[i].suit; break;}
    }
    let numbers = [];
    let numberOfJokers = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].suit === 'J') {
            numberOfJokers++;
        } else if (cards[i].suit !== suit && cards[i].suit !== 'J') {
            // console.log('suit dont match');
            isValid = false;
            break;
        } else {
            numbers.push(cards[i].number);
        }
    }

    numbers = numbers.sort((a, b) => a - b);
    for (let i = 1; i < numbers.length; i++) {
        let diff = numbers[i] - numbers[i-1];
        if (
            (diff >= 4) ||
            (diff === 3 && numberOfJokers < 2) ||
            (diff === 2 && numberOfJokers < 1))
        {
            // console.log('not in sequence');
            // console.log('numbers: ' + numbers);
            // console.log(
            //     (numbers[i - 1] !== numbers[i] - 1) + ", " +
            //     (numbers[i - 1] === numbers[i] - 2 && numberOfJokers < 1) + ", " +
            //     (numbers[i - 1] === numbers[i] - 3 && numberOfJokers < 2));
            isValid = false;
            break;
        }
    }

    return isValid;
}

function areCardsSameNumber(cards) {
    let isValid = true;

    // 2+ cards of same number
    let number = cards[0].number;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].number === 0) {continue;}
        if (cards[i].number !== number) {
            isValid = false;
            break;
        }
    }

    return isValid;
}