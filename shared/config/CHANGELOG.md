# @quick-threejs/config

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

- 9baddc4: # Logs

  - fix(configs): drop main root exporter

## 0.1.10

### Patch Changes

- 73f97cb: # Logs

  - fix(configs): improve configs accessibility

## 0.1.9

### Patch Changes

- 2908080: # Logs

  - fix: bundles & importation errors corrections

## 0.1.8

### Patch Changes

- 7926349: #### chore: correct `@typescript-eslint` plugin ussage

  - use `@typescript-eslint` without `/eslint-plugin`
    - disabled `@typescript-eslint/no-var-requires`

## 0.1.7

### Patch Changes

- 587d290: # Summary

  Removes the `only-warn` plugins to the`@quick-three/configs`

  ## Logs

  - Remove `only-warn` to the `eslint` plugins props
  - Remove `eslint-plugin-only-warn` dependency to `@quick-three/configs`

## 0.1.6

### Patch Changes

- 1d2c441: make shared resources public

## 0.1.5
