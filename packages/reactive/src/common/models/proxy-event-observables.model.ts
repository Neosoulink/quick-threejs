import { Observable } from "rxjs";

import { ProxyEvent } from "main";
import { ProxyEventSubjectsModel } from "./proxy-event-subjects.models";
import { ProxyEventObservablesImplementation } from "../types/object.type";

export class ProxyEventObservablesModel
	extends ProxyEventSubjectsModel
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
