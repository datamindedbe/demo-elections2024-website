import { createAgreementIdPath } from '@/routes.tsx';
import styles from './list-item.module.scss';
import { CoalitionAgreementOrCategory } from '@/types/coalition-agreement.ts';
import { List } from '@/components/list/list.tsx';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

type Props = CoalitionAgreementOrCategory & {
    category: string;
    isIndented?: boolean;
    level?: number;
};

const getCategoryListItemClasses = (level: number, isIndented: boolean) => {
    const indentClass = `indent-level-${level}`;

    return clsx(styles.listItem, isIndented && styles.indented, styles[indentClass]);
};

export const ListItem = ({ name, agreements, category, isIndented = false, level = 0 }: Props) => {
    const categoryRef = useRef<HTMLLIElement>(null);
    const navigate = useNavigate();

    const handleCategoryClick = () => {
        if (categoryRef.current) {
            categoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleAgreementClick = () => {
        navigate(createAgreementIdPath(category, name), { state: { category } });
        window.scrollTo(0, 0);
    };

    const listItemClasses = getCategoryListItemClasses(level, isIndented);
    const transformedName = name.replace('_', ':');

    return (
        <>
            {agreements?.length ? (
                <>
                    <li className={listItemClasses} ref={categoryRef} onClick={handleCategoryClick}>
                        <span className={styles.categoryLink}>{transformedName}</span>
                    </li>
                    <List listType={'unordered'}>
                        {agreements.map((agreement, index) => {
                            return (
                                <ListItem
                                    key={`${agreement.name}-${index}`}
                                    {...agreement}
                                    category={category}
                                    isIndented={true}
                                    level={level + 1}
                                />
                            );
                        })}
                    </List>
                </>
            ) : (
                <li onClick={handleAgreementClick} className={listItemClasses}>
                    <div className={styles.agreementLink}>{transformedName}</div>
                </li>
            )}
        </>
    );
};
