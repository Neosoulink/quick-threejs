import { launchApp } from "@quick-threejs/reactive/worker";
import {
	AmbientLight,
	Color,
	DirectionalLight,
	Mesh,
	MeshToonMaterial
} from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

launchApp({
	onReady: (app) => {
		const ambientLight = new AmbientLight(0xffffff, 0.1);
		const directionalLight = new DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(0, 0, 1);

		app.module.world.scene().background = new Color("#211d20");
		app.module.world.scene().add(ambientLight, directionalLight);

		app.module.resize$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.module.wheel$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.module.loader.getLoad$().subscribe((payload) => {
			const { resource } = payload;
			const { scene: pawnScene } = (resource as GLTF | undefined) || {};
			const pawn = pawnScene?.children?.[0] as Mesh | undefined;

			if (!(pawn instanceof Mesh)) return;

			const pawnMaterial = new MeshToonMaterial({
				color: 0x777777
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
