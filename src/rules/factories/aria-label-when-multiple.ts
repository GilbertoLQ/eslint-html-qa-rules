import { hasAttr, getJSXTagName } from '../atoms/attrs';

export function makeAriaLabelWhenMultipleRule(tagName: string) {
  const tag = `<${tagName}>`;
  return {
    meta: {
      type: 'suggestion' as const,
      docs: {
        description: `Si hay múltiples ${tag} en la vista, exige aria-label/aria-labelledby para diferenciarlos.`,
        recommended: false,
      },
      schema: [],
      messages: {
        needsLabel: `${tag} requiere aria-label/aria-labelledby cuando hay múltiples instancias.`,
      },
    },
    create(context: any) {
      const nodes: any[] = [];
      return {
        JSXOpeningElement(node: any) {
          const name = getJSXTagName(node);
          if (name === tagName) nodes.push(node);
        },
        'Program:exit'() {
          if (nodes.length <= 1) return;
          for (const n of nodes) {
            if (!hasAttr(n, 'aria-label') && !hasAttr(n, 'aria-labelledby')) {
              context.report({ node: n, messageId: 'needsLabel' });
            }
          }
        },
      };
    },
  };
}
