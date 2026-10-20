<script lang="ts">
  import {
    Button,
    Input,
    Checkbox,
    Switch,
    Select,
    Modal,
    Tabs,
    Badge,
    Alert,
    Card,
    Progress,
    Pagination,
    Avatar,
    Breadcrumbs
  } from '@cubit-ui/svelte';
  import { setTheme } from '@cubit-ui/tokens';

  let theme: 'light' | 'dark' = 'light';
  let modalOpen: boolean = false;
  let inputText: string = 'Svelte 5 Runes & Directives Example';
  let checked: boolean = true;
  let page: number = 1;
  let progressVal: number = 65;

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    setTheme(theme);
  }

  function handleInputChange(e: CustomEvent<{ value: string }>) {
    inputText = e.detail?.value ?? '';
  }

  function handleCheckboxChange(e: CustomEvent<{ checked: boolean }>) {
    checked = e.detail?.checked ?? false;
  }

  function handlePaginationChange(e: CustomEvent<{ page: number }>) {
    page = e.detail?.page ?? 1;
  }
</script>

<main
  style="
    padding: 32px;
    background-color: var(--ui-color-bg-canvas);
    color: var(--ui-color-text-primary);
    min-height: 100vh;
    box-sizing: border-box;
    font-family: var(--ui-font-family-base);
  "
>
  <header
    style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--ui-color-border);
      padding-bottom: 16px;
      margin-bottom: 24px;
    "
  >
    <div>
      <h1 style="margin: 0;">Cubit UI (Svelte Showcase)</h1>
      <p style="margin: 4px 0 0 0; color: var(--ui-color-text-secondary);">
        Clean Svelte Wrapper with Slot Forwarding & Custom Event Dispatching
      </p>
    </div>
    <Button variant="secondary" on:click={toggleTheme}>
      {theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
    </Button>
  </header>

  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
    <Breadcrumbs>
      <ui-breadcrumb-item href="#home">Home</ui-breadcrumb-item>
      <ui-breadcrumb-item href="#components">Components</ui-breadcrumb-item>
      <ui-breadcrumb-item current>Svelte Showcase</ui-breadcrumb-item>
    </Breadcrumbs>
    <Avatar name="Svelte Dev" size="md" />
  </div>

  <Alert variant="info" title="Svelte 래퍼 구동">
    Svelte의 직관적인 이벤트 디스패치와 슬롯 포워딩을 통해 Web Components를 네이티브처럼 조작합니다.
  </Alert>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;">
    <Card bordered>
      <div slot="header">폼 제어 및 반응성</div>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <Input
          value={inputText}
          placeholder="텍스트 입력"
          on:change={handleInputChange}
        />
        <div style="display: flex; gap: 16px; align-items: center;">
          <Checkbox {checked} on:change={handleCheckboxChange}>
            체크박스 상태: {checked ? '선택됨' : '해제됨'}
          </Checkbox>
          <Switch {checked} on:change={handleCheckboxChange}>
            스위치
          </Switch>
        </div>

        <Select placeholder="옵션을 선택하세요">
          <ui-option value="svelte">Svelte 5</ui-option>
          <ui-option value="wc">Web Components</ui-option>
          <ui-option value="tokens">Design Tokens</ui-option>
        </Select>

        <div style="margin-top: 8px;">
          <div style="margin-bottom: 8px; font-size: 14px;">진행률: {progressVal}%</div>
          <Progress value={progressVal} max={100} variant="primary" />
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <Button size="sm" variant="outline" on:click={() => progressVal = Math.max(0, progressVal - 10)}>-10%</Button>
            <Button size="sm" variant="outline" on:click={() => progressVal = Math.min(100, progressVal + 10)}>+10%</Button>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button variant="primary" on:click={() => modalOpen = true}>
          모달 다이얼로그 열기
        </Button>
      </div>
    </Card>

    <Card bordered>
      <div slot="header">내비게이션 & 탭</div>
      <Tabs value="tab1">
        <div slot="tabs" style="display: inline-flex; gap: 8px;">
          <ui-tab value="tab1">아키텍처</ui-tab>
          <ui-tab value="tab2">접근성</ui-tab>
        </div>

        <ui-tab-panel value="tab1">
          <p>Web Components 1회 구현 후 React와 Svelte 래퍼를 1:1로 매핑하여 유지보수 비용을 최소화합니다.</p>
          <div style="display: flex; gap: 8px;">
            <Badge variant="primary">Cubit</Badge>
            <Badge variant="success">WCAG 2.1 AA</Badge>
          </div>
        </ui-tab-panel>
        <ui-tab-panel value="tab2">
          <p>모든 인터랙티브 컴포넌트는 키보드(Tab, Enter, Space, Escape, 화살표 키) 조작을 완벽 지원합니다.</p>
        </ui-tab-panel>
      </Tabs>

      <div style="margin-top: 24px;">
        <div style="margin-bottom: 8px; font-size: 14px;">현재 페이지: {page}</div>
        <Pagination current={page} total={100} pageSize={10} on:change={handlePaginationChange} />
      </div>
    </Card>
  </div>

  <Modal open={modalOpen} title="Svelte 제어 모달" on:close={() => modalOpen = false}>
    <p>Svelte 컴포넌트 이벤트 <code>on:close</code>로 닫기 동작이 동기화되는 모달입니다.</p>
    <div slot="footer">
      <Button variant="outline" on:click={() => modalOpen = false}>닫기</Button>
      <Button variant="primary" on:click={() => modalOpen = false}>확인</Button>
    </div>
  </Modal>
</main>
