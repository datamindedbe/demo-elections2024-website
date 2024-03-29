import React from 'react';
import styles from './details.module.scss';

export interface DetailsProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {}

export const Details = ({ children, ...props }: DetailsProps) => {
    return (
        <details className={styles.details} {...props}>
            {children}
        </details>
    );
};
