document.addEventListener('DOMContentLoaded', () => {

    const board = document.getElementById('board');
    const newGameBtn = document.getElementById('new-game');
    const difficultySelect = document.getElementById('difficulty');
    const togglePencilBtn = document.getElementById('toggle-pencil');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const numberButtons = document.getElementById('number-buttons');

    let puzzle = [];
    let solution = [];
    let pencilMode = false;
    let selectedCell = null;
    let timer;
    let seconds = 0;
    let score = 0;
    let lives = 3;

    function generatePuzzle() {
        // Simplified puzzle generation
        solution = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                solution.push((i * 3 + Math.floor(i / 3) + j) % 9);
            }
        }

        puzzle = [...solution];
        const difficulty = difficultySelect.value;
        let cellsToRemove;

        switch (difficulty) {
            case 'easy':
                cellsToRemove = 30;
                break;
            case 'medium':
                cellsToRemove = 40;
                break;
            case 'hard':
                cellsToRemove = 50;
                break;
            default:
                cellsToRemove = 40;
        }

        while (cellsToRemove > 0) {
            const index = Math.floor(Math.random() * 81);
            if (puzzle[index] !== 0) {
                puzzle[index] = 0;
                cellsToRemove--;
            }
        }
    }

    function renderBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            if (puzzle[i] !== 0) {
                cell.textContent = puzzle[i];
                cell.classList.add('given');
            } else {
                cell.addEventListener('click', handleCellClick);
            }
            const pencilMarks = document.createElement('div');
            pencilMarks.classList.add('pencil-marks');
            for (let j = 0; j < 9; j++) {
                const mark = document.createElement('span');
                mark.classList.add('pencil-mark');
                pencilMarks.appendChild(mark);
            }
            cell.appendChild(pencilMarks);
            board.appendChild(cell);
        }
    }

    function handleCellClick(event) {
        const cell = event.target.closest('.cell');
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = cell;
        cell.classList.add('selected');
        highlightRelatedCells(parseInt(cell.dataset.index));
    }

    function highlightRelatedCells(index) {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const boxStartRow = Math.floor(row / 3) * 3;
        const boxStartCol = Math.floor(col / 3) * 3;

        document.querySelectorAll('.cell').forEach((cell, i) => {
            cell.classList.remove('related');
            const cellRow = Math.floor(i / 9);
            const cellCol = i % 9;
            if (cellRow === row || cellCol === col ||
                (cellRow >= boxStartRow && cellRow < boxStartRow + 3 &&
                    cellCol >= boxStartCol && cellCol < boxStartCol + 3)) {
                cell.classList.add('related');
            }
        });
    }

    function createNumberButtons() {
        for (let i = 1; i <= 9; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('number-button');
            button.addEventListener('click', () => handleNumberInput(i));
            numberButtons.appendChild(button);
        }
    }

    function handleNumberInput(number) {
        if (selectedCell && !selectedCell.classList.contains('given')) {
            const index = parseInt(selectedCell.dataset.index);
            if (pencilMode) {
                togglePencilMark(selectedCell, number);
            } else {
                if (number === solution[index]) {
                    puzzle[index] = number;
                    selectedCell.textContent = number;
                    selectedCell.classList.add('correct');
                    selectedCell.classList.remove('selected');
                    score += 10;
                    updateScore();
                    checkWin();
                } else {
                    selectedCell.classList.add('incorrect');
                    setTimeout(() => selectedCell.classList.remove('incorrect'), 1000);
                    lives--;
                    updateLives();
                    if (lives === 0) {
                        endGame(false);
                    }
                }
            }
        }
    }

    function togglePencilMark(cell, number) {
        const pencilMarks = cell.querySelector('.pencil-marks');
        const mark = pencilMarks.children[number - 1];
        if (mark.textContent === '') {
            mark.textContent = number;
        } else {
            mark.textContent = '';
        }
    }

    function updateTimer() {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function updateLives() {
        livesDisplay.textContent = `Lives: ${lives}`;
    }

    function checkWin() {
        if (puzzle.every((num, index) => num === solution[index])) {
            endGame(true);
        }
    }

    function endGame(isWin) {
        clearInterval(timer);
        if (isWin) {
            alert(`Congratulations! You solved the puzzle in ${formatTime(seconds)}!`);
        } else {
            alert('Game over! You ran out of lives.');
        }
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function newGame() {
        clearInterval(timer);
        seconds = 0;
        score = 0;
        lives = 3;
        generatePuzzle();
        renderBoard();
        updateTimer();
        updateScore();
        updateLives();
        timer = setInterval(updateTimer, 1000);
    }

    function togglePencilMode() {
        pencilMode = !pencilMode;
        togglePencilBtn.classList.toggle('active');
    }

    // Dark mode toggle function
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }

    newGameBtn.addEventListener('click', newGame);
    togglePencilBtn.addEventListener('click', togglePencilMode);

    // Add event listener for difficulty change
    difficultySelect.addEventListener('change', newGame);

    // Add event listener for dark mode toggle button (make sure you add this button in HTML)
    const darkModeToggleBtn = document.getElementById('dark-mode-toggle');
    if (darkModeToggleBtn) {
        darkModeToggleBtn.addEventListener('click', toggleDarkMode);
    }

    // Initialize the game
    createNumberButtons();
    newGame();

});
