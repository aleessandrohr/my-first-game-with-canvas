import { createObservers } from "@/observers.js";
import { AcceptedCommands } from "@/types/interfaces/AcceptedCommands";
import { AddObject } from "@/types/interfaces/AddObject";
import { Canvas } from "@/types/interfaces/Canvas";
import { HandleCommands } from "@/types/interfaces/HandleCommands";
import { State } from "@/types/interfaces/State";

export const createGame = () => {
	const canvas: Canvas = {
		screen: {
			width: 15,
			height: 15,
		},
		objects: {
			size: {
				width: 1,
				height: 1,
			},
			colors: {
				currentPlayer: "#f0db4f",
				players: "black",
				fruits: "green",
			},
		},
	};

	const state: State = {
		players: {},
		fruits: {},
	};

	const setState = (newState: State) => {
		Object.assign(state, newState);
	};

	const { subscribe, unsubscribe, notifyAll } = createObservers();

	const removePlayer = (id: string | number) => {
		notifyAll({ type: "remove-player", id });

		delete state.players[id];
	};

	const removeFruit = (id: string | number) => {
		notifyAll({ type: "remove-fruit", id });

		delete state.fruits[id];
	};

	const checkForPlayerCollision = (fruitId: string | number) => {
		const fruit = state.fruits[fruitId];

		for (const playerId in state.players) {
			const player = state.players[playerId];

			if (fruit.x === player.x && fruit.y === player.y) {
				notifyAll({ type: "sound", id: "collect" });
				removeFruit(fruitId);
			}
		}
	};

	const checkForFruitCollision = (playerId: string | number) => {
		const player = state.players[playerId];

		for (const fruitId in state.fruits) {
			const fruit = state.fruits[fruitId];

			if (player.x === fruit.x && player.y === fruit.y) {
				notifyAll({ type: "sound", id: "collect" });
				removeFruit(fruitId);
			}
		}
	};

	const addPlayer = ({
		id,
		x = Math.floor(Math.random() * canvas.screen.width),
		y = Math.floor(Math.random() * canvas.screen.height),
	}: AddObject) => {
		notifyAll({
			type: "add-player",
			id,
			x,
			y,
		});

		state.players[id] = {
			x,
			y,
		};

		checkForFruitCollision(id);
	};

	const addFruit = ({
		id,
		x = Math.floor(Math.random() * canvas.screen.width),
		y = Math.floor(Math.random() * canvas.screen.height),
	}: AddObject) => {
		notifyAll({
			type: "add-fruit",
			id,
			x,
			y,
		});

		state.fruits[id] = {
			x,
			y,
		};

		checkForPlayerCollision(id);
	};

	const acceptedCommands: AcceptedCommands = {
		w: player => {
			const y = (player.y -= 1);

			if (y === -1) {
				const height = canvas.screen.height;
				player.y = height - 1;
			} else {
				player.y = y;
			}
		},
		s: player => {
			const y = (player.y += 1);
			const height = canvas.screen.height;

			if (y === height) {
				player.y = 0;
			} else {
				player.y = y;
			}
		},
		a: player => {
			const x = (player.x -= 1);

			if (x === -1) {
				const width = canvas.screen.width;
				player.x = width - 1;
			} else {
				player.x = x;
			}
		},
		d: player => {
			const x = (player.x += 1);
			const width = canvas.screen.height;

			if (x === width) {
				player.x = 0;
			} else {
				player.x = x;
			}
		},
	};

	const handleCommands = ({ playerId, key }: HandleCommands) => {
		notifyAll({ type: "command", playerId, key });

		const player = state.players[playerId];

		if (player) {
			const command = key.toLowerCase();
			const commandFunction = acceptedCommands[command];

			if (commandFunction) {
				commandFunction(player);
				checkForFruitCollision(playerId);
			}
		}
	};

	const playSound = (id: string) => {
		const sound = document.getElementById(id) as HTMLAudioElement;
		sound.pause();
		sound.currentTime = 0;
		sound.play();
	};

	const start = (frequency = 5000, fruitNumbers = 30) => {
		setInterval(() => {
			const fruitId = Math.floor(Math.random() * fruitNumbers);

			addFruit({ id: fruitId });
		}, frequency);
	};

	return {
		canvas,
		state,
		setState,
		subscribe,
		unsubscribe,
		addPlayer,
		removePlayer,
		addFruit,
		removeFruit,
		handleCommands,
		playSound,
		start,
	};
};
