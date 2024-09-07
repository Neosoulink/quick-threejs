# @quick-threejs/reactive

## 0.1.13

### Patch Changes

- 57527ed: # patch

  ## feat(reactive): share screen sizings to events

  - All the register events now share the `canvas` & `window` `height` and `width`

## 0.1.12

### Patch Changes

- 7ef2ec8: # Logs

  ## refactor(reactive): use `setAnimationLoop`

  - `Timer` now use `renderer..setAnimationLoop` instead of `requestAnimationFrame`
    - `Timer` is now initialized after the `Renderer`
  - The timer animation callback method is now called `step`
    - Update the live cycles states with a **STEP\_** prefix instead of **UPDATE\_**

- Updated dependencies [4874023]
  - @quick-threejs/utils@0.1.8

## 0.1.12

### Patch Changes

- b675af0: # Changes

  ## refactor(reactive): export missing base resources

  - `setDefaultCamera` cameraComponent is now `initDefaultCamera`
  - `lil-gui` is now a peer-dependency
  - `TimerModule` now export `step# @quick-threejs/reactive
  - `WorldModule` now export `enable# @quick-threejs/reactive

## 0.1.11

### Patch Changes

- dab1876: #### refactor: improves resources importation

  - Export resources from sub folders

## 0.1.10

### Patch Changes

- 358bf6f: #### refactor: expose missing modules resources

  - Models now export there components & controllers properties

  #### chore(deps): define `peerDependencies`

  - Add `tsyringe` as peer-dependency
  - Add `stats.js` as peer-dependency
    - Set `stats.js` as optional peer-dependecy

- Updated dependencies [7507a34]
  - @quick-threejs/utils@0.1.7

## 0.1.9

### Patch Changes

- 153edba: Improve samples & documetations

## 0.1.8

### Patch Changes

- 2dd41f7: Compiled outputs correction & documentatiom improvements

## 0.1.7

### Patch Changes

- Updated dependencies [1d2c441]
  - @quick-threejs/utils@0.1.6

## 0.1.6

### Patch Changes

- ad4b1fc: v0.1.6 `@quick-threejs/reactive`documentation improvement.

## 0.1.5
