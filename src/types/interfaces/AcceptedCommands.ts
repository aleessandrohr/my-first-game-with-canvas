import { Player } from "./Player";

export interface AcceptedCommands {
	[key: string]: (player: Player) => void;
}
