# @quick-threejs/reactive

## 0.1.21

### Patch Changes

- 57c90f8: # logs

  ## refactor(reactive): use addon js importation

## 0.1.20

### Patch Changes

- eb4ee1b: # Logs

  ## refactor(reactive): drop `threejs` `Addon` imports

## 0.1.19

### Patch Changes

- 5641c96: # Logs

  ## chore(deps): set `stats.js` as dependency

## 0.1.18

### Patch Changes

- 0c42a30: # Logs

  ## Build utils with `tsup`

  - Build `@quick-three/utils` with `tsup`
  - Add a shred `tsup` config at `@quick-three/configs/tsup.js`

- Updated dependencies [0c42a30]
  - @quick-threejs/utils@0.1.12

## 1.0.1

### Patch Changes

- a412ec7: # Logs

  - fix(reactive): correct version to `0.1.16`

## 1.0.0

### Major Changes

- 6740fae: # Logs

  - chore(reactive): use [tsup](https://tsup.egoist.dev/) as build manager

## 0.1.16

### Patch Changes

- 73f97cb: # Logs

  - fix(configs): improve configs accessibility

- Updated dependencies [73f97cb]
  - @quick-threejs/utils@0.1.11

## 0.1.15

### Patch Changes

- 2908080: # Logs

  - fix: bundles & importation errors corrections

- Updated dependencies [2908080]
  - @quick-threejs/utils@0.1.10

## 0.1.14

### Patch Changes

- 1f8ab82: #

  ## fix(reactive): define events & streams types

  - Correct resize observable values types
  - Use widowÏ height and width to set the default renderer aspect

- Updated dependencies [809fcb7]
  - @quick-threejs/utils@0.1.9

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
