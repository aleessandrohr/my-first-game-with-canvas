export type State = {
	[key in "players" | "fruits"]: {
		[key: string]: {
			x: number;
			y: number;
		};
	};
};
