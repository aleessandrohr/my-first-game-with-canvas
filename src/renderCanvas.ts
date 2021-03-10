import { RenderCanvas } from "./types/interfaces/RenderCanvas";

export const renderCanvas = ({
	context,
	canvas,
	state,
	currentPlayerId,
}: RenderCanvas) => {
	context.clearRect(0, 0, canvas.screen.width, canvas.screen.height);

	for (const playerId in state.players) {
		const player = state.players[playerId];

		if (playerId === currentPlayerId) {
			context.fillStyle = canvas.colors.currentPlayer;
		} else {
			context.fillStyle = canvas.colors.players;
		}

		context.fillRect(player.x, player.y, canvas.size.width, canvas.size.height);
	}

	for (const fruitId in state.fruits) {
		const fruit = state.fruits[fruitId];

		context.fillStyle = canvas.colors.fruits;
		context.fillRect(fruit.x, fruit.y, canvas.size.width, canvas.size.height);
	}

	requestAnimationFrame(() => {
		renderCanvas({ canvas, context, state, currentPlayerId });
	});
};
