import { Router } from 'express';
import { CoalitionAgreementsRoutes } from '../../handlers/coalition-agreements/coalition-agreements.routes';
import { sendResponse } from '../../util/response.util';

export class ApiRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.use(CoalitionAgreementsRoutes.BASE_PATH, new CoalitionAgreementsRoutes().router);

        this.router.get('/status', async (_request, response) => sendResponse(response, 'ok'));
    }
}
