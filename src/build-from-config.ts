import map from '../config/html-qa-map.json';
import {
  makeRequiredAttrsRule,
  makeRequiredAttrsRuleMulti,
  makeRecommendedAttrsRule,
  makeAccessibleNameRule,
  makeAriaLabelWhenMultipleRule,
  makeImgAltNotEmptyRule,
} from './rules/_utils.js';
import { makeValidateDataTestidRule } from './rules/validate-data-testid.js';

//El tipo para soportar flags adicionales del JSON
type RuleEntry = {
  requiredAttributes?: string[];
  recommendedAttributes?: string[];
  tags?: string[];
  mustHaveVisibleText?: boolean;
  fallbackAriaLabelIfNoText?: boolean;
  ariaLabelWhenMultiple?: boolean;
  altShouldNotBeEmpty?: boolean;
};

export function buildRulesFromConfig() {
  const rules: Record<string, unknown> = {};

  for (const [key, raw] of Object.entries(map as Record<string, RuleEntry>)) {
    const entry: RuleEntry = raw || {};
    const req = entry.requiredAttributes ?? [];
    const rec = entry.recommendedAttributes ?? [];
    const tags = entry.tags;

    // 1) Reglas de atributos REQUERIDOS
    if (tags?.length) {
      rules[`${key}-required-attrs`] = makeRequiredAttrsRuleMulti(
        tags,
        req,
        `<${tags.join('|')}>`,
      );
    } else {
      rules[`${key}-required-attrs`] = makeRequiredAttrsRule(
        key,
        req,
        `<${key}>`,
      );
    }

    // 2) Reglas de atributos RECOMENDADOS
    if (rec.length) {
      // Para multi-tag usamos una etiqueta amigable combinada
      const friendly = tags?.length ? `<${tags.join('|')}>` : `<${key}>`;
      // Nota: la factory actual valida un tagName; si es multi, tomamos el primero
      const tagForFactory = tags?.[0] ?? key;
      rules[`${key}-recommended-attrs`] = makeRecommendedAttrsRule(
        tagForFactory,
        rec,
        friendly,
      );
    }

    // 3) Nombre accesible en elementos interactivos (texto visible o aria-*)
    if (entry.mustHaveVisibleText || entry.fallbackAriaLabelIfNoText) {
      const list = tags?.length ? tags : [key];
      rules[`${key}-accessible-name`] = makeAccessibleNameRule(
        list,
        tags?.length ? `<${tags.join('|')}>` : `<${key}>`,
      );
    }

    // 4) aria-label / aria-labelledby cuando hay múltiples landmarks del mismo tipo
    if (entry.ariaLabelWhenMultiple) {
      const list = tags?.length ? tags : [key];
      for (const t of list) {
        rules[`${t}-aria-label-when-multiple`] =
          makeAriaLabelWhenMultipleRule(t);
      }
    }

    // 5) img alt no vacío (con excepciones decorativas)
    if (key === 'img' && entry.altShouldNotBeEmpty) {
      rules['img-alt-not-empty'] = makeImgAltNotEmptyRule();
    }
  }

  rules['validate-data-testid'] = makeValidateDataTestidRule();

  return rules;
}
