import { inject, Lifecycle, scoped } from "tsyringe";
import { Observable, Subject } from "rxjs";

import { AppService } from "./app.service";
import { ProxyEventHandlersBlueprint } from "../../common/blueprints/proxy.blueprint";
import { PROXY_EVENT_LISTENERS } from "../../common/constants/event.constants";

@scoped(Lifecycle.ContainerScoped)
export class AppController extends ProxyEventHandlersBlueprint {
	constructor(@inject(AppService) private readonly _service: AppService) {
		super();

		for (const eventType of PROXY_EVENT_LISTENERS) {
			this[`${eventType}$$`] = new Subject<any>();
			this[`${eventType}$`] = this[`${eventType}$$`].pipe() as Observable<any>;
			this[eventType] = (event: any) => {
				this._service.proxyReceiver.handleEvent({
					...event,
					type: event.type || eventType
				});
				this[`${eventType}$$`].next(event);
			};
		}
	}
}
