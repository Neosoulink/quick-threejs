---
"@quick-threejs/reactive": patch
---

# Logs

## refactor: handle loader module

- Make loader accessible from the `main` & `worker` thread
  - Add the register props`loaderDataSources` & `loadResourcesOnInit`
  - Improve resources getters
  - Handle `videoTexture` and `Object3D` loads
- Code optimization and observable data access
