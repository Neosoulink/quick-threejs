import { register } from "@quick-threejs/reactive";
import Stats from "stats.js";

import pawnGltf from "./assets/3D/pawn.glb?url";
import matCapImg from "./assets/textures/matcap.jpg?url";
import sampleAudio from "./assets/audios/sample.mp3?url";
import helvetikerFont from "./assets/fonts/helvetiker_regular.typeface.json?url";

import "./style.css";
import { Audio, AudioListener } from "three";

const registerApp = () =>
	register({
		location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
		enableDebug: true,
		enableControls: true,
		axesSizes: 5,
		gridSizes: 10,
		withMiniCamera: true,
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
				name: "helvetikerFont",
				path: helvetikerFont,
				type: "font"
			}
		],
		onReady: async (app) => {
			const stats = new Stats();
			const thread = app.module.getThread();
			stats.showPanel(0);

			window.document.body.appendChild(stats.dom);

			thread.getBeforeRender$?.().subscribe(() => {
				stats.begin();
			});

			thread.getStep$?.().subscribe(() => {
				stats.end();
			});

			app.module.loader.getLoadCompleted$().subscribe((payload) => {
				const sample = payload.loadedResources["sample"];

				if (!(sample instanceof AudioBuffer)) return;

				const audioListener = new AudioListener();
				const sampleAudio = new Audio(audioListener);
				sampleAudio.setBuffer(sample);

				document.onclick = () => {
					sampleAudio.stop();
					sampleAudio.play();
				};
			});
		}
	});

registerApp();

// HOW TO DISPOSE APP
// const app1 = registerApp();
// setTimeout(() => {
// 	app1.container.clearInstances();
// 	app1.container.dispose();
// 	document.onclick = null;
// }, 1500);

// setTimeout(() => {
// 	registerApp();
// }, 3000);
