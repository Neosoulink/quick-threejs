import { singleton } from "tsyringe";

import { Subject } from "rxjs";
import { Vector2Like } from "three";

@singleton()
export class CoreController {
	public readonly lifecycle$$ = new Subject();
	public readonly resize$$ = new Subject<Vector2Like>();

	constructor() {}

	public get lifecycle$() {
		return this.lifecycle$$.pipe();
	}

	public get resize$() {
		return this.resize$$.pipe();
	}

	public resize(sizes: Vector2Like): void {
		this.resize$$.next(sizes);
	}
}
