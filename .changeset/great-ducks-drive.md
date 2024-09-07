---
"@quick-threejs/reactive": patch
---

# Logs

## refactor(reactive): use `setAnimationLoop`

- `Timer` now use `renderer..setAnimationLoop` instead of `requestAnimationFrame`
  - `Timer` is now initialized after the `Renderer`
- The timer animation callback method is now called `step`
  - Update the live cycles states with a **STEP\_** prefix instead of **UPDATE\_**
