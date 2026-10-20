<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let value: string = '';
  export let placeholder: string = '';
  export let type: string = 'text';
  export let disabled: boolean = false;
  export let readonly: boolean = false;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let invalid: boolean = false;
  export let ariaLabel: string | undefined = undefined;

  const dispatch = createEventDispatcher<{
    input: { value: string };
    change: { value: string };
  }>();

  function handleInput(e: CustomEvent<{ value: string }>) {
    value = e.detail?.value ?? '';
    dispatch('input', e.detail);
  }

  function handleChange(e: CustomEvent<{ value: string }>) {
    value = e.detail?.value ?? '';
    dispatch('change', e.detail);
  }
</script>

<ui-input
  {value}
  {placeholder}
  {type}
  disabled={disabled ? '' : undefined}
  readonly={readonly ? '' : undefined}
  {size}
  invalid={invalid ? '' : undefined}
  aria-label={ariaLabel}
  on:input={handleInput}
  on:change={handleChange}
  {...$$restProps}
/>
