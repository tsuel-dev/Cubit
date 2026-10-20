<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let name: string | undefined = undefined;
  export let value: string | undefined = undefined;

  const dispatch = createEventDispatcher<{
    change: { value: string; checked: boolean };
  }>();

  function handleChange(e: CustomEvent<{ value: string; checked: boolean }>) {
    checked = e.detail?.checked ?? false;
    dispatch('change', e.detail);
  }
</script>

<ui-radio
  checked={checked ? '' : undefined}
  disabled={disabled ? '' : undefined}
  {name}
  {value}
  on:change={handleChange}
  {...$$restProps}
>
  <slot />
</ui-radio>
