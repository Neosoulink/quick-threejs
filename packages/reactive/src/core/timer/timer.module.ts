import { inject, singleton } from "tsyringe";

import { TimerComponent } from "./timer.component";
import { TimerController } from "./timer.controller";
import { Module } from "../../common/interfaces/module.interface";
import { EventStatus } from "../../common/enums/event.enum";

@singleton()
export class TimerModule implements Module {
	constructor(
		@inject(TimerComponent) private readonly component: TimerComponent,
		@inject(TimerController) private readonly controller: TimerController
	) {}

	public init(): void {
		this.controller.enable$.subscribe((status) => {
			this.component.enabled = status;
			if (status === EventStatus.ON) this.controller.animate();
		});
	}

	public enable() {
		this.controller.enable$$.next(EventStatus.ON);
	}

	public disable() {
		this.controller.enable$$.next(EventStatus.OFF);
	}

	public dispose(): void {
		throw new Error("Method not implemented.");
	}
}
