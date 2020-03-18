const localStorage = window.localStorage;
const playButton = document.getElementsByClassName("play")[0];
const squares = document.getElementsByClassName("square");
const modal = document.getElementsByClassName("modal")[0];
const winnerNameInput = document.getElementsByClassName("winner-name-input")[0];
const winnerNameTextbox = document.getElementById("winner-textbox");
const addWinnerButton = document.getElementsByClassName("add-winner")[0];
const winnerList = document.getElementsByClassName("winner-list")[0];

let isSquareEnabled = [];
let playerTurn = 'x';
let squareValues = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
let numberOfTurns = 0;
let gameFinished = false;
 
updateWinnerList(JSON.parse(localStorage.getItem('scores')));


playButton.addEventListener("click", () => {
    playButton.disabled = true;
    prepareBoard();

    for (let i=0; i<9; i++) {
        isSquareEnabled[i] = true;
        squares[i].addEventListener("click", onFieldClick(i));
    }
});

addWinnerButton.addEventListener("click", addWinner);

var onFieldClick = function (i) {
    return function () {
         if (isSquareEnabled[i] && !gameFinished) {
        numberOfTurns++;
        isSquareEnabled[i] = false;
        squares[i].classList.toggle(`${playerTurn}-field-disabled`);     
        squares[i].innerHTML = playerTurn;
        squareValues[i] = playerTurn;

        if (!hasWinner(playerTurn) && numberOfTurns < 9) {
        for (let i=0; i<9; i++) {
            
            squares[i].classList.toggle("x");
            squares[i].classList.toggle("o");
        }
        toggleTurn();
        } else {
            gameFinished = true;
            if (hasWinner(playerTurn)) {
            modal.classList.toggle("show-modal");
            winnerNameInput.classList.remove("hide-winner-input");
            } else {
                modal.classList.toggle("show-modal");
                winnerNameInput.classList.toggle("hide-winner-input");
                document.getElementsByClassName("draw-message")[0].classList.toggle("show-draw-message");
                console.log("fesf");
                setTimeout(() => {
                 modal.classList.toggle("show-modal");
                 document.getElementsByClassName("draw-message")[0].classList.toggle("show-draw-message");
                }, 500);
                console.log("posle sleepa");
            
               
                
            }
           playButton.disabled = false;
        }
      }
    }
};


function toggleTurn() {
    playerTurn = playerTurn === 'x'? 'o' : 'x';
}


function hasWinner(player) {
    if (checkFields(0,1,2, player)) return player;
    if (checkFields(3,4,5, player)) return player;
    if (checkFields(6,7,8, player)) return player;
    if (checkFields(0,3,6, player)) return player;
    if (checkFields(1,4,7, player)) return player;
    if (checkFields(2,5,8, player)) return player;
    if (checkFields(0,4,8, player)) return player;
    if (checkFields(2,4,6, player)) return player;
}


function checkFields(f1, f2, f3, player) {
     if (squareValues[f1] === squareValues[f2] && squareValues[f2] === squareValues[f3] && squareValues[f1] === player){
        
        return true;
    } else {
        return false;
    }
}

function addWinner() {
let scores = JSON.parse(localStorage.getItem('scores'));
if (!scores) {
    scores = [];
}

scores.push({
winner: winnerNameTextbox.value,
symbol: playerTurn,
moves: numberOfTurns
});

localStorage.setItem('scores', JSON.stringify(scores));
modal.classList.toggle("show-modal");
winnerNameTextbox.value = "";

updateWinnerList(scores);

}


function updateWinnerList(scores) {
    if (scores) {
    let finalHtml = ""
    for (let i=0; i<scores.length; i++) {
        
        finalHtml +=`<div class="winner-list-element"> Winner: ${scores[i].winner} Symbol: ${scores[i].symbol} Moves: ${scores[i].moves} </div>`;

    }
    winnerList.innerHTML = finalHtml;
}
}

function prepareBoard() {
    gameFinished = false;
    squareValues = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    numberOfTurns = 0;
    playerTurn = 'x';
    for (let i=0; i<9; i++) {
        isSquareEnabled[i] = true;
        squares[i].classList.remove(`x-field-disabled`);   
        squares[i].classList.remove(`o-field-disabled`);     
        squares[i].innerHTML = '';
    }
}







