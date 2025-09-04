import { hasAccessibleName } from '../atoms/accessible-name';
import { getJSXTagName } from '../atoms/attrs';

export function makeAccessibleNameRule(
  tagNames: string[],
  friendlyTag = `<${tagNames.join('|')}>`,
) {
  const lower = tagNames.map((t) => t.toLowerCase());
  return {
    meta: {
      type: 'problem' as const,
      docs: {
        description: `Exige nombre accesible en ${friendlyTag} (texto visible o aria-label/aria-labelledby).`,
        recommended: false,
      },
      schema: [],
      messages: {
        missingName: `${friendlyTag} debe tener nombre accesible (texto visible o aria-label/aria-labelledby).`,
      },
    },
    create(context: any) {
      return {
        JSXElement(node: any) {
          const opening = node.openingElement;
          const name = opening ? getJSXTagName(opening) : undefined;
          if (!name || !lower.includes(name)) return;
          if (!hasAccessibleName(node)) {
            context.report({ node: opening, messageId: 'missingName' });
          }
        },
      };
    },
  };
}
