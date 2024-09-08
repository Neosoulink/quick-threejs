import { Observable } from "rxjs";

import { ProxyEvent } from "main";

export class AppProxyEventHandlersModel {
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
