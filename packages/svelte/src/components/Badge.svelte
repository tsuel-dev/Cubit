<script lang="ts">
  import '@cubit-ui/core';

  export let variant: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<ui-badge {variant} {size} {...$$restProps}>
  <slot />
</ui-badge>
