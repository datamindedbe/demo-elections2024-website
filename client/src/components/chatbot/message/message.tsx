import styles from './message.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { Avatar } from '@/components/chatbot/avatar/avatar.tsx';
import { ChatbotDecision } from '@/api/chatbot-api.ts';
import { Link } from '@/components/link/link.tsx';
import { Details } from '@/components/details/details.tsx';

type Props = {
    author: 'robot' | 'user';
    decisions?: ChatbotDecision[];
    children: ReactNode;
    placeholder?: boolean;
};

export function Message({ author, decisions, children, placeholder }: Props) {
    return (
        <div className={clsx(styles.messageContainer, styles[author], placeholder && styles.placeholder)}>
            <Avatar variant={author} />

            <div className={styles.message}>
                <div className={clsx(decisions?.length && styles.wrappedContents)}>{children}</div>

                {!!decisions?.length && (
                    <Details>
                        <summary>Referenties</summary>
                        <div className={styles.references}>
                            {decisions.map((decision, index) => (
                                <div key={`decision-${index}`}>
                                    <Link href={decision.decisionUrl} target="_blank">
                                        [{index}]:
                                    </Link>
                                    &nbsp;
                                    {decision.title}
                                </div>
                            ))}
                        </div>
                    </Details>
                )}
            </div>
        </div>
    );
}
