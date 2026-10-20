<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let value: string = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let ariaLabel: string | undefined = undefined;

  const dispatch = createEventDispatcher<{
    change: { value: string };
  }>();

  function handleChange(e: CustomEvent<{ value: string }>) {
    value = e.detail?.value ?? '';
    dispatch('change', e.detail);
  }
</script>

<ui-segmented
  {value}
  {size}
  disabled={disabled ? '' : undefined}
  aria-label={ariaLabel}
  on:change={handleChange}
  {...$$restProps}
>
  <slot />
</ui-segmented>
