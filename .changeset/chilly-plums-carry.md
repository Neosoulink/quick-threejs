---
"@quick-threejs/reactive": patch
"@quick-threejs/config": patch
"@quick-threejs/utils": patch
---

# Logs

## refactor: use `vite` as lib bundler

- Improve `@quick-three/configs` usability
  - Add an entry file exposing all the resources
  - Drop `tsup` config
  - Add `Vite` config
- Build `@quick-three/utils` & `@quick-three/reactive` with `Vite` and drop `tsup`
  - Remove thread s`Object3D` serializer.
