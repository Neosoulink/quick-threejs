import "reflect-metadata";

import { type DependencyContainer, inject, Lifecycle, scoped } from "tsyringe";
import { excludeProperties } from "@quick-threejs/utils";

import {
	type CoreModuleMessageEventData,
	type Module,
	type ProgressedResource,
	type Resource,
	CONTAINER_TOKEN,
	PROXY_EVENT_LISTENERS,
	RegisterPropsModel,
	RegisterProxyEventHandlersModel
} from "../../common";
import { ExposedAppModule } from "../app/app.module-worker";
import { LoaderModule } from "../loader/loader.module";
import { ExposedLoaderModule } from "../loader/loader.module-worker";
import { RegisterService } from "./register.service";
import { RegisterController } from "./register.controller";

@scoped(Lifecycle.ContainerScoped)
export class RegisterModule
	extends RegisterProxyEventHandlersModel
	implements Module
{
	public initialized = false;

	constructor(
		@inject(CONTAINER_TOKEN) private readonly _container: DependencyContainer,
		@inject(RegisterService) private readonly _service: RegisterService,
		@inject(RegisterController)
		private readonly _controller: RegisterController,
		@inject(RegisterPropsModel)
		public readonly registerProps: RegisterPropsModel
	) {
		super();

		if (this.registerProps.initOnConstruct) this.init();
	}

	private async _initCanvas() {
		try {
			if (this.registerProps.canvas instanceof HTMLCanvasElement)
				this._service.canvas = this.registerProps.canvas;

			if (typeof this.registerProps.canvas === "string") {
				const canvas_ = document.querySelector(
					this.registerProps.canvas as string
				);

				if (canvas_ instanceof HTMLCanvasElement)
					this._service.canvas = canvas_;
			}

			if (!this._service.canvas) {
				this._service.canvas = document.createElement("canvas");

				this._service.canvas.dataset["reactive"] = "true";
				document.body.appendChild(this._service.canvas);
			}
		} catch (err) {
			console.error(
				`🛑 Unable to initialize the canvas:\n${err instanceof Error ? err.message : "Something went wrong"}`
			);
		}
	}

	private async _initComponent() {
		this._service.init({
			worker: this._service.worker,
			thread: this._service.thread
		});
	}

	private async _initController() {
		if (!this._service.canvas)
			throw new Error("Canvas element is not initialized.");

		this._controller.init(this._service.canvas);
		if (!this._service.thread || !this._service.worker) return;

		this._service.thread?.resize?.({
			...this._controller.uiEventHandler({ type: "resize" } as UIEvent)
		});
	}

	private async _initWorkerThread() {
		if (!this._service.canvas)
			throw new Error("Canvas element is not initialized.");

		const offscreenCanvas = this._service.canvas.transferControlToOffscreen();
		offscreenCanvas.width = this._service.canvas.clientWidth;
		offscreenCanvas.height = this._service.canvas.clientHeight;

		const [workerThread, queued] =
			await this._service.workerPool.run<ExposedAppModule>({
				payload: {
					path: this.registerProps.location,
					subject: {
						...excludeProperties(this.registerProps, [
							"canvas",
							"location",
							"onReady"
						]),
						canvas: offscreenCanvas
					} satisfies CoreModuleMessageEventData,
					transferSubject: [offscreenCanvas]
				}
			});

		if (!workerThread || queued)
			throw new Error("Unable to retrieve the worker-thread info.");

		this._service.worker = workerThread.worker;
		this._service.thread = workerThread.thread;
	}

	private async _initObservableProxyEvents() {
		PROXY_EVENT_LISTENERS.forEach(
			(key) => (this[`${key}$`] = () => this._controller?.[`${key}$`])
		);
	}

	public async init() {
		await this._initCanvas();
		await this._initWorkerThread();
		await this._initComponent();
		await this._initController();
		await this._initObservableProxyEvents();

		this.registerProps.onReady?.({ module: this, container: this._container });
	}

	public async loadResources(props: {
		resources: Resource[];
		disposeOnComplete?: boolean;
		onMainThread?: boolean;
		immediateLoad?: boolean;
		onProgress?: (resource: ProgressedResource) => unknown;
		onProgressComplete?: (resource: ProgressedResource) => unknown;
	}) {
		const [workerThread, queued] =
			await this._service.workerPool.run<ExposedLoaderModule>({
				payload: {
					path: "../loader/loader.module-worker.ts",
					subject: {
						resources: props.resources
					}
				}
			});

		if (!workerThread || queued)
			throw new Error("Unable to retrieve worker thread info.");

		workerThread.thread
			?.progress$()
			.subscribe((resource: ProgressedResource) => {
				props.onProgress?.(resource);
			});

		workerThread.thread
			?.progressCompleted$()
			.subscribe((resource: ProgressedResource) => {
				props.onProgressComplete?.(resource);
				if (props.disposeOnComplete || props.disposeOnComplete === undefined)
					workerThread.thread?.dispose();
			});

		if (props.immediateLoad || props.immediateLoad === undefined)
			await workerThread.thread?.load();

		return {
			...workerThread,
			load: (await workerThread.thread?.load) as LoaderModule["load"],
			items: (await workerThread.thread?.items()) as ReturnType<
				LoaderModule["items"]
			>,
			loaders: (await workerThread.thread?.items()) as ReturnType<
				LoaderModule["loaders"]
			>,
			toLoad: (await workerThread.thread?.toLoad()) as ReturnType<
				LoaderModule["toLoad"]
			>,
			loaded: (await workerThread.thread?.loaded()) as ReturnType<
				LoaderModule["loaded"]
			>,
			resources: (await workerThread.thread?.resources()) as ReturnType<
				LoaderModule["resources"]
			>
		};
	}

	public workerPool() {
		return this._service.workerPool;
	}

	public canvas() {
		return this._service.canvas;
	}

	public worker() {
		return this._service.worker;
	}

	public thread() {
		return this._service.thread;
	}

	public async dispose() {
		await this._service.workerPool.terminateAll();

		if (this._service.canvas?.dataset["reactive"] === "true") {
			this._service.canvas.remove();
			this._service.canvas = undefined;
		}
	}
}
