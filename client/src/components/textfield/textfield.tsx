import styles from './textfield.module.scss';
import { ForwardedRef, forwardRef, KeyboardEventHandler } from 'react';

type Props = {
    name: string;
    placeholder: string;
    onKeyDown?: KeyboardEventHandler;
};

export const Textfield = forwardRef(({ name, placeholder, onKeyDown }: Props, ref: ForwardedRef<HTMLInputElement>) => {
    return <input {...{ name, placeholder, className: styles.input, ref, onKeyDown }} />;
});
