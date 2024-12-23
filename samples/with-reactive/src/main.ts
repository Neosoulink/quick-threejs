import { register } from "@quick-threejs/reactive";
import Stats from "stats.js";

import "./style.css";

register({
	location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
	enableDebug: true,
	axesSizes: 5,
	gridSizes: 10,
	withMiniCamera: true,
	onReady: async (app) => {
		const stats = new Stats();
		stats.showPanel(0);

		window.document.body.appendChild(stats.dom);

		app.module
			.thread()
			.beforeStep$()
			.subscribe(() => {
				stats.begin();
			});

		app.module
			.thread()
			.step$()
			.subscribe(() => {
				stats.end();
			});

		console.log(app.module);
	}
});
