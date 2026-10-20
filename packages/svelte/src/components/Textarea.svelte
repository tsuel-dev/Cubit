<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let value: string = '';
  export let placeholder: string = '';
  export let rows: number = 3;
  export let maxlength: number | undefined = undefined;
  export let resize: 'none' | 'vertical' | 'both' = 'vertical';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let name: string | undefined = undefined;
  export let disabled: boolean = false;
  export let readonly: boolean = false;
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

<ui-textarea
  {value}
  {placeholder}
  {rows}
  {maxlength}
  {resize}
  {size}
  {name}
  disabled={disabled ? '' : undefined}
  readonly={readonly ? '' : undefined}
  invalid={invalid ? '' : undefined}
  aria-label={ariaLabel}
  on:input={handleInput}
  on:change={handleChange}
  {...$$restProps}
></ui-textarea>
