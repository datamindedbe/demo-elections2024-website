import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './stepper.module.scss';
import { faArrowRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

type Props = {
    steps: number[];
    currentStepNumber: number;
    goToStep: (stepNumber: number) => void;
    onNextStep?: () => void;
};

export const Stepper = ({ steps, currentStepNumber, goToStep, onNextStep }: Props) => {
    const onGoToStep = (stepNumber: number) => {
        goToStep(stepNumber);
    };

    return (
        <div className={styles.dots}>
            {steps.map((step) => {
                const isActiveStep = step === currentStepNumber;

                return (
                    <div
                        key={step}
                        className={clsx(styles.dot, isActiveStep && styles.active)}
                        onClick={() => onGoToStep(step)}
                    >
                        <FontAwesomeIcon className={styles.icon} icon={faCircle} />
                    </div>
                );
            })}
            <div className={styles.arrow} onClick={onNextStep}>
                <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
            </div>
        </div>
    );
};
