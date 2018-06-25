import {Express, Request, Response} from 'express';
import {BaseRoute, ExpressBed, ExpressTestBed} from "./express-bed";
import supertest = require('supertest');

describe('express-bed', () => {

    let testBed: ExpressTestBed;

    describe('configureTestingModule', () => {
        it('should return a ExpressTestBed object with the correct routes if they are passed via config', async (done: any) => {

            class TestRoute implements BaseRoute {
                public create(app: Express) {
                    app.get(
                        '/user/validPath/',
                        (req: Request, res: Response) => {
                            res.status(200).send();
                        },
                    );
                }
            }

            testBed = await ExpressBed.configureTestingModule(
                {
                    routes: [TestRoute],
                },
            );

            try {
                await supertest(testBed.app)
                    .get('/user/validPath/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }

            try {
                await supertest(testBed.app)
                    .get('/user/invalidPath/')
                    .expect(404).then(() => done());
            } catch (error) {
                fail();
            }

        });

        it('should return a ExpressTestBed object with the correct routes and injectables if they are passed via config', async (done: any) => {

            class TestInjectable {
                public doSomething() {
                }
            }

            class TestRoute implements BaseRoute {

                constructor(private testInjectable: TestInjectable) {
                    this.testInjectable.doSomething();
                }

                public create(app: Express) {
                    app.get(
                        '/user/validPath/',
                        (req: Request, res: Response) => {
                            res.status(200).send();
                        },
                    );
                }
            }

            testBed = await ExpressBed.configureTestingModule(
                {
                    routes: [TestRoute],
                    injectables: [TestInjectable]
                },
            );

            try {
                await supertest(testBed.app)
                    .get('/user/validPath/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }

            expect(testBed.get(TestInjectable) instanceof TestInjectable).toBe(true);

        });

        it('should return a ExpressTestBed object with the correct routes and injectables if they are passed via config', async (done: any) => {

            class TestInjectable {
                public doSomething() {
                }
            }

            class TestRoute implements BaseRoute {

                constructor(private testInjectable: TestInjectable) {
                    this.testInjectable.doSomething();
                }

                public create(app: Express) {
                    app.get(
                        '/user/validPath/',
                        (req: Request, res: Response) => {
                            res.status(200).send();
                        },
                    );
                }
            }

            testBed = await ExpressBed.configureTestingModule(
                {
                    routes: [TestRoute],
                    injectables: [TestInjectable]
                },
            );

            try {
                await supertest(testBed.app)
                    .get('/user/validPath/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }

            expect(testBed.get(TestInjectable) instanceof TestInjectable).toBe(true);

        });

        it('should return a ExpressTestBed object with the correct routes if multiple routes provided', async (done: any) => {


            class TestRoute implements BaseRoute {

                public create(app: Express) {
                    app.get(
                        '/user/validPath/',
                        (req: Request, res: Response) => {
                            res.status(200).send();
                        },
                    );
                }
            }

            class TestRoute2 implements BaseRoute {

                public create(app: Express) {
                    app.post(
                        '/user/validPath2/',
                        (req: Request, res: Response) => {
                            res.status(200).send();
                        },
                    );
                }
            }

            testBed = await ExpressBed.configureTestingModule(
                {
                    routes: [TestRoute, TestRoute2],
                },
            );

            try {
                await supertest(testBed.app)
                    .get('/user/validPath/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }

            try {
                await supertest(testBed.app)
                    .post('/user/validPath2/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }


        });
    });
});