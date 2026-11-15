# Cubit UI — Design System & Component Library

[한국어](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Português](README.pt.md)

> **Aviso de idioma:** El README en coreano ([README.md](README.md)) siempre tiene prioridad. Si el contenido de esta traducción difiere del README en coreano, o si la traducción es inexacta, prevalece el README en coreano.

> **Estandarización y una experiencia de usuario coherente entre frameworks, basadas en nuestro propio sistema de tokens de diseño**

Cubit UI es una biblioteca estándar de componentes de interfaz basada en una estética geométrica sólida y fiable (**Cubit · Minimal**: tokens de redondeo (8/12/16px + Pill), espaciado de 4px/8px, contraste de bordes nítido).

Los componentes principales se implementan una sola vez como **Web Components** estándar (Custom Elements + Shadow DOM con alcance), con envoltorios 1:1 para **React** y **Svelte**, de modo que se mantienen exactamente los mismos tokens de diseño y el mismo contrato de API sin importar el framework.

---

## 0. Inicio rápido

```bash
git clone https://github.com/tsuel-dev/Cubit.git
cd Cubit
pnpm install
pnpm run build
```

---

## 1. Arquitectura y paquetes

```text
packages/
├── tokens/   # Primitive/semantic tokens, light/dark themes, CSS variable generator
├── core/     # 30 Web Components (zero external UI dependencies, WCAG 2.1 AA)
├── react/    # React 18/19 wrappers (forwardRef, type-safe props, event mapping)
└── svelte/   # Svelte 4/5 wrappers (reactive bindings, slot forwarding, custom events)

examples/
├── vanilla/  # Plain HTML + Web Components showcase
├── react/    # React TSX showcase
└── svelte/   # Svelte showcase
```

---

## 2. Especificación de tokens de diseño (valores de referencia fijos)

- **Colores**:
  - Fondo / primer plano por defecto: `White (#ffffff)` / `Black (#000000)`
  - Color de énfasis (Primary / Accent): `#ff5500`
  - Secundario / de fondo (Secondary): `#ffebcc`, `#ffe4c9`
  - Modo oscuro: Black (`#000000`) con fondos Dark Gray por niveles y ajuste de alto contraste (mantiene la legibilidad de `#ff5500` y garantiza un contraste WCAG 2.1 AA de 4.5:1 o más)
- **Estética (Cubit · Minimal)**:
  - Tokens de radio de esquina: `--ui-radius-sm: 8px` (controles generales como botones y tarjetas) / `--ui-radius-md: 12px` (contenedores) / `--ui-radius-lg: 16px` (modales y paneles grandes) / `--ui-radius-full: 9999px` (pills como insignias y pistas de interruptor)
  - Escala de espaciado: tokens basados en `4px / 8px`
  - Bordes: bordes nítidos y separación clara de capas (sin sombras innecesarias)
- **Tipografía**:
  - Usa la **pila de fuentes del sistema** nativa del sistema operativo, sin descargar fuentes externas

---

## 3. Instalación y uso (espacio de trabajo local)

Puedes usar los paquetes dentro del monorepo o desde un proyecto local.

### 3.1. Cargar las hojas de estilo de tokens de diseño (obligatorio en todos los casos)
Incluye el CSS de tokens en el punto de entrada de tu proyecto (HTML o bundle raíz):
```html
<!-- Load from HTML -->
<link rel="stylesheet" href="./packages/tokens/dist/css/tokens.css" />
<link rel="stylesheet" href="./packages/tokens/dist/css/dark.css" />
```
```ts
// Import from a JS/TS bundler (Vite, Webpack, ...)
import '@cubit-ui/tokens/css/tokens.css';
import '@cubit-ui/tokens/css/dark.css';
```

### 3.2. Vanilla (Web Components)
```ts
import '@cubit-ui/core';
```
```html
<ui-button variant="primary" size="md">Save</ui-button>
<ui-input placeholder="Enter your name"></ui-input>
<ui-modal id="myModal" title="Notice">
  <p>This is the modal content.</p>
  <div slot="footer">
    <ui-button variant="outline" onclick="document.getElementById('myModal').open=false">Close</ui-button>
  </div>
</ui-modal>
```

