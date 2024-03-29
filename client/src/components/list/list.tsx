import React from 'react';
import styles from './list.module.scss';

export interface OrderedList extends React.PropsWithChildren<React.HTMLProps<HTMLOListElement>> {}

export interface UnorderedList extends React.PropsWithChildren<React.HTMLProps<HTMLUListElement>> {}

type ListType = 'ordered' | 'unordered';

type List = (OrderedList | UnorderedList) & { listType: ListType };

export const List = ({ children, listType, ...props }: List) => {
    const component = listType === 'ordered' ? 'ol' : 'ul';

    return React.createElement(component, { className: styles.list, ...props }, children);
};
