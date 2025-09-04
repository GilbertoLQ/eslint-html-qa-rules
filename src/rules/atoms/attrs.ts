/**
 * Utilidades para trabajar con atributos en nodos JSX (ESTree)
 */

type JSXIdentifier = { type: string; name: string };
type JSXAttribute = {
  type: string;
  name: JSXIdentifier;
  value?: any;
};
type JSXSpreadAttribute = { type: string };
type JSXOpeningElement = {
  type: string;
  name: JSXIdentifier | any;
  attributes: (JSXAttribute | JSXSpreadAttribute)[];
};

function getNameFromJSX(node: { name: any }): string | undefined {
  const n: any = node?.name;
  if (!n) return undefined;
  if (n.type === 'JSXIdentifier') return String(n.name || '').toLowerCase();
  // No soportamos nombres cualificados (Member/Namespaced) en estas reglas
  return undefined;
}

export function hasAttr(node: JSXOpeningElement, name: string): boolean {
  const n = name.toLowerCase();
  return node.attributes?.some((a: any) => {
    return a?.type === 'JSXAttribute' && a.name?.name?.toLowerCase() === n;
  });
}

export function getAttrValue(
  node: JSXOpeningElement,
  name: string,
): string | undefined {
  const n = name.toLowerCase();
  const attr: any = node.attributes?.find(
    (a: any) => a?.type === 'JSXAttribute' && a.name?.name?.toLowerCase() === n,
  );
  if (!attr) return undefined;
  const v = attr.value;
  // Literal: { type: 'Literal', value: string } o JSXText-as-literal
  if (!v) return '';
  if (v.type === 'Literal') return typeof v.value === 'string' ? v.value : undefined;
  if (v.type === 'JSXExpressionContainer') {
    // Solo resolvemos literal inmediata: attr={"text"}
    const expr: any = v.expression;
    if (expr && expr.type === 'Literal' && typeof expr.value === 'string') {
      return expr.value;
    }
  }
  return undefined;
}

export function missingAttrs(
  node: JSXOpeningElement,
  required: string[],
): string[] {
  return required.filter((attr) => !hasAttr(node, attr));
}

export function getJSXTagName(node: JSXOpeningElement): string | undefined {
  return getNameFromJSX(node);
}
