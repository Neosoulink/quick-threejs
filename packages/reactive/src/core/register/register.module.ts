import "reflect-metadata";

import { excludeProperties } from "@quick-threejs/utils";
import { type DependencyContainer, inject, Lifecycle, scoped } from "tsyringe";
import { Subscription } from "rxjs";

import {
	type Module,
	type AppModulePropsMessageEvent,
	CONTAINER_TOKEN,
	PROXY_EVENT_LISTENERS,
	RegisterPropsBlueprint,
	RegisterProxyEventHandlersBlueprint,
	LOADER_SERIALIZED_LOAD_TOKEN,
	ProxyEvent,
	OffscreenCanvasWithStyle
} from "../../common";
import { ExposedAppModule } from "../app/app.worker";
import { RegisterService } from "./register.service";
import { RegisterController } from "./register.controller";
import { LoaderModule } from "./loader/loader.module";
import { LoaderController } from "./loader/loader.controller";

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

	private get currentWorker() {
		return this.props.mainThread ? self : this._service.worker;
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

	private async _initServiceWorker() {
		this._service.init({
			worker: this._service.worker,
			thread: this._service.thread
		});
	}

	private async _initEvents() {
		if (!this._service.canvas)
			throw new Error("Canvas element is not initialized.");

		this._controller.init();

		setTimeout(() => {
			const event = new UIEvent("resize") as UIEvent & ProxyEvent;
			event.width = window.innerWidth;
			event.height = window.innerHeight;
			event.windowWidth = window.innerWidth;
			event.windowHeight = window.innerHeight;

			this._controller.resize$$.next(
				this._service.uiEventHandler(event) as unknown as UIEvent & ProxyEvent
			);
		}, 0);
	}

	private async _initOnMainThread() {
		await import(`${this.props.location}`);

		self.postMessage({
			mainThread: true,
			...excludeProperties(this.props, [
				"canvas",
				"location",
				"onReady",
				"loaderDataSources"
			])
		});
	}

	private async _initOnWorkerThread() {
		if (!this._service.canvas)
			throw new Error("Canvas element is not initialized.");

		this._service.offscreenCanvas =
			this._service.canvas.transferControlToOffscreen() as OffscreenCanvasWithStyle;
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

	private async _initObservables() {
		PROXY_EVENT_LISTENERS.forEach(
			(key) => (this[`${key}$`] = () => this._controller?.[`${key}$`])
		);
	}

	private async _initLoader() {
		this.loader.init({
			sources: this.props.loaderDataSources,
			dracoDecoderPath: this.props.loaderDracoDecoderPath
		});

		this._subscriptions.push(
			this._loaderController.serializedLoad$.subscribe((payload) => {
				if (payload.resource instanceof ArrayBuffer)
					return this.currentWorker?.postMessage(payload.resource, [
						payload.resource
					]);

				this.currentWorker?.postMessage({
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
		if (this.props.mainThread) await this._initOnMainThread();
		else await this._initOnWorkerThread();
		await this._initServiceWorker();
		await this._initObservables();
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
