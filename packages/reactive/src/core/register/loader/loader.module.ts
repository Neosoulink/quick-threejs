import { Subscription } from "rxjs";
import { inject, Lifecycle, scoped } from "tsyringe";

import {
	RegisterPropsBlueprint,
	type Module,
	type LoaderSource
} from "../../../common";
import { LoaderController } from "./loader.controller";
import { LoaderService } from "./loader.service";

@scoped(Lifecycle.ContainerScoped)
export class LoaderModule implements Module {
	private readonly _subscriptions: Subscription[] = [];

	constructor(
		@inject(LoaderController) private readonly _controller: LoaderController,
		@inject(LoaderService) private readonly _service: LoaderService,
		@inject(RegisterPropsBlueprint)
		private readonly _props: RegisterPropsBlueprint
	) {
		this._subscriptions.push(
			this._controller.load$.subscribe(
				this._service.handleLoad.bind(this._service)
			)
		);
	}

	public init(sources: LoaderSource[] = []) {
		this._service.init(sources);
		this._service.setDracoDecoder();

		if ([undefined, true].includes(this._props.loadResourcesOnInit))
			this.load();
	}

	public load() {
		this._service.launchLoad((source, resource) =>
			this._controller.load$$.next({
				source,
				resource
			})
		);
	}

	public getLoadedResources() {
		return this._service.loadedResources;
	}

	public getLoaders() {
		return this._service.loaders;
	}

	public getSources() {
		return this._service.sources;
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

	public setDracoDecoder(dracoDecoderPath: string) {
		this._service.setDracoDecoder(dracoDecoderPath);
	}

	public dispose() {
		this._subscriptions.forEach((sub) => sub.unsubscribe());
		this._controller.load$$.complete();
	}
}
