---
"@quick-threejs/reactive": patch
---

# Logs

## refactor(reactive): improve loaders

- Rename supported types
  - Before: `"cubeTexture" | "texture" | "gltfModel" | "video" | "audio"`
  - After: `"audio" | "image" | "video" | "gltf"`
- Now LoaderResource support is defined as `GLTF | ImageBitmap | ImageBitmap[] | AudioBuffer`
- Fix OrbitControl types