### 3.3. React
```tsx
import React, { useState } from 'react';
import { Button, Input, Modal, Alert } from '@cubit-ui/react';

export function MyComponent() {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');

  return (
    <div>
      <Alert variant="info" title="Notice">The React components work.</Alert>
      <Input value={val} onChange={(detail) => setVal(detail.value)} placeholder="Input" />
      <Button variant="primary" onClick={() => setOpen(true)}>Open modal</Button>

      <Modal open={open} title="Confirm" onClose={() => setOpen(false)}>
        <p>Selected value: {val}</p>
        <div slot="footer">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
```

### 3.4. Svelte
```svelte
<script lang="ts">
  import { Button, Input, Modal, Alert } from '@cubit-ui/svelte';

  let open = false;
  let text = '';

  function handleInputChange(e: CustomEvent<{ value: string }>) {
    text = e.detail.value;
  }
</script>

<Alert variant="success" title="Svelte example">A Svelte binding example.</Alert>
<Input value={text} on:change={handleInputChange} placeholder="Type here" />
<Button variant="primary" on:click={() => open = true}>Open modal</Button>

<Modal {open} title="Svelte modal" on:close={() => open = false}>
  <p>Entered text: {text}</p>
  <div slot="footer">
    <Button variant="outline" on:click={() => open = false}>Close</Button>
  </div>
</Modal>
```

---

## 4. Tabla de API y props de los 30 componentes

