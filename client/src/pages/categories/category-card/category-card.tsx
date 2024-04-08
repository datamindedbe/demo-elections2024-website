import styles from './category-card.module.scss';
import { coalitionAgreementCategoryIconMap, TopLevelCoalitionAgreement } from '@/types/coalition-agreement.ts';

type Props = TopLevelCoalitionAgreement & {
    onClick: (name: string) => void;
};

const getCoalitionAgreementIcon = (name: string) => {
    const iconKey = coalitionAgreementCategoryIconMap[name];
    return new URL(`../../../assets/icons/${iconKey}.svg`, import.meta.url).href;
};

export const CategoryCard = ({ name, onClick }: Props) => {
    return (
        <div key={name} className={styles.category} onClick={() => onClick(name)}>
            <img className={styles.icon} src={getCoalitionAgreementIcon(name)} alt={name} />
            <span className={styles.title}>{name}</span>
        </div>
    );
};
