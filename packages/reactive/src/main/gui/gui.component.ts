import { singleton } from "tsyringe";

@singleton()
export class GuiComponent {
	private static readonly _CLASS_VISIBLE = "visible";

	public static readonly DOCUMENT_BODY = document.querySelector("body");

	private readonly _layer: HTMLDivElement;
	private readonly _container: HTMLDivElement;

	private _canvas?: HTMLCanvasElement;

	constructor() {
		this._layer = document.createElement("div");
		this._layer.classList.add("gui-layer", GuiComponent._CLASS_VISIBLE);
		this._layer.innerHTML = `<div style="opacity: 1; transition: all .3s;">
			<h1>Click to start</h1>
			<p>Use WASD and Cursor to move.</p>
		</div>`;

		GuiComponent.DOCUMENT_BODY?.appendChild(this._layer);
		this._container = this._layer.firstElementChild as HTMLDivElement;
	}

	public get canvas() {
		return this._canvas;
	}

	public get layer() {
		return this._layer;
	}

	public get container() {
		return this._container;
	}

	public init(canvas: HTMLCanvasElement): void {
		this._canvas = canvas;
	}

	public show(): void {
		this._layer.classList.add(GuiComponent._CLASS_VISIBLE);
		this._container.classList.add(GuiComponent._CLASS_VISIBLE);
	}

	public hide(): void {
		this._layer.classList.remove(GuiComponent._CLASS_VISIBLE);
		this._container.classList.remove(GuiComponent._CLASS_VISIBLE);
	}
}
