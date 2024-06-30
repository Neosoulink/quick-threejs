import { inject, singleton } from "tsyringe";
import { fromEvent, map, filter, Subject } from "rxjs";
import { copyProperties } from "@quick-threejs/utils";

import { AppComponent } from "./app.component";
import {
	KEYBOARD_EVENT_CODES,
	PROXY_EVENT_LISTENERS
} from "../common/constants/event.constants";
import type { AppLifecycleState } from "../common/enums/lifecycle.enum";
import { ProxyEventHandlersModel } from "../common/models/proxy-event-handler.model";

@singleton()
export class AppController extends ProxyEventHandlersModel {
	private canvas!: HTMLCanvasElement;

	public readonly lifecycle$$ = new Subject<AppLifecycleState>();
	public readonly lifecycle$ = this.lifecycle$$.pipe();

	constructor(@inject(AppComponent) private readonly component: AppComponent) {
		super();
	}

	init(canvas: HTMLCanvasElement) {
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

			// @ts-ignore
			this[`${key}$`] = fromEvent<MouseEvent>(
				key === "resize" ? window : canvas,
				key
			)
				.pipe(
					// @ts-ignore
					map(eventHandler.bind(this)),
					filter((e) => (key === "keydown" && !e ? false : true))
				)
				.subscribe((event) => {
					this.component.core.thread?.[key]?.(event);
				});
		}
	}

	public preventDefaultHandler(e: Event) {
		e.preventDefault();

		return {
			type: e.type
		};
	}

	public uiEventHandler(e: UIEvent) {
		const rect = this.canvas.getBoundingClientRect();

		return {
			type: e.type,
			x: window?.innerWidth ?? 0,
			y: window?.innerHeight ?? 0,
			top: rect.top,
			left: rect.left,
			width: this.canvas.width,
			height: this.canvas.height
		};
	}

	public mouseEventHandler(e: PointerEvent) {
		return copyProperties(e, [
			"ctrlKey",
			"metaKey",
			"shiftKey",
			"button",
			"pointerType",
			"clientX",
			"clientY",
			"pageX",
			"pageY"
		]);
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

		return data;
	}

	public wheelEventHandler(e: WheelEvent) {
		e.preventDefault();

		return copyProperties(e, ["deltaX", "deltaY"]);
	}

	public keyEventHandler(e: KeyboardEvent) {
		if (!KEYBOARD_EVENT_CODES.includes(e.code)) return undefined;

		e.preventDefault();
		return copyProperties(e, ["ctrlKey", "metaKey", "shiftKey", "keyCode"]);
	}
}
