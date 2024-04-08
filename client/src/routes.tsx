import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OnboardingPage } from './pages/onboarding/onboarding.page.tsx';
import { Categories } from './pages/categories/categories.page.tsx';
import { CategoryPage } from './pages/category/category.page.tsx';
import { AgreementPage } from './pages/agreement/agreement.page.tsx';
import { ChatbotLayout } from '@/components/layout/chatbot/chatbot.layout.tsx';

export enum ApplicationPaths {
    Root = '/',
    Categories = '/categories',
    Category = '/categories/:categoryName',
    Agreement = '/categories/:categoryName/:agreementName',
    StandaloneAgreement = '/agreement/:agreementName',
}

export function createStandaloneAgreementPath(agreementName: string) {
    return ApplicationPaths.StandaloneAgreement.replace(':agreementName', agreementName);
}

export function createCategoryIdPath(categoryName: string) {
    return ApplicationPaths.Category.replace(':categoryName', categoryName);
}

export function createAgreementIdPath(categoryName: string, agreementName: string) {
    return ApplicationPaths.Agreement.replace(':categoryName', encodeURIComponent(categoryName)).replace(
        ':agreementName',
        encodeURIComponent(agreementName),
    );
}

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ApplicationPaths.Root} Component={OnboardingPage} />

                <Route path="/" Component={ChatbotLayout}>
                    <Route path={ApplicationPaths.Categories} Component={Categories} />
                    <Route path={ApplicationPaths.Category} Component={CategoryPage} />
                    <Route path={ApplicationPaths.Agreement} Component={AgreementPage} />
                    <Route path={ApplicationPaths.StandaloneAgreement} Component={AgreementPage} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
