import { launchApp } from "@quick-threejs/reactive/worker";
import { CanvasTexture, Color, Mesh, MeshMatcapMaterial } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

launchApp({
	onReady: (app) => {
		app.module.world.scene().background = new Color("#211d20");

		app.module.resize$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.module.wheel$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.module.loader.getLoadCompleted$().subscribe((payload) => {
			const pawn = (payload.loadedResources["pawn"] as GLTF).scene?.children[0];
			const matcap = payload.loadedResources["matcap"];

			if (!(pawn instanceof Mesh) || !(matcap instanceof ImageBitmap)) return;

			const pawnMaterial = new MeshMatcapMaterial({
				color: 0x888888,
				matcap: new CanvasTexture(matcap)
			});

			pawn.rotation.z = Math.PI * 0.055;
			pawn.scale.setScalar(2);
			pawn.material = pawnMaterial;

			app.module.timer.step$().subscribe((payload) => {
				pawn.rotation.y += payload.deltaRatio * 0.05;
			});

			app.module.world.scene().add(pawn);
		});
	}
});
