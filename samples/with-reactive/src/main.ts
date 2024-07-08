import { register } from "@quick-threejs/reactive";

import "./style.css";

register({
	location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
	enableDebug: true,
	axesSizes: 5,
	gridSizes: 10,
	withMiniCamera: true,
	onReady: (app) => {
		app
			.gui()
			?.add({ torusX: 0 }, "torusX")
			.step(0.01)
			.onChange((value: any) => {
				app.worker()?.postMessage({ type: "torus-x-gui-event", value });
			});
	}
});
