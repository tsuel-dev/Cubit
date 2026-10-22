# Cubit UI — Design System & Component Library

[한국어](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Português](README.pt.md)

> **Aviso de idioma:** O README em coreano ([README.md](README.md)) sempre tem prioridade. Se o conteúdo desta tradução for diferente do README em coreano, ou se a tradução for imprecisa, prevalece o README em coreano.

> **Padronização e uma experiência de usuário consistente entre frameworks, com base em nosso próprio sistema de design tokens**

O Cubit UI é uma biblioteca padrão de componentes de interface baseada em uma estética geométrica sólida e confiável (**Cubit · Minimal**: tokens de arredondamento (8/12/16px + Pill), espaçamento de 4px/8px, contraste de bordas nítido).

Os componentes principais são implementados uma única vez como **Web Components** padrão (Custom Elements + Shadow DOM com escopo), com wrappers 1:1 para **React** e **Svelte**, mantendo exatamente os mesmos design tokens e o mesmo contrato de API, independentemente do framework.

---

## 0. Início rápido

```bash
git clone https://github.com/tsuel-dev/Cubit.git
cd Cubit
pnpm install
pnpm run build
```

---

## 1. Arquitetura e pacotes

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

## 2. Especificação dos design tokens (valores de referência fixos)

- **Cores**:
  - Fundo / primeiro plano padrão: `White (#ffffff)` / `Black (#000000)`
  - Cor de destaque (Primary / Accent): `#ff5500`
  - Secundária / de fundo (Secondary): `#ffebcc`, `#ffe4c9`
  - Modo escuro: Black (`#000000`) com fundos Dark Gray em camadas e ajuste de alto contraste (mantém a legibilidade de `#ff5500` e garante contraste WCAG 2.1 AA de 4.5:1 ou mais)
- **Estética (Cubit · Minimal)**:
  - Tokens de raio de canto: `--ui-radius-sm: 8px` (controles gerais, como botões e cartões) / `--ui-radius-md: 12px` (contêineres) / `--ui-radius-lg: 16px` (modais e painéis grandes) / `--ui-radius-full: 9999px` (pills, como selos e trilhos de interruptor)
  - Escala de espaçamento: tokens baseados em `4px / 8px`
  - Bordas: bordas nítidas e separação clara de camadas (sem sombras desnecessárias)
- **Tipografia**:
  - Usa a **pilha de fontes do sistema** nativa do sistema operacional, sem baixar fontes externas

---

## 3. Instalação e uso (workspace local)

Você pode usar os pacotes dentro do monorepo ou a partir de um projeto local.

### 3.1. Carregar as folhas de estilo dos design tokens (obrigatório em todos os casos)
Inclua o CSS dos tokens no ponto de entrada do projeto (HTML ou bundle raiz):
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

## 4. Tabela de API e props dos 30 componentes

