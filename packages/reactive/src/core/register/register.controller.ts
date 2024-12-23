import { inject, singleton } from "tsyringe";
import { fromEvent, map, filter } from "rxjs";
import { copyProperties } from "@quick-threejs/utils";

import { RegisterService } from "./register.service";
import {
	KEYBOARD_EVENT_CODES,
	PROXY_EVENT_LISTENERS
} from "../../common/constants/event.constants";
import { ProxyEventHandlersModel } from "../../common/models/proxy-event-handler.model";

@singleton()
export class RegisterController extends ProxyEventHandlersModel {
	private canvas!: HTMLCanvasElement;

	constructor(
		@inject(RegisterService) private readonly _service: RegisterService
	) {
		super();
	}

	public init(canvas: HTMLCanvasElement) {
		this.canvas = canvas;

		for (const key of PROXY_EVENT_LISTENERS) {
			const eventHandler =
				key.startsWith("mouse") ||
				key.startsWith("pointer") ||
				key.startsWith("touch")
					? this.mouseEventHandler
					: key.startsWith("key")
						? this.keyEventHandler
						: key === "resize"
							? this.uiEventHandler
							: key === "wheel"
								? this.wheelEventHandler
								: this.preventDefaultHandler;

			// @ts-ignore - This is a dynamic property
			this[`${key}$`] = fromEvent<MouseEvent>(
				key === "resize" ? window : canvas,
				key
			).pipe(
				// @ts-ignore
				map(eventHandler.bind(this)),
				filter((e) => (key === "keydown" && !e ? false : true))
			);
			this[`${key}$`].subscribe((event) => {
				this._service.thread?.[key]?.(event);
			});
		}
	}

	public preventDefaultHandler(e: Event) {
		e.preventDefault();

		return {
			type: e.type
		};
	}

	public getScreenSizes() {
		return {
			width: this.canvas.width,
			height: this.canvas.height,
			windowWidth: window?.innerWidth ?? 0,
			windowHeight: window?.innerHeight ?? 0
		};
	}

	public uiEventHandler(e: UIEvent) {
		const rect = this.canvas.getBoundingClientRect();

		return {
			...this.getScreenSizes(),
			type: e.type,
			top: rect.top,
			left: rect.left
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
