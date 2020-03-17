
const LogicCtrl = (function(){
        const state = {
                currPlayer: 'x',
                gameActive: true,
                grid: ['', '', '', '', '', '', '', ''],
                moves: 0,
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
                            return true;
                        }
                    }
                    return false;
                
        }
        return {
                handlePlay: function(cellIndex){
                        state.grid[cellIndex] = state.currPlayer;
                        if(isGameOver()) {
                                state.gameActive = false;
                                return;
                        }
                        state.currPlayer = state.currPlayer === 'x'? 'o': 'x';
                        state.moves++;
                },
                getGameActive: function(){
                        return state.gameActive;
                },
                reset: function() {
                        state.currPlayer = 'x';
                        state.gameActive = true;
                        state.grid = ['', '', '', '', '', '', '', ''];
                        state.moves = 0;
                },
                getWinnerInfo: function() {
                        const winnerInfo = {};
                        winnerInfo.winner = state.currPlayer;
                        winnerInfo.moves = state.movers;
                        return winnerInfo;
                },
                addWinner: function(name) {
                        const winnerList = JSON.parse(localStorage.getItem('winners'));
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
                        localStorage.setItem(JSON.stringify(winnerList));
                }
        };
})();

const UICtrl = (function(){
        return {
                getCellIndex: function(e){
                        console.log(e);
                        Array.from(e.target.parentNode.children).indexOf(e.target);
                },
                showWinnerInfo: function(winnerInfo){
                        const winnerHeader = document.querySelector('.game__winner');
                        winnerHeader.classList.toggle('game__winner--show');
                        winnerHeader.textContent = `Winner ${winnerInfo.winner}, Moves: ${winnerInfo.moves}`
                },
                showForm: function() {
                        const frm = document.querySelector('.game__form');
                        frm.classList.toggle('game__form--show')
                },
                getName: function(e) {
                        const formData = new frmData(e.target);
                        return formData.get('name');
                },
                updateWinnerList() {
                        const winnerList = JSON.parse(localStorage.getItem('winners'));
                        winnerList.forEach(winner => {
                                document.querySelector('.winner-list').insertAdjacentHTML('beforeend', 
                                `<li class="winner-list__item">Winner: ${winner.name}, &nbsp;Symbol: ${winner.symbol}, Moves ${winner.moves}</li>`);
                        })
                },
                addWinner(name, winnerInfo) {
                        document.querySelector('.winner-list').insertAdjacentHTML('beforeend', 
                        `<li class="winner-list__item">Winner: ${name}, &nbsp;Symbol: ${winnerInfo.winner}, Moves ${winnerInfo.moves}</li>`);
                },
                updateCell(e, winnerInfo) {
                        if(winnerInfo.winner === 'o'){
                                e.target.children[0].classList.add('circle');
                        }
                        else{
                                e.target.children[0].classList.add('cross');
                        }
                },
        
        }
})();

const ctrl = (function(LogicCtrl, UICtrl){
        function handleMove(e){
                if(LogicCtrl.getGameActive()){
                        cellIndex = UICtrl.getCellIndex(e);
                        LogicCtrl.handlePlay(cellIndex);
                        UICtrl.updateCell(e, LogicCtrl.getWinnerInfo())
                        if(!LogicCtrl.getGameActive()){
                                const winnerInfo = LogicCtrl.getWinnerInfo();
                                UICtrl.showWinnerInfo(winnerInfo);
                                UICtrl.showForm();
                        }
                }       
        }
        function handleNameInput(e) {
                e.preventDefault();
                const name = UICtrl.getName(e);
                const winnerInfo = LogicCtrl.getWinnerInfo();
                LogicCtrl.addWinner(name);
                UICtrl.addWinner(name, winnerInfo);
                LogicCtrl.reset();
                UICtrl.reset();
        }
        function setupEventListeners(){
                Array.from(document.getElementsByClassName('xo-table__cell')).forEach(el => {
                        el.addEventListener('click', handleMove);
                })
                document.querySelector('.game__form').addEventListener('submit', handleNameInput);
        }
        return {
                init: function() {
                        setupEventListeners();
                }
        }
})(LogicCtrl, UICtrl);

ctrl.init();
