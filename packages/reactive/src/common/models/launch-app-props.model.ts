import type { ContainerizedApp, Module } from "../../main";

/** @description `launchApp` initialization properties. */
export class LaunchAppProps<M extends Module> {
	/** @description Handler triggered when the app is ready. */
	onReady?: (workerApp: ContainerizedApp<M>) => unknown;
}
