import { register } from "@quick-threejs/reactive";
import Stats from "stats.js";

import chessPawn from "./assets/3D/pawn.glb?url";
import matCapImg from "./assets/textures/matcap.jpg?url";

import "./style.css";

register({
	location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
	enableDebug: true,
	enableControls: true,
	axesSizes: 5,
	gridSizes: 10,
	withMiniCamera: true,
	withCameraHelper: true,
	loaderDataSources: [
		{
			name: "pawn",
			path: chessPawn,
			type: "gltf"
		},
		{
			name: "matcap",
			path: matCapImg,
			type: "image"
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
