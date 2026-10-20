<script lang="ts">
  import '@cubit-ui/core';

  export let striped: boolean = false;
  export let bordered: boolean = false;
  export let hoverable: boolean = false;
</script>

<ui-table
  striped={striped ? '' : undefined}
  bordered={bordered ? '' : undefined}
  hoverable={hoverable ? '' : undefined}
  {...$$restProps}
>
  <slot />
</ui-table>
