import { inject, singleton } from "tsyringe";
import { registerSerializer } from "threads";
import { WorkerPool } from "@quick-threejs/utils";
import { WorkerThreadResolution } from "@quick-threejs/utils/dist/types/worker.type";

import { AppController } from "./app.controller";
import { ExposedLoaderModule } from "../loader/loader.module-worker";
import { ExposedCoreModule } from "../core/core.module-worker";
import { LoaderModule } from "../loader/loader.module";
import { Module } from "../common/interfaces/module.interface";
import {
	ProgressedResource,
	Resource
} from "../common/interfaces/resource.interface";
import { object3DSerializer } from "../common/serializers/object3d.serializer";
import { RegisterDto } from "../common/dtos/register.dto";
import { CoreModuleMessageEvent } from "../core/core.interface";

@singleton()
export class AppModule implements Module {
	private _workerPool = WorkerPool();
	private _canvas!: HTMLCanvasElement;
	private _core!: WorkerThreadResolution<ExposedCoreModule>;

	constructor(
		@inject(RegisterDto) private readonly props: RegisterDto,
		@inject(AppController) private readonly controller: AppController
	) {
		this.init();
	}

	private _initCanvas() {
		try {
			this._canvas = document.createElement("canvas");

			if (this.props.canvas instanceof HTMLCanvasElement)
				this._canvas = this.props.canvas;

			if (typeof this.props.canvas === "string") {
				const canvas_ = document.querySelector(this.props.canvas as string);

				if (canvas_ instanceof HTMLCanvasElement) this._canvas = canvas_;
			}

			if (!this._canvas.parentElement) document.body.appendChild(this._canvas);
		} catch (err: any) {
			console.error(
				`🛑 Unable to initialize the canvas:\n${err?.message ?? "Something went wrong"}`
			);
		}
	}

	private async _initCore() {
		const offscreenCanvas = this._canvas.transferControlToOffscreen();
		offscreenCanvas["style"] = { width: "0", height: "0" };
		offscreenCanvas.width = this._canvas.clientWidth;
		offscreenCanvas.height = this._canvas.clientHeight;

		const core = await this._workerPool.run<ExposedCoreModule>({
			payload: {
				path: this.props.location,
				subject: {
					canvas: offscreenCanvas,
					startTimer: this.props.startTimer,
					useDefaultCamera: this.props.useDefaultCamera,
					withMiniCamera: this.props.withMiniCamera
				} satisfies CoreModuleMessageEvent["data"],
				transferSubject: [offscreenCanvas]
			}
		});

		if (core.thread && core.worker) {
			this._core = core;

			this._initController();
		}
	}

	private _initController(): void {
		this.controller.init(this._canvas);

		this.controller.canvasResize$.subscribe((sizes) =>
			this._core.thread?.setSize(sizes)
		);
	}

	public init(): void {
		registerSerializer(object3DSerializer);

		this._initCanvas();
		this._initCore();
	}

	public async loadResources(props: {
		resources: Resource[];
		disposeOnComplete?: boolean;
		onMainThread?: boolean;
		immediateLoad?: boolean;
		onProgress?: (resource: ProgressedResource) => unknown;
		onProgressComplete?: (resource: ProgressedResource) => unknown;
	}) {
		const loaderWorkerThread = await this._workerPool.run<ExposedLoaderModule>({
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

	public dispose(): void {
		this._workerPool.terminateAll();
	}
}
