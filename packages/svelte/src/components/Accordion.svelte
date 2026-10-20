<script lang="ts">
  import '@cubit-ui/core';

  export let multiple: boolean = false;
</script>

<ui-accordion multiple={multiple ? '' : undefined} {...$$restProps}>
  <slot />
</ui-accordion>
