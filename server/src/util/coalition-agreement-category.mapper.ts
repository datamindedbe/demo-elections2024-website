import { CoalitionAgreement, CoalitionAgreementCategoryContents } from '../types/coalition-agreement.types';
import path from 'node:path';
import fs from 'fs';
import { coalitionAgreementsAssetsFolder } from '../shared/constants';

export const coalitionAgreementCategoryMapper = (
    categoryName: string,
    recursionDepth = 0,
    basePath?: string,
): CoalitionAgreementCategoryContents => {
    if (recursionDepth > 2) {
        throw new Error('Maximum recursion depth exceeded');
    }

    if (!basePath) {
        basePath = path.join('../../', coalitionAgreementsAssetsFolder);
    }

    // Get all files in all folders in agreementsPath
    const categoryPath = path.join(__dirname, basePath, categoryName);
    const categoryDirContents = fs.readdirSync(categoryPath);

    const agreements = categoryDirContents.map((file): CoalitionAgreement | CoalitionAgreementCategoryContents => {
        const filePath = path.join(categoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            return coalitionAgreementCategoryMapper(file, recursionDepth + 1, path.join(basePath, categoryName));
        } else {
            return {
                name: file.split('.')[0],
                contents: fs.readFileSync(filePath).toString(),
            };
        }
    });

    return { name: categoryName, agreements };
};
