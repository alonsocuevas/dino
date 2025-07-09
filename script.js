const dino = document.getElementById('dino');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');

let isJumping = false;
let jumpHeight = 0;
let gravity = -0.6;
let velocity = 12;
let obstacles = [];
let score = 0;
let gameOver = false;
let obstacleSpeed = 6;

// Dino jump logic
function jump() {
  if (isJumping) return;
  isJumping = true;
  velocity = 13;
}

// Listen for jump key
document.addEventListener('keydown', e => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && !gameOver) {
    jump();
  }
  if (e.code === 'Enter' && gameOver) {
    resetGame();
  }
});

// Create obstacles at intervals
function createObstacle() {
  if (gameOver) return;
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = game.offsetWidth + 'px';
  game.appendChild(obstacle);
  obstacles.push(obstacle);

  // Next obstacle between 1.2 and 2.5 seconds
  const nextTime = Math.random() * 1300 + 1200;
  setTimeout(createObstacle, nextTime);
}

// Check collision between dino and obstacle
function checkCollision(obstacle) {
  const dinoRect = dino.getBoundingClientRect();
  const obsRect = obstacle.getBoundingClientRect();

  const buffer = 25;

  return !(
    dinoRect.top > obsRect.bottom - buffer ||
    dinoRect.bottom < obsRect.top + buffer ||
    dinoRect.right < obsRect.left + buffer ||
    dinoRect.left > obsRect.right - buffer
  );
}

// Update game frame
function update() {
  if (gameOver) return;

  // Update dino position
  velocity += gravity;
  jumpHeight += velocity;
  if (jumpHeight < 0) {
    jumpHeight = 0;
    isJumping = false;
  }
  dino.style.bottom = 0 + jumpHeight + 'px';

  // Move obstacles and check collisions
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    const currentLeft = parseFloat(obs.style.left);
    if (currentLeft < -20) {
      obs.remove();
      obstacles.splice(i, 1);
      score++;
      scoreDisplay.textContent = 'Puntuación: ' + score;
    } else {
      obs.style.left = (currentLeft - obstacleSpeed) + 'px';
      if (checkCollision(obs)) {
        endGame();
      }
    }
  }

  requestAnimationFrame(update);
}

function increaseDifficulty() {
  if (gameOver) return;

  obstacleSpeed += 0.2; // aumenta la velocidad gradualmente
  setTimeout(increaseDifficulty, 5000); // cada 5 segundos
}

// End game logic
function endGame() {
  gameOver = true;
  scoreDisplay.textContent += ' — ¡Fin del juego! Presiona ENTER para reiniciar.';
}

// Reset game
function resetGame() {
  obstacles.forEach(obs => obs.remove());
  obstacles = [];
  score = 0;
  scoreDisplay.textContent = 'Puntuación: 0';
  jumpHeight = 0;
  velocity = 0;
  isJumping = false;
  gameOver = false;
  dino.style.bottom = '40px';
  createObstacle();
  update();
}

// Start the game
createObstacle();
update();
increaseDifficulty();