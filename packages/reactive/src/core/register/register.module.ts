import "reflect-metadata";

import { inject, singleton } from "tsyringe";
import { excludeProperties } from "@quick-threejs/utils";

import { RegisterComponent } from "./register.component";
import { RegisterController } from "./register.controller";
import { LoaderModule } from "../loader/loader.module";
import { ExposedLoaderModule } from "../loader/loader.module-worker";
import { ExposedAppModule } from "../app/app.module-worker";
import { RegisterPropsModel } from "../../common/models/register-props.model";
import {
	RegisterLifecycleState,
	AppLifecycleState
} from "../../common/enums/lifecycle.enum";
import { RegisterProxyEventHandlersModel } from "../../common/models/register-proxy-event-handler.model";
import { PROXY_EVENT_LISTENERS } from "../../common/constants/event.constants";
import type {
	ProgressedResource,
	Resource
} from "../../common/interfaces/resource.interface";
import type { Module } from "../../common/interfaces/module.interface";
import type { CoreModuleMessageEventData } from "../../common/interfaces/core.interface";

@singleton()
export class RegisterModule
	extends RegisterProxyEventHandlersModel
	implements Module
{
	constructor(
		@inject(RegisterComponent) private readonly component: RegisterComponent,
		@inject(RegisterController) private readonly controller: RegisterController,
		@inject(RegisterPropsModel)
		private readonly registerProps: RegisterPropsModel
	) {
		super();
		this.init();
	}

	private async _initCanvas() {
		try {
			this.component.canvas = document.createElement("canvas");

			if (this.registerProps.canvas instanceof HTMLCanvasElement)
				this.component.canvas = this.registerProps.canvas;

			if (typeof this.registerProps.canvas === "string") {
				const canvas_ = document.querySelector(
					this.registerProps.canvas as string
				);

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

	private async _initComponent() {
		this.component.init({
			worker: this.component.worker,
			thread: this.component.thread
		});
	}

	private async _initController() {
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
		const offscreenCanvas = this.component.canvas.transferControlToOffscreen();
		offscreenCanvas.width = this.component.canvas.clientWidth;
		offscreenCanvas.height = this.component.canvas.clientHeight;

		const app = await this.component.workerPool.run<ExposedAppModule>({
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

		if (!app.thread || !app.worker)
			throw new Error("Unable to retrieve app worker info.");

		this.component.worker = app.worker;
		this.component.thread = app.thread;
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
		this.registerProps.onReady?.(this);
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
					path: "../loader/loader.module-worker.ts",
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

	public dispose(): void {
		this.component.workerPool.terminateAll();
		this.controller.lifecycle$$.next(RegisterLifecycleState.DISPOSED);
	}

	public lifecycle$() {
		return this.controller.lifecycle$;
	}
}
