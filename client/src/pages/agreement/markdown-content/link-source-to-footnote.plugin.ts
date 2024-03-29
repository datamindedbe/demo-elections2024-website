import { visit } from 'unist-util-visit';
import { u as build } from 'unist-builder';

export type TextNode = { type: 'text'; value: string };

export type Node =
    | TextNode
    | {
          children: Node[];
          tagName: string;
          type: string;
      };

type Root = {
    children: Node[];
    type: 'root';
};

export const linkSourceToFootnote = () => {
    return (tree: Root): Root => {
        visit(tree, 'text', (node, index, parent) => {
            // Find the references to the footnotes (e.g. [11])
            const textSegments = node.value.split(/\[|\]/);

            if (textSegments.length > 1 && parent && 'tagName' in parent && parent.tagName !== 'a') {
                const newNodes = textSegments.map((segment) => {
                    const referenceNumber = Number(segment);

                    // Node can just be normal text or empty -> stays a text segment
                    if (Number.isNaN(referenceNumber) || segment === '') {
                        return build('text', segment);
                    }

                    // It is a number, so create a link to the reference in the footnotes
                    return build('element', { tagName: 'a', properties: { href: `#reference-${referenceNumber}` } }, [
                        build('text', `[${referenceNumber}]`),
                    ]);
                });
                parent.children.splice(index!, 1, ...newNodes);
            }
        });

        return tree;
    };
};
