import { Subject } from "rxjs";
import { singleton } from "tsyringe";

@singleton()
export class WorldController {
	public readonly enable$$ = new Subject<boolean>();
	public readonly enable$ = this.enable$$.pipe();
}
