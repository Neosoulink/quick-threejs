import { inject, singleton } from "tsyringe";

import { TimerComponent } from "./timer.component";
import { TimerController } from "./timer.controller";
import type { Module } from "../../common/interfaces/module.interface";

@singleton()
export class TimerModule implements Module {
	constructor(
		@inject(TimerComponent) private readonly component: TimerComponent,
		@inject(TimerController) private readonly controller: TimerController
	) {}

	public init(startTimer?: boolean): void {
		this.controller.enable$.subscribe((status) => {
			this.component.enabled = !!status;
			if (status) this.controller.animate();
		});

		if (startTimer) this.enabled(true);
	}

	public clock() {
		return this.component.clock;
	}

	public frame() {
		return this.component.frame;
	}

	public delta(value?: number) {
		if (typeof value === "number") this.component.delta = value;
		return this.component.delta;
	}

	public deltaRatio(value?: number) {
		if (typeof value === "number") this.component.deltaRatio = value;
		return this.component.deltaRatio;
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this.controller.enable$$.next(value);
		return this.component.enabled;
	}

	public dispose() {
		this.controller.step$$.complete();
		this.controller.enable$$.complete();
	}

	public step$() {
		return this.controller.step$;
	}

	public enabled$() {
		return this.controller.enable$;
	}
}
