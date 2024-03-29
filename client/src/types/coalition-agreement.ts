import React from 'react';

export type CoalitionAgreementCategory = {
    name: string;
    icon: React.SVGProps<SVGSVGElement>;
};

export type CoalitionAgreement = {
    name: string;
    contents: string;
};

export type TopLevelCoalitionAgreement = CoalitionAgreementCategory & CoalitionAgreement;

export type CoalitionAgreementCategoryContents = CoalitionAgreementCategory & {
    agreements: CoalitionAgreementOrCategory[];
};

export type CoalitionAgreementOrCategory =
    | (CoalitionAgreement & {
          agreements: never;
      })
    | CoalitionAgreementCategoryContents;

export function isCoalitionAgreement(
    agreement: CoalitionAgreement | CoalitionAgreementCategoryContents,
): agreement is CoalitionAgreement {
    return (agreement as CoalitionAgreement).contents !== undefined;
}

export const coalitionAgreementCategoryIconMap: {
    [key: string]: string;
} = {
    Armoedebestrijding: 'people',
    Bestuurzaken: 'briefcase',
    'Binnenlands bestuur en stedenbeleid': 'office',
    Brussel: 'brussels',
    'Buitenlands beleid en toerisme': 'flag',
    'Cultuur, jeugd en sport': 'sports',
    'Economie en innovatie': 'graph',
    'Energie en klimaat': 'leaf',
    'Financien en begroting': 'coins',
    'Fusie van entiteiten - bijlage bij het  regeerakkoord': 'intersection',
    'Gelijke kansen': 'equals',
    'Inburgering en integratie': 'earth',
    Justitie: 'hammer',
    'Kanselarij en bestuur': 'certificate',
    'Landbouw en visserij': 'vegetation',
    'Mobiliteit en openbare werken': 'road',
    Omgeving: 'tree',
    Onderwijs: 'college',
    'Onroerend erfgoed': 'tower',
    Samenleven: 'handshake',
    'Vlaamse rand': 'circle',
    Welzijn: 'care',
    Wonen: 'house',
    Dierenwelzijn: 'paw',
    Media: 'video',
};
