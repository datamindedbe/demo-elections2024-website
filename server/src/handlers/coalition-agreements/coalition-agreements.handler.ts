import { Request, Response } from 'express';
import path from 'node:path';
import {
    CoalitionAgreement,
    CoalitionAgreementCategory,
    CoalitionAgreementCategoryContents,
} from '../../types/coalition-agreement.types';
import sanitize from 'sanitize-filename';
import { sendErrorResponse, ServerErrorTypes } from '../../shared/errors/errors';
import { coalitionAgreementCategoryMapper } from '../../util/coalition-agreement-category.mapper';
import { sendResponse } from '../../util/response.util';

export class CoalitionAgreementsHandler {
    public getCoalitionAgreements(
        _req: Request,
        res: Response<(CoalitionAgreementCategory | CoalitionAgreement)[]>,
    ): void {
        const agreementsPath = path.join(__dirname, '../../../assets/coalition-agreement-categories.json');

        res.sendFile(agreementsPath);
    }

    public getCoalitionAgreementCategoryDetails(
        req: Request<{ categoryName: string }>,
        res: Response<CoalitionAgreementCategoryContents[]>,
    ): void {
        let categoryName: string;

        try {
            categoryName = sanitize(req.params.categoryName);
        } catch (e) {
            return sendErrorResponse(res, 400, ServerErrorTypes.BadRequest, e);
        }

        if (!categoryName) {
            return sendErrorResponse(res, 404, ServerErrorTypes.NotFound);
        } else if (categoryName.includes('.')) {
            return sendErrorResponse(
                res,
                400,
                ServerErrorTypes.BadRequest,
                new Error(`Category name cannot contain '.' (provided='${categoryName}')`),
            );
        }

        const categoryContents = coalitionAgreementCategoryMapper(categoryName);

        sendResponse(res, categoryContents);
    }
}
