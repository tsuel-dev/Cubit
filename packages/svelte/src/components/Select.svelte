<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let value: string = '';
  export let placeholder: string = '선택하세요';
  export let disabled: boolean = false;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let open: boolean = false;
  export let ariaLabel: string | undefined = undefined;

  const dispatch = createEventDispatcher<{
    change: { value: string };
    open: void;
    close: void;
  }>();

  function handleChange(e: CustomEvent<{ value: string }>) {
    value = e.detail?.value ?? '';
    dispatch('change', e.detail);
  }

  function handleOpen() {
    open = true;
    dispatch('open');
  }

  function handleClose() {
    open = false;
    dispatch('close');
  }
</script>

<ui-select
  {value}
  {placeholder}
  disabled={disabled ? '' : undefined}
  {size}
  open={open ? '' : undefined}
  aria-label={ariaLabel}
  on:change={handleChange}
  on:open={handleOpen}
  on:close={handleClose}
  {...$$restProps}
>
  <slot />
</ui-select>
