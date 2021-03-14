export const getDevice = () => {
	if ("ontouchstart" in window) {
		return { Mobile: true };
	} else {
		return { Desktop: true };
	}
};
