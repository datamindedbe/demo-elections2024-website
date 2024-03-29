import styles from './page-header.module.scss';
import DMLogo from '@/assets/DM_Logo.png';
import HatchLogo from '@/assets/logo_hatch.png';
import { ApplicationPaths } from '@/routes.tsx';
import { DATAMINDED_URL, HATCH_URL } from '@/constants/settings.constants.ts';
import { Link } from '@/components/link/link.tsx';
import clsx from 'clsx';

type Props = {
    variant: 'transparent' | 'default' | 'chatbot-page';
};

export const PageHeader = ({ variant = 'default' }: Props) => {
    return (
        <div className={clsx(styles.container, styles[variant])}>
            <div className={styles.wrapper}>
                <Link
                    className={styles.homeLink}
                    href={variant === 'chatbot-page' ? ApplicationPaths.Categories : ApplicationPaths.Root}
                >
                    <span>Regeringsrobot</span>
                </Link>

                <div className={styles.logoContainer}>
                    <Link className={styles.logo} href={DATAMINDED_URL} target="_blank">
                        <img src={DMLogo} alt="Data Minded logo" title="Data Minded" />
                    </Link>
                    <Link className={styles.logo} href={HATCH_URL} target="_blank">
                        <img src={HatchLogo} alt="Hatch logo" title="Hatch" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
