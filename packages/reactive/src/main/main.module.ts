import "reflect-metadata";

import { container, inject, singleton } from "tsyringe";
import { registerSerializer } from "threads";
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Scene } from "three";
import { WorkerPool } from "@quick-threejs/utils";
import { WorkerThreadResolution } from "@quick-threejs/utils/dist/types/worker.type";

import { MainDto } from "./dto/main.dto";
import { MainController } from "./main.controller";
import { ExposedLoaderModule } from "../loader/loader.module-worker";
import { ExposedCoreModule } from "../core/core.module-worker";
import { LoaderModule } from "../loader/loader.module";
import { Module } from "../common/interfaces/module.interface";
import {
	ProgressedResource,
	Resource
} from "../common/interfaces/resource.interface";
import { object3DSerializer } from "../common/serializers/object3d.serializer";
import { debounceTime, Subject } from "rxjs";

@singleton()
class MainModule implements Module {
	private _workerPool = WorkerPool();
	private _canvas!: HTMLCanvasElement;
	private _core!: WorkerThreadResolution<ExposedCoreModule>;
	public scene?: Scene;

	constructor(
		@inject(MainDto.name) private readonly props: MainDto,
		@inject(MainController) private readonly controller: MainController
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
		offscreenCanvas.width = this._canvas.clientWidth;
		offscreenCanvas.height = this._canvas.clientHeight;

		const core = await this._workerPool.run<ExposedCoreModule>({
			payload: {
				path: new URL("../core/core.module-worker.ts", import.meta.url),
				subject: { canvas: offscreenCanvas },
				transferSubject: [offscreenCanvas]
			}
		});

		if (core.thread && core.worker) {
			this._core = core;
			core.thread.setTimerStatus(true);
			core.thread.scene().subscribe((val) => {
				if (val instanceof Scene) {
					const scene$$ = new Subject<Scene>();
					scene$$.pipe(debounceTime(0)).subscribe((scene) => {
						core.thread?.scene(scene);
					});

					this.scene = new Proxy(val, {
						get: (target, property) => {
							scene$$.next(target);
							return target[property];
						},
						set: (target) => {
							scene$$.next(target);
							return true;
						}
					});

					core.thread?.step$().subscribe(() => {
						this.scene?.updateMatrix();
					});
				}
			});

			this._initController();
		}
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

	public dispose(): void {
		this._workerPool.terminateAll();
	}
}

export const QuickThree = (props?: MainDto) => {
	const mainProps = new MainDto();
	mainProps.canvas = props?.canvas;

	container.register(MainDto.name, { useValue: mainProps });
	return container.resolve(MainModule);
};

if (process.env.NODE_ENV === "development") {
	const canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const app = QuickThree({ canvas });

	setTimeout(() => {
		const box = new Mesh(
			new BoxGeometry(1, 1, 1),
			new MeshBasicMaterial({ color: new Color(0xff0000) })
		);
		app.scene?.add(box);
	}, 1000);
}