| Grupo | Tag / nome do componente | Props / atributos principais | Eventos | Acessibilidade (ARIA / WCAG) |
| :--- | :--- | :--- | :--- | :--- |
| **Básico 1** | `ui-button` / `Button` | `variant` (primary/secondary/outline/ghost/danger), `size` (sm/md/lg), `disabled`, `type` | `click` | `aria-disabled`, anel de foco de alto contraste |
| **Básico 2** | `ui-input` / `Input` | `value`, `placeholder`, `type`, `disabled`, `readonly`, `size`, `invalid` | `input`, `change` | `aria-invalid`, `aria-disabled` |
| **Básico 3** | `ui-checkbox` / `Checkbox` | `checked`, `disabled`, `indeterminate`, `name`, `value` | `change` | `role="checkbox"`, `aria-checked`, tecla Espaço |
| **Básico 4** | `ui-radio` / `Radio` | `checked`, `disabled`, `name`, `value` | `change` | `role="radio"`, seleção exclusiva dentro do grupo, tecla Espaço |
| **Básico 5** | `ui-switch` / `Switch` | `checked`, `disabled` | `change` | `role="switch"`, `aria-checked`, trilho pill + controle circular |
| **Básico 6** | `ui-select` / `Select` | `value`, `placeholder`, `disabled`, `size`, `open` | `change`, `open`, `close` | `role="combobox"`, fecha com Esc, fecha ao clicar fora |
| **Básico 7** | `ui-modal` / `Modal` | `open`, `title` | `close` | `role="dialog"`, `aria-modal`, armadilha de foco, fecha com Esc |
| **Básico 8** | `ui-toast` / `Toast` | `variant` (info/success/warning/error), `duration`, `open` | `close` | `role="status"`, `aria-live="polite"`, temporizador de fechamento automático |
| **Básico 9** | `ui-tooltip` / `Tooltip` | `content`, `position` (top/bottom/left/right) | - | `role="tooltip"`, acionado por hover/focus, Esc para sair |
| **Básico 10** | `ui-tabs` / `Tabs` | `value` | `change` | `role="tablist/tab/tabpanel"`, teclas de seta/Home/End |
| **Básico 11** | `ui-badge` / `Badge` | `variant` (primary/secondary/outline/success/warning/error), `size` | - | rótulo pill, texto de alto contraste |
| **Básico 12** | `ui-spinner` / `Spinner` | `size` (sm/md/lg) | - | `role="status"`, `aria-label="Loading"` |
| **Básico 13** | `ui-alert` / `Alert` | `variant` (info/success/warning/error), `title`, `closable` | `close` | `role="alert"`, contraste de cor de 4.5:1 garantido |
| **Ampliado 14** | `ui-card` / `Card` | `variant` (default/elevated/secondary/bordered), `bordered` | - | slots header, body e footer separados |
| **Ampliado 15** | `ui-accordion` / `Accordion` | `multiple` (`ui-accordion-item`: `open`, `title`, `disabled`) | `change`, `toggle-item` | `role="region"`, `aria-expanded`, Enter/Espaço |
| **Ampliado 16** | `ui-dropdown` / `Dropdown` | `open`, `placement`, `disabled` | `open`, `close` | `role="menu"`, `role="menuitem"`, fecha ao clicar fora |
| **Ampliado 17** | `ui-progress` / `Progress` | `value`, `max`, `size`, `variant` | - | `role="progressbar"`, `aria-valuenow/min/max` |
| **Ampliado 18** | `ui-pagination` / `Pagination` | `current`, `total`, `page-size` | `change` | `role="navigation"`, `aria-current="page"`, teclado |
| **Ampliado 19** | `ui-table` / `Table` | `striped`, `bordered`, `hoverable` | - | `role="table"`, fundo secundário (`#ffe4c9`) ao passar o cursor |
| **Ampliado 20** | `ui-avatar` / `Avatar` | `src`, `alt`, `name`, `size` (sm/md/lg), `shape` (circle/square) | - | circular por padrão, opção `shape="square"`, iniciais caso a imagem falhe |
| **Ampliado 21** | `ui-breadcrumbs` / `Breadcrumbs` | `separator` (`ui-breadcrumb-item`: `href`, `current`) | - | `role="navigation"`, `aria-current="page"` |
| **Ampliado 22** | `ui-drawer` / `Drawer` | `open`, `side` (left/right), `title` | `close` | armadilha de foco, fecha com Esc/fundo, painel fora da tela |
| **Ampliado 23** | `ui-skeleton` / `Skeleton` | `variant` (text/circle/rect), `width`, `height`, `lines` | - | `aria-hidden`, o shimmer para com `prefers-reduced-motion` |
| **Ampliado 24** | `ui-navbar` / `Navbar` | `brand`, `sticky` | - | `role="navigation"`, slot de links padrão + slot `actions` |
| **Dados 25** | `ui-log` / `Log` (+ `ui-log-item` / `LogItem`) | `label`, `height`, `wrap`, `auto-scroll`, `max`, `empty` (`ui-log-item`: `level`(info/success/warning/error/debug), `time`) | `copy` | `role="log"`, `aria-live="polite"`, parte inferior fixa, API: `push()` / `scrollDown()` / `clear()` |
| **Novo 26** | `ui-textarea` / `Textarea` | `value`, `placeholder`, `rows`, `maxlength`, `resize` (none/vertical/both), `size`, `name`, `disabled`, `readonly`, `invalid` | `input`, `change` | `aria-invalid`, associado a formulários (`name`, reset, fieldset disabled), contador de caracteres quando `maxlength` é definido |
| **Novo 27** | `ui-empty-state` / `EmptyState` | `heading`, `description`, `size` (sm/md), `variant` (default/error) | - | título como `<h3>`, ícone decorativo oculto para tecnologias assistivas, slot de ações |
| **Novo 28** | `ui-segmented` / `Segmented` | `value`, `size` (sm/md/lg), `disabled` (`ui-segment`: `value`, `disabled`) | `change` | `role="radiogroup"` / `role="radio"`, `aria-checked`, teclas de seta/Home/End (roving tabindex) |
| **Novo 29** | `ui-stepper` / `Stepper` | `current`, `orientation` (horizontal/vertical) (`ui-step`: `label`, `description`, `status`) | - | `role="list"` / `listitem`, `aria-current="step"`, o estado da etapa é anunciado a leitores de tela |
| **Novo 30** | `ui-chip` / `Chip` | `variant` (neutral/primary/success/warning/error), `size` (sm/md), `removable`, `disabled`, `remove-label` | `remove` | focável quando removível, botão × com `aria-label`, Delete/Backspace solicita a remoção |

