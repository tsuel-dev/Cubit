// .svelte 파일을 TypeScript import 하는 경우의 타입 선언
declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType<any>;
  export default component;
}
