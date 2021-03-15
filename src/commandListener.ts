import { getDevice } from "@/device.js";
import { createDirectionalListener } from "@/directionalListener";
import { createKeyboardListener } from "@/keyboardListener.js";
import { createObservers } from "@/observers.js";

export const createCommandListener = () => {
	const {
		subscribe,
		unsubscribe,
		unsubscribeAll,
		notifyAll,
	} = createObservers();

	let registerPlayerId: (id: string) => void;

	const { Mobile } = getDevice();

	if (Mobile) {
		const { registerPlayerId: registerPlayer } = createDirectionalListener(
			notifyAll,
		);
		registerPlayerId = registerPlayer;
	} else {
		const { registerPlayerId: registerPlayer } = createKeyboardListener(
			notifyAll,
		);
		registerPlayerId = registerPlayer;
	}

	return {
		registerPlayerId,
		subscribe,
		unsubscribe,
		unsubscribeAll,
	};
};