| Grupo | Etiqueta / nombre del componente | Props / atributos principales | Eventos | Accesibilidad (ARIA / WCAG) |
| :--- | :--- | :--- | :--- | :--- |
| **Básico 1** | `ui-button` / `Button` | `variant` (primary/secondary/outline/ghost/danger), `size` (sm/md/lg), `disabled`, `type` | `click` | `aria-disabled`, anillo de foco de alto contraste |
| **Básico 2** | `ui-input` / `Input` | `value`, `placeholder`, `type`, `disabled`, `readonly`, `size`, `invalid` | `input`, `change` | `aria-invalid`, `aria-disabled` |
| **Básico 3** | `ui-checkbox` / `Checkbox` | `checked`, `disabled`, `indeterminate`, `name`, `value` | `change` | `role="checkbox"`, `aria-checked`, tecla Espacio |
| **Básico 4** | `ui-radio` / `Radio` | `checked`, `disabled`, `name`, `value` | `change` | `role="radio"`, selección exclusiva dentro del grupo, tecla Espacio |
| **Básico 5** | `ui-switch` / `Switch` | `checked`, `disabled` | `change` | `role="switch"`, `aria-checked`, pista pill + control circular |
| **Básico 6** | `ui-select` / `Select` | `value`, `placeholder`, `disabled`, `size`, `open` | `change`, `open`, `close` | `role="combobox"`, se cierra con Esc, se cierra al hacer clic fuera |
| **Básico 7** | `ui-modal` / `Modal` | `open`, `title` | `close` | `role="dialog"`, `aria-modal`, trampa de foco, se cierra con Esc |
| **Básico 8** | `ui-toast` / `Toast` | `variant` (info/success/warning/error), `duration`, `open` | `close` | `role="status"`, `aria-live="polite"`, temporizador de cierre automático |
| **Básico 9** | `ui-tooltip` / `Tooltip` | `content`, `position` (top/bottom/left/right) | - | `role="tooltip"`, se activa con hover/focus, Esc para salir |
| **Básico 10** | `ui-tabs` / `Tabs` | `value` | `change` | `role="tablist/tab/tabpanel"`, teclas de flecha/Home/End |
| **Básico 11** | `ui-badge` / `Badge` | `variant` (primary/secondary/outline/success/warning/error), `size` | - | etiqueta pill, texto de alto contraste |
| **Básico 12** | `ui-spinner` / `Spinner` | `size` (sm/md/lg) | - | `role="status"`, `aria-label="Loading"` |
| **Básico 13** | `ui-alert` / `Alert` | `variant` (info/success/warning/error), `title`, `closable` | `close` | `role="alert"`, contraste de color de 4.5:1 garantizado |
| **Ampliado 14** | `ui-card` / `Card` | `variant` (default/elevated/secondary/bordered), `bordered` | - | ranuras header, body y footer separadas |
| **Ampliado 15** | `ui-accordion` / `Accordion` | `multiple` (`ui-accordion-item`: `open`, `title`, `disabled`) | `change`, `toggle-item` | `role="region"`, `aria-expanded`, Enter/Espacio |
| **Ampliado 16** | `ui-dropdown` / `Dropdown` | `open`, `placement`, `disabled` | `open`, `close` | `role="menu"`, `role="menuitem"`, se cierra al hacer clic fuera |
| **Ampliado 17** | `ui-progress` / `Progress` | `value`, `max`, `size`, `variant` | - | `role="progressbar"`, `aria-valuenow/min/max` |
| **Ampliado 18** | `ui-pagination` / `Pagination` | `current`, `total`, `page-size` | `change` | `role="navigation"`, `aria-current="page"`, teclado |
| **Ampliado 19** | `ui-table` / `Table` | `striped`, `bordered`, `hoverable` | - | `role="table"`, fondo secundario (`#ffe4c9`) al pasar el cursor |
| **Ampliado 20** | `ui-avatar` / `Avatar` | `src`, `alt`, `name`, `size` (sm/md/lg), `shape` (circle/square) | - | circular por defecto, opción `shape="square"`, iniciales si la imagen falla |
| **Ampliado 21** | `ui-breadcrumbs` / `Breadcrumbs` | `separator` (`ui-breadcrumb-item`: `href`, `current`) | - | `role="navigation"`, `aria-current="page"` |
| **Ampliado 22** | `ui-drawer` / `Drawer` | `open`, `side` (left/right), `title` | `close` | trampa de foco, se cierra con Esc/fondo, panel fuera de lienzo |
| **Ampliado 23** | `ui-skeleton` / `Skeleton` | `variant` (text/circle/rect), `width`, `height`, `lines` | - | `aria-hidden`, el shimmer se detiene con `prefers-reduced-motion` |
| **Ampliado 24** | `ui-navbar` / `Navbar` | `brand`, `sticky` | - | `role="navigation"`, ranura de enlaces por defecto + ranura `actions` |
| **Datos 25** | `ui-log` / `Log` (+ `ui-log-item` / `LogItem`) | `label`, `height`, `wrap`, `auto-scroll`, `max`, `empty` (`ui-log-item`: `level`(info/success/warning/error/debug), `time`) | `copy` | `role="log"`, `aria-live="polite"`, parte inferior fija, API: `push()` / `scrollDown()` / `clear()` |
| **Nuevo 26** | `ui-textarea` / `Textarea` | `value`, `placeholder`, `rows`, `maxlength`, `resize` (none/vertical/both), `size`, `name`, `disabled`, `readonly`, `invalid` | `input`, `change` | `aria-invalid`, asociado a formularios (`name`, reset, fieldset disabled), contador de caracteres si se define `maxlength` |
| **Nuevo 27** | `ui-empty-state` / `EmptyState` | `heading`, `description`, `size` (sm/md), `variant` (default/error) | - | título como `<h3>`, icono decorativo oculto para tecnologías de apoyo, ranura de acciones |
| **Nuevo 28** | `ui-segmented` / `Segmented` | `value`, `size` (sm/md/lg), `disabled` (`ui-segment`: `value`, `disabled`) | `change` | `role="radiogroup"` / `role="radio"`, `aria-checked`, teclas de flecha/Home/End (roving tabindex) |
| **Nuevo 29** | `ui-stepper` / `Stepper` | `current`, `orientation` (horizontal/vertical) (`ui-step`: `label`, `description`, `status`) | - | `role="list"` / `listitem`, `aria-current="step"`, el estado del paso se anuncia a los lectores de pantalla |
| **Nuevo 30** | `ui-chip` / `Chip` | `variant` (neutral/primary/success/warning/error), `size` (sm/md), `removable`, `disabled`, `remove-label` | `remove` | enfocable si es eliminable, botón × con `aria-label`, Delete/Backspace solicita la eliminación |

