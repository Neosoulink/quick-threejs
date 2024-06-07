import { inject, singleton } from "tsyringe";
import { Observable } from "rxjs";

import { CoreController } from "../core.controller";
import { EventStatus } from "../../common/interfaces/event.interface";

@singleton()
export class TimerController {
	public readonly pointerLock$: Observable<EventStatus>;

	constructor(
		@inject(CoreController) private readonly coreController: CoreController
	) {
		this.pointerLock$ = this.coreController.pointerLock$;
	}
}
