import { inject, Lifecycle, scoped } from "tsyringe";
import { Observable, Subject } from "rxjs";

import { ProxyEventHandlersBlueprint, PROXY_EVENT_LISTENERS } from "@/common";
import { AppService } from "./app.service";

@scoped(Lifecycle.ContainerScoped)
export class AppController extends ProxyEventHandlersBlueprint {
	constructor(@inject(AppService) private readonly _service: AppService) {
		super();

		for (const eventType of PROXY_EVENT_LISTENERS) {
			this[`${eventType}$$`] = new Subject<any>();
			this[`${eventType}$`] = this[`${eventType}$$`].pipe() as Observable<any>;
			this[eventType] = (event: any) => {
				const payload = {
					...event,
					type: event.type || eventType
				};
				this._service.proxyReceiver.handleEvent(payload);
				this._service.proxyReceiver.ownerDocument.handleEvent(payload);
				this[`${eventType}$$`].next(event);
			};
		}
	}
}
