import { elements } from '../views/base';

const row_list = [ 7, 9, 12, 16 ];
const cols_list = [ 7, 9, 12, 16 ];
let ROWS, COLS;

const removeRows = () => {
	while (elements.board.childNodes.length) {
		if (elements.board.childNodes) elements.board.removeChild(elements.board.childNodes[0]);
	}
};

const resetTime = () => {
	elements.time.innerText = '0';
};

const getTile = (row, col) => {
	for (let i = 0; i < elements.board.childNodes.length; i++) {
		for (let j = 0; j < elements.board.childNodes[i].childNodes.length; j++) {
			if (
				elements.board.childNodes[i].childNodes[j].getAttribute('data-rows') === row.toString() &&
				elements.board.childNodes[i].childNodes[j].getAttribute('data-cols') === col.toString()
			)
				return elements.board.childNodes[i].childNodes[j];
		}
	}
};

const getMineCount = (i, j) => {
	let count = 0;
	for (let di = -1; di <= 1; di++) {
		for (let dj = -1; dj <= 1; dj++) {
			const ni = +i + +di;
			const nj = +j + +dj;
			if (ni >= ROWS || nj >= COLS || ni < 0 || nj < 0) continue;
			const cell = getTile(ni, nj);
			if (cell.classList.contains('mine')) count++;
		}
	}
	return count;
};

export const createBoard = (difficulty) => {
	const rows = row_list[difficulty];
	const cols = cols_list[difficulty];
	ROWS = COLS = rows;
	for (let i = 0; i < rows; i++) {
		const row = document.createElement('div');
		row.classList.add('row');
		for (let j = 0; j < cols; j++) {
			const col = document.createElement('div');
			col.classList.add('col');
			col.classList.add('hidden');
			col.setAttribute('data-rows', i);
			col.setAttribute('data-cols', j);
			if (Math.random() < 0.015 * rows) {
				col.classList.add('mine');
			}
			row.insertAdjacentElement('beforeend', col);
		}
		elements.board.insertAdjacentElement('beforeend', row);
	}
};

export const reset = () => {
	removeRows();
	resetTime();
};

export const revealTiles = (row, col) => {
	const seen = {};

	function helper (i, j) {
		if (i >= ROWS || j >= COLS || i < 0 || j < 0) return;
		const key = `${i} ${j}`;
		if (seen[key]) return;
		const cell = getTile(i, j);
		const mineCount = getMineCount(i, j);
		if (!cell.classList.contains('hidden') || cell.classList.contains('mine')) return;

		cell.classList.remove('hidden');
		if (mineCount) {
			cell.innerText = mineCount;
			return;
		}

		for (let di = -1; di <= 1; di++) {
			for (let dj = -1; dj <= 1; dj++) {
				helper(+i + +di, +j + +dj);
			}
		}
	}

	helper(row, col);
};

export const revealBoard = (icon, isWin) => {
	const mines = document.querySelectorAll('.col.mine');
	const notMines = document.querySelectorAll('.col:not(.mine)');
	const hidden = document.querySelectorAll('.col.hidden');
	mines.forEach((e) => {
		e.innerText = icon;
	});
	notMines.forEach((e) => {
		const row = e.getAttribute('data-rows');
		const col = e.getAttribute('data-cols');
		e.innerText = getMineCount(row, col) === 0 ? '' : getMineCount(row, col);
	});
	hidden.forEach((e) => {
		e.classList.remove('hidden');
	});
	if (isWin) {
		mines.forEach((e) => {
			if (!e.classList.contains('won')) e.classList.add('won');
			if (e.classList.contains('mine')) e.classList.remove('mine');
		});
	} else {
		mines.forEach((e) => {
			if (!e.classList.contains('lost')) e.classList.add('lost');
		});
	}
};
