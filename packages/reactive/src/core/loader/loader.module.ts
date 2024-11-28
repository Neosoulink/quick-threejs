import "reflect-metadata";

import { container, inject, Lifecycle, scoped } from "tsyringe";
import { CanvasTexture } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { WorkerThreadModule } from "@quick-threejs/utils";

import { LoaderController } from "./loader.controller";
import { LoaderComponent } from "./loader.component";
import { Module } from "../../common/interfaces/module.interface";
import {
	LoadedResourceItem,
	Resource
} from "../../common/interfaces/resource.interface";

@scoped(Lifecycle.ResolutionScoped)
export class LoaderModule implements Module, WorkerThreadModule {
	constructor(
		@inject(LoaderController) private readonly controller: LoaderController,
		@inject(LoaderComponent) private readonly component: LoaderComponent
	) {
		self.onmessage = (event: MessageEvent<{ resources?: Resource[] }>) => {
			const resources = event?.data?.resources;
			if (resources) this.init(resources);
		};
	}

	private _handleLoadedResource(resource: Resource, file: LoadedResourceItem) {
		this.component.items[resource.name] = file;
		this.component.loaded++;
		this.controller.progress$$.next({
			file,
			resource,
			loaded: this.component.loaded,
			toLoad: this.component.toLoad
		});
	}

	public setDracoLoader(dracoDecoderPath: string, linkWithGltfLoader = true) {
		this.component.loaders.dracoLoader = new DRACOLoader(
			this.component.loadingManager
		);
		this.component.loaders.dracoLoader.setDecoderPath(dracoDecoderPath);

		if (linkWithGltfLoader && this.component.loaders.gltfLoader)
			this.component.loaders.gltfLoader.setDRACOLoader(
				this.component.loaders.dracoLoader
			);
	}

	public load() {
		const firstResource = this.component.resources[0];
		if (!firstResource) return;

		this.controller.progress$$.next({
			resource: firstResource,
			loaded: this.component.loaded,
			toLoad: this.component.toLoad
		});

		for (const source of this.component.resources)
			if (!this.component.items[source.name]) {
				if (source.type === "gltfModel" && typeof source.path === "string") {
					this.component.loaders.gltfLoader?.load(source.path, (model) =>
						this._handleLoadedResource(source, model)
					);
				}
				if (source.type === "texture" && typeof source.path === "string") {
					this.component.loaders.textureLoader?.load(source.path, (texture) => {
						this._handleLoadedResource(source, new CanvasTexture(texture));
					});
				}
				if (source.type === "cubeTexture" && typeof source.path === "object") {
					this.component.loaders.cubeTextureLoader?.load(
						source.path,
						(texture) => this._handleLoadedResource(source, texture)
					);
				}
				if (source.type === "video" && typeof source.path === "string") {
					this.component.loaders.videoLoader?.load(source.path, (texture) =>
						this._handleLoadedResource(source, texture)
					);
				}
				if (source.type === "audio" && typeof source.path === "string") {
					this.component.loaders.audioLoader?.load(
						source.path,
						(audioBuffer) => {
							this._handleLoadedResource(source, audioBuffer);
						}
					);
				}
			}
	}

	public items() {
		return this.component.items;
	}

	public loaders() {
		return this.component.loaders;
	}

	public resources() {
		return this.component.resources;
	}

	public loaded() {
		return this.component.loaded;
	}

	public toLoad() {
		return this.component.toLoad;
	}

	public init(resources: Resource[] = []) {
		this.component.init(resources);
	}

	public dispose() {
		this.controller.lifecycle$$.complete();
		this.controller.progress$$.complete();
	}

	public lifecycle$() {
		return this.controller.lifecycle$;
	}

	public progress$() {
		return this.controller.progress$;
	}

	public progressCompleted$() {
		return this.controller.progressCompleted$;
	}
}

export const loaderModule = container.resolve(LoaderModule);
