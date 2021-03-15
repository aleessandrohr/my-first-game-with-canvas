import { io } from "socket.io-client";

import { createCommandListener } from "@/commandListener.js";
import { createGame } from "@/game.js";
import { renderCanvas } from "@/renderCanvas.js";
import { AddObject } from "@/types/interfaces/AddObject.js";
import { Command } from "@/types/interfaces/Command.js";
import { HandleCommands } from "@/types/interfaces/HandleCommands.js";
import { PlaySound } from "@/types/interfaces/PlaySound";
import { RemoveObject } from "@/types/interfaces/RemoveObject.js";
import { State } from "@/types/interfaces/State";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

const game = createGame();

const commandListener = createCommandListener();

const socket = io();

socket.on("connect", () => {
	const playerId = socket.id;

	if (context) {
		renderCanvas({
			context,
			canvas: game.canvas,
			state: game.state,
			currentPlayerId: playerId,
		});
	}
});

socket.on("disconnect", () => {
	commandListener.unsubscribeAll();
});

socket.on("init", (state: State) => {
	const playerId = socket.id;

	game.setState(state);

	commandListener.registerPlayerId(playerId);
	commandListener.subscribe(game.handleCommands);
	commandListener.subscribe((command: Command) => {
		socket.emit(command.type, command);
	});
});

socket.on("add-object", (command: AddObject) => {
	game.addObjet(command);
});

socket.on("remove-object", (command: RemoveObject) => {
	game.removeObject(command);
});

socket.on("command", (command: HandleCommands) => {
	const playerId = socket.id;

	if (playerId !== command.playerId) {
		game.handleCommands(command);
	}
});

socket.on("sound", (command: PlaySound) => {
	const id = command.id;

	game.playSound(id);
});
