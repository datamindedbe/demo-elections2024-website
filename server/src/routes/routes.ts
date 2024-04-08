import * as path from 'path';
import { Request, Response, Router } from 'express';
import { ApiRoutes } from './api/api.routes';

export class Routes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {
        // first all non root ('/') route definitions
        this.router.use('/api', new ApiRoutes().router);
        console.log('Initialized routes');
    }
}
