<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let ariaLabel: string | undefined = undefined;

  const dispatch = createEventDispatcher<{
    change: { checked: boolean };
  }>();

  function handleChange(e: CustomEvent<{ checked: boolean }>) {
    checked = e.detail?.checked ?? false;
    dispatch('change', e.detail);
  }
</script>

<ui-switch
  checked={checked ? '' : undefined}
  disabled={disabled ? '' : undefined}
  aria-label={ariaLabel}
  on:change={handleChange}
  {...$$restProps}
>
  <slot />
</ui-switch>
