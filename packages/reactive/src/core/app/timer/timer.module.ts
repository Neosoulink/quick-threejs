import { Subscription } from "rxjs";
import { inject, Lifecycle, scoped } from "tsyringe";

import type { Module } from "../../../common/interfaces";
import { TimerService } from "./timer.service";
import { TimerController } from "./timer.controller";

@scoped(Lifecycle.ContainerScoped)
export class TimerModule implements Module {
	private _initialAnimationFrameId?: number;
	private _subscriptions: Subscription[] = [];

	constructor(
		@inject(TimerController) private readonly _controller: TimerController,
		@inject(TimerService) private readonly _service: TimerService
	) {
		this._subscriptions.push(
			this._controller.step$.subscribe(this._service.step.bind(this._service))
		);
	}

	public init(enabled?: boolean): void {
		this.enabled(enabled);
	}

	public frame() {
		return this._service.frame;
	}

	public deltaTime(value?: number) {
		if (typeof value === "number") this._service.deltaTime = value;
		return this._service.deltaTime;
	}

	public deltaRatio(value?: number) {
		if (typeof value === "number") this._service.deltaRatio = value;
		return this._service.deltaRatio;
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this._service.enabled = value;
		return this._service.enabled;
	}

	public dispose() {
		if (this._initialAnimationFrameId !== undefined)
			cancelAnimationFrame(this._initialAnimationFrameId);
		this._service.enabled = false;
	}

	public beforeStep$() {
		return this._controller.beforeStep$;
	}

	public step$() {
		return this._controller.step$;
	}
}
