<script lang="ts">
  import '@cubit-ui/core';

  export let level: 'info' | 'success' | 'warning' | 'error' | 'debug' = 'info';
  export let time: string | undefined = undefined;
</script>

<ui-log-item {level} {time} {...$$restProps}>
  <slot />
</ui-log-item>
