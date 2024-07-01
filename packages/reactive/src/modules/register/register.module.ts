import { container, inject, singleton } from "tsyringe";
import { registerSerializer } from "threads";
import { excludeProperties, WorkerPool } from "@quick-threejs/utils";

import { RegisterComponent } from "./register.component";
import { RegisterController } from "./register.controller";
import { LoaderModule } from "../loader/loader.module";
import { ExposedLoaderModule } from "../loader/loader.module-worker";
import { ExposedAppModule } from "../app/app.module-worker";
import { object3DSerializer } from "../../common/serializers/object3d.serializer";
import { RegisterPropsModel } from "../../common/models/register-props.model";
import {
	RegisterLifecycleState,
	AppLifecycleState
} from "../../common/enums/lifecycle.enum";
import type { Module } from "../../common/interfaces/module.interface";
import type {
	ProgressedResource,
	Resource
} from "../../common/interfaces/resource.interface";
import type { CoreModuleMessageEventData } from "../../common/interfaces/core.interface";

@singleton()
export class RegisterModule implements Module {
	constructor(
		@inject(RegisterPropsModel) private readonly props: RegisterPropsModel,
		@inject(RegisterComponent) private readonly component: RegisterComponent,
		@inject(RegisterController) private readonly controller: RegisterController
	) {
		this.init();
	}

	private async _initCanvas() {
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

	private async _initComponent() {
		this.component.init(this.core());
	}

	private async _initController() {
		this.controller.init(this.component.canvas);
		if (!this.component.core?.thread || !this.component.core?.worker) return;

		const rect = this.component.canvas.getBoundingClientRect();
		this.component.core.thread?.resize?.({
			type: "resize",
			x: this.props.fullScreen
				? window.innerWidth
				: this.component.canvas.width,
			y: this.props.fullScreen
				? window.innerHeight
				: this.component.canvas.height,
			top: rect.top,
			left: rect.left,
			width: this.props.fullScreen
				? window.innerWidth
				: this.component.canvas.width,
			height: this.props.fullScreen
				? window.innerHeight
				: this.component.canvas.height
		});

		this.component.core.thread
			?.lifecycle$()
			.subscribe((state: AppLifecycleState) => {
				if (state === AppLifecycleState.UPDATE_STARTED)
					this.component.stats?.begin();

				if (state === AppLifecycleState.UPDATE_ENDED)
					this.component.stats?.end();
			});
	}

	private async _initCore() {
		const offscreenCanvas = this.component.canvas.transferControlToOffscreen();
		offscreenCanvas.width = this.component.canvas.clientWidth;
		offscreenCanvas.height = this.component.canvas.clientHeight;

		const core = await this.component.workerPool.run<ExposedAppModule>({
			payload: {
				path: this.props.location,
				subject: {
					...excludeProperties(this.props, ["canvas", "location"]),
					canvas: offscreenCanvas
				} satisfies CoreModuleMessageEventData,
				transferSubject: [offscreenCanvas]
			}
		});

		if (!core.thread || !core.worker)
			throw new Error("Unable to retrieve core info.");

		this.component.core = core;
	}

	public async init() {
		registerSerializer(object3DSerializer);

		await this._initCanvas();
		await this._initCore();
		await this._initComponent();
		await this._initController();

		this.controller.lifecycle$$.next(RegisterLifecycleState.INITIALIZED);
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

	public workerPool() {
		return this.component.workerPool as unknown as WorkerPool;
	}

	public canvas() {
		return this.component.canvas;
	}

	public core() {
		return this.component.core;
	}

	public gui() {
		return this.component.gui;
	}

	public resize$() {
		return this.controller.resize$;
	}

	public lifecycle$() {
		return this.controller.lifecycle$;
	}

	public dispose(): void {
		this.component.workerPool.terminateAll();
		this.controller.lifecycle$$.next(RegisterLifecycleState.DISPOSED);
	}
}

/**
 * @description Register the main logic of the app.
 *
 * @important __🏁 Should be called on your main thread. Separated from the core implementation__
 *
 * @param props Quick-three register properties.
 */
export const register = (props: RegisterPropsModel) => {
	if (!props?.location)
		throw new Error(
			"Invalid register props detected. location path is required"
		);

	props.useDefaultCamera =
		props.useDefaultCamera === undefined ? true : props.useDefaultCamera;
	props.withMiniCamera = !!props.withMiniCamera;
	props.startTimer = props.startTimer === undefined ? true : props.startTimer;
	props.fullScreen = props.fullScreen === undefined ? true : props.fullScreen;

	container.register(RegisterPropsModel, { useValue: props });
	return container.resolve(RegisterModule);
};
