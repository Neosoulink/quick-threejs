import { Subject } from "rxjs";

import { ProxyEvent } from "main";
import { ProxyEventSubjectsImplementation } from "../types/object.type";

export class ProxyEventSubjectsModel
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
