import { Observable } from "rxjs";

import { ProxyEventSubjectsModel } from "./proxy-event-subjects.models";
import { ProxyEventObservablesImplementation } from "../types/object.type";

export class ProxyEventObservablesModel
	extends ProxyEventSubjectsModel
	implements ProxyEventObservablesImplementation
{
	contextmenu$!: Observable<Event>;
	resize$!: Observable<Event>;
	mousedown$!: Observable<Event>;
	mousemove$!: Observable<Event>;
	mouseup$!: Observable<Event>;
	pointerdown$!: Observable<Event>;
	pointermove$!: Observable<Event>;
	pointercancel$!: Observable<Event>;
	pointerup$!: Observable<Event>;
	touchstart$!: Observable<Event>;
	touchmove$!: Observable<Event>;
	touchend$!: Observable<Event>;
	wheel$!: Observable<Event>;
	keydown$!: Observable<Event>;
}
