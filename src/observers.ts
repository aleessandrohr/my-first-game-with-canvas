import { Observer } from "@/types/types/Observer";
import { Observers } from "@/types/types/Observers";

export const createObservers = () => {
	const observers = [] as Observers;

	const subscribe = (observerFunction: Observer) => {
		observers.push(observerFunction);
	};

	const unsubscribe = (observerFunction: Observer) => {
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
