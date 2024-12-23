import { launchApp } from "@quick-threejs/reactive/worker";
import {
	AmbientLight,
	Color,
	DirectionalLight,
	Mesh,
	MeshToonMaterial,
	TorusKnotGeometry
} from "three";

launchApp({
	onReady: (app) => {
		const ambientLight = new AmbientLight(0xffffff, 0.1);
		const directionalLight = new DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(0, 0, 1);

		const torus = new Mesh(
			new TorusKnotGeometry(0.8, 0.35, 100, 16),
			new MeshToonMaterial({
				color: 0x454545
			})
		);

		self.onmessage = (event: MessageEvent) => {
			if (event.data?.type === "torus-x-gui-event") {
				torus.position.x = event.data.value;
			}
		};

		app.module.world.scene().background = new Color("#211d20");
		app.module.world.scene().add(ambientLight, directionalLight, torus);

		app.module.resize$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.module.wheel$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.module.timer.step$().subscribe((payload) => {
			torus.rotateY(payload.deltaRatio * 0.01);
			torus.rotateX(payload.deltaRatio * 0.01);
		});
	}
});
