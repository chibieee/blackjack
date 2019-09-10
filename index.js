let main = document.querySelector('.main');
let play = document.getElementById('play');
let reset = document.getElementById('reset');
let hit = document.getElementById('hit');
let stand = document.getElementById('stand');
let winMsg = document.getElementById('win-msg');
let playAgain = document.getElementById('play-again');
let popUp = document.querySelector('.win-popup');
let btnCtn = document.querySelector('.btn-container');
let dealerCtn = document.querySelector('.dealer-container');
let playerCtn = document.querySelector('.player-container');
let dealerNum = document.querySelector('.dealer-num');
let playerNum = document.querySelector('.player-num');
let dealerArr = [];
let playerArr = [];
let playerWin = false;
let egg = 1;
class Deck {
    constructor() {
      this.deck = [];
      this.reset();
      this.shuffle();
    }
  
    reset() {
      this.deck = [];
  
      const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
      const values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];
  
      for (let suit in suits) {
        for (let value in values) {
          this.deck.push(`${values[value]} of ${suits[suit]}`);
        }
      }
    }
  
    shuffle() {
      const { deck } = this;
      let m = deck.length, i;
  
      while(m){
        i = Math.floor(Math.random() * m--);
  
        [deck[m], deck[i]] = [deck[i], deck[m]];
      }
  
      return this;
    }
  
    deal(){
      return this.deck.pop();
    }
}
  
const deck1 = new Deck();

function convertCard(card, arr) {
    let val = card.split(' ');
    if(Number(val[0])) {
        arr.push(Number(val[0]))
    } else {
        if (val[0] === 'Ace') {
            arr.push([1, 11])
        } else {
            arr.push(10);
        }
        
    }
}

function addCards(arr, node, checkWinTrue, compareHands) {
    let strArr = [0, 0];
    arr.forEach(function(c) {
        if(Number.isInteger(c)) {
            strArr[0] = strArr[0] + c;
            strArr[1] = strArr[1] + c;            
        } else {
            strArr[0] = strArr[0] + c[0];
            strArr[1] = strArr[1] + c[1];
        }
        
    })
    if(strArr[0] !== 0 && strArr[0] === strArr[1]) {
        node.innerHTML = strArr[0];
        if(strArr[0] > 21) {
            playerLose();
        }
        if(strArr[0] === 21) {
            checkWin('player', true);
        }
        if(compareHands) {
            return strArr[0]
        }
    } else {
        let num = 0;
        node.innerHTML = `${strArr[0]} or ${strArr[1]}`;
        if(strArr[1] > 21) {
            num = strArr[0]
        }
        if(num > 21) {
            playerLose();
        }
        if(num === 21) {
            checkWin('player', true);
        }
        if(compareHands) {
            return num;
        }
        
    }
    if(checkWinTrue) {
        if(strArr[1] === 21) {
            playerWin = true;
        }
    }
}

function showDealerCards(arr, node) {
    if(Number.isInteger(arr[1])) {
        node.innerHTML = arr[1]
    } else {
        node.innerHTML = '1 or 11'
    }
}

function addDealerCards(arr, node) {
    let strArr = [0, 0];
    arr.forEach(function(c) {
        if(Number.isInteger(c)) {
            strArr[0] = strArr[0] + c;
            strArr[1] = strArr[1] + c;            
        } else {
            strArr[0] = strArr[0] + c[0];
            strArr[1] = strArr[1] + c[1];
        }
        
    })
    if(strArr[0] === strArr[1]) {
        node.innerHTML = strArr[0];
        if(strArr[0] === 21) {
            dealerWin();
        } else if(strArr[0] < 18) {
            dealerDrawCard();
        } else if(strArr[0] > 21) {
            dealerBust();
        } else {
            compareHands(strArr[0]);
        }
    } else {
        let num = 0;
        node.innerHTML = `${strArr[0]} or ${strArr[1]}`;
        if(strArr[1] === 21) {
            dealerBlackjack();
        } else if(strArr[1] >= 18 && strArr[1] < 22) {
            compareHands(strArr[1]);
        } else if(strArr[1] < 18) {
            dealerDrawCard();
        } else {
            num = strArr[0]
            if(num < 18) {
                dealerDrawCard();
            } else if(num > 21) {
                dealerBust();
            } else {
                compareHands(num);
            }
        }

    }
}

