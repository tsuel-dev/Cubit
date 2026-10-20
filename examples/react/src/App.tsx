import React, { useState } from 'react';
import {
  Button,
  Input,
  Checkbox,
  Switch,
  Select,
  Option,
  Alert,
  Card,
  Modal,
  Tabs,
  Tab,
  TabPanel,
  Badge,
  Progress,
  Pagination,
  Avatar,
  Breadcrumbs,
  BreadcrumbItem,
} from '@cubit-ui/react';
import { setTheme, getTheme } from '@cubit-ui/tokens';

export default function App() {
  const [theme, setLocalTheme] = useState<'light' | 'dark'>('light');
  const [modalOpen, setModalOpen] = useState(false);
  const [inputText, setInputText] = useState('React Wrapper Example');
  const [checked, setChecked] = useState(true);
  const [page, setPage] = useState(1);
  const [progressVal, setProgressVal] = useState(45);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setLocalTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <div
      style={{
        padding: '32px',
        backgroundColor: 'var(--ui-color-bg-canvas)',
        color: 'var(--ui-color-text-primary)',
        minHeight: '100vh',
        boxSizing: 'border-box',
        fontFamily: 'var(--ui-font-family-base)',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--ui-color-border)',
          paddingBottom: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Cubit UI (React TSX Showcase)</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ui-color-text-secondary)' }}>
            Thin React Wrapper around Web Components with Type-safe Props & Events
          </p>
        </div>
        <Button variant="secondary" onClick={toggleTheme}>
          {theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
        </Button>
      </header>

      {/* Breadcrumbs & Avatar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Breadcrumbs>
          <BreadcrumbItem href="#home">Home</BreadcrumbItem>
          <BreadcrumbItem href="#components">Components</BreadcrumbItem>
          <BreadcrumbItem current>React Showcase</BreadcrumbItem>
        </Breadcrumbs>
        <Avatar name="Cubit User" size="md" />
      </div>

      <Alert variant="success" title="React 바인딩 정상 작동">
        React.forwardRef와 합성 이벤트 리스너가 Web Components 본체와 유기적으로 연동되고 있습니다.
      </Alert>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        <Card bordered>
          <div slot="header">양방향 상태 제어 (Form Controls)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              value={inputText}
              onChange={(detail) => setInputText(detail.value)}
              placeholder="텍스트를 입력하세요"
            />
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Checkbox checked={checked} onChange={(detail) => setChecked(detail.checked)}>
                체크박스 상태: {checked ? '선택됨' : '해제됨'}
              </Checkbox>
              <Switch checked={checked} onChange={(detail) => setChecked(detail.checked)}>
                스위치
              </Switch>
            </div>

            <Select
              placeholder="옵션을 선택하세요"
              onChange={(detail) => alert(`선택된 값: ${detail.value}`)}
            >
              <Option value="opt1">옵션 1 (Cubit)</Option>
              <Option value="opt2">옵션 2 (Minimal)</Option>
              <Option value="opt3">옵션 3 (Strict TS)</Option>
            </Select>

            <div style={{ marginTop: '8px' }}>
              <div style={{ marginBottom: '8px', fontSize: '14px' }}>진행률: {progressVal}%</div>
              <Progress value={progressVal} max={100} variant="primary" />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <Button size="sm" variant="outline" onClick={() => setProgressVal(Math.max(0, progressVal - 10))}>-10%</Button>
                <Button size="sm" variant="outline" onClick={() => setProgressVal(Math.min(100, progressVal + 10))}>+10%</Button>
              </div>
            </div>
          </div>
          <div slot="footer">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              다이얼로그 모달 열기
            </Button>
          </div>
        </Card>

        <Card bordered>
          <div slot="header">탭 및 페이지네이션 (Tabs & Pagination)</div>
          <Tabs value="tab1">
            <Tab slot="tabs" value="tab1">개요</Tab>
            <Tab slot="tabs" value="tab2">사양</Tab>
            <Tab slot="tabs" value="tab3">라이선스</Tab>

            <TabPanel value="tab1">
              <p>모노레포 기반 Thin Wrapper 아키텍처로 번들 사이즈를 최소화하고 일관된 디자인 토큰을 제공합니다.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge variant="primary">TypeScript</Badge>
                <Badge variant="secondary">React</Badge>
                <Badge variant="outline">WCAG AA</Badge>
              </div>
            </TabPanel>
            <TabPanel value="tab2">
              <p>모든 스타일은 Shadow DOM에 격리되어 프로젝트의 글로벌 CSS와 절대 충돌하지 않습니다.</p>
            </TabPanel>
            <TabPanel value="tab3">
              <p>TLL-BY-NC-ND — 저작자 표시 필요 · 영리 이용·수정·AI 학습 금지 (LICENSE 참고)</p>
            </TabPanel>
          </Tabs>

          <div style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>현재 페이지: {page}</div>
            <Pagination current={page} total={50} pageSize={10} onChange={(detail) => setPage(detail.page)} />
          </div>
        </Card>
      </div>

      <Modal open={modalOpen} title="React 제어 모달" onClose={() => setModalOpen(false)}>
        <p>React의 <code>useState</code>로 제어되는 표준 모달입니다.</p>
        <p>바깥 배경을 클릭하거나 ESC 키를 누르면 <code>onClose</code> 콜백이 호출되어 닫힙니다.</p>
        <div slot="footer">
          <Button variant="outline" onClick={() => setModalOpen(false)}>취소</Button>
          <Button variant="primary" onClick={() => setModalOpen(false)}>확인 완료</Button>
        </div>
      </Modal>
    </div>
  );
}
