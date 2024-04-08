import React from 'react';
import styles from './link.module.scss';
import { Link as ReactRouterLink } from 'react-router-dom';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const Link = ({ children, href = '#', ...props }: LinkProps) => {
    return (
        <ReactRouterLink className={styles.link} to={href} {...props}>
            {children}
        </ReactRouterLink>
    );
};
