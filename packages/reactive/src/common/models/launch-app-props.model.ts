import type { AppModule } from "../../main";

/** @description `launchApp` initialization properties. */
export class LaunchAppProps {
	/**
	 * @description Handler triggered when the app is ready.
	 */
	onReady?: (app: AppModule) => unknown;
}
