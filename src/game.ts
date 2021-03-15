import { createObservers } from "@/observers.js";
import { AcceptedCommands } from "@/types/interfaces/AcceptedCommands";
import { AddObject } from "@/types/interfaces/AddObject";
import { Canvas } from "@/types/interfaces/Canvas";
import { HandleCommands } from "@/types/interfaces/HandleCommands";
import { IObject } from "@/types/interfaces/Object";
import { PlaySound } from "@/types/interfaces/PlaySound";
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
		},
		colors: {
			currentPlayer: "#f0db4f",
			players: "black",
			fruits: "green",
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

	const addObjet = ({ key, id, x, y }: AddObject) => {
		const positionX =
			x || x === 0 ? x : Math.floor(Math.random() * canvas.screen.width);
		const positionY =
			y || y === 0 ? y : Math.floor(Math.random() * canvas.screen.height);

		notifyAll({
			type: "add-object",
			key,
			id,
			x: positionX,
			y: positionY,
		});

		state[key][id] = {
			x: positionX,
			y: positionY,
		};
	};

	const removeObject = ({ key, id }: RemoveObject) => {
		notifyAll({
			type: "remove-object",
			key,
			id,
		});

		delete state[key][id];
	};

	const playSound = ({ id }: PlaySound) => {
		const sound = document.getElementById(id) as HTMLAudioElement;
		sound.pause();
		sound.currentTime = 0;
		sound.play();
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

	const handleCommands = ({ type, playerId, key }: HandleCommands) => {
		notifyAll({ type, playerId, key });

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

	const start = (frequency?: number, fruitNumbers?: number) => {
		const currentFrequency = frequency ? frequency : 5000;
		const currentFruitNumbers = fruitNumbers ? fruitNumbers : 15;

		setInterval(() => {
			const fruitId = Math.floor(Math.random() * currentFruitNumbers);

			addObjet({ key: "fruits", id: fruitId });
		}, currentFrequency);
	};

	return {
		canvas,
		state,
		setState,
		subscribe,
		unsubscribe,
		addObjet,
		removeObject,
		playSound,
		handleCommands,
		start,
	};
};
