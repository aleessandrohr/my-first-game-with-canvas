import { createObservers } from "./observers.js";

export const createKeyboardListener = () => {
	let playerId: string | null = null;

	const registerPlayerId = (id: string) => {
		playerId = id;
	};

	const unregisterPlayerId = () => {
		playerId = null;
	};

	const {
		subscribe,
		unsubscribe,
		unsubscribeAll,
		notifyAll,
	} = createObservers();

	const handleKeydown = (event: KeyboardEvent) => {
		const keyPressed = event.key;

		const command = {
			type: "key-pressed",
			playerId,
			key: keyPressed,
		};

		notifyAll(command);
	};

	document.addEventListener("keydown", handleKeydown);

	return {
		registerPlayerId,
		unregisterPlayerId,
		subscribe,
		unsubscribe,
		unsubscribeAll,
	};
};
