import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createGame } from "./game.js";
import { Command } from "./types/interfaces/Command";
import { HandleCommands } from "./types/interfaces/HandleCommands.js";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use("/", express.static(__dirname + "/../public"));
app.use("/dist", express.static(__dirname + "/../dist"));

const game = createGame();

game.start();

game.subscribe((command: Command) => {
	sockets.emit(command.type, command);
});

sockets.on("connection", (socket: Socket) => {
	const playerId = socket.id;

	game.addObjet({
		key: "players",
		id: playerId,
	});

	const state = game.state;

	socket.emit("init", state);

	socket.on("key-pressed", (command: HandleCommands) => {
		command.type = "key-pressed";
		command.playerId = playerId;

		game.handleCommands(command);
	});

	socket.on("disconnect", () => {
		game.removeObject({ key: "players", id: playerId });
	});
});

server.listen(process.env.PORT || 3000, () => {
	console.log("Server running.");
});
