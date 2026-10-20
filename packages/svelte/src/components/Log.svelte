<script lang="ts">
  import '@cubit-ui/core';

  export let label: string = '';
  export let height: string | undefined = undefined;
  export let wrap: boolean = false;
  export let autoscroll: boolean = true;
  export let max: number | undefined = undefined;
  export let empty: string | undefined = undefined;
</script>

<ui-log
  {label}
  {height}
  {max}
  {empty}
  wrap={wrap ? '' : undefined}
  auto-scroll={autoscroll ? '' : 'false'}
  {...$$restProps}
>
  <slot />
</ui-log>
