# `@quick-threejs/reactive`

`@quick-threejs/reactive` is a **reactive** **worker-threads-based** library that provides an approachable vision for working with workers.

The core motivation was to provide a quick integration for using **[three.js](https://threejs.org/)** with **worker threads**.

## 🚀 Quick start

Because `@quick-threejs/reactive` is `worker-thread-based`, you have to split your logic into two parts.

### Main Thread

```typescript
// main.ts
import { register } from "@quick-threejs/reactive";

register({
	location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
	enableDebug: true,
	axesSizes: 5,
	gridSizes: 10,
	withMiniCamera: true,
	onReady: (app) => {
		app
			.gui()
			?.add({ torusX: 0 }, "torusX")
			.step(0.01)
			.onChange((value) => {
				app.worker()?.postMessage({ type: "torus-x-gui-event", value });
			});
	}
});
```

### Worker Thread

```typescript
// main.worker.ts
import { launchApp } from "@quick-threejs/reactive/worker";

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

		app.world.scene().background = new Color("#211d20");
		app.world.scene().add(ambientLight, directionalLight, torus);

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
```

After the configuration of the main part and the worker part, you should have the following screen:
![Screenshot 2024-07-08 at 2 55 59 AM](https://github.com/Neosoulink/quick-threejs/assets/44310540/ccf3f871-8ff9-45af-8fd3-bdff0ac98bfa)

**See the complete [Example folder](../../samples/with-reactive/).**

## Resources

This library uses:

- [RxJS](https://rxjs.dev/)
- [Theads.js](https://threads.js.org/)

---

> I would like to address a special thanks to @barnabasbartha with his [Threejs-Portal](https://github.com/barnabasbartha/Threejs-Portal) which inspired me to create this library ❤️.
