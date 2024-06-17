import { singleton } from "tsyringe";
import { fromEvent, Observable, map } from "rxjs";
import { Vector2Like } from "three";

@singleton()
export class MainController {
	public resize$!: Observable<Vector2Like>;
	public canvasResize$!: Observable<Vector2Like>;

	init(canvas: HTMLCanvasElement) {
		this.resize$ = fromEvent(window, "resize").pipe(
			map(() => ({
				x: window.innerWidth,
				y: window.innerHeight
			}))
		);

		this.canvasResize$ = this.resize$.pipe(
			map((sizes) => ({
				...sizes,
				x: canvas.width,
				y: canvas.height
			}))
		);
	}
}
