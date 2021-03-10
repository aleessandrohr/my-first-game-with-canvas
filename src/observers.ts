export const createObservers = () => {
	const observers = [] as Array<(command: any) => void>;

	const subscribe = (observerFunction: (command: any) => void) => {
		observers.push(observerFunction);
	};

	const unsubscribe = (observerFunction: (command: any) => void) => {
		observers.splice(observers.indexOf(observerFunction), 1);
	};

	const unsubscribeAll = () => {
		observers.splice(0, observers.length);
	};

	const notifyAll = (command: any) => {
		for (const observerFunction of observers) {
			observerFunction(command);
		}
	};

	return {
		subscribe,
		unsubscribe,
		unsubscribeAll,
		notifyAll,
	};
};
