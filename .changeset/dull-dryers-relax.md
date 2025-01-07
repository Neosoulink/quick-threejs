---
"with-reactive": patch
---

# Logs

## refactor(reactive): enhance `GLTF` serialization

- Add GLTF transferable data to the worker
  - animations (`AnimationClipJSON[]`)
  - cameras (`Camera[]`)
  - parser (`{ json: GLTFParser["json"] }`)
  - scenes (`Group[]`)
