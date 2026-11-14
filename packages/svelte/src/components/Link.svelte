<script lang="ts">
  import '@cubit-ui/core';

  export let href = '';
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
  export let variant: 'primary' | 'muted' | 'inherit' = 'primary';
  export let underline: 'hover' | 'always' | 'none' = 'hover';
  export let external = false;
  export let disabled = false;
</script>

<ui-link
  {href}
  {target}
  {rel}
  {variant}
  {underline}
  external={external ? '' : undefined}
  disabled={disabled ? '' : undefined}
  {...$$restProps}
>
  <slot />
</ui-link>
