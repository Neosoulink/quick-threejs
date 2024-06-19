import { singleton } from "tsyringe";

import { Subject } from "rxjs";
import { Vector2Like } from "three";
import { EventStatus } from "../common/enums/event.enum";

@singleton()
export class CoreController {
	public readonly lifecycle$$ = new Subject<EventStatus>();
	public readonly resize$$ = new Subject<Vector2Like>();
	public readonly lifecycle$ = this.lifecycle$$.pipe();
	public readonly resize$ = this.resize$$.pipe();

	public resize(sizes: Vector2Like): void {
		this.resize$$.next(sizes);
	}
}
