# @quick-threejs/worker

## 0.1.21

### Patch Changes

- 1b28aa0: # 10-06-2026

  Resources dependencies upgrades

- Updated dependencies [1b28aa0]
  - @quick-threejs/utils@0.1.22

## 0.1.21

### Patch Changes

- ac4b82b: # 06-19-2026

  ## fix(reactive): lifecycle teardown, performance, and worker stability

  ### @quick-threejs/reactive

  - Track and dispose `RegisterController` DOM/worker event subscriptions on teardown.
  - Dispose the app worker thread before terminating the worker pool.
  - Implement `WorldModule.dispose()` with scene graph resource cleanup and reorder app disposal.
  - Replace per-frame `excludeProperties` timer allocations with a reusable `TimerFramePayload`.
  - Keep the timer stream alive when disabled (`filter` instead of `takeWhile`).
  - Connect Three.js `Timer` to the proxy receiver for visibility-based pausing.
  - Update renderer pixel ratio on resize when `autoPixelRatio` is enabled.
  - Guard aspect ratio division by zero and fix boolean/number module setters.
  - Suppress Vite dynamic import analysis warning for main-thread worker bootstrap.
  - Add structured-clone-safe `TimerFramePayload` (excludes non-serializable `Timer` instance).

  ### @quick-threejs/worker

  - Fix worker message listener removal by reusing a stable handler reference.
  - Release existing workers before re-run and reset idle state on spawn failure.

  ### Samples

  - Fix React Router sample dispose cleanup with a ref-based lifecycle.
  - Add play-audio and dispose/register controls to the `with-reactive` sample.

## 0.1.20

### Patch Changes

- d5e306e: # 05-19-2026

  ## refactor: threejs version bumps

  - Upgrade `three` to ^0.184.0 and `@types/three` to ^0.184.1.
  - Add `@quick-threejs/reactive` getters for `worker` and `thread`
  - Clarify `RegisterPropsBlueprint` debug JSDoc references. (Samples use the new versions locally.
  - `with-reactive-react-router` uses Tailwind v4 `@tailwindcss/postcss` and typed `register({ debug: … })`.)
  - Convert `@commitlint` config to TypeScript and disable `body-max-line-length` rule.

- Updated dependencies [d5e306e]
  - @quick-threejs/utils@0.1.21

## 0.1.19

### Patch Changes

- Updated dependencies [ad90f53]
  - @quick-threejs/utils@0.1.20

## 0.1.18

### Patch Changes

- 3f4095e: # 03-13-2026

  ## chore(deps): upgrade core dependencies

  - Upgrade `three` to `^0.183.1`
  - Upgrade `@types/three` to `^0.183.1`
  - `@quick-threejs/reactive` now uses `THREE.TIMER` instead of `THREE.CLOCK`
  - Fix `Vite` path alias resolution

- Updated dependencies [3f4095e]
  - @quick-threejs/utils@0.1.19

## 0.1.17

### Patch Changes

- a0f6c0a: # 09-12-2025

  ## refactor: move worker out of utils

- Updated dependencies [e9fae86]
- Updated dependencies [a0f6c0a]
  - @quick-threejs/utils@0.1.18

## 0.1.16

## 0.1.15

### Patch Changes

- 4ca0a3a: # Logs

  ## `@quick-threejs/utils`

  - `Threads.js` is now a part of `@quick-threejs/utils`
  - Dropped `rxjs` and the worker lifecycle approach
  - `WorkerPool#run` now returns an array of `WorkerThread` & `queue` boolean
  - Add worker resources documentation
  - Can manually run `WorkerPool#runNext`
  - Improve `terminateAll` behavior
  - Can terminate a thread from a worker using `MessageEvent`

## 0.1.8

### Patch Changes

- 4874023: # Logs

  ## fix(utils): `Object3D` serializer resolution

  - **Stringify** the received converted Object for worker messaging support
  - Deserializer now support the **stringify** JSON `Object3D`

  ## feat(reactive): share screen sizings to events

  - All the register events now share the `canvas` & `window` `height` and `width`
