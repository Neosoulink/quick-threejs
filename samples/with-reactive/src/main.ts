import { register } from "@quick-threejs/reactive";
import Stats from "stats.js";

import pawnGltf from "./assets/3D/pawn.glb?url";
import matCapImg from "./assets/textures/matcap.jpg?url";
import sampleAudio from "./assets/audios/sample.mp3?url";

import "./style.css";
import { Audio, AudioListener } from "three";

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
			path: pawnGltf,
			type: "gltf"
		},
		{
			name: "matcap",
			path: matCapImg,
			type: "image"
		},
		{
			name: "sample",
			path: sampleAudio,
			type: "audio"
		},
		{
			name: "free-video",
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

		app.module.loader.getLoadCompleted$().subscribe((payload) => {
			const sample = payload.loadedResources["sample"];

			if (!(sample instanceof AudioBuffer)) return;

			const audioListener = new AudioListener();
			const sampleAudio = new Audio(audioListener);
			sampleAudio.setBuffer(sample);

			document.addEventListener("click", () => {
				sampleAudio.stop();
				sampleAudio.play();
			});
		});
	}
});
