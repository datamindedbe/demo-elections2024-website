import { ReactNode } from 'react';
import styles from './content.module.scss';
import clsx from 'clsx';

type Props = {
    children: ReactNode;
    variant?: 'default' | 'narrow';
    className?: string;
};

/*
    Content component.
    Used to wrap page content in a standard container.
 */
export function Content({ children, variant = 'default', className }: Props) {
    return <div className={clsx(styles.content, styles[variant], className)}>{children}</div>;
}
