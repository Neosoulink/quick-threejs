import { launchApp } from "@quick-threejs/reactive/worker";
import { CanvasTexture, Color, Mesh, MeshMatcapMaterial } from "three";
import { Font, GLTF, TextGeometry } from "three/examples/jsm/Addons.js";

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
			const pawn = (payload.loadedResources["pawn"] as GLTF).scene
				?.children[0] as Mesh;
			const font = app.module.loader.getLoadedResources()[
				"helvetikerFont"
			] as Font;
			const matcap = payload.loadedResources["matcap"];

			if (!pawn.isMesh || !(matcap instanceof ImageBitmap) || !font.isFont)
				return;

			const material = new MeshMatcapMaterial({
				color: 0x888888,
				matcap: new CanvasTexture(matcap)
			});
			const text = new Mesh(
				new TextGeometry("@quick-threejs/reactive", {
					font,
					size: 0.5,
					depth: 0.2,
					curveSegments: 12,
					bevelEnabled: true,
					bevelThickness: 0.03,
					bevelSize: 0.02,
					bevelOffset: 0,
					bevelSegments: 4
				}),
				material
			);

			pawn.rotation.z = Math.PI * 0.055;
			pawn.scale.setScalar(2);
			pawn.material = material;

			text.position.set(0, 2.5, 0);
			text.geometry.center();

			app.module.timer.step$().subscribe((payload) => {
				pawn.rotation.y += payload.deltaRatio * 0.05;
			});

			app.module.world.scene().add(pawn, text);
		});
	}
});
