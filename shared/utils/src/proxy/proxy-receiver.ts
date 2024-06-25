import { BaseEvent, EventDispatcher } from "three";

const noop = () => {};

export class ProxyReceiver<
	T extends Record<string, any>
> extends EventDispatcher<T> {
	public readonly style: Partial<HTMLCanvasElement["style"]> = {};

	public width = 0;
	public height = 0;
	public left = 0;
	public top = 0;

	constructor() {
		super();
		this.getRootNode = this.getRootNode.bind(this);
		this.handleEvent = this.handleEvent.bind(this);
	}

	setPointerCapture() {}

	releasePointerCapture() {}

	getRootNode() {
		return this;
	}

	getBoundingClientRect() {
		return {
			left: this.left,
			top: this.top,
			width: this.width,
			height: this.height,
			right: this.left + this.width,
			bottom: this.top + this.height
		};
	}

	handleEvent<TEvent extends Extract<keyof T, string>>(
		event: BaseEvent<TEvent> & T[TEvent]
	) {
		if (event.type === "resize") {
			this.left = event.left ?? 0;
			this.top = event.top ?? 0;
			this.width = event.width ?? 0;
			this.height = event.height ?? 0;
			return;
		}

		event.preventDefault = noop;
		event.stopPropagation = noop;

		this.dispatchEvent(event);
	}

	focus() {}
}
