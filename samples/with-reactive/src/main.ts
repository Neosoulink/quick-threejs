import { register } from "@quick-threejs/reactive";
import Stats from "stats.js";

import chessPawn from "./assets/3D/pawn.glb?url";

import "./style.css";

register({
	location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
	enableDebug: true,
	axesSizes: 5,
	gridSizes: 10,
	withMiniCamera: true,
	loaderDataSources: [
		{
			name: "pawn",
			path: chessPawn,
			type: "gltfModel"
		},
		{
			name: "videoTexture",
			path: "https://static.pexels.com/lib/videos/free-videos.mp4",
			type: "video"
		}
	],
	onReady: async (app) => {
		const stats = new Stats();
		stats.showPanel(0);

		window.document.body.appendChild(stats.dom);

		app.module
			.thread()
			.beforeStep$?.()
			.subscribe(() => {
				stats.begin();
			});

		app.module
			.thread()
			.step$?.()
			.subscribe(() => {
				stats.end();
			});
	}
});
