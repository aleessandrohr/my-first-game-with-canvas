import { Canvas } from "./Canvas";
import { State } from "./State";

export interface RenderCanvas {
	context: CanvasRenderingContext2D;
	canvas: Canvas;
	state: State;
	currentPlayerId: string;
}
