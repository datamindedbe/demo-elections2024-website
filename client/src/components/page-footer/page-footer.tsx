import styles from './page-footer.module.scss';
import { Content } from '@/components/layout/content/content.tsx';
import { Link } from 'react-router-dom';
import { ApplicationPaths } from '@/routes.tsx';
import { DATAMINDED_URL, HATCH_URL, SOURCE_CODE_URL } from '@/constants/settings.constants.ts';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export const PageFooter = () => {
    return (
        <footer className={styles.footer}>
            <Content className={styles.content}>
                <p className={styles.twoColumns}>
                    <Link to={ApplicationPaths.Root}>Over Regeringsrobot</Link>
                    <Link to={SOURCE_CODE_URL} target="_blank" className={styles.sourceCode}>
                        <FontAwesomeIcon icon={faGithub} className={styles.githubLogo} /> Broncode
                    </Link>
                </p>

                <div className={styles.divider} />

                <p className={clsx(styles.twoColumns, styles.copyright)}>
                    <span className={styles.mobileStacked}>
                        <span>Mogelijk gemaakt door&nbsp;</span>
                        <span>
                            <Link to={DATAMINDED_URL}>Data Minded</Link> &amp; <Link to={HATCH_URL}>Hatch</Link>
                        </span>
                    </span>
                    <span className={styles.mobileStacked}>
                        <span>&copy; 2024, Data Minded.&nbsp;</span>
                        <span>Alle rechten voorbehouden.</span>
                    </span>
                </p>
            </Content>
        </footer>
    );
};
