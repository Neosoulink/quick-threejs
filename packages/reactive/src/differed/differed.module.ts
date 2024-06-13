import "reflect-metadata";

import { container, Lifecycle, scoped } from "tsyringe";
import { expose } from "threads/worker";
import { Observable, Subject } from "threads/observable";
import { WorkerModule } from "threads/dist/types/worker";

import { WorkerThreadModule } from "@quick-threejs/utils";
import { Module } from "../common/interfaces/module.interface";

export type ExposedDifferedModule = WorkerModule<
	Exclude<keyof DifferedModule, number | symbol>
>;

@scoped(Lifecycle.ResolutionScoped)
export class DifferedModule implements Module, WorkerThreadModule {
	private readonly _lifecycleSubject = new Subject();

	constructor() {
		setTimeout(() => {
			this._lifecycleSubject.complete();
		}, 2000);
	}

	public run(task: () => unknown) {
		try {
			if (typeof task !== "function") throw new Error("Wrong task type");

			return task();
		} catch (err) {
			return console.log("Unable to execute the task:\n", err);
		}
	}

	public lifecycle() {
		return Observable.from(this._lifecycleSubject);
	}

	public init() {}
}

const differedModule = container.resolve(DifferedModule);

expose({
	run: differedModule.run.bind(differedModule),
	lifecycle: differedModule.lifecycle.bind(differedModule),
	init: () => {}
} satisfies ExposedDifferedModule);
