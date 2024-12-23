import { excludeProperties, Properties } from "@quick-threejs/utils";
import {
	animationFrames,
	filter,
	map,
	share,
	Subject,
	takeWhile,
	tap
} from "rxjs";
import { inject, singleton } from "tsyringe";

import { TimerService } from "./timer.service";

@singleton()
export class TimerController {
	private readonly beforeStep$$ = new Subject<Properties<TimerService>>();

	private _previousTime = 0;

	public readonly beforeStep$ = this.beforeStep$$.asObservable();
	public readonly step$ = animationFrames().pipe(
		tap(({ elapsed }) => {
			if (this._previousTime !== elapsed) {
				this.beforeStep$$?.next(excludeProperties(this._service, []));
				this._previousTime = elapsed;
			}
		}),
		filter(() => this._service.enabled),
		takeWhile(() => this._service.enabled),
		map(() => excludeProperties(this._service, [])),
		share()
	);

	constructor(@inject(TimerService) private readonly _service: TimerService) {}
}
