import { hasAttr, getJSXTagName } from '../atoms/attrs';

export function makeRecommendedAttrsRule(
  tagName: string,
  recommended: string[],
  friendlyTag?: string,
) {
  const tag = friendlyTag ?? `<${tagName}>`;
  return {
    meta: {
      type: 'suggestion' as const,
      docs: {
        description: `Recomienda atributos en ${tag}.`,
        recommended: false,
      },
      schema: [],
      messages: {
        missingRecommended: `${tag} sin atributo(s) recomendado(s): {{attrs}}`,
      },
    },
    create(context: any) {
      return {
        JSXOpeningElement(node: any) {
          const name = getJSXTagName(node);
          if (name !== tagName) return;
          const miss = recommended.filter((a) => !hasAttr(node, a));
          if (miss.length) {
            context.report({
              node,
              messageId: 'missingRecommended',
              data: { attrs: miss.join(', ') },
            });
          }
        },
      };
    },
  };
}
