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
import { inject, Lifecycle, scoped } from "tsyringe";

import { TimerService } from "./timer.service";

@scoped(Lifecycle.ContainerScoped)
export class TimerController {
	private readonly _beforeStep$$ = new Subject<Properties<TimerService>>();
	private _oldElapsed = 0;

	public readonly beforeStep$ = this._beforeStep$$.asObservable();
	public readonly step$ = animationFrames().pipe(
		tap(({ elapsed }) => {
			if (this._oldElapsed !== elapsed) {
				this._beforeStep$$?.next(excludeProperties(this._service, []));
				this._oldElapsed = elapsed;
			}
		}),
		filter(() => this._service.enabled),
		takeWhile(() => this._service.enabled),
		map(() => excludeProperties(this._service, [])),
		share()
	);

	constructor(@inject(TimerService) private readonly _service: TimerService) {}
}
