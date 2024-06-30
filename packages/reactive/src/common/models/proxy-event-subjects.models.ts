import { Subject } from "rxjs";

import { ProxyEventSubjectsImplementation } from "../types/object.type";

export class ProxyEventSubjectsModel implements ProxyEventSubjectsImplementation {
	contextmenu$$!: Subject<Event>;
	resize$$!: Subject<Event>;
	mousedown$$!: Subject<Event>;
	mousemove$$!: Subject<Event>;
	mouseup$$!: Subject<Event>;
	pointerdown$$!: Subject<Event>;
	pointermove$$!: Subject<Event>;
	pointercancel$$!: Subject<Event>;
	pointerup$$!: Subject<Event>;
	touchstart$$!: Subject<Event>;
	touchmove$$!: Subject<Event>;
	touchend$$!: Subject<Event>;
	wheel$$!: Subject<Event>;
	keydown$$!: Subject<Event>;
}
