<script lang="ts">
  import '@cubit-ui/core';

  export let separator: string = '/';
  export let ariaLabel: string = 'Breadcrumbs';
</script>

<ui-breadcrumbs {separator} aria-label={ariaLabel} {...$$restProps}>
  <slot />
</ui-breadcrumbs>
