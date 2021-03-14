export interface Canvas {
	screen: {
		width: number;
		height: number;
	};
	objects: {
		size: {
			width: number;
			height: number;
		};
	};
	colors: {
		currentPlayer: string;
		players: string;
		fruits: string;
	};
}
