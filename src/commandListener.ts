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

	let registerPlayer: (id: string) => void;

	const { Mobile } = getDevice();

	if (Mobile) {
		const { registerPlayerId } = createDirectionalListener(notifyAll);
		registerPlayer = registerPlayerId;
	} else {
		const { registerPlayerId } = createKeyboardListener(notifyAll);
		registerPlayer = registerPlayerId;
	}

	return {
		registerPlayer,
		subscribe,
		unsubscribe,
		unsubscribeAll,
	};
};
