import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './breadcrumb.module.scss';
import { Link } from '@/components/link/link.tsx';

type Props = {
    name: string;
    href: string;
};

export function Breadcrumb({ name, href }: Props) {
    return (
        <div>
            <Link className={styles.breadcrumb} href={href}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>{name}</span>
            </Link>
        </div>
    );
}
