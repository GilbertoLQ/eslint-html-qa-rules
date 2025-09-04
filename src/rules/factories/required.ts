import { missingAttrs, getJSXTagName } from '../atoms/attrs';

export function makeRequiredAttrsRule(
  tagName: string,
  required: string[],
  friendlyTag?: string,
) {
  const tag = friendlyTag ?? `<${tagName}>`;
  return {
    meta: {
      type: 'problem' as const,
      docs: {
        description: `Exige atributos obligatorios en ${tag}.`,
        recommended: false,
      },
      schema: [],
      messages: {
        missingAttr: `${tag} falta(n) atributo(s): {{attrs}}`,
      },
    },
    create(context: any) {
      return {
        JSXOpeningElement(node: any) {
          const name = getJSXTagName(node);
          if (name !== tagName) return;
          const miss = missingAttrs(node, required);
          if (miss.length) {
            context.report({
              node,
              messageId: 'missingAttr',
              data: { attrs: miss.join(', ') },
            });
          }
        },
      };
    },
  };
}

export function makeRequiredAttrsRuleMulti(
  tagNames: string[],
  required: string[],
  friendlyTag = `<${tagNames.join('|')}>`,
) {
  const lower = tagNames.map((t) => t.toLowerCase());
  return {
    meta: {
      type: 'problem' as const,
      docs: {
        description: `Exige atributos obligatorios en ${friendlyTag}.`,
        recommended: false,
      },
      schema: [],
      messages: {
        missingAttr: `${friendlyTag} falta(n) atributo(s): {{attrs}}`,
      },
    },
    create(context: any) {
      return {
        JSXOpeningElement(node: any) {
          const name = getJSXTagName(node);
          if (!name || !lower.includes(name)) return;
          const miss = missingAttrs(node, required);
          if (miss.length) {
            context.report({
              node,
              messageId: 'missingAttr',
              data: { attrs: miss.join(', ') },
            });
          }
        },
      };
    },
  };
}
