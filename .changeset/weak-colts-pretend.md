---
"@quick-threejs/reactive": patch
"@quick-threejs/utils": patch
---

# Logs

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
