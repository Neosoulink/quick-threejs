# @quick-threejs/utils

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

  ## `@quick-threejs/reactive`

  - Changes based on `@quick-threejs/utils`

## 0.1.14

### Patch Changes

- efbad2d: # Logs

  ## refactor: use `common-js` as default export

## 0.1.13

### Patch Changes

- c7b4279: # Logs

  ## refactor: use `vite` as lib bundler

  - Improve `@quick-three/configs` usability
    - Add an entry file exposing all the resources
    - Drop `tsup` config
    - Add `Vite` config
  - Build `@quick-three/utils` & `@quick-three/reactive` with `Vite` and drop `tsup`
    - Remove thread s`Object3D` serializer.

## 0.1.12

### Patch Changes

- 0c42a30: # Logs

  ## Build utils with `tsup`

  - Build `@quick-three/utils` with `tsup`
  - Add a shred `tsup` config at `@quick-three/configs/tsup.js`

## 0.1.11

### Patch Changes

- 73f97cb: # Logs

  - fix(configs): improve configs accessibility

## 0.1.10

### Patch Changes

- 2908080: # Logs

  - fix: bundles & importation errors corrections

## 0.1.9

### Patch Changes

- 809fcb7: #

  ## refactor(utils): improves `types` exportation

## 0.1.8

### Patch Changes

- 4874023: # Logs

  ## fix(utils): `Object3D` serializer resolution

  - **Stringify** the received converted Object for worker messaging support
  - Deserializer now support the **stringify** JSON `Object3D`

  ## feat(reactive): share screen sizings to events

  - All the register events now share the `canvas` & `window` `height` and `width`

## 0.1.7

### Patch Changes

- 7507a34: - Add new types & export them
  - Add `NonNever`
  - Add `Methods`
  - Add `Properties`

## 0.1.6

### Patch Changes

- 1d2c441: make shared resources public

## 0.1.5
