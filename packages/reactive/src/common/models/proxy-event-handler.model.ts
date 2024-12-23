import { ProxyEvent } from "main";
import { ProxyEventHandlersImplementation } from "../interfaces/object.interface";
import { ProxyEventObservablesModel } from "./proxy-event-observables.model";

export class ProxyEventHandlersModel
	extends ProxyEventObservablesModel
	implements ProxyEventHandlersImplementation
{
	public contextmenu!: (e: MouseEvent & ProxyEvent) => void;
	public resize!: (e: UIEvent & ProxyEvent) => void;
	public mousedown!: (e: PointerEvent & ProxyEvent) => void;
	public mousemove!: (e: PointerEvent & ProxyEvent) => void;
	public mouseup!: (e: PointerEvent & ProxyEvent) => void;
	public pointerdown!: (e: PointerEvent & ProxyEvent) => void;
	public pointermove!: (e: PointerEvent & ProxyEvent) => void;
	public pointercancel!: (e: PointerEvent & ProxyEvent) => void;
	public pointerup!: (e: PointerEvent & ProxyEvent) => void;
	public touchstart!: (e: TouchEvent & ProxyEvent) => void;
	public touchmove!: (e: TouchEvent & ProxyEvent) => void;
	public touchend!: (e: TouchEvent & ProxyEvent) => void;
	public wheel!: (e: WheelEvent & ProxyEvent) => void;
	public keydown!: (e: KeyboardEvent & ProxyEvent) => void;
}
