<script lang="ts">
  import '@cubit-ui/core';

  export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let ariaLabel: string | undefined = undefined;
</script>

<ui-button
  {variant}
  {size}
  disabled={disabled ? '' : undefined}
  {type}
  aria-label={ariaLabel}
  on:click
  {...$$restProps}
>
  <slot />
</ui-button>
