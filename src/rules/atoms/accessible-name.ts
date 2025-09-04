import { hasAttr } from './attrs';

type JSXText = { type: string; value: string };
type JSXElement = {
  type: string;
  openingElement: any;
  children?: any[];
};

/** ¿Tiene texto hijo no vacío? */
export function hasNonEmptyVisibleText(node: JSXElement): boolean {
  const children: any[] = (node as any).children ?? [];
  return children.some((c) => {
    if (c?.type === 'JSXText' && typeof c.value === 'string') {
      return c.value.trim().length > 0;
    }
    return false;
  });
}

/** Heurística simple de Accessible Name (texto visible o aria-*) */
export function hasAccessibleName(node: JSXElement): boolean {
  if (hasNonEmptyVisibleText(node)) return true;
  const opening: any = node.openingElement;
  if (opening && hasAttr(opening, 'aria-label')) return true;
  if (opening && hasAttr(opening, 'aria-labelledby')) return true;
  return false;
}
