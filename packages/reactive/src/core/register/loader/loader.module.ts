import { Subscription } from "rxjs";
import { inject, Lifecycle, scoped } from "tsyringe";

import {
	RegisterPropsBlueprint,
	type Module,
	type LoaderSource
} from "../../../common";
import { LoaderController } from "./loader.controller";
import { LoaderService } from "./loader.service";
import { DRACOLoader } from "three/examples/jsm/Addons";

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

	public init(params: { sources?: LoaderSource[]; dracoDecoderPath?: string }) {
		this._service.init(params.sources || []);
		this._service.setDracoDecoder(params.dracoDecoderPath);

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
		Object.keys(this._service.loaders).forEach((loaderKey) => {
			const loader = this._service.loaders[loaderKey];

			if (loader instanceof DRACOLoader) loader.dispose();

			this._service.loaders[loaderKey] = undefined;
		});
		this._controller.load$$.complete();
	}
}
