import { io } from "socket.io-client";
import { createGame } from "./game.js";
import { createKeyboardListener } from "./keyboardListener.js";
import { renderCanvas } from "./renderCanvas.js";
import { State } from "./types/interfaces/State";
import { Command } from "./types/interfaces/Command.js";
import { AddObject } from "./types/interfaces/AddObject.js";
import { RemoveObject } from "./types/interfaces/RemoveObject.js";
import { HandleCommands } from "./types/interfaces/HandleCommands.js";

const socket = io();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

const game = createGame();

const keyboardListener = createKeyboardListener();

socket.on("connect", () => {
	const canvas = game.canvas;
	const state = game.state;
	const playerId = socket.id;

	renderCanvas({
		context,
		canvas,
		state,
		currentPlayerId: playerId,
	});
});

socket.on("disconnect", () => {
	keyboardListener.unregisterPlayerId();
	keyboardListener.unsubscribeAll();
});

socket.on("init", (state: State) => {
	const playerId = socket.id;

	game.setState(state);

	keyboardListener.registerPlayerId(playerId);
	keyboardListener.subscribe(game.handleCommands);
	keyboardListener.subscribe((command: Command) => {
		socket.emit(command.type, command);
	});
});

socket.on("add-object", (command: AddObject) => {
	game.addObjet(command);
});

socket.on("remove-object", (command: RemoveObject) => {
	game.removeObject(command);
});

socket.on("key-pressed", (command: HandleCommands) => {
	const playerId = socket.id;

	if (playerId !== command.playerId) {
		game.handleCommands(command);
	}
});
