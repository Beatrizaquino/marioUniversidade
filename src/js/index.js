const score = document.querySelector('.score');
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const overlay = document.querySelector('.overlay');
const reset = document.querySelector('.reset');
const overlayScore = document.querySelector('.overlay-score');
const startGameInfo = document.querySelector('.start-game');

let countScore = 0;
let startGame = true;
let timerVerifyDead;
let timerScore;
let timerSpeed;
let pipeCleared = false;

startGameInfo.innerHTML =
  'Pressione qualquer tecla para iniciar <br/> O tempo é contabilizado a cada segundo';

reset.addEventListener('click', () => window.location.reload());

window.addEventListener('keypress', () => {
  if (startGame) {
    pipe.classList.add('pipeRun');
    startGameInfo.innerHTML = '';
    startGameInfo.style.background = 'transparent';
    startGame = false;

    let pipeSpeed = 1.5;
    timerScore = setInterval(() => {
      countScore++;
      score.innerHTML = `SCORE ${countScore}`;
    }, 1000);

    timerSpeed = setInterval(() => {
      pipeSpeed -= 0.1;
      if (pipeSpeed <= 0) {
        pipeSpeed = 0.6;
      }
      pipe.style.animationDuration = `${pipeSpeed}s`;
    }, 1000 * 10);

    timerVerifyDead = setInterval(() => {
      handleLogicForGameOver();
    }, 10);
  }

  mario.classList.add('jump');
  setTimeout(() => mario.classList.remove('jump'), 500);
});

// Alteração na lógica para manter o estado do cano
const handleLogicForGameOver = () => {
  const pipeLocalization = pipe.offsetLeft;
  const marioLocalization = +window.getComputedStyle(mario).bottom.replace('px', '');

  if (pipeLocalization <= 120 && pipeLocalization > 0 && marioLocalization < 80) {
    pipe.style.animation = '';
    pipe.style.left = `${pipeLocalization}px`;

    mario.src = './src/assets/game-over.png';
    mario.style.marginLeft = '50px';
    mario.style.bottom = `-200px`;
    mario.style.width = '80px';
    mario.classList.add('dead');

    overlayScore.innerHTML = `SCORE ${countScore}`;
    overlay.style.display = 'flex';

    clearInterval(timerScore);
    clearInterval(timerVerifyDead);
  } else if (pipeLocalization <= 0 && !pipeCleared) {
    pipeCleared = true;
    setTimeout(() => {
      pipeCleared = false;
    }, 1000);
    spawnCoins();
  }
};

// Função para verificar a colisão das moedas com o Mario
const handleCoinCollision = (coinElement) => {
  const coinLocalization = coinElement.offsetLeft;
  const marioLocalization = +window.getComputedStyle(mario).bottom.replace('px', '');

  if (coinLocalization <= 200 && coinLocalization > 0 && marioLocalization >= 80) {
    coinElement.remove();
    countScore += 10;
    score.innerHTML = `SCORE ${countScore}`;
  }
};

const spawnCoins = () => {
  const shouldSpawnTripleCoins = Math.random() > 0.5;
  const pipePosition = pipe.offsetLeft;
  const pipeWidth = pipe.offsetWidth;
  const screenWidth = window.innerWidth;

  if (shouldSpawnTripleCoins) {
    for (let i = 0; i < 3; i++) {
      const coin = document.createElement('img');
      coin.src = './src/assets/coin.png';
      coin.classList.add('coin');
      coin.style.bottom = `${getRandomBottomPosition()}px`;

      // Adicionar um valor aleatório positivo ou negativo à posição horizontal do cano
      const coinHorizontalOffset = Math.random() > 0.5 ? Math.floor(Math.random() * pipeWidth) : -Math.floor(Math.random() * pipeWidth);

      // Calcular a posição horizontal da moeda com base na posição do cano e no deslocamento aleatório
      const coinHorizontalPosition = pipePosition + coinHorizontalOffset;

      // Garantir que a moeda apareça apenas dentro dos limites da tela
      const maxHorizontalPosition = screenWidth - coin.offsetWidth;
      const minHorizontalPosition = 0;
      const finalHorizontalPosition = Math.max(minHorizontalPosition, Math.min(coinHorizontalPosition, maxHorizontalPosition));

      coin.style.left = `${finalHorizontalPosition}px`;
      document.querySelector('.container').appendChild(coin);
      coin.classList.add('coinRun');
      setInterval(() => handleCoinCollision(coin), 10);
    }
  } else {
    const coin = document.createElement('img');
    coin.src = './src/assets/coin.png';
    coin.classList.add('coin');
    coin.style.bottom = `${getRandomBottomPosition()}px`;

    // Adicionar um valor aleatório positivo ou negativo à posição horizontal do cano
    const coinHorizontalOffset = Math.random() > 0.5 ? Math.floor(Math.random() * pipeWidth) : -Math.floor(Math.random() * pipeWidth);

    // Calcular a posição horizontal da moeda com base na posição do cano e no deslocamento aleatório
    const coinHorizontalPosition = pipePosition + coinHorizontalOffset;

    // Garantir que a moeda apareça apenas dentro dos limites da tela
    const maxHorizontalPosition = screenWidth - coin.offsetWidth;
    const minHorizontalPosition = 0;
    const finalHorizontalPosition = Math.max(minHorizontalPosition, Math.min(coinHorizontalPosition, maxHorizontalPosition));

    coin.style.left = `${finalHorizontalPosition}px`;
    document.querySelector('.container').appendChild(coin);
    coin.classList.add('coinRun');
    setInterval(() => handleCoinCollision(coin), 10);
  }
};


const getRandomBottomPosition = () => {
  return Math.floor(Math.random() * (200 - 80 + 1)) + 80;
};
