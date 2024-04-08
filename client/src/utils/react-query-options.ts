import { queryOptions } from '@tanstack/react-query';
import { getCoalitionAgreementCategoryDetails, getCoalitionAgreements } from '../api/coalition-agreement-api';
import { getChatbotMessageAnswer } from '@/api/chatbot-api.ts';

const ONE_HOUR = 1000 * 60 * 60;

export function coalitionAgreementCategoryDetails(name: string | undefined) {
    return queryOptions({
        queryKey: ['coalitionAgreementCategoryDetails', name],
        queryFn: () => {
            if (!name) {
                throw new Error('No name provided');
            }
            return getCoalitionAgreementCategoryDetails(name);
        },
        staleTime: ONE_HOUR,
        gcTime: ONE_HOUR,
    });
}

export function coalitionAgreementCategories() {
    return queryOptions({
        queryKey: ['coalitionAgreementCategories'],
        queryFn: () => {
            return getCoalitionAgreements();
        },
        staleTime: ONE_HOUR,
        gcTime: ONE_HOUR,
    });
}

export function chatMessageAnswer() {
    return {
        queryKey: ['chatMessageAnswer'],
        mutationFn: (message: string | undefined) => {
            return getChatbotMessageAnswer(message);
        },
    };
}
