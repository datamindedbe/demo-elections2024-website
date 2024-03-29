import { useParams } from 'react-router-dom';
import { ApplicationPaths, createCategoryIdPath } from '@/routes.tsx';
import { Breadcrumb } from '@/components/breadcrumb/breadcrumb.tsx';
import { MarkdownContent } from '@/pages/agreement/markdown-content/markdown-content.tsx';
import { useAgreementData } from '@/pages/agreement/useAgreementData.tsx';

export const AgreementPage = () => {
    const { agreementName, categoryName } = useParams();
    const { agreement } = useAgreementData({ agreementName, categoryName });

    const breadcrumb = {
        name: categoryName || 'Categorieën',
        href: categoryName ? createCategoryIdPath(categoryName) : ApplicationPaths.Categories,
    };
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            {agreement?.contents && <MarkdownContent content={agreement.contents} />}
        </>
    );
};
