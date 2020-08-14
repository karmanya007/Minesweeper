import * as Board from './models/Board';
import { elements } from './views/base';

// Local variables
let difficulty = 0;
let win = false;
let timer;
let sec = 0;
const audio = new Audio('./../sounds/click.mp3');

// Board Controller
// 16 12 9 7
Board.createBoard(difficulty);

const gameOver = (isWin) => {
	let message;
	let icon = null;
	if (isWin) {
		message = 'You Won';
		icon = '🏁';
	} else {
		message = 'You Lost';
		icon = '💣';
	}
	Board.revealBoard(icon, isWin);
	elements.html.classList.add('darkenPage');
	setTimeout(() => {
		alert(message + ` with a time of ${sec} seconds`);
		resetGame();
	}, 1000);
};

const playAudio = () => {
	audio.currentTime = 0;
	audio.play();
};

// Event listners
elements.difficulty.addEventListener('change', changeDifficulty);
elements.newGame.addEventListener('click', resetGame);
elements.board.addEventListener('click', (e) => {
	if (e.target.classList.contains('col')) {
		playAudio();
		const row = e.target.dataset.rows;
		const col = e.target.dataset.cols;
		if (e.target.classList.contains('mine')) {
			gameOver(false);
			stopTime();
		} else {
			if (!win && !timer) {
				startTime();
				win = true;
			}
			Board.revealTiles(row, col);
			const isGameOver =
				document.querySelectorAll('.col.hidden').length === document.querySelectorAll('.col.mine').length;
			if (isGameOver) {
				gameOver(true);
				stopTime();
			}
		}
	}
});

function startTime () {
	timer = setInterval(controlTime, 1000);
}
function stopTime () {
	clearInterval(timer);
}
function controlTime () {
	sec++;
	elements.time.innerText = sec;
}

function changeDifficulty (e) {
	difficulty = e.target.options.selectedIndex;
}

function resetGame () {
	Board.reset();
	Board.createBoard(difficulty);
	stopTime();
	elements.html.classList.remove('darkenPage');
	win = false;
	timer = null;
	sec = 0;
}
