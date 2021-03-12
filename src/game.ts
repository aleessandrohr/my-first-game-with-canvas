import { createObservers } from "./observers.js";
import { Canvas } from "./types/interfaces/Canvas";
import { State } from "./types/interfaces/State";
import { AddObject } from "./types/interfaces/AddObject";
import { RemoveObject } from "./types/interfaces/RemoveObject";
import { HandleCommands } from "./types/interfaces/HandleCommands";
import { AcceptedCommands } from "./types/interfaces/AcceptedCommands";
import { Player } from "./types/interfaces/Player";

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

	const start = (frequency?: number, fruitNumbers?: number) => {
		const currentFrequency = frequency ? frequency : 5000;
		const currentFruitNumbers = fruitNumbers ? fruitNumbers : 10;

		setInterval(() => {
			const fruitId = Math.floor(Math.random() * currentFruitNumbers);

			addObjet({ key: "fruits", id: fruitId });
		}, currentFrequency);
	};

	const { subscribe, unsubscribe, notifyAll } = createObservers();

	const addObjet = ({ key, id, x, y }: AddObject) => {
		const positionX =
			x || x === 0 ? x : Math.floor(Math.random() * canvas.screen.width);
		const positionY =
			y || y === 0 ? y : Math.floor(Math.random() * canvas.screen.height);

		state[key][id] = {
			x: positionX,
			y: positionY,
		};

		notifyAll({
			type: "add-object",
			key,
			id,
			x: positionX,
			y: positionY,
		});
	};

	const removeObject = ({ key, id }: RemoveObject) => {
		delete state[key][id];

		notifyAll({
			type: "remove-object",
			key,
			id,
		});
	};

	const handleCommands = ({ type, playerId, key }: HandleCommands) => {
		const player = state.players[playerId];

		if (player) {
			const command = key.toLowerCase();
			const commandFunction = acceptedCommands[command];

			if (commandFunction) {
				commandFunction(player);
				checkForFruitCollision(player);
				notifyAll({ type, playerId, key });
			}
		}
	};

	const acceptedCommands: AcceptedCommands = {
		w: player => {
			const positionY = (player.y -= 1);

			if (positionY === -1) {
				const height = canvas.screen.height;
				player.y = height - 1;
			} else {
				player.y = positionY;
			}
		},
		s: player => {
			const positionY = (player.y += 1);
			const height = canvas.screen.height;

			if (positionY === height) {
				player.y = 0;
			} else {
				player.y = positionY;
			}
		},
		a: player => {
			const positionX = (player.x -= 1);

			if (positionX === -1) {
				const width = canvas.screen.width;
				player.x = width - 1;
			} else {
				player.x = positionX;
			}
		},
		d: player => {
			const positionX = (player.x += 1);
			const width = canvas.screen.height;

			if (positionX === width) {
				player.x = 0;
			} else {
				player.x = positionX;
			}
		},
	};

	const checkForFruitCollision = (player: Player) => {
		for (const fruitId in state.fruits) {
			const fruit = state.fruits[fruitId];

			if (player.x === fruit.x && player.y === fruit.y) {
				removeObject({ key: "fruits", id: fruitId });
			}
		}
	};

	return {
		canvas,
		state,
		setState,
		start,
		subscribe,
		unsubscribe,
		addObjet,
		removeObject,
		handleCommands,
	};
};
