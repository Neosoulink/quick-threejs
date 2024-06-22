import { Subject } from "rxjs";
import { Lifecycle, scoped } from "tsyringe";
import { filter } from "rxjs";

import { ProgressedResource } from "../common/interfaces/resource.interface";

@scoped(Lifecycle.ResolutionScoped)
export class LoaderController {
	public readonly lifecycle$$ = new Subject();
	public readonly progress$$ = new Subject<ProgressedResource>();
	public readonly progress$ = this.progress$$.pipe();
	public readonly lifecycle$ = this.lifecycle$$.pipe();
	public readonly progressCompleted$ = this.progress$.pipe(
		filter((resource) => resource.toLoad === resource.loaded)
	);
}
