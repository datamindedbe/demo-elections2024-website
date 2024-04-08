import { useParams } from 'react-router-dom';
import styles from './category.module.scss';
import { ApplicationPaths } from '@/routes.tsx';
import { Breadcrumb } from '@/components/breadcrumb/breadcrumb.tsx';
import { List } from '@/components/list/list.tsx';
import { ListItem } from '@/pages/category/list-item/list-item.tsx';
import { useQuery } from '@tanstack/react-query';
import { coalitionAgreementCategoryDetails } from '@/utils/react-query-options.ts';
import { useEffect } from 'react';

export const CategoryPage = () => {
    const { categoryName: category } = useParams();
    const { data } = useQuery({
        ...coalitionAgreementCategoryDetails(category),
        enabled: !!category,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Breadcrumb name={'Categorieën'} href={ApplicationPaths.Categories} />

            <h1 className={styles.title}>{data?.name || category}</h1>

            <List listType={'unordered'}>
                {category &&
                    data?.agreements.map((agreement, index) => {
                        return <ListItem key={`${agreement.name}-${index}`} {...agreement} category={category} />;
                    })}
            </List>
        </>
    );
};
