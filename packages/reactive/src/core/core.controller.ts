import { inject, singleton } from "tsyringe";
import { Subject } from "rxjs";

import { CoreComponent } from "./core.component";
import { ProxyEventHandlersModel } from "../common/models/proxy-event-handler.model";
import { CoreLifecycleState } from "../common/enums/lifecycle.enum";
import { PROXY_EVENT_LISTENERS } from "../common/constants/event.constants";

@singleton()
export class CoreController extends ProxyEventHandlersModel {
	public readonly lifecycle$$ = new Subject<CoreLifecycleState>();
	public readonly lifecycle$ = this.lifecycle$$.pipe();

	constructor(
		@inject(CoreComponent) private readonly component: CoreComponent
	) {
		super();

		for (const eventType of PROXY_EVENT_LISTENERS) {
			this[`${eventType}$$`] = new Subject<Event>();
			this[`${eventType}$`] = this[`${eventType}$$`].pipe();

			this[eventType] = (event: Event) => {
				this.component.proxyReceiver.handleEvent({
					...event,
					type: event.type || eventType
				});
				this[`${eventType}$$`].next(event);
			};
		}
	}
}
