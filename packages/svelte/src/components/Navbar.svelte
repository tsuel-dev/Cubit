<script lang="ts">
  import '@cubit-ui/core';

  export let brand: string = '';
  export let sticky: boolean = false;
</script>

<ui-navbar {brand} sticky={sticky ? '' : undefined} {...$$restProps}>
  <slot />
  <slot name="actions" slot="actions" />
</ui-navbar>
