import { IObject } from "./Object";

export interface AcceptedCommands {
	[key: string]: (player: IObject) => void;
}
