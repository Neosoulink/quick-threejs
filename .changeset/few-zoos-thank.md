---
"@quick-threejs/utils": patch
---

# Logs

## fix(utils): `Object3D` serializer resolution

- **Stringify** the received converted Object for worker messaging support
- Deserializer now support the **stringify** JSON `Object3D`
