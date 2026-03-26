# @quick-threejs/worker

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
