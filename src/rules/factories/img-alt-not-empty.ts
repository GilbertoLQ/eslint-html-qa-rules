import { getJSXTagName, getAttrValue } from '../atoms/attrs';

export function makeImgAltNotEmptyRule() {
  return {
    meta: {
      type: 'problem' as const,
      docs: {
        description:
          'Exige que <img> no tenga alt vacío, salvo si es decorativa (role="presentation" o aria-hidden="true").',
        recommended: false,
      },
      schema: [],
      messages: {
        emptyAlt:
          '<img> no debe tener alt="" a menos que sea decorativa (role="presentation" o aria-hidden="true").',
      },
    },
    create(context: any) {
      return {
        JSXOpeningElement(node: any) {
          const name = getJSXTagName(node);
          if (name !== 'img') return;
          const alt = getAttrValue(node, 'alt');
          const role = (getAttrValue(node, 'role') || '').toLowerCase();
          const ariaHidden = (getAttrValue(node, 'aria-hidden') || '').toLowerCase();
          const isDecorative = role === 'presentation' || ariaHidden === 'true';

          if (alt !== undefined && alt.trim() === '' && !isDecorative) {
            context.report({ node, messageId: 'emptyAlt' });
          }
        },
      };
    },
  };
}
