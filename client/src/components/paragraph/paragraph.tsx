import React from 'react';
import styles from './paragraph.module.scss';

export interface ParagraphProps extends React.PropsWithChildren<React.HTMLProps<HTMLParagraphElement>> {}

export const Paragraph = ({ children, ...props }: ParagraphProps) => {
    return (
        <p className={styles.paragraph} {...props}>
            {children}
        </p>
    );
};
