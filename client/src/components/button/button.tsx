import styles from './button.module.scss';
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

export function Button({ children, ...props }: Props) {
    return (
        <button {...props} className={styles.button}>
            {children}
        </button>
    );
}
