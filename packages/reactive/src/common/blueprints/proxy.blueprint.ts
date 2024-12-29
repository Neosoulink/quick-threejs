import { Observable, Subject } from "rxjs";

import {
	ProxyEvent,
	ProxyEventHandlersImplementation,
	ProxyEventObservablesImplementation,
	ProxyEventSubjectsImplementation
} from "../interfaces/proxy-event.interface";

export class ProxyEventSubjectsBlueprint
	implements ProxyEventSubjectsImplementation
{
	contextmenu$$!: Subject<MouseEvent & ProxyEvent>;
	resize$$!: Subject<UIEvent & ProxyEvent>;
	mousedown$$!: Subject<PointerEvent & ProxyEvent>;
	mousemove$$!: Subject<PointerEvent & ProxyEvent>;
	mouseup$$!: Subject<PointerEvent & ProxyEvent>;
	pointerdown$$!: Subject<PointerEvent & ProxyEvent>;
	pointermove$$!: Subject<PointerEvent & ProxyEvent>;
	pointercancel$$!: Subject<PointerEvent & ProxyEvent>;
	pointerup$$!: Subject<PointerEvent & ProxyEvent>;
	touchstart$$!: Subject<TouchEvent & ProxyEvent>;
	touchmove$$!: Subject<TouchEvent & ProxyEvent>;
	touchend$$!: Subject<TouchEvent & ProxyEvent>;
	wheel$$!: Subject<WheelEvent & ProxyEvent>;
	keydown$$!: Subject<KeyboardEvent & ProxyEvent>;
}

export class ProxyEventObservablesBlueprint
	extends ProxyEventSubjectsBlueprint
	implements ProxyEventObservablesImplementation
{
	contextmenu$!: Observable<MouseEvent & ProxyEvent>;
	resize$!: Observable<UIEvent & ProxyEvent>;
	mousedown$!: Observable<PointerEvent & ProxyEvent>;
	mousemove$!: Observable<PointerEvent & ProxyEvent>;
	mouseup$!: Observable<PointerEvent & ProxyEvent>;
	pointerdown$!: Observable<PointerEvent & ProxyEvent>;
	pointermove$!: Observable<PointerEvent & ProxyEvent>;
	pointercancel$!: Observable<PointerEvent & ProxyEvent>;
	pointerup$!: Observable<PointerEvent & ProxyEvent>;
	touchstart$!: Observable<TouchEvent & ProxyEvent>;
	touchmove$!: Observable<TouchEvent & ProxyEvent>;
	touchend$!: Observable<TouchEvent & ProxyEvent>;
	wheel$!: Observable<WheelEvent & ProxyEvent>;
	keydown$!: Observable<KeyboardEvent & ProxyEvent>;
}

export class ProxyEventHandlersBlueprint
	extends ProxyEventObservablesBlueprint
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

export class AppProxyEventHandlersBlueprint {
	contextmenu$?: () => Observable<MouseEvent & ProxyEvent>;
	resize$?: () => Observable<UIEvent & ProxyEvent>;
	mousedown$?: () => Observable<PointerEvent & ProxyEvent>;
	mousemove$?: () => Observable<PointerEvent & ProxyEvent>;
	mouseup$?: () => Observable<PointerEvent & ProxyEvent>;
	pointerdown$?: () => Observable<PointerEvent & ProxyEvent>;
	pointermove$?: () => Observable<PointerEvent & ProxyEvent>;
	pointercancel$?: () => Observable<PointerEvent & ProxyEvent>;
	pointerup$?: () => Observable<PointerEvent & ProxyEvent>;
	touchstart$?: () => Observable<TouchEvent & ProxyEvent>;
	touchmove$?: () => Observable<TouchEvent & ProxyEvent>;
	touchend$?: () => Observable<TouchEvent & ProxyEvent>;
	wheel$?: () => Observable<WheelEvent & ProxyEvent>;
	keydown$?: () => Observable<KeyboardEvent & ProxyEvent>;

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

export class RegisterProxyEventHandlersBlueprint {
	public contextmenu$?: () => Observable<Event>;
	public resize$?: () => Observable<Event>;
	public mousedown$?: () => Observable<Event>;
	public mousemove$?: () => Observable<Event>;
	public mouseup$?: () => Observable<Event>;
	public pointerdown$?: () => Observable<Event>;
	public pointermove$?: () => Observable<Event>;
	public pointercancel$?: () => Observable<Event>;
	public pointerup$?: () => Observable<Event>;
	public touchstart$?: () => Observable<Event>;
	public touchmove$?: () => Observable<Event>;
	public touchend$?: () => Observable<Event>;
	public wheel$?: () => Observable<Event>;
	public keydown$?: () => Observable<Event>;
}