function dealerDraw() {
    let firstDealerCard = document.querySelector('.dealer-container .card:first-child');
    firstDealerCard.classList.add('playing');
    addDealerCards(dealerArr, dealerNum)
}

function dealerDrawCard() {
    let card = deck1.deal();
    convertCard(card, dealerArr);
    var div = document.createElement('div');
    div.innerHTML = card;
    div.setAttribute('class', 'card');
    dealerCtn.appendChild(div);
    addDealerCards(dealerArr, dealerNum)
}

function compareHands(dealerFinal) {
    let playerFinalNum = addCards(playerArr, playerNum, false, true);
    let dealerFinalNum = dealerFinal;
    if(dealerFinalNum > playerFinalNum) {
        dealerWin();
    } else if (dealerFinalNum === playerFinalNum) {
        playerPush();
    } else {
        playerWinsCompare();
    }
}

function playerWinsCompare() {
    togglePopup();
    winMsg.innerHTML = 'Player Wins!';
}

function playerLose() {
    togglePopup();
    winMsg.innerHTML = 'Player Bust! Dealer Wins!'
}

function playerPush() {
    togglePopup();
    winMsg.innerHTML = 'It\'s a tie! Player Push!';
}

function checkWin(person, didWin) {
    if(person === 'player' && didWin) {
        togglePopup();
        winMsg.innerHTML = 'Blackjack! Player Wins!'
    }
}

function dealerWin() {
    togglePopup();
    winMsg.innerHTML = 'Dealer wins!'
}

function dealerBlackjack() {
    togglePopup();
    winMsg.innerHTML = 'Dealer Blackjack! Dealer Wins!'
}

function dealerBust() {
    togglePopup();
    winMsg.innerHTML = 'Dealer Bust! Player Wins!'
}

function togglePopup() {
    popUp.classList.toggle('active');
}

function reDeal() {
    deck1.reset();
    deck1.shuffle();
    dealerArr = [];
    playerArr = [];
    addCards(dealerArr, dealerNum);
    addCards(playerArr, playerNum);
}

function easterEgg() {
    egg = egg - .002;
    main.setAttribute('style', `background-color: rgba(71, 113, 72, ${egg});`)
}

play.addEventListener('click', function() {
    this.parentElement.classList.add('playing');
    for(let i = 0; i < 4; i++) {
        if (i === 0 || i === 2) {
            let card = deck1.deal();
            convertCard(card, playerArr);
            var div = document.createElement('div');
            div.innerHTML = card;
            div.setAttribute('class', 'card');
            playerCtn.appendChild(div);
        } else {
            let card = deck1.deal()
            convertCard(card, dealerArr);
            var div = document.createElement('div');
            div.innerHTML = card;
            div.setAttribute('class', 'card');
            dealerCtn.appendChild(div);
        }
    }
    showDealerCards(dealerArr, dealerNum, false);
    addCards(playerArr, playerNum, true);
    checkWin('player', playerWin)
    easterEgg();
})

hit.addEventListener('click', function() {
    let card = deck1.deal();
    console.log(`Player's Cards ${card}`)
    convertCard(card, playerArr);
    var div = document.createElement('div');
    div.innerHTML = card;
    div.setAttribute('class', 'card');
    playerCtn.appendChild(div);
    addCards(playerArr, playerNum);
    checkWin();
})

stand.addEventListener('click', function() {
    hit.classList.add('no-click');
    dealerDraw();
})

reset.addEventListener('click', function() {
    dealerCtn.innerHTML = '';
    playerCtn.innerHTML = '';
    reDeal();
    hit.classList.remove('no-click');
    btnCtn.classList.remove('playing');
})

playAgain.addEventListener('click', function() {
    dealerCtn.innerHTML = '';
    playerCtn.innerHTML = '';
    reDeal();
    playerWin = false;
    hit.classList.remove('no-click');
    btnCtn.classList.remove('playing');
    togglePopup();
})