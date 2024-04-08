import { Router } from 'express';
import { CoalitionAgreementsHandler } from './coalition-agreements.handler';

export class CoalitionAgreementsRoutes {
    public static BASE_PATH = '/coalition-agreements';
    public router: Router;

    private handler: CoalitionAgreementsHandler;

    constructor() {
        this.router = Router();
        this.handler = new CoalitionAgreementsHandler();

        this.initialize();
    }

    private initialize(): void {
        this.router.get('', this.handler.getCoalitionAgreements);

        this.router.get('/:categoryName', this.handler.getCoalitionAgreementCategoryDetails);
    }
}
