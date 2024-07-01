import { Observable } from "rxjs";

export class AppProxyEventHandlersModel {
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
