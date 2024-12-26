const gameArea = document.querySelector(".game-area");
const playerCar = document.querySelector(".player-car");
const scoreDisplay = document.createElement("div"); // Create score display
const startButton = document.createElement("button"); // Start button

let player = {
  x: 130,
  y: 400,
  speed: 2,
  movingRight: false,
  movingLeft: false,
  score: 0,
};

let enemyCars = [];
let gameOver = false;
let enemySpeed = 5;
let touchStartX = 0; // For touch event tracking

// Create score display
scoreDisplay.style.position = "absolute";
scoreDisplay.style.top = "10px";
scoreDisplay.style.left = "10px";
scoreDisplay.style.color = "white";
scoreDisplay.style.fontSize = "20px";
scoreDisplay.style.fontWeight = "bold";
scoreDisplay.textContent = `Score: ${player.score}`;
gameArea.appendChild(scoreDisplay);

// Create start button
startButton.id = "startButton";
startButton.textContent = "Start Game";
document.body.appendChild(startButton);

// Handle keydown and keyup events for keyboard controls (PC)
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") player.movingRight = true;
  if (event.key === "ArrowLeft") player.movingLeft = true;
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowRight") player.movingRight = false;
  if (event.key === "ArrowLeft") player.movingLeft = false;
});

// Handle touch events for mobile controls
gameArea.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
});

gameArea.addEventListener("touchmove", (event) => {
  const touchMoveX = event.touches[0].clientX;
  const touchDifference = touchMoveX - touchStartX;

  // Move the car based on swipe direction
  if (touchDifference > 5 && player.x < 260) {
    player.x += player.speed;
  } else if (touchDifference < -5 && player.x > 0) {
    player.x -= player.speed;
  }

  playerCar.style.left = `${player.x}px`;
});

// Update the player's position
function updatePlayerPosition() {
  if (player.movingRight && player.x < 260) {
    player.x += player.speed;
  }
  if (player.movingLeft && player.x > 0) {
    player.x -= player.speed;
  }
  playerCar.style.left = `${player.x}px`;
}

// Create enemy cars with random colors
function createEnemies(count) {
  const colors = ["blue", "green", "yellow", "pink", "aquamarine"];

  for (let i = 0; i < count; i++) {
    const enemyCar = document.createElement("div");
    enemyCar.classList.add("enemy-car");
    enemyCar.style.left = `${Math.random() * 260}px`;
    enemyCar.style.top = `${-200 * i}px`; // Stagger enemy cars
    enemyCar.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    gameArea.appendChild(enemyCar);
    enemyCars.push(enemyCar);
  }
}

// Move enemy cars and adjust speed based on score
function moveEnemyCars() {
  enemyCars.forEach((enemy, index) => {
    let enemyTop = parseInt(enemy.style.top);
    if (enemyTop > 500) {
      // Reset enemy position and increment score
      enemy.style.top = "-100px";
      enemy.style.left = `${Math.random() * 260}px`;
      enemy.style.backgroundColor = [
        "blue",
        "green",
        "yellow",
        "pink",
        "aquamarine",
      ][Math.floor(Math.random() * 5)]; // Change color
      player.score += 2; // Add points for passing the car
      scoreDisplay.textContent = `Score: ${player.score}`;

      // Increase enemy speed as score increases
      if (player.score % 10 === 0) enemySpeed += 0.5;
    } else {
      enemy.style.top = `${enemyTop + enemySpeed}px`; // Move enemy down
    }

    // Check for collision
    if (checkCollision(playerCar, enemy)) {
      endGame();
    }
  });
}

// Check for collision between two elements
function checkCollision(car1, car2) {
  const rect1 = car1.getBoundingClientRect();
  const rect2 = car2.getBoundingClientRect();
  return !(
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  );
}

// End the game
function endGame() {
  gameOver = true;
  alert(`Game Over! Your final score is ${player.score}`);
  location.reload(); // Refresh the page after "OK" on the alert
}

// Game loop for smooth movement
function gameLoop() {
  if (!gameOver) {
    updatePlayerPosition();
    moveEnemyCars();
    requestAnimationFrame(gameLoop);
  }
}

// Start the game
function startGame() {
  // Hide the start button
  startButton.style.display = "none"; // Correctly hides the start button

  // Initialize the game
  createEnemies(3); // Adjust the number of enemy cars here
  gameLoop();
}

// Set the start button click event
startButton.addEventListener("click", startGame);
