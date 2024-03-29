import * as path from 'node:path';
import * as fs from 'fs';
import { CoalitionAgreement, CoalitionAgreementCategory } from '../types/coalition-agreement.types';
import { coalitionAgreementsAssetsFolder } from '../shared/constants';

const generateCoalitionCategoryOverview = () => {
    const coalitionAgreementsPath = path.join(__dirname, '../../', coalitionAgreementsAssetsFolder);

    const coalitionAgreementsContents = fs.readdirSync(coalitionAgreementsPath);

    const parsedCoalitionAgreement = coalitionAgreementsContents.map(
        (agreement): CoalitionAgreementCategory | CoalitionAgreement => {
            const currentPath = path.join(coalitionAgreementsPath, agreement);
            const isFile = fs.statSync(currentPath).isFile();

            return {
                name: isFile ? agreement.split('.')[0] : agreement,
                ...(isFile ? { contents: fs.readFileSync(currentPath).toString() } : {}),
            };
        },
    );

    const outputDirectory = path.join(__dirname, '../../assets');
    const outputFile = path.join(outputDirectory, 'coalition-agreement-categories.json');

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(parsedCoalitionAgreement));

    console.log('Generated coalition-agreement-categories.json');
};

generateCoalitionCategoryOverview();
