import { Observable } from "rxjs";

export class RegisterProxyEventHandlersModel {
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
