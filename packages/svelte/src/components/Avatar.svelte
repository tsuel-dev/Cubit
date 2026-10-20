<script lang="ts">
  import '@cubit-ui/core';

  export let src: string = '';
  export let alt: string = '';
  export let name: string = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<ui-avatar {src} {alt} {name} {size} {...$$restProps} />
