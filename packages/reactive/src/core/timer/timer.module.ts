import { inject, singleton } from "tsyringe";

import { TimerComponent } from "./timer.component";
import { TimerController } from "./timer.controller";
import { Module } from "../../common/interfaces/module.interface";

@singleton()
export class TimerModule implements Module {
	private _pointerLocked = false;

	constructor(
		@inject(TimerComponent) private readonly component: TimerComponent,
		@inject(TimerController) private readonly controller: TimerController
	) {}

	private checkStart(): void {
		if (this._pointerLocked) this.component.enable();
		else this.component.disable();
	}

	public init(): void {
		this.controller.pointerLock$.subscribe((status) => {
			console.log(status)
			this._pointerLocked = !!status;
			this.checkStart();
		});
	}
}
