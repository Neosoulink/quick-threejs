import { Subscription } from "rxjs";
import { inject, Lifecycle, scoped } from "tsyringe";

import type { Module } from "../../../common/interfaces";
import { LoaderController } from "./loader.controller";
import { LoaderService } from "./loader.service";

@scoped(Lifecycle.ContainerScoped)
export class LoaderModule implements Module {
	private readonly _subscriptions: Subscription[] = [];
	constructor(
		@inject(LoaderController) private readonly _controller: LoaderController,
		@inject(LoaderService) private readonly _service: LoaderService
	) {}

	public init() {
		this._subscriptions.push(
			this._controller.load$.subscribe(
				this._service.handleLoad.bind(this._service)
			)
		);
	}

	public getLoadedResources() {
		return this._service.loadedResources;
	}

	public getLoadedCount() {
		return this._service.loadedCount;
	}

	public getToLoadCount() {
		return this._service.toLoadCount;
	}

	public getLoad$() {
		return this._controller.load$;
	}

	public getLoadCompleted$() {
		return this._controller.loadCompleted$;
	}

	public dispose() {
		this._subscriptions.forEach((subscription) => subscription.unsubscribe());
	}
}
