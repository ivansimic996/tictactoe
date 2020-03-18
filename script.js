
const LogicCtrl = (function(){
        const state = {
                currPlayer: 'x',
                gameActive: true,
                grid: ['', '', '', '', '', '', '', '',''],
                moves: 0,
                winCombination: [],
        }
        const winningCombinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
               [2, 4, 6]
        ];
        function isGameOver(){              
                 for (let i = 0; i <= 7; i++) {
                        const winCombination = winningCombinations[i];
                        let a = state.grid[winCombination[0]];
                        let b = state.grid[winCombination[1]];
                        let c = state.grid[winCombination[2]];
                        if (a === '' || b === '' || c === '') {
                            continue;
                        }
                        if (a === b && b === c) {
                                state.winCombination = winCombination;
                                return true;
                        }
                    }
                    return false;
                
        }
        return {
                handlePlay: function(cellIndex){
                        state.grid[cellIndex] = state.currPlayer;
                        state.moves++;
                        if(isGameOver()) {
                                state.gameActive = false;
                                return;
                        }
                },
                getGameActive: function(){
                        return state.gameActive;
                },
                reset: function() {
                        state.currPlayer = 'x';
                        state.gameActive = true;
                        state.grid = ['', '', '', '', '', '', '', '', ''];
                        state.moves = 0;
                },
                getWinnerInfo: function() {
                        const winnerInfo = {};
                        winnerInfo.winner = state.currPlayer;
                        winnerInfo.moves = state.moves;
                        return winnerInfo;
                },
                addWinner: function(name) {
                        let winnerList = JSON.parse(localStorage.getItem('winners'));
                        const winner = {};
                        winner.name = name;
                        winner.symbol = state.currPlayer;
                        winner.moves = state.moves;
                        if(winnerList){
                                winnerList = [...winnerList, winner];
                        }
                        else {
                                winnerList = [winner];
                        }
                        localStorage.setItem('winners',JSON.stringify(winnerList));
                },
                
                nextPlayer: function() {
                        state.currPlayer = state.currPlayer === 'x'? 'o': 'x';
                },
                isCellEmpty(cellIndex) {
                        return state.grid[cellIndex] === '';
                },
                getWinCombination() {
                        return state.winCombination;
                }
        };
})();

const UICtrl = (function(){
        return {
                getCellIndex: function(target){
                        return Array.from(target.parentNode.children).indexOf(target);
                },
                showWinnerInfo: function(winnerInfo){
                        const winnerHeader = document.querySelector('.game__winner');
                        winnerHeader.classList.toggle('game__winner--show');
                        winnerHeader.textContent = `Winner: ${winnerInfo.winner}, Moves: ${winnerInfo.moves}`
                },
                showForm: function() {
                        const frm = document.querySelector('.game__form');
                        frm.classList.toggle('game__form--show')
                },
                getName: function(e) {
                        const formData = new FormData(e.target);
                        return formData.get('winnerName');
                },
                updateWinnerList() {
                        const winnerList = JSON.parse(localStorage.getItem('winners'));
                        if(winnerList){
                                winnerList.forEach(winner => {
                                        document.querySelector('.winner-list').insertAdjacentHTML('beforeend', 
                                        `<li class="winner-list__item">Winner: ${winner.name}, &nbsp;Symbol: ${winner.symbol}, Moves ${winner.moves}</li>`);
                                })
                        }
                },
                addWinner(name, winnerInfo) {
                        document.querySelector('.winner-list').insertAdjacentHTML('beforeend', 
                        `<li class="winner-list__item">Winner: ${name}, &nbsp;Symbol: ${winnerInfo.winner}, Moves ${winnerInfo.moves}</li>`);
                        document.querySelector('input').disabled = true;
                        document.querySelector('.btn--submit').disabled = true;
                        document.querySelector('.btn--submit').classList.add('btn--disabled');
                },
                updateCell(target, winnerInfo) {
                        if(winnerInfo.winner === 'o'){
                                target.children[0].classList.add('circle');
                        }
                        else{
                                target.children[0].classList.add('cross');
                        }
                },
                reset(){
                        const items = document.getElementsByClassName('cell-item');
                        Array.from(items).forEach(item => {
                                item.classList.remove('circle');
                                item.classList.remove('cross');
                                item.classList.remove('cell-item--dark');
                                item.classList.remove('cell-item--light');

                        });
                        document.querySelector('.game__winner').classList.remove('game__winner--show');
                        document.querySelector('.game__form').classList.remove('game__form--show');
                        document.querySelector('input').disabled = false;
                        document.querySelector('.btn--submit').disabled = false;
                        document.querySelector('.btn--submit').classList.remove('btn--disabled');
                        
                },
                highlightWinnerSymbol: function(winCombination){
                        const cells = document.getElementsByClassName('cell-item');
                        Array.from(cells).forEach((cell, i) => {
                                if(winCombination.indexOf(i) !== -1){
                                        cell.classList.add('cell-item--light');
                                }
                                else{
                                        cell.classList.add('cell-item--dark');
                                }
                        })
                },
        
        }
})();

const ctrl = (function(LogicCtrl, UICtrl){
        function handleMove(e){
                let target;
                if(e.target.classList.contains('cell-item')){
                        target = e.target.parentNode;
                }
                else {
                        target = e.target;
                }
                if(LogicCtrl.getGameActive()){
                        const cellIndex = UICtrl.getCellIndex(target);
                        if(LogicCtrl.isCellEmpty(cellIndex)){
                                LogicCtrl.handlePlay(cellIndex);
                                UICtrl.updateCell(target, LogicCtrl.getWinnerInfo());
                                if(!LogicCtrl.getGameActive()){
                                        const winnerInfo = LogicCtrl.getWinnerInfo();
                                        UICtrl.highlightWinnerSymbol(LogicCtrl.getWinCombination());
                                        UICtrl.showWinnerInfo(winnerInfo);
                                        UICtrl.showForm();
                                }
                                LogicCtrl.nextPlayer();
                        }                      
                        
                }       
        }
        function handleNameInput(e) {
                console.log(e);
                e.preventDefault();
                const name = UICtrl.getName(e);
                const winnerInfo = LogicCtrl.getWinnerInfo();
                LogicCtrl.addWinner(name);
                UICtrl.addWinner(name, winnerInfo);
                LogicCtrl.reset();
        }
        function restart(){
                LogicCtrl.reset();
                UICtrl.reset();
        }
        function setupEventListeners(){
                Array.from(document.getElementsByClassName('xo-table__cell')).forEach(el => {
                        el.addEventListener('click', handleMove);
                })
                document.querySelector('.game__form').addEventListener('submit', handleNameInput);
                document.querySelector('.btn--reset').addEventListener('click', restart);
        }
        return {
                init: function() {
                        setupEventListeners();
                        UICtrl.updateWinnerList();
                }
        }
})(LogicCtrl, UICtrl);

ctrl.init();
