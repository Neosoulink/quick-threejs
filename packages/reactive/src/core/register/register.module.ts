import "reflect-metadata";

import { excludeProperties } from "@quick-threejs/utils";
import { type DependencyContainer, inject, Lifecycle, scoped } from "tsyringe";
import { Subscription } from "rxjs";

import {
	type AppModulePropsMessageEvent,
	type Module,
	type OffscreenCanvasStb,
	type ProxyEvent,
	CONTAINER_TOKEN,
	LOADER_SERIALIZED_LOAD_TOKEN,
	PROXY_EVENT_LISTENERS,
	RegisterPropsBlueprint,
	RegisterProxyEventHandlersBlueprint
} from "@/common";
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
		return this.props.mainThread ? self : this._service.workerThread?.worker;
	}

	private async _initCanvas() {
		try {
			this._service.canvas =
				this.props.canvas instanceof HTMLCanvasElement
					? this.props.canvas
					: undefined;

			if (!this._service.canvas) {
				this._service.canvas = document.createElement("canvas");

				this._service.canvas.dataset["reactive"] = "true";
				document.body.appendChild(this._service.canvas);
			}

			this._service.canvasWrapper =
				this.props.canvasWrapper instanceof HTMLElement
					? this.props.canvasWrapper
					: this.props.canvasWrapper === "parent"
						? (this.props.canvas?.parentElement ?? undefined)
						: undefined;
		} catch (err) {
			console.error(
				`🛑 Unable to initialize the canvas:\n${err instanceof Error ? err.message : "Something went wrong"}`
			);
		}
	}

	private async _initEvents() {
		if (!this._service.canvas)
			throw new Error("Canvas element is not initialized.");

		this._controller.init();

		if (!this.props.mainThread)
			this._subscriptions.push(
				this._controller.resize$.subscribe((e) => {
					const canvas = this._service.canvas;

					if (!this.props.autoRenderResize || !canvas) return;

					const canvasWrapper = this._service.canvasWrapper;
					const fullScreen = this.props.fullScreen;
					const width = fullScreen
						? e.windowWidth
						: canvasWrapper
							? e.wrapperWidth
							: e.width;
					const height = fullScreen
						? e.windowHeight
						: canvasWrapper
							? e.wrapperHeight
							: e.height;

					canvas.style.width = width + "px";
					canvas.style.height = height + "px";
				})
			);

		const canvas = this._service.canvas;
		const canvasWrapper = this._service.canvasWrapper;
		const event = new UIEvent("resize") as UIEvent & ProxyEvent;

		event.width = canvas?.width ?? 0;
		event.height = canvas?.height ?? 0;
		event.wrapperWidth = canvasWrapper?.clientWidth ?? 0;
		event.wrapperHeight = canvasWrapper?.clientHeight ?? 0;
		event.windowWidth = window.innerWidth;
		event.windowHeight = window.innerHeight;

		this._controller.resize$$.next(this._service.uiEventHandler(event) as any);
	}

	private async _initCore() {
		const data = {
			...excludeProperties(this.props, [
				"canvas",
				"canvasWrapper",
				"location",
				"onReady",
				"loaderDataSources"
			]),
			pixelRatio: this.props.pixelRatio,
			initApp: true,
			hasCanvasWrapper: !!this.props.canvasWrapper
		} satisfies AppModulePropsMessageEvent["data"];

		if (this.props.mainThread) {
			await import(`${this.props.location}`);

			await new Promise<void>((resolve) => {
				const handleMessage = (event: MessageEvent) => {
					if (event.data.mainThread) {
						resolve();
						self.removeEventListener("message", handleMessage);
					}
				};
				self.addEventListener("message", handleMessage);
				self.postMessage(data);
			});

			return;
		}

		if (!this._service.canvas)
			throw new Error("Canvas element is not initialized.");

		this._service.offscreenCanvas =
			this._service.canvas.transferControlToOffscreen() as OffscreenCanvasStb;
		this._service.offscreenCanvas.width = this._service.canvas.clientWidth;
		this._service.offscreenCanvas.height = this._service.canvas.clientHeight;

		const subjectData = {
			...data,
			canvas: this._service.offscreenCanvas
		} satisfies AppModulePropsMessageEvent["data"];

		const [workerThread, queued] =
			(await this._service.workerPool.run<ExposedAppModule>({
				payload: {
					path: this.props.location,
					subject: subjectData,
					transferSubject: [this._service.offscreenCanvas]
				}
			})) || [];

		if (!workerThread || queued)
			throw new Error("Unable to retrieve the worker-thread info.");

		this._service.workerThread = workerThread;
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
		await this._initCore();
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

	public getWorkerThread() {
		return this._service.workerThread;
	}

	public getWorkerPool() {
		return this._service.workerPool;
	}

	public getProps() {
		return this.props;
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
