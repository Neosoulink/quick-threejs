import { ProxyEventHandlersImplementation } from "../types/object.type";
import { ProxyEventObservablesModel } from "./proxy-event-observables.model";

export class ProxyEventHandlersModel
	extends ProxyEventObservablesModel
	implements ProxyEventHandlersImplementation
{
	public contextmenu!: (event: Event) => void;
	public resize!: (event: Event) => void;
	public mousedown!: (event: Event) => void;
	public mousemove!: (event: Event) => void;
	public mouseup!: (event: Event) => void;
	public pointerdown!: (event: Event) => void;
	public pointermove!: (event: Event) => void;
	public pointercancel!: (event: Event) => void;
	public pointerup!: (event: Event) => void;
	public touchstart!: (event: Event) => void;
	public touchmove!: (event: Event) => void;
	public touchend!: (event: Event) => void;
	public wheel!: (event: Event) => void;
	public keydown!: (event: Event) => void;
}
