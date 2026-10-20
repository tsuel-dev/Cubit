<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let value: string = '';

  const dispatch = createEventDispatcher<{
    change: { value: string };
  }>();

  function handleChange(e: CustomEvent<{ value: string }>) {
    if (e.target !== e.currentTarget) return; // 자식 컴포넌트에서 버블링된 이벤트는 무시
    value = e.detail?.value ?? '';
    dispatch('change', e.detail);
  }
</script>

<ui-tabs {value} on:change={handleChange} {...$$restProps}>
  <slot name="tabs" slot="tabs" />
  <slot />
</ui-tabs>
