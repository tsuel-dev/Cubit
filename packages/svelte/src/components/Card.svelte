<script lang="ts">
  import '@cubit-ui/core';

  export let variant: 'default' | 'elevated' | 'secondary' | 'bordered' = 'default';
  export let bordered: boolean = false;
</script>

<ui-card {variant} bordered={bordered ? '' : undefined} {...$$restProps}>
  <slot name="header" slot="header" />
  <slot />
  <slot name="footer" slot="footer" />
</ui-card>
