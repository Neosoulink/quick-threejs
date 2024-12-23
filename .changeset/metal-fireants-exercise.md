---
"@quick-threejs/reactive": patch
---

# Logs

## drop unnecessary native supports

- Remove `Stats.js` native support
- Remove `lil-gui` native support
- Threads no longer expose **observable proxy events**
- Drop modules `lifeCycle` integration (to prioritize `Observable`s usage)
  - Add `beforeStep$` Observable.
- Expose `ContainerizedApp` interface for `App` & `Register`
- Update `Timer` resources
  - Add `currentTime`
  - Add `elapsedTime`
  - Rename `delta` to `deltaTime`
  - Move `step()` method from **module to service**