> **Soporte de formularios (v1.1):** `ui-input`, `ui-textarea`, `ui-checkbox`, `ui-radio` y `ui-switch` participan en los formularios: se envían con `name` y respetan `<form>.reset()` y `<fieldset disabled>`.

---

## 5. Guía para cambiar entre modo claro y oscuro

La biblioteca usa un sistema de temas basado en variables CSS, por lo que basta con establecer el atributo `data-theme` en la etiqueta de nivel superior (`html` o `body`) para que todos los componentes cambien al instante.

### 5.1. Cambiar directamente con un atributo HTML
```html
<!-- Force light mode -->
<html data-theme="light">

<!-- Force dark mode -->
<html data-theme="dark">

<!-- Follow the OS theme (without data-theme, prefers-color-scheme applies) -->
<html>
```

### 5.2. Usar las funciones auxiliares de JS/TS
Puedes usar los auxiliares en tiempo de ejecución que ofrece `@cubit-ui/tokens`:
```ts
import { setTheme, getTheme } from '@cubit-ui/tokens';

// Switch to dark mode
setTheme('dark');

// Switch to light mode
setTheme('light');

// Restore the system setting
setTheme('system');

// Read the current setting
console.log(getTheme()); // 'light' | 'dark' | 'system'
```

---

## 6. Personalización de los tokens de diseño

Si sobrescribes las propiedades personalizadas de CSS en el CSS global o en el ámbito de un contenedor concreto, el cambio se propaga de inmediato a los componentes que contiene.

