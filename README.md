# Quick-ThreeJS

Quick-threeJS is a small open-source library.
As its name says, the lib will quickly set up a 3D scene with as little configuration as possible.

## 🚀 Quick start

Simply import `quick-threejs` and instantiate it as follows:

```typescript
import QuickThreejs from "quick-threejs";

let APP = new QuickThreejs(
 {
  axesSizes: 5,
  gridSizes: 10,
  enableDebug: true,
  withMiniCamera: true,
 },
 "#experience"
);
```

That's it! Now you should see the following screen on your local development server preview:
![image](https://github.com/Neosoulink/quick-threejs/assets/44310540/51f71f5e-404c-437f-bfee-1169aeadbf64)

> 💡 The first parameter is the initialization properties and the second is the dom element reference.
>
> See the types definitions:
>
> - [Initialization property](./src/index.ts?plain=1#L14)
> - [QuickThreejs class](./src/index.ts?plain=1#L97)

Checkout the [Example folder](./example/) for more details

## 🚧 Disclaimer

I have to apologize for not documenting this library well.

At the current time, this library is mainly for personal use.

If find this library interesting or useful and need to improve the library, please raise an [issue](https://github.com/Neosoulink/quick-threejs/issues).
I'll be glad to have your feedback ❤.

## License

MIT License. See the license file for more details.

Copyright @ 2023. Made with ❤ by @Neosoulink.
