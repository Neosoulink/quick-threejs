import { inject, Lifecycle, scoped } from "tsyringe";
import {
	copyProperties,
	createWorkerPool,
	WorkerPool
} from "@quick-threejs/utils";
import { WorkerThreadResolution } from "@quick-threejs/utils";

import { KEYBOARD_EVENT_CODES, RegisterPropsBlueprint } from "../../common";
import { ExposedAppModule } from "../app/app.util";

@scoped(Lifecycle.ContainerScoped)
export class RegisterService {
	public readonly workerPool: WorkerPool;

	public canvas?: HTMLCanvasElement;
	public offscreenCanvas?: OffscreenCanvas;
	public worker?: WorkerThreadResolution<ExposedAppModule>["worker"];
	public thread?: WorkerThreadResolution<ExposedAppModule>["thread"];

	constructor(
		@inject(RegisterPropsBlueprint)
		private readonly _props: RegisterPropsBlueprint
	) {
		this.workerPool = createWorkerPool(undefined, this._props.enableDebug);
	}

	public init(app: WorkerThreadResolution<ExposedAppModule>) {
		this.worker = app.worker;
		this.thread = app.thread;
	}

	public preventDefaultHandler(e: Event) {
		e.preventDefault();

		return {
			type: e.type
		};
	}

	public getScreenSizes() {
		return {
			width: this.canvas?.width,
			height: this.canvas?.height,
			windowWidth: window?.innerWidth ?? 0,
			windowHeight: window?.innerHeight ?? 0
		};
	}

	public uiEventHandler(e: UIEvent) {
		const rect = this.canvas?.getBoundingClientRect();

		return {
			...this.getScreenSizes(),
			type: e.type,
			top: rect?.top,
			left: rect?.left
		};
	}

	public mouseEventHandler(e: PointerEvent) {
		return {
			...this.getScreenSizes(),
			...copyProperties(e, [
				"ctrlKey",
				"metaKey",
				"shiftKey",
				"button",
				"pointerType",
				"clientX",
				"clientY",
				"pageX",
				"pageY"
			])
		};
	}

	public touchEventHandler(e: TouchEvent) {
		const touches: {
			pageX: number;
			pageY: number;
		}[] = [];

		const data = { type: e.type, touches };
		for (let i = 0; i < e.touches.length; ++i) {
			const touch = e.touches[i];
			touches.push({
				pageX: touch?.pageX ?? 0,
				pageY: touch?.pageY ?? 0
			});
		}

		return { ...this.getScreenSizes(), ...data };
	}

	public wheelEventHandler(e: WheelEvent) {
		e.preventDefault();

		return {
			...this.getScreenSizes(),
			...copyProperties(e, ["deltaX", "deltaY"])
		};
	}

	public keyEventHandler(e: KeyboardEvent) {
		if (!KEYBOARD_EVENT_CODES.includes(e.code)) return undefined;

		e.preventDefault();

		return {
			...this.getScreenSizes(),
			...copyProperties(e, ["ctrlKey", "metaKey", "shiftKey", "keyCode"])
		};
	}
}
