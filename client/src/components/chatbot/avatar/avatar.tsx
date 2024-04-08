import clsx from 'clsx';
import RobotAvatar from '@/assets/robot_avatar.svg';
import styles from './avatar.module.scss';

type Props = {
    variant: 'robot' | 'user';
};

export function Avatar({ variant }: Props) {
    return (
        <div className={clsx(styles.avatar, styles[variant])}>
            {variant === 'robot' ? (
                <img src={RobotAvatar} className={styles.robotAvatar} alt="Regeringsrobot" />
            ) : (
                'Jij'
            )}
        </div>
    );
}
