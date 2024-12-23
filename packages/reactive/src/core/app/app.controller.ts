import { inject, singleton } from "tsyringe";
import { Observable, Subject } from "rxjs";

import { AppService } from "./app.service";
import { ProxyEventHandlersModel } from "../../common/models/proxy-event-handler.model";
import { PROXY_EVENT_LISTENERS } from "../../common/constants/event.constants";

@singleton()
export class AppController extends ProxyEventHandlersModel {
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
