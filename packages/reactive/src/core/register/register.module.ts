import "reflect-metadata";

import { type DependencyContainer, inject, Lifecycle, scoped } from "tsyringe";
import { excludeProperties } from "@quick-threejs/utils";

import { PROXY_EVENT_LISTENERS } from "../../common/constants";
import type {
	ProgressedResource,
	Resource,
	Module,
	CoreModuleMessageEventData
} from "../../common/interfaces";
import { RegisterLifecycleState, AppLifecycleState } from "../../common/enums";
import {
	RegisterPropsModel,
	RegisterProxyEventHandlersModel
} from "../../common/models";
import { CONTAINER_TOKEN } from "../../common/tokens";
import { RegisterComponent } from "./register.component";
import { RegisterController } from "./register.controller";
import { LoaderModule } from "../loader/loader.module";
import { ExposedLoaderModule } from "../loader/loader.module-worker";
import { ExposedAppModule } from "../app/app.module-worker";

@scoped(Lifecycle.ContainerScoped)
export class RegisterModule
	extends RegisterProxyEventHandlersModel
	implements Module
{
	public initialized = false;

	constructor(
		@inject(CONTAINER_TOKEN) private readonly container: DependencyContainer,
		@inject(RegisterComponent) private readonly component: RegisterComponent,
		@inject(RegisterController) private readonly controller: RegisterController,
		@inject(RegisterPropsModel)
		public readonly registerProps: RegisterPropsModel
	) {
		super();

		if (this.registerProps.initOnConstruct) this.init();
	}

	private async _initCanvas() {
		try {
			if (this.registerProps.canvas instanceof HTMLCanvasElement)
				this.component.canvas = this.registerProps.canvas;

			if (typeof this.registerProps.canvas === "string") {
				const canvas_ = document.querySelector(
					this.registerProps.canvas as string
				);

				if (canvas_ instanceof HTMLCanvasElement)
					this.component.canvas = canvas_;
			}

			if (!this.component.canvas) {
				this.component.canvas = document.createElement("canvas");

				this.component.canvas.dataset["reactive"] = "true";
				document.body.appendChild(this.component.canvas);
			}
		} catch (err) {
			console.error(
				`🛑 Unable to initialize the canvas:\n${err instanceof Error ? err.message : "Something went wrong"}`
			);
		}
	}

	private async _initComponent() {
		this.component.init({
			worker: this.component.worker,
			thread: this.component.thread
		});
	}

	private async _initController() {
		if (!this.component.canvas)
			throw new Error("Canvas element is not initialized.");

		this.controller.init(this.component.canvas);
		if (!this.component.thread || !this.component.worker) return;

		this.component.thread?.resize?.({
			...this.controller.uiEventHandler({ type: "resize" } as UIEvent)
		});

		this.component.thread
			?.lifecycle$()
			.subscribe((state: AppLifecycleState) => {
				if (state === AppLifecycleState.STEP_STARTED)
					this.component.stats?.begin();

				if (state === AppLifecycleState.STEP_ENDED) this.component.stats?.end();
			});
	}

	private async _initWorkerThread() {
		if (!this.component.canvas)
			throw new Error("Canvas element is not initialized.");

		const offscreenCanvas = this.component.canvas.transferControlToOffscreen();
		offscreenCanvas.width = this.component.canvas.clientWidth;
		offscreenCanvas.height = this.component.canvas.clientHeight;

		const [workerThread, queued] =
			await this.component.workerPool.run<ExposedAppModule>({
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

		this.component.worker = workerThread.worker;
		this.component.thread = workerThread.thread;
	}

	private async _initProxyEvents() {
		PROXY_EVENT_LISTENERS.forEach(
			(key) => (this[`${key}$`] = () => this.controller?.[`${key}$`])
		);
	}

	public async init() {
		await this._initCanvas();
		await this._initWorkerThread();
		await this._initComponent();
		await this._initController();
		await this._initProxyEvents();

		this.controller.lifecycle$$.next(RegisterLifecycleState.INITIALIZED);
		this.registerProps.onReady?.({ module: this, container: this.container });
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
			await this.component.workerPool.run<ExposedLoaderModule>({
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
		return this.component.workerPool;
	}

	public canvas() {
		return this.component.canvas;
	}

	public worker() {
		return this.component.worker;
	}

	public thread() {
		return this.component.thread;
	}

	public gui() {
		return this.component.gui;
	}

	public async dispose() {
		await this.component.workerPool.terminateAll();
		if (this.component.stats) this.component.stats.dom.remove();
		if (this.component.gui) this.component.gui.destroy();

		if (this.component.canvas?.dataset["reactive"] === "true") {
			this.component.canvas.remove();
			this.component.canvas = undefined;
		}
	}

	public lifecycle$() {
		return this.controller.lifecycle$;
	}
}
