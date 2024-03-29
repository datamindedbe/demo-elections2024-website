import { Http } from '@/http/http';
import { ApiUrl } from './api-urls';
import { CoalitionAgreementCategoryContents, TopLevelCoalitionAgreement } from '../types/coalition-agreement';
import { runtimeConfig } from '@/config/runtime-config.ts';

const config = runtimeConfig();
const http = new Http(config.getBaseApiUrl());

export const getCoalitionAgreements = async (): Promise<TopLevelCoalitionAgreement[]> => {
    const response = await http.get<TopLevelCoalitionAgreement[]>(ApiUrl.coalitionAgreements);

    if (response) {
        return response;
    }

    throw new Error('No data received');
};

export const getCoalitionAgreementCategoryDetails = async (
    categoryName: string,
): Promise<CoalitionAgreementCategoryContents> => {
    const encodedCategoryName = encodeURIComponent(categoryName);
    const response = await http.get<CoalitionAgreementCategoryContents>(
        ApiUrl.coalitionAgreementCategory.replace(':categoryName', encodedCategoryName),
    );

    if (response) {
        return response;
    }

    throw new Error('No data received');
};
