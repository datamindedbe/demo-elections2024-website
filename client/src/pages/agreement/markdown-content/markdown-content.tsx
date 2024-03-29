import Markdown, { Components, ExtraProps } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './markdown-content.module.scss';
import rehypeRaw from 'rehype-raw';
import { List, OrderedList, UnorderedList } from '@/components/list/list.tsx';
import { Link, LinkProps } from '@/components/link/link.tsx';
import { Paragraph, ParagraphProps } from '@/components/paragraph/paragraph.tsx';
import { Details, DetailsProps } from '@/components/details/details.tsx';
import { useEffect } from 'react';
import {
    linkSourceToFootnote,
    Node,
    TextNode,
} from '@/pages/agreement/markdown-content/link-source-to-footnote.plugin.ts';

const components: Components = {
    a: (props: LinkProps & ExtraProps) => {
        let id = undefined;

        // Links starting with http are external links in the footnotes -> add their reference ID to link to them from in the text
        if (props.href?.startsWith('http')) {
            const value = (props.node?.children?.[0] as TextNode | undefined)?.value;

            const split = value?.split(/\[|\]/);

            if (split?.length === 3) {
                id = `reference-${split[1]}`;
            }
        }

        return <Link {...{ ...props, target: props.href?.startsWith('#') ? '' : '_blank', id }} />;
    },
    details: (props: DetailsProps & ExtraProps) => {
        const summaryEl = (props.children as (Node & { props: { children: string } })[])?.find(
            (el) => el.type === 'summary',
        );
        const isReferences = summaryEl?.props.children?.includes('Referenties');

        // Add an ID to the details element with references so that it can be opened when clicking on a reference in the text
        // Eg clicking '[11]' needs to scroll to the footnotes to reference no 11.
        return <Details {...{ ...props, ...(isReferences ? { id: 'references' } : {}) }} />;
    },
    p: (props: ParagraphProps) => <Paragraph {...props} />,
    ul: (props: UnorderedList) => <List {...props} listType={'unordered'} />,
    ol: (props: OrderedList) => <List {...props} listType={'ordered'} />,
};

type Props = {
    content: string;
};

export function MarkdownContent({ content }: Props) {
    const currentHash = window.location.hash?.split('#')[1];

    useEffect(() => {
        if (!currentHash) return;

        window.location.hash = '';

        const referenceEl = document.getElementById(currentHash);

        if (!referenceEl) return;

        document.querySelectorAll('.highlight').forEach((el) => el.classList.remove('highlight'));
        document.getElementById('references')?.setAttribute('open', 'open');
        referenceEl.scrollIntoView({ behavior: 'smooth' });

        const parentParagraphEl = referenceEl.parentElement?.parentElement;
        parentParagraphEl?.classList.add('highlight');
    }, [currentHash]);

    return (
        <div className={styles.markdownWrapper}>
            <Markdown
                children={content}
                rehypePlugins={[rehypeRaw, linkSourceToFootnote]}
                remarkPlugins={[remarkGfm]}
                components={components}
                className={styles.markdownContent}
            />
        </div>
    );
}
