<script lang="ts">
  import '@cubit-ui/core';

  export let content: string = '';
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
</script>

<ui-tooltip {content} {position} {...$$restProps}>
  <slot />
</ui-tooltip>
