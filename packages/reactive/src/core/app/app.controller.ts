import { inject, singleton } from "tsyringe";
import { Subject } from "rxjs";

import { AppComponent } from "./app.component";
import { ProxyEventHandlersModel } from "../../common/models/proxy-event-handler.model";
import { AppLifecycleState } from "../../common/enums/lifecycle.enum";
import { PROXY_EVENT_LISTENERS } from "../../common/constants/event.constants";

@singleton()
export class AppController extends ProxyEventHandlersModel {
	public readonly lifecycle$$ = new Subject<AppLifecycleState>();
	public readonly lifecycle$ = this.lifecycle$$.pipe();

	constructor(@inject(AppComponent) private readonly component: AppComponent) {
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
