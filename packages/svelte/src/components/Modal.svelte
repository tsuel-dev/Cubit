<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let open: boolean = false;
  export let title: string = '';
  export let ariaLabel: string | undefined = undefined;

  const dispatch = createEventDispatcher<{
    close: void;
  }>();

  function handleClose(e: Event) {
    if (e.target !== e.currentTarget) return; // 자식 컴포넌트에서 버블링된 이벤트는 무시
    open = false;
    dispatch('close');
  }
</script>

<ui-modal
  open={open ? '' : undefined}
  {title}
  aria-label={ariaLabel}
  on:close={handleClose}
  {...$$restProps}
>
  <slot />
  <slot name="footer" slot="footer" />
</ui-modal>
