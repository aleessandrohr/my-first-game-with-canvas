import { getDevice } from "./device.js";
import { createDirectionalListener } from "./directionalListener";
import { createKeyboardListener } from "./keyboardListener.js";
import { createObservers } from "./observers.js";

export const createCommandListener = () => {
	const {
		subscribe,
		unsubscribe,
		unsubscribeAll,
		notifyAll,
	} = createObservers();

	const createListener = () => {
		const { Mobile } = getDevice();

		if (Mobile) {
			const { registerPlayerId } = createDirectionalListener(notifyAll);

			return { registerPlayerId };
		} else {
			const { registerPlayerId } = createKeyboardListener(notifyAll);

			return { registerPlayerId };
		}
	};

	const { registerPlayerId } = createListener();

	return {
		registerPlayerId,
		subscribe,
		unsubscribe,
		unsubscribeAll,
	};
};
