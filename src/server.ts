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
const port = process.env.PORT || 3000;
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

	socket.emit("init", game.state);

	socket.on("command", (command: HandleCommands) => {
		command.type = "command";
		command.playerId = playerId;

		game.handleCommands(command);
	});

	socket.on("disconnect", () => {
		game.removeObject({ key: "players", id: playerId });
	});
});

server.listen(port, () => {
	console.log(`Server running on port ${port}.`);
});
