import { inject, singleton } from "tsyringe";
import { Subject } from "rxjs";
import { Vector2Like } from "three";

import { CoreComponent } from "./core.component";
import { PROXY_EVENT_LISTENERS } from "../common/constants/event.constants";
import { LifecycleState } from "../common/enums/lifecycle.enum";

@singleton()
export class CoreController {
	[x: string]: any;

	public readonly lifecycle$$ = new Subject<LifecycleState>();
	public readonly gui$$ = new Subject();
	public readonly lifecycle$ = this.lifecycle$$.pipe();

	constructor(
		@inject(CoreComponent) private readonly component: CoreComponent
	) {
		for (const eventKey of PROXY_EVENT_LISTENERS) {
			this[`${eventKey}$$`] = new Subject<Vector2Like>();
			this[eventKey] = (sizes: Vector2Like) => {
				this.component.proxyReceiver.handleEvent({ type: eventKey, ...sizes });
				this[`${eventKey}$$`].next(sizes);
			};
		}
	}
}
