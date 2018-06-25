import {ExpressBedUtils} from './express-bed-utils';
import express, {Router} from 'express';

export interface ExpressTestBed {
    app: express.Application;
    get(token: any): any;
}

export interface BaseRoute {
   create(router: Router): void
}

export class ExpressBed {

    public static configureTestingModule(
        testConfig: {
            routes?: any[];
            injectables?: any[];
        },
    ): ExpressTestBed {

        let instantiatedRoutes: any[] = [];
        let instantiatedInjectables: any = {};

        const app = express();

        if (testConfig.routes) {
            const routesAndInjectables = ExpressBedUtils.instantiateRoutesAndInjectables(
                testConfig,
            );
            instantiatedRoutes = routesAndInjectables.instantiatedRoutes;
            instantiatedInjectables = routesAndInjectables.instantiatedInjectables;
        } else {
            instantiatedInjectables = ExpressBedUtils.instantiateInjectables(
                testConfig.injectables,
            );
        }

        instantiatedRoutes.forEach((route) => {
            route.create(app);
        });

        return {
            app,
            get(token: any): any {
                return instantiatedInjectables[token.constructor.name];
            },
        };
    }
}
