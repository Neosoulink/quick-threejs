import { launchApp } from "@quick-threejs/reactive/worker";
import { Color, Mesh, MeshNormalMaterial, TorusKnotGeometry } from "three";

launchApp({
	onReady: (app) => {
		const torus = new Mesh(new TorusKnotGeometry(), new MeshNormalMaterial());

		self.onmessage = (event: MessageEvent) => {
			if (event.data?.type === "torus-x-gui-event") {
				torus.position.x = event.data.value;
			}
		};

		app.world.scene().background = new Color("#211d20");

		app.world.scene().add(torus);

		app.resize$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.wheel$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.timer.step$().subscribe(() => {
			torus.rotateY(0.05);
			torus.rotateX(0.001);
		});
	}
});
