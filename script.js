document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const playerForm = document.getElementById('player-form');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const submitPlayersBtn = document.getElementById('submit-players');
    const gameContainer = document.getElementById('game-container');
    const statusDisplay = document.getElementById('status');
    const cells = document.querySelectorAll('.grid-item');
    const resetBtn = document.getElementById('reset');
    const resetPlayersBtn = document.getElementById('reset-players');
    
    // Game Variables
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let player1Name = '';
    let player2Name = '';
    
    // Winning Conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Event Listeners
    startBtn.addEventListener('click', showPlayerForm);
    submitPlayersBtn.addEventListener('click', startGameWithPlayers);
    resetBtn.addEventListener('click', resetGame);
    resetPlayersBtn.addEventListener('click', resetPlayers);
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    
    // Show player name input form
    function showPlayerForm() {
        startScreen.classList.add('hidden');
        playerForm.classList.remove('hidden');
    }
    
    // Start game with player names
    function startGameWithPlayers() {
        player1Name = player1Input.value.trim();
        player2Name = player2Input.value.trim();
        
        if (!player1Name || !player2Name) {
            alert('Please enter names for both players!');
            return;
        }
        
        playerForm.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        // Initialize game
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        
        // Clear board
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        // Update status
        updateStatus();
    }
    
    // Handle cell click
    function handleCellClick(e) {
        if (!gameActive) return;
        
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell already filled, ignore
        if (gameState[clickedCellIndex] !== '') return;
        
        // Update game state
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        checkResult();
    }
    
    // Check game result
    function checkResult() {
        let roundWon = false;
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                highlightWinningCells(a, b, c);
                break;
            }
        }
        
        // If won, end game
        if (roundWon) {
            const winnerName = currentPlayer === 'X' ? player1Name : player2Name;
            statusDisplay.textContent = `${winnerName} (${currentPlayer}) wins!`;
            gameActive = false;
            return;
        }
        
        // If all cells filled (draw)
        if (!gameState.includes('')) {
            statusDisplay.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }
        
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
    
    // Highlight winning cells
    function highlightWinningCells(a, b, c) {
        document.querySelector(`[data-index="${a}"]`).classList.add('winning-cell');
        document.querySelector(`[data-index="${b}"]`).classList.add('winning-cell');
        document.querySelector(`[data-index="${c}"]`).classList.add('winning-cell');
    }
    
    // Update status display
    function updateStatus() {
        const currentPlayerName = currentPlayer === 'X' ? player1Name : player2Name;
        statusDisplay.textContent = `${currentPlayerName}'s turn (${currentPlayer})`;
    }
    
    // Reset game (keep same players)
    function resetGame() {
        // Clear board
        gameState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        // Reset to player X
        currentPlayer = 'X';
        gameActive = true;
        
        // Update status
        updateStatus();
    }
    
    // Reset players (go back to name input)
    function resetPlayers() {
        // Hide game container
        gameContainer.classList.add('hidden');
        
        // Show player form
        playerForm.classList.remove('hidden');
        
        // Clear previous names
        player1Input.value = '';
        player2Input.value = '';
        
        // Reset game state
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = false;
        
        // Clear any existing board state
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        // Focus on first player input
        player1Input.focus();
        
        // Reset status display
        statusDisplay.textContent = '';
    }
});