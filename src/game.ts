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
			width: 10,
			height: 10,
		},
		size: {
			width: 1,
			height: 1,
		},
		colors: {
			players: "black",
			currentPlayer: "#f0db4f",
			fruits: "green",
		},
	};

	const state: State = {
		players: {},
		fruits: {},
	};

	const start = () => {
		const frequency = 5000;

		setInterval(() => {
			const id = String(Math.floor(Math.random() * 5));

			addObjet({ key: "fruits", id });
		}, frequency);
	};

	const { subscribe, unsubscribe, notifyAll } = createObservers();

	const setState = (newState: State) => {
		Object.assign(state, newState);
	};

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
			const keyPressed = key.toLowerCase();
			const commandFunction = acceptedCommands[keyPressed];

			if (commandFunction) {
				commandFunction(player);
				checkForFruitCollision(player);
				notifyAll({ type, playerId, key });
			}
		}
	};

	const acceptedCommands: AcceptedCommands = {
		w: player => {
			player.y = Math.max(player.y - 1, 0);
		},
		s: player => {
			const height = canvas.screen.width;
			player.y = Math.min(player.y + 1, height - 1);
		},
		a: player => {
			player.x = Math.max(player.x - 1, 0);
		},
		d: player => {
			const width = canvas.screen.height;
			player.x = Math.min(player.x + 1, width - 1);
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
		start,
		subscribe,
		unsubscribe,
		setState,
		addObjet,
		removeObject,
		handleCommands,
	};
};
