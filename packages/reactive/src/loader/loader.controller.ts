import { Subject } from "rxjs";
import { Lifecycle, scoped } from "tsyringe";
import { filter } from "rxjs";

import { ProgressedResource } from "../common/interfaces/resource.interface";

@scoped(Lifecycle.ResolutionScoped)
export class LoaderController {
	private readonly _lifecycle$$ = new Subject();
	private readonly _progress$$ = new Subject<ProgressedResource>();
	private readonly _progress$ = this.progress$$.pipe();

	public get lifecycle$$() {
		return this._lifecycle$$;
	}

	public get progress$$() {
		return this._progress$$;
	}

	public get lifecycle$() {
		return this._lifecycle$$.pipe();
	}

	public get progress$() {
		return this.progress$$.pipe();
	}

	public get progressCompleted$() {
		return this._progress$.pipe(
			filter((resource) => resource.toLoad === resource.loaded)
		);
	}
}
