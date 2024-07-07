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
		const torus = new Mesh(new TorusKnotGeometry(), new MeshNormalMaterial());

		self.onmessage = (event: MessageEvent) => {
			if (event.data?.type === "torus-x-gui-event") {
				torus.position.x = event.data.value;
			}
		};

		app.world.scene().add(torus);

		app.resize$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.wheel$?.().subscribe((event) => {
			console.log(event.type);
		});

		app.timer.step$().subscribe(() => {
			torus.rotateY(0.1);
			torus.rotateX(0.01);
		});
	}
});
```

## Resources

This library uses:

- [RxJS](https://rxjs.dev/)
- [Theads.js](https://threads.js.org/)

---

> I would like to address a special thanks to @barnabasbartha with his [Threejs-Portal](https://github.com/barnabasbartha/Threejs-Portal) which inspired me to create this library ❤️.
