<script lang="ts">
  import '@cubit-ui/core';

  export let label: string = '';
  export let description: string = '';
  /** Set to "error" to mark a failed step. */
  export let status: 'error' | undefined = undefined;
</script>

<ui-step {label} {description} {status} {...$$restProps}>
  <slot />
</ui-step>