```css
/* Example: custom brand override for an application */
:root {
  /* Change the primary color to match your brand */
  --ui-color-primary: #ff4500;
  --ui-color-primary-hover: #e03e00;

  /* Make the default 8px button radius larger, like cards */
  --ui-radius-sm: 12px;

  /* Change the default font stack */
  --ui-font-family-base: "Pretendard", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## 7. Pautas estándar de UX (patrones de auditorías de servicios reales)

Los tipos de problemas hallados repetidamente en auditorías de servicios reales se definen aquí como **patrones estándar de composición de componentes**.
Los cuatro patrones siguientes coinciden con las demos en vivo de la documentación de la biblioteca (`examples/vanilla` — sección UX Patterns).

### 7.1. Máquina de estados de búsqueda — mostrar siempre los cuatro estados: cargando / éxito / sin resultados / error

**Principio**: las búsquedas y consultas siempre muestran explícitamente sus cuatro estados.
`carga lenta → carga infinita` (falta el indicador de carga), `error → ocultado como resultado vacío` y `sin resultados → pantalla en blanco` se consideran errores.

- **Cargando**: muestra `ui-spinner size="sm"` en el área de resultados y aplica el patrón de bloqueo de 7.2 al botón de búsqueda
- **Sin resultados**: `ui-alert variant="warning"` + indicación de la siguiente acción («prueba con otro término de búsqueda»)
- **Error**: `ui-alert variant="error"` + cómo reintentar (nunca ocultes en la etiqueta de un botón que se trata de un problema de red)
- Asigna `aria-live="polite"` al contenedor de resultados (para que los lectores de pantalla anuncien las actualizaciones)

```ts
// Standard skeleton (vanilla)
const box = document.getElementById('searchResults'); // aria-live="polite"
box.innerHTML = '';
button.disabled = true;           // 1) lock immediately
box.appendChild(spinner);         // 2) show loading
const items = await fetch(...);
if (items.length === 0) renderEmpty();   // 3) empty result = warning Alert
box.appendChild(resultRow);              // 4) success = actual results
button.disabled = false;          // always restore
```

**Antipatrones**: dejar el área de resultados como está y terminar solo con un toast / mostrar un error con una insignia de «hecho».

### 7.2. Bloqueo de botones contra doble clic — guardia busy + etiqueta de reintento tras un error

**Principio**: bloquea siempre el botón de cualquier acción que tarde 0.5 s o más, o cuyo duplicado sea costoso.
Un botón sin protección permite que un doble clic cree envíos duplicados.

- Mientras se procesa: atributo `disabled` + sustituir la etiqueta por `"Procesando..."`
- Si falla: devolver la etiqueta a `"Reintentar"` + mostrar la causa con `ui-toast variant="error"` (restaurar la etiqueta original tras 2 s)
- Si tiene éxito: restaurar la etiqueta original + dar respuesta con `ui-toast variant="success"`

```ts
async function withButtonLock(button, busyLabel, action, failLabel = 'Try again') {
  if (button.dataset.busy === '1') return;   // double-click guard
  const original = button.textContent;
  button.dataset.busy = '1';
  button.setAttribute('disabled', '');
  button.textContent = busyLabel;
  try {
    await action();
    button.textContent = original;
  } catch (err) {
    button.textContent = failLabel;
    showToast(err.message, 'error');
    setTimeout(() => { button.textContent = original; }, 2200);
  } finally {
    button.removeAttribute('disabled');
    delete button.dataset.busy;
  }
}
```

**Antipatrones**: usar `await` sin tiempo límite (el usuario podría volver a hacer clic) / volver al estado anterior en silencio tras un error.

### 7.3. Chips de estado en tiempo real — el valor de la insignia procede del valor real

**Principio**: el `variant` y el texto de un chip de estado de servidor/servicio (`ui-badge`) deben seguir el último valor de estado.
Una etiqueta que cambia mientras el color queda fijo, o un chip que siempre dice «OK» sin tener un valor, es una **visualización falsa**.

- Al empezar la actualización: muestra `ui-spinner size="sm"` junto al elemento (para indicar que se está actualizando)
- Al llegar el valor: `badge.setAttribute('variant', <variant correspondiente al estado>)` + reemplazar el texto — actualización síncrona
- Muestra siempre la hora de la última comprobación (`"Última comprobación: 19:39:23"`) para que el usuario juzgue la actualidad
- Distingue los estados: `success` (correcto) / `warning` (retrasado o pendiente) / `outline` (en espera)

```html
<ui-badge id="stateChip" variant="outline">Waiting</ui-badge>
<ui-spinner size="sm" id="stateSpinner" style="visibility: hidden;"></ui-spinner>
Last checked: <span id="stateUpdated">—</span>
```

**Antipatrones**: rellenar el chip con «OK» una vez y dejarlo fijo / mantener una insignia de éxito cuando hay un error.

### 7.4. Registros y texto largo — usa `ui-log`, no un `<pre>` garabateado

**Principio**: estandariza con `ui-log` el texto largo que crece continuamente, como registros de servidor, historial de tareas y resultados de ejecución.

- Accesibilidad integrada: `role="log"` + `aria-live="polite"` (no hace falta establecerlos tú)
- Parte inferior fija: si el usuario está leyendo más arriba, los nuevos elementos no fuerzan el desplazamiento; solo lo sigue cuando está cerca del final
- Protección de capacidad: al superar `max` (500 por defecto) se eliminan automáticamente los elementos más antiguos — evita el crecimiento ilimitado del DOM
- Colores por nivel `level="info/success/warning/error/debug"`, marcas de tiempo `time`, botón de copiar en la cabecera y evento `copy` integrados
- Para ajustar líneas largas usa `wrap`; el desplazamiento horizontal es el comportamiento por defecto, como en los registros estándar

```html
<ui-log label="gateway.log" height="240px">
  <ui-log-item level="info" time="19:31:02">GET /healthz — 204 · 3ms</ui-log-item>
  <ui-log-item level="error" time="19:33:12">SSH check failed — path parse error</ui-log-item>
