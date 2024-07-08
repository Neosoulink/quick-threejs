# `@quick-threejs/legacy`

`@quick-threejs/legacy` is a small library.
This lib was designed to quickly start a `ThreeJS` app. It'll set up a 3D scene with as little configuration as possible.

## 🚀 Quick start

Simply import `@quick-threejs/legacy` and instantiate it as follows:

```typescript
import QuickThreejs from "@quick-threejs/legacy";

let APP = new QuickThreejs(
	{
		axesSizes: 5,
		gridSizes: 10,
		enableDebug: true,
		withMiniCamera: true
	},
	"#experience"
);
```

That's it! Now you should see the following screen on your local development server preview:
![image](https://github.com/Neosoulink/quick-threejs/assets/44310540/51f71f5e-404c-437f-bfee-1169aeadbf64)

### Understanding

`@quick-threejs/legacy` is designed to be usage simple.

💡 The first parameter is the initialization properties and the second is the `DOMElement` reference.

For more details about the about the available properties, see:

- [Initialization property](./src/index.ts?plain=1#L14)
- [`@quick-threejs/legacy` class](./src/index.ts?plain=1#L97)

**See the complete [Example folder](../../samples/basic/).**
