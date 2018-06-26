import {Express, Request, Response} from 'express';
import {BaseRoute, ExpressBed, ExpressTestBed} from "./express-bed";
import supertest = require('supertest');

describe('express-bed', () => {

    let testBed: ExpressTestBed;

    describe('configureTestingModule', () => {
        it('should return a ExpressTestBed object with the correct routes if they are passed via config', (done: any) => {

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

            testBed = ExpressBed.configureTestingModule(
                {
                    routes: [TestRoute],
                },
            );

            try {
                supertest(testBed.app)
                    .get('/user/validPath/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }

            try {
                supertest(testBed.app)
                    .get('/user/invalidPath/')
                    .expect(404).then(() => done());
            } catch (error) {
                fail();
            }

        });

        fit('should return a ExpressTestBed object with the correct routes and injectables, as well as any injectable dependencies if they are passed via config', (done: any) => {

            class Dependency {
                public doDepStuff(): string {
                    return 'blah';
                }
            }

            class TestInjectable {

                constructor(private dep: Dependency){}

                public doSomething() {
                    this.dep.doDepStuff();
                }
            }

            class TestInjectable2 {

                public doSomethingElse() {
                    console.log('blah');
                }
            }

            class TestRoute implements BaseRoute {

                constructor(private testInjectable: TestInjectable, private testInjectable2: TestInjectable2) {
                    this.testInjectable.doSomething();
                    this.testInjectable2.doSomethingElse();
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

            testBed = ExpressBed.configureTestingModule(
                {
                    routes: [TestRoute],
                    injectables: [
                        {
                            inject: TestInjectable,
                            injectables: [Dependency]
                        },
                        TestInjectable2
                    ]
                },
            );

            try {
                supertest(testBed.app)
                    .get('/user/validPath/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }

            expect(testBed.get(TestInjectable) instanceof TestInjectable).toBe(true);
            expect(testBed.get(TestInjectable2) instanceof TestInjectable2).toBe(true);

        });

        it('should return a ExpressTestBed object with the correct routes and injectables if they are passed via config', (done: any) => {

            class TestInjectable {
                public doSomething() {}
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

            testBed = ExpressBed.configureTestingModule(
                {
                    routes: [TestRoute],
                    injectables: [TestInjectable]
                },
            );

            try {
                supertest(testBed.app)
                    .get('/user/validPath/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }

            expect(testBed.get(TestInjectable) instanceof TestInjectable).toBe(true);

        });

        it('should return a ExpressTestBed object with the correct routes if multiple routes provided', (done: any) => {


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

            testBed = ExpressBed.configureTestingModule(
                {
                    routes: [TestRoute, TestRoute2],
                },
            );

            try {
                supertest(testBed.app)
                    .get('/user/validPath/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }

            try {
                supertest(testBed.app)
                    .post('/user/validPath2/')
                    .expect(200).then(() => done());
            } catch (error) {
                fail();
            }


        });
    });
});