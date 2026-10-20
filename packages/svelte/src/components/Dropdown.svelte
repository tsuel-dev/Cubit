<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let open: boolean = false;
  export let placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher<{
    open: void;
    close: void;
  }>();

  function handleOpen(e: Event) {
    if (e.target !== e.currentTarget) return; // 자식 컴포넌트에서 버블링된 이벤트는 무시
    open = true;
    dispatch('open');
  }

  function handleClose(e: Event) {
    if (e.target !== e.currentTarget) return; // 자식 컴포넌트에서 버블링된 이벤트는 무시
    open = false;
    dispatch('close');
  }
</script>

<ui-dropdown
  open={open ? '' : undefined}
  {placement}
  disabled={disabled ? '' : undefined}
  on:open={handleOpen}
  on:close={handleClose}
  {...$$restProps}
>
  <slot name="trigger" slot="trigger" />
  <slot />
</ui-dropdown>
