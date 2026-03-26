import { inject, Lifecycle, scoped } from "tsyringe";
import { copyProperties } from "@quick-threejs/utils";
import {
	createWorkerPool,
	type WorkerPool,
	type WorkerThreadResolution
} from "@quick-threejs/worker";

import {
	type OffscreenCanvasStb,
	KEYBOARD_EVENT_CODES,
	RegisterPropsBlueprint
} from "@/common";
import { ExposedAppModule } from "../app/app.worker";

@scoped(Lifecycle.ContainerScoped)
export class RegisterService {
	public readonly workerPool: WorkerPool;

	public canvas?: HTMLCanvasElement;
	public canvasWrapper?: HTMLElement;
	public offscreenCanvas?: OffscreenCanvasStb;
	public workerThread?: WorkerThreadResolution<ExposedAppModule>;

	constructor(
		@inject(RegisterPropsBlueprint)
		private readonly _props: RegisterPropsBlueprint
	) {
		this.workerPool = createWorkerPool(undefined, !!this._props.debug?.enabled);
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
			wrapperWidth: this.canvasWrapper?.clientWidth ?? 0,
			wrapperHeight: this.canvasWrapper?.clientHeight ?? 0,
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
