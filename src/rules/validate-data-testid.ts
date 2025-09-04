import { getAttrValue, hasAttr } from './atoms/attrs';

/**
 * Regla: validate-data-testid
 * - Permite presets o regex custom para el patrón
 * - Permite lista "disallow" por preset o custom
 */

// Presets disponibles para el patrón
const PRESET_PATTERNS = {
  kebab: /^[a-z0-9]+(-[a-z0-9]+)*$/,
  snake: /^[a-z0-9]+(_[a-z0-9]+)*$/,
  camel: /^[a-z][a-zA-Z0-9]*$/,
  prefixed:
    /^(btn|input|link|card|nav|header|footer|aside|section|article|modal|dialog|toast|table|row|col|list|item|img|icon|form|label|field|select|textarea|video|audio|svg|canvas)-[a-z0-9]+(-[a-z0-9]+)*$/,
} as const;

type PresetName = keyof typeof PRESET_PATTERNS;

const PRESET_DISALLOW = ['test', 'todo', 'foo', 'bar', '123'];

type Options = {
  /**
   * pattern:
   *  - true  => usa preset por defecto ("prefixed")
   *  - string => nombre de preset ("kebab" | "snake" | "camel" | "prefixed") o regex en string
   */
  pattern?: boolean | string;
  /**
   * disallow:
   *  - true => usa lista por defecto PRESET_DISALLOW
   *  - string[] => lista custom
   */
  disallow?: boolean | string[];
};

// Defaults centralizados
const DEFAULTS = {
  patternPresetName: 'prefixed' as PresetName,
  disallow: PRESET_DISALLOW as readonly string[],
} as const;

function resolvePattern(opt: Options | undefined): { regex: RegExp; label: string } {
  const p = opt?.pattern;

  // true | undefined => usa el preset por defecto
  if (p === true || p === undefined) {
    const preset = PRESET_PATTERNS[DEFAULTS.patternPresetName]; // ahora es RegExp seguro
    return { regex: preset, label: `preset:${DEFAULTS.patternPresetName}` };
  }

  if (typeof p === 'string') {
    if ((p as string) in PRESET_PATTERNS) {
      const key = p as PresetName;
      return { regex: PRESET_PATTERNS[key], label: `preset:${key}` };
    }
    // si no, trátalo como regex string personalizado
    const rx = new RegExp(p);
    return { regex: rx, label: p };
  }

  // fallback => kebab
  return { regex: PRESET_PATTERNS.kebab, label: 'preset:kebab' };
}

function resolveDisallow(opt: Options | undefined): string[] {
  const d = opt?.disallow;
  if (d === true) return [...DEFAULTS.disallow];
  if (Array.isArray(d)) return d;
  return [];
}

export function makeValidateDataTestidRule() {
  return {
    meta: {
      type: 'problem' as const,
      docs: {
        description:
          'Valida que el atributo data-testid siga un patrón consistente (no vacío, no genérico).',
        recommended: false,
      },
      schema: [
        {
          type: 'object',
          properties: {
            pattern: { anyOf: [{ type: 'string' }, { type: 'boolean' }] },
            disallow: {
              anyOf: [
                { type: 'array', items: { type: 'string' } },
                { type: 'boolean' },
              ],
            },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        empty: 'El atributo data-testid no debe estar vacío.',
        generic:
          'El valor de data-testid "{{value}}" es demasiado genérico. Usa un nombre más específico.',
        invalid:
          'El valor de data-testid "{{value}}" no cumple el patrón requerido {{pattern}}.',
      },
    },
    create(context: any) {
      const options: Options | undefined = context.options?.[0];

      const { regex: pattern, label: patternLabel } = resolvePattern(options);
      const disallow = resolveDisallow(options);

      return {
        JSXOpeningElement(node: any) {
          // Si no existe el atributo, no inspeccionamos
          if (!hasAttr(node, 'data-testid')) return;

          const value = getAttrValue(node, 'data-testid')?.trim() ?? '';
          if (!value) {
            context.report({ node, messageId: 'empty' });
            return;
          }

          if (disallow.includes(value)) {
            context.report({ node, messageId: 'generic', data: { value } });
            return;
          }

          if (!pattern.test(value)) {
            context.report({
              node,
              messageId: 'invalid',
              data: { value, pattern: patternLabel },
            });
          }
        },
      };
    },
  };
}
