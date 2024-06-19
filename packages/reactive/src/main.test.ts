import { launchApp } from "./core/core.module-worker";

launchApp({
	onReady: (app) => {
		console.log(app);
	}
});
