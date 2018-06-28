export class ExpressBedUtils {
  public static instantiateInjectables(injectables?: any[]): any[] {
    if (!injectables) {
      return [];
    }
    return this.resolveInjectables(injectables);
  }

  public static instantiateRoutesAndInjectables(testConfig: {
    routes?: any[];
    injectables?: any[];
  }): { instantiatedRoutes: any[]; instantiatedInjectables: any[] } {
    const routes: any[] = [];
    let injectablesToReturn: any[] = [];

    if (testConfig.routes) {
      testConfig.routes.forEach((route: any) => {
        injectablesToReturn = this.resolveInjectables(testConfig.injectables);
        routes.push(new route(...injectablesToReturn));
      });
    }

    return {
      instantiatedRoutes: routes,
      instantiatedInjectables: injectablesToReturn
    };
  }

  private static resolveInjectables(injectables?: any[]): any[] {
    const constructorArgs: any[] = [];

    if (injectables) {
      injectables.forEach((injectable: any) => {
        let injectableArg: any;

        if (injectable.useValue) {
          injectableArg = injectable.useValue;
        } else {
          if (injectable.injectables) {
            injectableArg = new injectable.inject(
              ...this.resolveInjectables(injectable.injectables)
            );
          } else {
            injectableArg = new injectable();
          }
        }

        constructorArgs.push(injectableArg);
      });
    }
    return constructorArgs;
  }
}
