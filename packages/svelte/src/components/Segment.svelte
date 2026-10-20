<script lang="ts">
  import '@cubit-ui/core';

  export let value: string;
  export let disabled: boolean = false;
</script>

<ui-segment {value} disabled={disabled ? '' : undefined} {...$$restProps}>
  <slot />
</ui-segment>
