import { RenderCanvas } from "@/types/interfaces/RenderCanvas";

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
			context.fillStyle = canvas.objects.colors.currentPlayer;
		} else {
			context.fillStyle = canvas.objects.colors.players;
		}
		context.fillRect(
			player.x,
			player.y,
			canvas.objects.size.width,
			canvas.objects.size.height,
		);
	}

	for (const fruitId in state.fruits) {
		const fruit = state.fruits[fruitId];

		context.fillStyle = canvas.objects.colors.fruits;
		context.fillRect(
			fruit.x,
			fruit.y,
			canvas.objects.size.width,
			canvas.objects.size.height,
		);
	}

	requestAnimationFrame(() => {
		renderCanvas({ canvas, context, state, currentPlayerId });
	});
};
