import type { AppModule } from "../../modules/app/app.module";

/**
 * @description Module representation.
 *
 * @important Each module should `implement` this interface.
 */
export interface Module {
	/**
	 * @description Module initializer method.
	 *
	 * Can be used for direct initialization (when constructing `quick-three`) or manual (later in the code).
	 */
	init(...props: any[]): void;

	/**
	 * @description Module disposal.
	 *
	 * Used to terminate the Module execution and free memory.
	 */
	dispose(): void;
}

/** @description `launchApp` initialization properties. */
export interface LaunchAppProps {
	/**
	 * @description Handler triggered when the app is ready.
	 */
	onReady?: (app: AppModule) => unknown;
}
