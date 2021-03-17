export const createKeyboardListener = (notifyAll: (command: any) => void) => {
	let playerId: string;

	const registerPlayerId = (id: string) => {
		playerId = id;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		const keyPressed = event.key;

		notifyAll({ type: "command", playerId, key: keyPressed });
	};

	document.addEventListener("keydown", handleKeydown);

	return { registerPlayerId };
};
