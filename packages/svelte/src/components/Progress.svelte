<script lang="ts">
  import '@cubit-ui/core';

  export let value: number = 0;
  export let max: number = 100;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let variant: 'primary' | 'success' | 'warning' | 'error' = 'primary';
  export let ariaLabel: string = 'Progress';
</script>

<ui-progress
  {value}
  {max}
  {size}
  {variant}
  aria-label={ariaLabel}
  {...$$restProps}
/>
