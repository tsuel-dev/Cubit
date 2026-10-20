<script lang="ts">
  import '@cubit-ui/core';

  export let heading: string = '';
  export let description: string = '';
  export let size: 'sm' | 'md' = 'md';
  export let variant: 'default' | 'error' = 'default';
</script>

<ui-empty-state {heading} {description} {size} {variant} {...$$restProps}>
  <slot name="icon" slot="icon" />
  <slot />
</ui-empty-state>
