import { singleton } from "tsyringe";
import { fromEvent, Observable, map, tap } from "rxjs";
import { Vector2, Vector2Like } from "three";

@singleton()
export class MainController {
	private readonly _sizes: Vector2 = new Vector2();

	public readonly resize$: Observable<Vector2Like>;

	constructor() {
		this.resize$ = fromEvent(window, "resize").pipe(
			tap(() => {
				this._sizes.x = window.innerWidth;
				this._sizes.y = window.innerHeight;
			}),
			map(() => this._sizes)
		);
	}
}
