export type CoalitionAgreementCategory = {
    name: string;
};

export type CoalitionAgreementCategoryContents = CoalitionAgreementCategory & {
    agreements: (CoalitionAgreement | CoalitionAgreementCategoryContents)[];
};

export type CoalitionAgreement = {
    name: string;
    contents: string;
};
