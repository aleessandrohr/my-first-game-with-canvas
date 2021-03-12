export const createDirectionalListener = (
	notifyAll: (command: any) => void,
) => {
	let playerId: string | null = null;

	const registerPlayerId = (id: string) => {
		playerId = id;
	};

	const directional = document.getElementById("directional");

	if (directional) {
		directional.style.display = "flex";
	}

	const handleDirectional = (directionalPressed: string) => {
		const command = {
			type: "command",
			playerId,
			key: directionalPressed,
		};

		notifyAll(command);
	};

	const directionalUp = document.getElementById("directional-up");
	const directionalDown = document.getElementById("directional-down");
	const directionalLeft = document.getElementById("directional-left");
	const directionalRight = document.getElementById("directional-right");

	directionalUp?.addEventListener("click", () => {
		handleDirectional("w");
	});

	directionalDown?.addEventListener("click", () => {
		handleDirectional("s");
	});

	directionalLeft?.addEventListener("click", () => {
		handleDirectional("a");
	});

	directionalRight?.addEventListener("click", () => {
		handleDirectional("d");
	});

	return {
		registerPlayerId,
	};
};
