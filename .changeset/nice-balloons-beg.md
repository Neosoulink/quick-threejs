---
"@quick-threejs/reactive": patch
---

# Logs

## feat(reactive): add font loader support

- Add support for fonts
- Add `getBeforeRender$()` & `getAfterRender$()` app module getters
- Fix app module `thread` getter type
- Expose the register `offscreenCanvas`
- Register getters `canvas`, `thread`, `worker` & `workerPool` name starts now with a `get` (e.g `getThread()`)
