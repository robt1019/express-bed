import {ExpressBedUtils} from './express-bed-utils';
import {Router} from 'express';
import express from 'express';

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
                return instantiatedInjectables
                    .find((injectable: any) => {
                        return token.toString()
                            .includes(`function ${injectable.constructor.name}(`);
                    });
            },
        };
    }
}
