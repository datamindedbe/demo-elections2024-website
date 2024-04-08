import { useState } from 'react';
import { Stepper } from './stepper/stepper';
import styles from './onboarding.module.scss';
import RobotStep1 from '@/assets/robot_step_1.svg';
import RobotStep2 from '@/assets/robot_step_2.svg';
import RobotStep3 from '@/assets/robot_step_3.svg';
import { Container } from '@/components/layout/container/container';
import { useNavigate } from 'react-router-dom';
import { ApplicationPaths } from '@/routes';
import { Button } from '@/components/button/button';
import { PageHeader } from '@/components/page-header/page-header.tsx';

export type OnboardingStep = {
    title: string;
    description: string;
    image: string;
    buttonText: string;
    step: number;
};

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        step: 0,
        title: 'Hallo, ik ben Regeringsrobot!',
        description: 'Kent u nog alle maatregelen uit het regeerakkoord? Of welke acties er effectief zijn uitgevoerd?',
        buttonText: 'Nope',
        image: RobotStep1,
    },
    {
        step: 1,
        title: 'Geen paniek!\n' + 'Ik klaar het voor u uit.',
        description: 'Ik analyseer vlot tienduizenden overheidsdocumenten en leg voor u de politieke puzzel in elkaar.',
        buttonText: 'Geweldig!',
        image: RobotStep2,
    },
    {
        step: 2,
        title: 'Meestal juist,\n' + 'maar niet altijd.',
        description:
            'Ik maak gebruik van Generatieve AI om je een overzicht te bieden. Mijn trukendoos is fenomenaal, maar niet altijd feilloos.',
        buttonText: 'Roger that',
        image: RobotStep3,
    },
];

export function OnboardingPage() {
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const { title, description, buttonText, image } = ONBOARDING_STEPS[activeStep];
    const lastStep = ONBOARDING_STEPS.slice(-1)[0].step;

    function goToStep(step: number) {
        setActiveStep(step);
    }

    function goToNextStep() {
        if (activeStep < lastStep) {
            setActiveStep(activeStep + 1);
        } else {
            confirmAndNavigate();
        }
    }

    function confirmAndNavigate() {
        navigate(ApplicationPaths.Categories);
    }

    return (
        <>
            <PageHeader variant={'transparent'} />
            <Container>
                <div className={styles.onboardingWrapper}>
                    <div className={styles.content}>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.description}>{description}</p>
                        <div className={styles.stepper}>
                            <Button onClick={goToNextStep}>{buttonText}</Button>
                            <Stepper
                                steps={ONBOARDING_STEPS.map((step) => step.step)}
                                currentStepNumber={activeStep}
                                goToStep={goToStep}
                                onNextStep={goToNextStep}
                            />
                        </div>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img className={styles.robotImage} src={image} alt="onboarding" />
                    </div>
                </div>
            </Container>
            <div className={styles.backgroundImage}></div>
        </>
    );
}
