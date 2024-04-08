import styles from './chatbot.module.scss';
import { Content } from '@/components/layout/content/content.tsx';
import RobotChatbot from '@/assets/robot_chatbot.svg';
import { Message } from '@/components/chatbot/message/message.tsx';
import { Button } from '@/components/button/button.tsx';
import { Textfield } from '@/components/textfield/textfield.tsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatMessageAnswer } from '@/utils/react-query-options.ts';
import { ChatbotDecision, ChatbotResponse } from '@/api/chatbot-api.ts';
import { LoadingDots } from '@/components/loading-dots/loading-dots.tsx';
import clsx from 'clsx';

type Props = {
    expanded?: boolean;
};

type Message = {
    author: 'robot' | 'user';
    contents: ReactNode;
    decisions?: ChatbotDecision[];
};

export const Chatbot = ({ expanded }: Props) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputField = useRef<HTMLInputElement>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            author: 'robot',
            contents: (
                <>
                    Ik kan je helpen met: <br />
                    <ul>
                        <li>Informatie zoeken</li>
                        <li>Samenvattingen te maken</li>
                        <li>Conclusies te vormen</li>
                    </ul>
                </>
            ),
        },
    ]);

    const { isPending, mutate } = useMutation({
        ...chatMessageAnswer(),
        onSuccess: (data: ChatbotResponse) => {
            if (data) {
                setMessages([...messages, { author: 'robot', contents: data.response, decisions: data.decisions }]);
            }
        },
    });

    const sendMessage = () => {
        if (inputField.current?.value) {
            mutate(inputField.current.value);
            setMessages([...messages, { author: 'user', contents: inputField.current.value }]);

            inputField.current.value = '';
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isPending]);

    return (
        <>
            <div className={styles.chatbotScrollArea}>
                <Content className={styles.chatbotColumn}>
                    <div className={clsx(styles.chatbotColumn, styles.intro)}>
                        <h2>Ik help het je te vinden!</h2>

                        <img src={RobotChatbot} alt="Regeringsrobot" className={styles.image} />
                    </div>

                    <div className={styles.messages}>
                        {messages.map(({ author, contents, decisions }, i) => (
                            <Message {...{ author, decisions, key: `message-${i}` }}>{contents}</Message>
                        ))}

                        {isPending && (
                            <Message author="robot" placeholder>
                                <LoadingDots />
                            </Message>
                        )}
                    </div>
                </Content>

                <div ref={messagesEndRef} />
            </div>

            <Content className={clsx(styles.form, expanded && styles.expanded)}>
                <Textfield
                    ref={inputField}
                    name="chat-input"
                    placeholder="Wat is je vraag?"
                    onKeyDown={(e) => !isPending && e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={isPending}>
                    Verstuur
                </Button>
            </Content>
        </>
    );
};
