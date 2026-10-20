<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let variant: 'info' | 'success' | 'warning' | 'error' = 'info';
  export let duration: number = 4000;
  export let open: boolean = false;

  const dispatch = createEventDispatcher<{
    close: void;
  }>();

  function handleClose() {
    open = false;
    dispatch('close');
  }
</script>

<ui-toast
  {variant}
  {duration}
  open={open ? '' : undefined}
  on:close={handleClose}
  {...$$restProps}
>
  <slot />
</ui-toast>