> **Suporte a formulários (v1.1):** `ui-input`, `ui-textarea`, `ui-checkbox`, `ui-radio` e `ui-switch` participam de formulários: são enviados com `name` e respeitam `<form>.reset()` e `<fieldset disabled>`.

---

## 5. Guia para alternar entre modo claro e escuro

A biblioteca usa um sistema de temas baseado em variáveis CSS, então basta definir o atributo `data-theme` na tag de nível superior (`html` ou `body`) para que todos os componentes mudem instantaneamente.

### 5.1. Alternar diretamente com um atributo HTML
```html
<!-- Force light mode -->
<html data-theme="light">

<!-- Force dark mode -->
<html data-theme="dark">

<!-- Follow the OS theme (without data-theme, prefers-color-scheme applies) -->
<html>
```

### 5.2. Usar as funções auxiliares de JS/TS
Você pode usar os auxiliares de tempo de execução fornecidos por `@cubit-ui/tokens`:
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

## 6. Personalização dos design tokens

Ao sobrescrever as propriedades personalizadas de CSS no CSS global ou no escopo de um contêiner específico, a alteração é propagada imediatamente para os componentes abaixo dele.

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

## 7. Diretrizes padrão de UX (padrões de auditorias de serviços reais)

Os tipos de problema encontrados repetidamente em auditorias de serviços reais são definidos aqui como **padrões padrão de composição de componentes**.
Os quatro padrões abaixo correspondem às demonstrações ao vivo da documentação da biblioteca (`examples/vanilla` — seção UX Patterns).

### 7.1. Máquina de estados de busca — mostrar sempre os quatro estados: carregando / sucesso / sem resultados / falha

**Princípio**: buscas e consultas sempre renderizam explicitamente os quatro estados.
`carregamento lento → carregamento infinito` (indicador de carregamento ausente), `falha → escondida como resultado vazio` e `sem resultados → tela em branco` são tratados como bugs.

- **Carregando**: mostre `ui-spinner size="sm"` na área de resultados e aplique o padrão de bloqueio de 7.2 ao botão de busca
- **Sem resultados**: `ui-alert variant="warning"` + orientação sobre a próxima ação («tente outro termo de busca»)
- **Falha**: `ui-alert variant="error"` + como tentar novamente (nunca esconda no rótulo de um botão o fato de ser um problema de rede)
- Atribua `aria-live="polite"` ao contêiner de resultados (para que os leitores de tela anunciem as atualizações)

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

**Antipadrões**: deixar a área de resultados como está e encerrar apenas com um toast / mostrar uma falha com um selo de «concluído».

### 7.2. Bloqueio de botões contra clique duplo — guarda busy + rótulo de nova tentativa após falha

**Princípio**: bloqueie sempre o botão de qualquer ação que leve 0.5 s ou mais, ou cuja duplicação seja custosa.
Um botão sem proteção permite que um clique duplo gere envios duplicados.

- Durante o processamento: atributo `disabled` + trocar o rótulo por `"Processando..."`
- Em caso de falha: voltar o rótulo para `"Tentar novamente"` + mostrar a causa com `ui-toast variant="error"` (restaurar o rótulo original após 2 s)
- Em caso de sucesso: restaurar o rótulo original + dar retorno com `ui-toast variant="success"`

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

**Antipadrões**: usar `await` sem tempo limite (o usuário pode clicar de novo) / voltar ao estado anterior em silêncio após uma falha.

### 7.3. Chips de status em tempo real — o valor do selo vem do valor real

