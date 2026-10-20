<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let variant: 'info' | 'success' | 'warning' | 'error' = 'info';
  export let title: string = '';
  export let closable: boolean = false;
  export let ariaLabel: string | undefined = undefined;

  const dispatch = createEventDispatcher<{
    close: void;
  }>();

  function handleClose() {
    dispatch('close');
  }
</script>

<ui-alert
  {variant}
  {title}
  closable={closable ? '' : undefined}
  aria-label={ariaLabel}
  on:close={handleClose}
  {...$$restProps}
>
  <slot />
</ui-alert>