</ui-log>
```

```ts
// Streaming (vanilla)
const log = document.getElementById('myLog');          // ui-log element
log.push('success', 'Deploy complete (v2.4.1)', stamp()); // push API
log.push('warning', 'Disk 82% — over threshold');
log.clear();                                           // clear everything
```

**Antipatrones**: apilar con un simple `div.appendChild(p)` (se pierde la posición de lectura, crecimiento ilimitado) / combinar colores por cuenta propia (sin usar los tokens de color por nivel).

---

## 8. Estado de preparación para el lanzamiento (CI y publicación)

- **GitHub Actions CI (`.github/workflows/ci.yml`)**:
  - Está automatizado todo el flujo `pnpm install` → `eslint` → `vite build` → `tsc (typecheck)`.
- **Publicación en npm y versiones de GitHub**:
  - Todos los paquetes (`tokens`, `core`, `react`, `svelte`) tienen completos los campos `main`, `module`, `types`, `exports` y `files` en su `package.json`.
  - **El `npm publish` real lo realiza el responsable del mantenimiento cuando sea necesario.** (No se ejecuta ninguna publicación automática.)

---

## Licencia / License

Cubit UI se ofrece bajo **TLL-BY-NC-ND** ([Tsuel Liberty License](https://tll.mataku.org)). El texto en coreano es la referencia; si otro idioma difiere, prevalece el texto en coreano.

- Texto completo de la licencia: [`LICENSE`](./LICENSE)
- [Enlace de detalles de la licencia (explicación sencilla y condiciones)](https://tll.mataku.org/?lang=es#/detail?by=1&attr=tsuel&cm=titleNameLink&sa=0&nc=1&nd=1&reg_e=1&reg_m=forbid&reg_l=KP%2CCN%2CRU&ad=none&ai=nc-only&rp_e=1&rp=%5B%5B%22KP%22%2C1%2C%22combined%22%2C%22%22%2C%22legal%22%2C%22%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%28KR%29%EC%9D%98+%EB%82%A8%EB%B6%81%EA%B5%90%EB%A5%98%ED%98%91%EB%A0%A5%EB%B2%95%28Inter-Korean+Exchange+and+Cooperation+Act%29%EC%97%90+%EB%94%B0%EB%9D%BC+%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD+%EA%B5%AD%EB%AF%BC%EC%9D%80+%EB%B6%81%ED%95%9C%28KP%29%EC%97%90+%EC%9E%90%EB%A3%8C%EB%A5%BC+%EC%A0%9C%EA%B3%B5%ED%95%A0+%EC%88%98+%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4.+%EA%B4%80%EB%A0%A8%ED%95%98%EC%97%AC+%EC%A0%95%EB%B6%80+%EA%B8%B0%EA%B4%80%EC%9D%98+%ED%97%88%EA%B0%80%EA%B0%80+%ED%95%84%EC%9A%94%ED%95%A9%EB%8B%88%EB%8B%A4.%22%2C%22contract%22%2C%22%22%5D%2C%5B%22CN%22%2C1%2C%22combined%22%2C%22%22%2C%22security%2ChumanRights%22%2C%22%EA%B5%AD%EA%B0%80+%EC%B0%A8%EC%9B%90%EC%9D%98+%EC%9D%B8%ED%84%B0%EB%84%B7+%EA%B2%80%EC%97%B4%2C+%ED%91%9C%ED%98%84%EC%9D%98+%EC%9E%90%EC%9C%A0+%EC%A0%9C%ED%95%9C+%EB%B0%8F+%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4+%ED%86%B5%EC%A0%9C+%EB%AC%B8%EC%A0%9C%2C+%EC%A0%80%EC%9E%91%EA%B6%8C+%EC%9D%98%EC%8B%9D%EC%9D%98+%EA%B5%AD%EA%B0%80%EC%A0%81+%EB%B6%80%EC%9E%AC+%EB%93%B1%EC%9C%BC%EB%A1%9C+%EC%9D%B8%ED%95%B4+%EC%A0%9C%ED%95%9C%ED%95%A9%EB%8B%88%EB%8B%A4.%22%2C%22%22%2C%22%22%5D%2C%5B%22RU%22%2C1%2C%22territory%22%2C%22%22%2C%22conflict%22%2C%22%EB%9D%BC%EC%9D%B4%EC%84%BC%EC%8A%A4+%EC%A0%9C%EA%B3%B5%EC%9E%90%EB%8A%94+%EC%A0%84%EC%9F%81%EC%97%90+%EA%B2%B0%EC%82%AC+%EB%B0%98%EB%8C%80%ED%95%98%EB%A9%B0%2C+%EB%8C%80%EB%9F%AC%EC%8B%9C%EC%95%84+%EA%B2%BD%EC%A0%9C%EC%A0%9C%EC%9E%AC+%EC%A0%95%EC%B1%85%EC%97%90+%EB%8F%99%EC%9D%98%ED%95%98%EA%B3%A0+%EC%9D%B4%EB%A5%BC+%EC%A4%80%EC%88%98%ED%95%98%EA%B8%B0+%EC%9C%84%ED%95%9C+%EC%A1%B0%EC%B9%98%EC%9E%85%EB%8B%88%EB%8B%A4.+%EC%9D%B4%EC%97%90+%EB%8C%80%ED%95%B4+%EC%86%8C%EB%AA%85%ED%95%A0+%EC%88%98+%EC%9E%88%EA%B1%B0%EB%82%98+%EC%A0%84%EC%9F%81%EC%97%90+%EB%B0%98%EB%8C%80%ED%95%98%EB%8A%94+%EC%A6%9D%EB%B9%99+%EC%9E%90%EB%A3%8C%EA%B0%80+%EC%9E%88%EC%9D%84+%EA%B2%BD%EC%9A%B0+%ED%97%88%EC%9A%A9%EB%90%A9%EB%8B%88%EB%8B%A4.%22%2C%22contract%22%2C%22%22%5D%5D&aii=deny&aix=deny&ail=1&tdm=1&fb=military%2Csurveillance%2Chate%2Cadult%2Cgambling&pat=grantRetaliate&bnd=allow&cp=docs&cc_e=1&cc_c=cubit%40mataku.org&tm=1&nt=before&term_e=1&term_d=0&law=KR&note=default+contact+%3A+cubit%40mataku.org&fp=422DF40527)
- Acerca de TLL y el generador: <https://tll.mataku.org>

| Condición | Significado |
|---|---|
| BY | Acreditar al autor `tsuel` con **título de la obra + nombre + enlace** |
| NC | Prohibido el uso comercial |
| ND | Prohibido modificar o crear obras derivadas |
| Región | Uso prohibido en Rusia, China y Corea del Norte |
| IA | Entrenamiento permitido solo para investigación académica / modelos no comerciales (entrenamiento comercial de IA prohibido); prohibido usarla como entrada de IA y recopilarla para búsqueda/indexación por IA; indicar el uso de IA |
| Otros | Avisar al autor antes de usarla · el uso comercial requiere permiso aparte vía cubit@mataku.org · prohibida para fines militares, de vigilancia, de odio, adultos o de juego · puede incluirse sin modificar en otros productos |

- Esta **no** es una licencia Creative Commons y no cumple la Definición de Código Abierto (OSI).
- Este documento requiere la revisión de un profesional jurídico (abogado) sobre su validez legal. El texto generado automáticamente no constituye asesoramiento jurídico.

---

## Contacto / Contact

Si necesitas ponerte en contacto con los responsables por cualquier obligación legal, de licencia, de derechos de autor o de seguridad, o para coordinarte entre desarrolladores, escribe a:

**github@mataku.org**
