import { useQuery } from '@tanstack/react-query';
import { coalitionAgreementCategories, coalitionAgreementCategoryDetails } from '@/utils/react-query-options.ts';
import {
    CoalitionAgreement,
    CoalitionAgreementOrCategory,
    isCoalitionAgreement,
    TopLevelCoalitionAgreement,
} from '@/types/coalition-agreement.ts';

type Props = {
    agreementName?: string;
    categoryName?: string;
};

function findAgreementDataByName(
    agreements?: CoalitionAgreementOrCategory[],
    agreementName?: string,
): CoalitionAgreement | null {
    let agreementData: CoalitionAgreement | null = null;
    if (!agreements || !agreementName) {
        return agreementData;
    }
    // It can have several levels of agreements, we need to search recursively
    for (const agreement of agreements) {
        if (isCoalitionAgreement(agreement) && agreement.name === agreementName) {
            agreementData = agreement;
            break;
        } else if (agreement.agreements) {
            agreementData = findAgreementDataByName(agreement.agreements, agreementName);
            if (agreementData) {
                break;
            }
        }
    }
    return agreementData;
}

// This function will look for agreementData that can be found in the TopLevelCoalitionAgreement array (the one we fetch on the categories page)
const findStandaloneAgreementData = (agreements: TopLevelCoalitionAgreement[] | undefined, agreementName?: string) => {
    let agreementData: CoalitionAgreement | null = null;

    if (!agreements || !agreementName) {
        return agreementData;
    }

    for (const agreement of agreements) {
        if (isCoalitionAgreement(agreement) && agreement.name === agreementName) {
            agreementData = agreement;
            break;
        }
    }
    return agreementData;
};

export function useAgreementData({ agreementName, categoryName }: Props) {
    const isStandaloneAgreement = !categoryName;
    const { data } = useQuery({
        ...coalitionAgreementCategoryDetails(categoryName),
        enabled: !!agreementName && !isStandaloneAgreement,
    });
    const { data: standaloneAgreementData } = useQuery({
        ...coalitionAgreementCategories(),
        enabled: isStandaloneAgreement && !!agreementName,
    });

    const agreement = isStandaloneAgreement
        ? findStandaloneAgreementData(standaloneAgreementData, agreementName)
        : findAgreementDataByName(data?.agreements, agreementName);

    return {
        agreement,
        isStandaloneAgreement,
    };
}
