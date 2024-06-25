import { inject, singleton } from "tsyringe";
import { fromEvent, map, filter } from "rxjs";
import { copyProperties } from "@quick-threejs/utils";

import { AppComponent } from "./app.component";
import {
	KEYBOARD_EVENT_CODES,
	PROXY_EVENT_LISTENERS
} from "../common/constants/event.constants";

@singleton()
export class AppController {
	[x: string]: any;

	private canvas!: HTMLCanvasElement;

	constructor(@inject(AppComponent) private readonly component: AppComponent) {}

	init(canvas: HTMLCanvasElement) {
		this.canvas = canvas;

		const handlers = {
			contextmenu: this.preventDefaultHandler,
			resize: this.uiEventHandler,
			mousedown: this.mouseEventHandler,
			mousemove: this.mouseEventHandler,
			mouseup: this.mouseEventHandler,
			pointerdown: this.mouseEventHandler,
			pointermove: this.mouseEventHandler,
			pointercancel: this.mouseEventHandler,
			pointerup: this.mouseEventHandler,
			touchstart: this.touchEventHandler,
			touchmove: this.touchEventHandler,
			touchend: this.touchEventHandler,
			wheel: this.wheelEventHandler,
			keydown: this.keydownEventHandler
		} as const;

		for (const eventKey of PROXY_EVENT_LISTENERS) {
			const eventHandler = handlers[eventKey];

			this[`${eventKey}$`] = fromEvent<MouseEvent>(
				eventKey === "resize" ? window : canvas,
				eventKey
			)
				.pipe(
					// @ts-ignore
					map(eventHandler.bind(this)),
					filter((e) => (eventKey === "keydown" && !e ? false : true))
				)
				.subscribe((event) => {
					this.component.core.thread?.[eventKey]?.(event);
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

	public mouseEventHandler(e: MouseEvent) {
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

	public keydownEventHandler(e: KeyboardEvent) {
		if (!KEYBOARD_EVENT_CODES.includes(e.code)) return undefined;

		e.preventDefault();
		return copyProperties(e, ["ctrlKey", "metaKey", "shiftKey", "keyCode"]);
	}
}
