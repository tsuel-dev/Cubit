<script lang="ts">
  import '@cubit-ui/core';

  export let variant: 'text' | 'circle' | 'rect' = 'text';
  export let width: string | undefined = undefined;
  export let height: string | undefined = undefined;
  export let lines: number = 1;
</script>

<ui-skeleton {variant} {width} {height} {lines} {...$$restProps} />