**Princípio**: o `variant` e o texto de um chip de status de servidor/serviço (`ui-badge`) devem acompanhar o valor de status mais recente.
Um rótulo que muda enquanto a cor fica fixa, ou um chip que sempre diz «OK» sem ter um valor, é uma **exibição falsa**.

- Ao iniciar a atualização: mostre `ui-spinner size="sm"` ao lado do item (para indicar que está atualizando)
- Quando o valor chega: `badge.setAttribute('variant', <variant correspondente ao status>)` + substituir o texto — atualização síncrona
- Mostre sempre o horário da última verificação (`"Última verificação: 19:39:23"`) para que o usuário julgue a atualidade
- Diferencie os estados: `success` (normal) / `warning` (atrasado ou pendente) / `outline` (em espera)

```html
<ui-badge id="stateChip" variant="outline">Waiting</ui-badge>
<ui-spinner size="sm" id="stateSpinner" style="visibility: hidden;"></ui-spinner>
Last checked: <span id="stateUpdated">—</span>
```

**Antipadrões**: preencher o chip com «OK» uma vez e deixá-lo fixo / manter um selo de sucesso quando há falha.

### 7.4. Logs e textos longos — use `ui-log`, não um `<pre>` rabiscado

**Princípio**: padronize com `ui-log` os textos longos que crescem continuamente, como logs de servidor, histórico de tarefas e resultados de execução.

- Acessibilidade embutida: `role="log"` + `aria-live="polite"` (não é preciso defini-los)
- Parte inferior fixa: se o usuário estiver lendo mais acima, novos itens não forçam a rolagem; ela só acompanha quando está perto do final
- Proteção de capacidade: ao exceder `max` (500 por padrão), os itens mais antigos são removidos automaticamente — evita o crescimento ilimitado do DOM
- Cores por nível `level="info/success/warning/error/debug"`, carimbos de tempo `time`, botão de copiar no cabeçalho e evento `copy` embutidos
- Para quebrar linhas longas use `wrap`; a rolagem horizontal é o padrão, como em logs comuns

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

**Antipadrões**: empilhar com um simples `div.appendChild(p)` (perde-se a posição de leitura, crescimento ilimitado) / combinar cores por conta própria (sem usar os tokens de cor por nível).

---

## 8. Estado de preparação para o lançamento (CI e publicação)

- **GitHub Actions CI (`.github/workflows/ci.yml`)**:
  - Todo o fluxo `pnpm install` → `eslint` → `vite build` → `tsc (typecheck)` está automatizado.
- **Publicação no npm e releases do GitHub**:
  - Todos os pacotes (`tokens`, `core`, `react`, `svelte`) têm os campos `main`, `module`, `types`, `exports` e `files` completos no `package.json`.
  - **O `npm publish` real é feito pelo mantenedor quando necessário.** (Nenhuma publicação automática é executada.)

---

## Licença / License

O Cubit UI é fornecido sob **TLL-BY-NC-ND** ([Tsuel Liberty License](https://tll.mataku.org)). O texto em coreano é a referência; se outro idioma for diferente, vale o texto em coreano.

- Texto completo da licença: [`LICENSE`](./LICENSE)
- [Link de detalhes da licença (explicação simples e condições)](https://tll.mataku.org/?lang=pt#/detail?by=1&attr=tsuel%28%40tsuel-dev%29&cm=titleNameLink&sa=0&nc=1&nd=1&reg_e=1&reg_m=forbid&reg_l=RU%2CCN%2CKP&ad=none&ai=deny&lang=pt&fp=6E4B95B8BB)
- Sobre o TLL e o gerador: <https://tll.mataku.org>

| Condição | Significado |
|---|---|
| BY | Dar crédito ao autor `tsuel(@tsuel-dev)` com **título da obra + nome + link** |
| NC | Uso comercial proibido |
| ND | Proibido modificar ou criar obras derivadas |
| Região | Uso proibido na Rússia, China e Coreia do Norte |
| IA | Proibido usar como dados de treinamento de modelos de IA/aprendizado de máquina |

- Esta **não** é uma licença Creative Commons e não atende à Definição de Código Aberto (OSI).
- Este documento precisa de revisão de um profissional jurídico (advogado) quanto à sua validade legal. O texto gerado automaticamente não é aconselhamento jurídico.

---

## Contato / Contact

Se precisar entrar em contato com os mantenedores por qualquer obrigação legal, de licença, de direitos autorais ou de segurança, ou para coordenação entre desenvolvedores, escreva para:

**github@mataku.org**
