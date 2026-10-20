<script lang="ts">
  import '@cubit-ui/core';

  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let ariaLabel: string = 'Loading';
</script>

<ui-spinner {size} aria-label={ariaLabel} {...$$restProps} />
