import "reflect-metadata";

import { excludeProperties } from "@quick-threejs/utils";
import { type DependencyContainer, inject, Lifecycle, scoped } from "tsyringe";

import {
	type Module,
	type AppModulePropsMessageEvent,
	CONTAINER_TOKEN,
	PROXY_EVENT_LISTENERS,
	RegisterPropsBlueprint,
	RegisterProxyEventHandlersBlueprint,
	LOADER_SERIALIZED_LOAD_TOKEN
} from "../../common";
import { ExposedAppModule } from "../app/app.worker";
import { RegisterService } from "./register.service";
import { RegisterController } from "./register.controller";
import { LoaderModule } from "./loader/loader.module";
import { LoaderController } from "./loader/loader.controller";
import { Subscription } from "rxjs";

@scoped(Lifecycle.ContainerScoped)
export class RegisterModule
	extends RegisterProxyEventHandlersBlueprint
	implements Module
{
	private readonly _subscriptions: Subscription[] = [];
	private _initialized: boolean = false;

	constructor(
		@inject(RegisterService) private readonly _service: RegisterService,
		@inject(RegisterController)
		private readonly _controller: RegisterController,
		@inject(LoaderController)
		private readonly _loaderController: LoaderController,
		@inject(CONTAINER_TOKEN) public readonly container: DependencyContainer,
		@inject(RegisterPropsBlueprint)
		public readonly props: RegisterPropsBlueprint,
		@inject(LoaderModule) public readonly loader: LoaderModule
	) {
		super();

		if (this.props.initOnConstruct) this.init();
	}

	private async _initCanvas() {
		try {
			if (this.props.canvas instanceof HTMLCanvasElement)
				this._service.canvas = this.props.canvas;

			if (typeof this.props.canvas === "string") {
				const canvas_ = document.querySelector(this.props.canvas as string);

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

	private async _initService() {
		this._service.init({
			worker: this._service.worker,
			thread: this._service.thread
		});
	}

	private async _initEvents() {
		if (!this._service.canvas)
			throw new Error("Canvas element is not initialized.");

		if (!this._service.thread || !this._service.worker)
			throw new Error("Worker-thread is not initialized.");

		this._controller.init();

		if (this.props.fullScreen)
			this._service.thread?.resize?.({
				...this._service.uiEventHandler({
					type: "resize"
				} as UIEvent)
			});
	}

	private async _initWorkerThread() {
		if (!this._service.canvas)
			throw new Error("Canvas element is not initialized.");

		this._service.offscreenCanvas =
			this._service.canvas.transferControlToOffscreen();
		this._service.offscreenCanvas.width = this._service.canvas.clientWidth;
		this._service.offscreenCanvas.height = this._service.canvas.clientHeight;

		const [workerThread, queued] =
			(await this._service.workerPool.run<ExposedAppModule>({
				payload: {
					path: this.props.location,
					subject: {
						...excludeProperties(this.props, [
							"canvas",
							"location",
							"onReady",
							"loaderDataSources"
						]),
						canvas: this._service.offscreenCanvas
					} satisfies AppModulePropsMessageEvent["data"],
					transferSubject: [this._service.offscreenCanvas]
				}
			})) || [];

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

	private async _initLoader() {
		this.loader.init(this.props.loaderDataSources);

		this._subscriptions.push(
			this._loaderController.serializedLoad$.subscribe((payload) => {
				if (payload.resource instanceof ArrayBuffer)
					return this._service.worker?.postMessage(payload.resource, [
						payload.resource
					]);

				this._service.worker?.postMessage({
					token: LOADER_SERIALIZED_LOAD_TOKEN,
					payload
				});
			})
		);
	}

	public async init() {
		if (this._initialized) return;
		this._initialized = true;

		await this._initCanvas();
		await this._initWorkerThread();
		await this._initService();
		await this._initObservableProxyEvents();
		await this._initLoader();
		await this._initEvents();

		this.props.onReady?.({ module: this, container: this.container });
	}

	public getCanvas() {
		return this._service.canvas;
	}

	public getOffscreenCanvas() {
		return this._service.offscreenCanvas;
	}

	public getThread() {
		return this._service.thread;
	}

	public getWorker() {
		return this._service.worker;
	}

	public getWorkerPool() {
		return this._service.workerPool;
	}

	public isInitialized() {
		return this._initialized;
	}

	public async dispose() {
		this._subscriptions.map((sub) => sub.unsubscribe());
		await this._service.workerPool.terminateAll();

		if (this._service.canvas?.dataset["reactive"] === "true") {
			document.body.removeChild(this._service.canvas);
			this._service.canvas.remove();
			this._service.canvas = undefined;
		}

		this._initialized = false;
	}
}
