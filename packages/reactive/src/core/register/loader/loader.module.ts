import "reflect-metadata";

import { Subscription } from "rxjs";
import { container, inject, singleton } from "tsyringe";
import { CanvasTexture } from "three";

import type {
	Module,
	LoaderSource,
	LoaderResource
} from "../../../common/interfaces";
import { LoaderController } from "./loader.controller";
import { LoaderService } from "./loader.service";
import { RegisterPropsBlueprint } from "../../../common/blueprints";

@singleton()
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

	private _performLoad(source: LoaderSource, resource?: LoaderResource) {
		this._controller.load$$.next({
			source,
			resource
		});
	}

	public init(sources: LoaderSource[] = []) {
		this._service.init(sources);
		this._service.setDracoDecoder();

		if ([undefined, true].includes(this._props.loadResourcesOnInit))
			this.load();
	}

	public load() {
		const firstSource = this._service.sources[0];
		if (!firstSource) return;

		this._performLoad(firstSource);

		for (const source of this._service.sources) {
			if (this._service.loadedResources[source.name]) return;

			if (source.type === "gltfModel" && typeof source.path === "string")
				this._service.loaders.gltfLoader?.load(source.path, (model) =>
					this._performLoad(source, model)
				);

			if (source.type === "texture" && typeof source.path === "string")
				this._service.loaders.textureLoader?.load(source.path, (texture) => {
					this._performLoad(source, new CanvasTexture(texture));
				});

			if (source.type === "cubeTexture" && typeof source.path === "object")
				this._service.loaders.cubeTextureLoader?.load(source.path, (texture) =>
					this._performLoad(source, texture)
				);

			if (source.type === "video" && typeof source.path === "string")
				this._service.loaders.videoLoader?.load(source.path, (texture) =>
					this._performLoad(source, texture)
				);

			if (source.type === "audio" && typeof source.path === "string")
				this._service.loaders.audioLoader?.load(source.path, (audioBuffer) => {
					this._performLoad(source, audioBuffer);
				});
		}
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
		this._controller.load$$.complete();
	}
}

export const loaderModule = container.resolve(LoaderModule);
