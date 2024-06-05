import { Container, Singleton } from "typescript-ioc";

@Singleton
class Main {
	constructor(readonly hello: string) {}
}

export const QuickThree = Container.get(Main);

console.log(QuickThree.hello);
