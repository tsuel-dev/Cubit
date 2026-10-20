<script lang="ts">
  import '@cubit-ui/core';

  /** Zero-based index of the active step. */
  export let current: number = 0;
  export let orientation: 'horizontal' | 'vertical' = 'horizontal';
  export let ariaLabel: string | undefined = undefined;
</script>

<ui-stepper {current} {orientation} aria-label={ariaLabel} {...$$restProps}>
  <slot />
</ui-stepper>
