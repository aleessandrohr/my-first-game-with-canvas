import { createObservers } from "@/observers.js";
import { AcceptedCommands } from "@/types/interfaces/AcceptedCommands";
import { AddObject } from "@/types/interfaces/AddObject";
import { Canvas } from "@/types/interfaces/Canvas";
import { HandleCommands } from "@/types/interfaces/HandleCommands";
import { IObject } from "@/types/interfaces/Object";
import { RemoveObject } from "@/types/interfaces/RemoveObject";
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

	const removeObject = ({ key, id }: RemoveObject) => {
		notifyAll({
			type: "remove-object",
			key,
			id,
		});

		delete state[key][id];
	};

	const checkAllPlayersForFruitCollision = () => {
		for (const playerId in state.players) {
			const player = state.players[playerId];

			for (const fruitId in state.fruits) {
				const fruit = state.fruits[fruitId];

				if (player.x === fruit.x && player.y === fruit.y) {
					notifyAll({ type: "sound", id: "collect" });
					removeObject({ key: "fruits", id: fruitId });
				}
			}
		}
	};

	const checkForFruitCollision = (player: IObject) => {
		for (const fruitId in state.fruits) {
			const fruit = state.fruits[fruitId];

			if (player.x === fruit.x && player.y === fruit.y) {
				notifyAll({ type: "sound", id: "collect" });
				removeObject({ key: "fruits", id: fruitId });
			}
		}
	};

	const addObjet = ({
		key,
		id,
		x = Math.floor(Math.random() * canvas.screen.width),
		y = Math.floor(Math.random() * canvas.screen.height),
	}: AddObject) => {
		notifyAll({
			type: "add-object",
			key,
			id,
			x,
			y,
		});

		state[key][id] = {
			x,
			y,
		};

		switch (key) {
			case "players":
				const player = state.players[id];
				checkForFruitCollision(player);
				break;
			case "fruits":
				checkAllPlayersForFruitCollision();
				break;
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

	const handleCommands = ({ playerId, key }: HandleCommands) => {
		notifyAll({ type: "command", playerId, key });

		const player = state.players[playerId];

		if (player) {
			const command = key.toLowerCase();
			const commandFunction = acceptedCommands[command];

			if (commandFunction) {
				commandFunction(player);
				checkForFruitCollision(player);
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

			addObjet({ key: "fruits", id: fruitId });
		}, frequency);
	};

	return {
		canvas,
		state,
		setState,
		subscribe,
		unsubscribe,
		addObjet,
		removeObject,
		handleCommands,
		playSound,
		start,
	};
};
