
export class ExpressBedUtils {
    public static instantiateInjectables(injectables?: any[]): any[] {
        if (!injectables) {
            return [];
        }

        const injectablesToReturn: any = {};
        const resolvedInjectables: any = this.resolveInjectables(injectables);
        injectables.forEach((injectable: any, key: any) => {
            const mockInjectable: any = injectable.inject;
            if (mockInjectable) {
                injectablesToReturn[mockInjectable.constructor.name] =
                    resolvedInjectables[key];
            } else {
                injectablesToReturn[injectable.constructor.name] =
                    resolvedInjectables[key];
            }
        });

        return injectablesToReturn;
    }

    public static instantiateRoutesAndInjectables(testConfig: {
        routes?: any[];
        injectables?: any[];
    }): { instantiatedRoutes: any[]; instantiatedInjectables: any[] } {
        const routes: any[] = [];
        let injectablesToReturn: any = {};

        if (testConfig.routes) {
            testConfig.routes.forEach((route: any) => {
                injectablesToReturn = this.resolveInjectables(testConfig.injectables);

                if (testConfig.injectables) {
                    testConfig.injectables.forEach((injectable: any, key: number) => {
                        const isMockProvided = !!injectable.inject;
                        injectablesToReturn[
                            isMockProvided
                                ? injectable.inject.constructor.name
                                : injectable.constructor.name
                            ] =
                            injectablesToReturn[key];
                    });
                }

                routes.push(new route(...injectablesToReturn));

            });
        }

        return {
            instantiatedRoutes: routes,
            instantiatedInjectables: injectablesToReturn,
        };
    }

    private static resolveInjectables(injectables?: any[]) {
        const constructorArgs: any[] = [];

        if (injectables) {
            injectables.forEach((injectable: any) => {
                let injectableArg: any;

                if (injectable.useValue) {
                    injectableArg = injectable.useValue;
                } else {
                    injectableArg = new injectable();
                }

                constructorArgs.push(injectableArg);
            });
        }
        return constructorArgs;
    }
}