// Global variables
let flippedCards = [];
let moves = 0;
let matches = 0;
let timerInterval;
let timeElapsed = 0;
let score = 0;

// Initialize the game with a specific grid size
function initializeGame(gridSize = 4) {
    const gameGrid = document.querySelector(".game-grid");
    gameGrid.innerHTML = ""; // Clear the grid
    gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gameGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

     // Ensure the grid fits within the viewport
     const containerWidth = Math.min(window.innerWidth * 0.9, 600); // Limit grid size to 90% of the screen or 600px max
     gameGrid.style.maxWidth = `${containerWidth}px`;

    // Prepare cards
    const totalCards = gridSize * gridSize;
    const images = Array.from({ length: totalCards / 2 }, (_, i) => i + 1);
    const cards = [...images, ...images].sort(() => Math.random() - 0.5); // Shuffle

    // Create card elements
    cards.forEach(value => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.name = value;

        const front = document.createElement("div");
        front.classList.add("card-front");

        const back = document.createElement("div");
        back.classList.add("card-back");
        back.textContent = value; // Placeholder for visuals

        card.append(front, back);
        gameGrid.append(card);

        // Add event listener for flipping the card
        card.addEventListener("click", () => flipCard(card));
    });

    resetGame(); // Reset game state
}

// Flip a card
function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// Check if two flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.name === card2.dataset.name) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matches++;

        if (matches === document.querySelectorAll(".card").length / 2) {
            clearInterval(timerInterval);
            updateScore();
            setTimeout(() => alert(`Congratulations! Your final score is ${score}`), 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
        }, 1000);
    }
    flippedCards = [];
    moves++;
    document.getElementById("moves").textContent = moves;
    updateScore(); // Update score dynamically
}

// Reset the game
function resetGame() {
    moves = 0;
    matches = 0;
    timeElapsed = 0;
    score = 0;
    document.getElementById("moves").textContent = "0";
    document.getElementById("timer").textContent = "00:00";
    document.getElementById("score").textContent = "Score: 0";
    clearInterval(timerInterval);
    startTimer(); // Start the timer for the new game
}

// Start the game timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, "0");
        const seconds = String(timeElapsed % 60).padStart(2, "0");
        document.getElementById("timer").textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Update the score dynamically
function updateScore() {
    // Score formula: Higher score for fewer moves and faster completion
    score = Math.max(1000 - moves * 10 - timeElapsed * 5, 0);
    document.getElementById("score").textContent = `Score: ${score}`;
}

// Handle New Game button and difficulty levels
document.getElementById("new-game").addEventListener("click", () => {
    const difficulty = prompt("Choose difficulty: Easy (4x4), Medium (6x6), Hard (8x8)").toLowerCase();

    let gridSize;
    switch (difficulty) {
        case "easy":
            gridSize = 4;
            break;
        case "medium":
            gridSize = 6;
            break;
        case "hard":
            gridSize = 8;
            break;
        default:
            alert("Invalid input! Defaulting to Easy (4x4).");
            gridSize = 4;
    }

    initializeGame(gridSize);
});

// Start the game with default settings
initializeGame();
