export const createKeyboardListener = (notifyAll: (command: any) => void) => {
	let playerId: string | null = null;

	const registerPlayerId = (id: string) => {
		playerId = id;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		const keyPressed = event.key;

		const command = {
			type: "command",
			playerId,
			key: keyPressed,
		};

		notifyAll(command);
	};

	document.addEventListener("keydown", handleKeydown);

	return { registerPlayerId };
};
