import { Mesh, MeshBasicMaterial, TorusKnotGeometry } from "three";
import { launchApp } from "./core/core.module-worker";

launchApp({
	onReady: (app) => {
		const torus = new Mesh(
			new TorusKnotGeometry(),
			new MeshBasicMaterial({ color: 0xff0000 })
		);

		app.world.scene.add(torus);

		app.timer.step$().subscribe(() => {
			torus.rotateY(0.01);
			torus.rotateX(0.005);
		});
	}
});
