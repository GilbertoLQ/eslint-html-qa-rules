# eslint-html-qa-rules
======================

Plugin de ESLint con reglas simples para revisar semántica HTML/JSX orientada a QA: atributos requeridos/recomendados, nombre accesible en elementos interactivos y consistencia de `data-testid`.

Características
- Reglas generadas desde `config/html-qa-map.json` para múltiples tags HTML.
- Valida atributos requeridos y recomendados por etiqueta.
- Exige nombre accesible (texto visible o `aria-*`) cuando aplica.
- Detecta `img` con `alt` vacío (salvo casos decorativos).
- Regla configurable para estandarizar `data-testid`.

Instalación
- Instala el plugin en tu proyecto:
  - npm: `npm i -D eslint-plugin-html-qa`
  - yarn: `yarn add -D eslint-plugin-html-qa`
- Si publicas/descargas desde GitHub Packages, configura tu `.npmrc`:
  
  ```
  @<tu-scope>:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
  ```

Uso rápido
1) Agrega el plugin a tu configuración de ESLint (ej. `.eslintrc.js`):

```js
module.exports = {
  // Asegúrate de tener el parser adecuado para TS/JSX si lo usas
  plugins: ['html-qa'],
  rules: {
    // Ejemplos (ajusta severidades a tu gusto)
    'html-qa/input-required-attrs': 'error',
    'html-qa/button-accessible-name': 'warn',
    'html-qa/a-accessible-name': 'warn',
    'html-qa/img-alt-not-empty': 'error',
    'html-qa/form-aria-label-when-multiple': 'warn',
    'html-qa/validate-data-testid': ['error', { pattern: true, disallow: true }],
  },
};
```

2) Lanza ESLint sobre tu código:

```bash
npx eslint . --ext .html
```

Reglas incluidas (resumen)
- `<tag>-required-attrs`: exige atributos obligatorios por etiqueta (p. ej. `input-required-attrs`).
- `<tag>-recommended-attrs`: recomienda atributos útiles (si existen para la etiqueta).
- `<tag>-accessible-name`: fuerza nombre accesible en elementos interactivos (`button`, `a`, etc.).
- `<tag>-aria-label-when-multiple`: requiere `aria-label`/`aria-labelledby` cuando hay múltiples landmarks del mismo tipo (`nav`, `header`, `main`, `section`, `article`, `form`, `footer`, `aside`).
- `img-alt-not-empty`: evita `alt` vacío salvo imágenes puramente decorativas.
- `validate-data-testid`: valida el patrón de `data-testid` y evita nombres genéricos.

Tip: los nombres exactos de las reglas se generan a partir del mapa en `config/html-qa-map.json`. Ejemplos frecuentes: `input-required-attrs`, `button-required-attrs`, `a-accessible-name`, `form-aria-label-when-multiple`, etc.

`validate-data-testid` (opciones)
- `pattern`:
  - `true` o `undefined`: usa el preset por defecto `prefixed` (ej. `btn-primary`, `form-login`).
  - `"kebab" | "snake" | "camel" | "prefixed"`: usa uno de los presets incluidos.
  - `string` con regex: usa tu propia expresión regular (como string) p. ej. `"^[a-z]+-[a-z]+$"`.
- `disallow`:
  - `true`: bloquea palabras genéricas por defecto (`test`, `todo`, `foo`, `bar`, `123`).
  - `string[]`: tu propia lista a evitar.

Ejemplo de configuración recomendada para tests
```js
rules: {
  'html-qa/input-required-attrs': 'error',
  'html-qa/select-required-attrs': 'error',
  'html-qa/textarea-required-attrs': 'error',
  'html-qa/button-accessible-name': 'warn',
  'html-qa/a-accessible-name': 'warn',
  'html-qa/img-alt-not-empty': 'error',
  'html-qa/form-aria-label-when-multiple': 'warn',
  'html-qa/validate-data-testid': ['error', { pattern: 'prefixed', disallow: true }],
}
```

Requisitos/Notas
- Pensado para proyectos con JSX/TSX (React u otros) donde el AST expone `JSXOpeningElement`.
- Ajusta severidades según el equipo y el proyecto.
- Si necesitas nuevas reglas o atributos, edita `config/html-qa-map.json` y vuelve a compilar.

Desarrollo
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test` (placeholder por ahora)

Licencia
- UNLICENSED.

