import styles from './chatbot.layout.module.scss';
import { Outlet } from 'react-router-dom';
import { PageHeader } from '@/components/page-header/page-header.tsx';
import { Container } from '@/components/layout/container/container.tsx';
import { Content } from '@/components/layout/content/content.tsx';
import { Chatbot } from '@/components/chatbot/chatbot.tsx';
import { useState } from 'react';
import clsx from 'clsx';
import ArrowLeft from '@/assets/icons/arrow_left.svg';
import RobotAvatar from '@/assets/robot_avatar.svg';
import Xsymbol from '@/assets/icons/x-symbol.svg';
import { PageFooter } from '@/components/page-footer/page-footer.tsx';

export function ChatbotLayout() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <PageHeader variant="chatbot-page" />

            <Container variant="chatbot-page" className={styles.container}>
                <Content>
                    <Outlet />
                </Content>

                <div className={clsx(styles.chatbot, isExpanded && styles.expanded)}>
                    <span className={styles.expandCollapse} onClick={() => setIsExpanded(!isExpanded)}>
                        <img src={ArrowLeft} alt="Vergroten" />
                    </span>

                    <span className={styles.close} onClick={() => setIsExpanded(false)}>
                        <img src={Xsymbol} className={styles.icon} alt="Sluiten" />
                    </span>

                    <Chatbot expanded={isExpanded} />
                </div>
            </Container>

            <PageFooter />

            <div
                className={clsx(styles.mobileChatbotIcon, isExpanded && styles.hidden)}
                onClick={() => setIsExpanded(true)}
            >
                <img src={RobotAvatar} alt="Regeringsrobot Chatbot" />
            </div>
        </>
    );
}
