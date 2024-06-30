import { Mesh, MeshNormalMaterial, TorusKnotGeometry } from "three";

import { launchApp } from "./modules/app/app.module-worker";

if (process.env.NODE_ENV === "development") {
	launchApp({
		onReady: (app) => {
			const torus = new Mesh(new TorusKnotGeometry(), new MeshNormalMaterial());

			self.onmessage = (event: MessageEvent) => {
				if (event.data?.type === "gui-event") console.log(event.data.type);
			};

			app.world.scene().add(torus);

			app.resize$?.().subscribe((event) => {
				console.log(event);
			});

			console.log(app);

			app.timer.step$().subscribe(() => {
				torus.rotateY(0.1);
				torus.rotateX(0.01);
			});
		}
	});
}

export { launchApp };
