<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let variant: 'neutral' | 'primary' | 'success' | 'warning' | 'error' = 'neutral';
  export let size: 'sm' | 'md' = 'md';
  export let removable: boolean = false;
  export let disabled: boolean = false;
  export let removeLabel: string | undefined = undefined;

  const dispatch = createEventDispatcher<{ remove: undefined }>();
</script>

<ui-chip
  {variant}
  {size}
  removable={removable ? '' : undefined}
  disabled={disabled ? '' : undefined}
  remove-label={removeLabel}
  on:remove={() => dispatch('remove')}
  {...$$restProps}
>
  <slot />
</ui-chip>
