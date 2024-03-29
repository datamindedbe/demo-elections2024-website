import { ReactNode } from 'react';
import styles from './container.module.scss';
import clsx from 'clsx';

type Props = {
    children: ReactNode;
    variant?: 'application' | 'page' | 'chatbot-page';
    className?: string;
};

/*
    Container component.
    Used to wrap page content in a standard container.
 */
export function Container({ children, variant = 'page', className }: Props) {
    return <div className={clsx(styles.container, styles[variant], className)}>{children}</div>;
}
