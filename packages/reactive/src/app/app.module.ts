import { inject, singleton } from "tsyringe";
import { registerSerializer } from "threads";
import { WorkerPool } from "@quick-threejs/utils";

import { AppController } from "./app.controller";
import { AppComponent } from "./app.component";
import { LoaderModule } from "../loader/loader.module";
import { ExposedLoaderModule } from "../loader/loader.module-worker";
import { ExposedCoreModule } from "../core/core.module-worker";
import { object3DSerializer } from "../common/serializers/object3d.serializer";
import { RegisterDto } from "../common/dtos/register.dto";
import type { Module } from "../common/interfaces/module.interface";
import type {
	ProgressedResource,
	Resource
} from "../common/interfaces/resource.interface";
import type { CoreModuleMessageEventData } from "../core/core.interface";

@singleton()
export class AppModule implements Module {
	constructor(
		@inject(RegisterDto) private readonly props: RegisterDto,
		@inject(AppComponent) private readonly component: AppComponent,
		@inject(AppController) private readonly controller: AppController
	) {
		this.init();
	}

	private _initCanvas() {
		try {
			this.component.canvas = document.createElement("canvas");

			if (this.props.canvas instanceof HTMLCanvasElement)
				this.component.canvas = this.props.canvas;

			if (typeof this.props.canvas === "string") {
				const canvas_ = document.querySelector(this.props.canvas as string);

				if (canvas_ instanceof HTMLCanvasElement)
					this.component.canvas = canvas_;
			}

			if (!this.component.canvas.parentElement)
				document.body.appendChild(this.component.canvas);
		} catch (err: any) {
			console.error(
				`🛑 Unable to initialize the canvas:\n${err?.message ?? "Something went wrong"}`
			);
		}
	}

	private _initComponent(core: AppComponent["core"]) {
		this.component.init(core);
	}

	private _initController(): void {
		this.controller.init(this.component.canvas);

		if (this.props.fullScreen)
			this.component.core.thread?.resize?.({
				type: "resize",
				x: this.props.fullScreen
					? window.innerWidth
					: this.component.canvas.width,
				y: this.props.fullScreen
					? window.innerHeight
					: this.component.canvas.height
			});
	}

	private async _initCore() {
		const offscreenCanvas = this.component.canvas.transferControlToOffscreen();
		offscreenCanvas.width = this.component.canvas.clientWidth;
		offscreenCanvas.height = this.component.canvas.clientHeight;

		const core = await this.component.workerPool.run<ExposedCoreModule>({
			payload: {
				path: this.props.location,
				subject: {
					canvas: offscreenCanvas,
					startTimer: this.props.startTimer,
					useDefaultCamera: this.props.useDefaultCamera,
					withMiniCamera: this.props.withMiniCamera,
					fullScreen: this.props.fullScreen
				} satisfies CoreModuleMessageEventData,
				transferSubject: [offscreenCanvas]
			}
		});

		if (!core.thread || !core.worker) return;

		this._initComponent(core);
		this._initController();
	}

	public init(): void {
		registerSerializer(object3DSerializer);

		this._initCanvas();
		this._initCore();
	}

	public workerPool() {
		return this.component.workerPool as unknown as WorkerPool;
	}

	public async loadResources(props: {
		resources: Resource[];
		disposeOnComplete?: boolean;
		onMainThread?: boolean;
		immediateLoad?: boolean;
		onProgress?: (resource: ProgressedResource) => unknown;
		onProgressComplete?: (resource: ProgressedResource) => unknown;
	}) {
		const loaderWorkerThread =
			await this.component.workerPool.run<ExposedLoaderModule>({
				payload: {
					path: new URL("../loader/loader.module-worker.ts", import.meta.url),
					subject: {
						resources: props.resources
					}
				}
			});

		loaderWorkerThread.thread
			?.progress$()
			.subscribe((resource: ProgressedResource) => {
				props.onProgress?.(resource);
			});

		loaderWorkerThread.thread
			?.progressCompleted$()
			.subscribe((resource: ProgressedResource) => {
				props.onProgressComplete?.(resource);
				if (props.disposeOnComplete || props.disposeOnComplete === undefined)
					loaderWorkerThread.thread?.dispose();
			});

		if (props.immediateLoad || props.immediateLoad === undefined)
			await loaderWorkerThread.thread?.load();

		return {
			...loaderWorkerThread,
			load: (await loaderWorkerThread.thread?.load) as LoaderModule["load"],
			items: (await loaderWorkerThread.thread?.items()) as ReturnType<
				LoaderModule["items"]
			>,
			loaders: (await loaderWorkerThread.thread?.items()) as ReturnType<
				LoaderModule["loaders"]
			>,
			toLoad: (await loaderWorkerThread.thread?.toLoad()) as ReturnType<
				LoaderModule["toLoad"]
			>,
			loaded: (await loaderWorkerThread.thread?.loaded()) as ReturnType<
				LoaderModule["loaded"]
			>,
			resources: (await loaderWorkerThread.thread?.resources()) as ReturnType<
				LoaderModule["resources"]
			>
		};
	}

	public core() {
		return this.component.core;
	}

	public canvas() {
		return this.component.canvas;
	}

	public resize$() {
		return this.controller.observablesHandlers.resize$;
	}

	public dispose(): void {
		this.component.workerPool.terminateAll();
	}
}
