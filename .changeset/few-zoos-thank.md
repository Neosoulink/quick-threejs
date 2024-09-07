---
"@quick-threejs/utils": patch
---

# Logs

## fix(utils): `Object3D` serializer resolution

- **Stringify** the received converted Object for worker messaging support
- Deserializer now support the **stringify** JSON `Object3D`

## feat(reactive): share screen sizings to events

- All the register events now share the `canvas` & `window` `height` and `width`
