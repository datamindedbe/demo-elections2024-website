import styles from './categories.module.scss';
import { useNavigate } from 'react-router-dom';
import { createCategoryIdPath, createStandaloneAgreementPath } from '@/routes.tsx';
import { CategoryCard } from '@/pages/categories/category-card/category-card.tsx';
import { useQuery } from '@tanstack/react-query';
import { coalitionAgreementCategories } from '@/utils/react-query-options.ts';
import { TopLevelCoalitionAgreement } from '@/types/coalition-agreement.ts';

export function Categories() {
    const navigate = useNavigate();
    const { data } = useQuery(coalitionAgreementCategories());

    const onNavigateToCategory = (coalitionAgreement: TopLevelCoalitionAgreement) => {
        if (coalitionAgreement.contents) {
            navigate(createStandaloneAgreementPath(coalitionAgreement.name));
        } else {
            navigate(createCategoryIdPath(coalitionAgreement.name));
        }
    };

    return (
        <>
            <h4 className={styles.pageTitle}>Categorieën</h4>
            <div className={styles.categories}>
                {data?.map((category, index) => (
                    <CategoryCard
                        key={`${category.name}-${index}`}
                        onClick={() => onNavigateToCategory(category)}
                        {...category}
                    />
                ))}
            </div>
        </>
    );
}
