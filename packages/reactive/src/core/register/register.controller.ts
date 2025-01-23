import { inject, singleton } from "tsyringe";
import { fromEvent, map, filter } from "rxjs";

import { RegisterService } from "./register.service";
import { PROXY_EVENT_LISTENERS } from "../../common/constants/event.constants";
import { ProxyEventHandlersBlueprint } from "../../common/blueprints/proxy.blueprint";

@singleton()
export class RegisterController extends ProxyEventHandlersBlueprint {
	constructor(
		@inject(RegisterService) private readonly _service: RegisterService
	) {
		super();
	}

	public init() {
		for (const key of PROXY_EVENT_LISTENERS) {
			const eventHandler =
				key.startsWith("mouse") ||
				key.startsWith("pointer") ||
				key.startsWith("touch")
					? this._service.mouseEventHandler.bind(this._service)
					: key.startsWith("key")
						? this._service.keyEventHandler.bind(this._service)
						: key === "resize"
							? this._service.uiEventHandler.bind(this._service)
							: key === "wheel"
								? this._service.wheelEventHandler.bind(this._service)
								: this._service.preventDefaultHandler.bind(this._service);

			// @ts-ignore - This is a dynamic property
			this[`${key}$`] = fromEvent<MouseEvent>(
				key === "resize" ? window : this._service.canvas!,
				key
			).pipe(
				// @ts-ignore
				map(eventHandler.bind(this)),
				filter((e) => (key === "keydown" && !e ? false : true))
			);
			this[`${key}$`].subscribe((event) => {
				this._service.thread?.[key]?.(event as any);
			});
		}
	}
}
