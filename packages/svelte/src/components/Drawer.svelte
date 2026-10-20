<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let open: boolean = false;
  export let side: 'left' | 'right' = 'right';
  export let title: string = '';

  const dispatch = createEventDispatcher<{
    close: void;
  }>();

  function handleClose(e: Event) {
    if (e.target !== e.currentTarget) return; // 자식 컴포넌트에서 버블링된 이벤트는 무시
    open = false;
    dispatch('close');
  }
</script>

<ui-drawer open={open ? '' : undefined} {side} {title} on:close={handleClose} {...$$restProps}>
  <slot />
  <slot name="footer" slot="footer" />
</ui-drawer>
