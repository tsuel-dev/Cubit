<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '@cubit-ui/core';

  export let current: number = 1;
  export let total: number = 1;
  export let pageSize: number = 10;

  const dispatch = createEventDispatcher<{
    change: { page: number };
  }>();

  function handleChange(e: CustomEvent<{ page: number }>) {
    current = e.detail?.page ?? 1;
    dispatch('change', e.detail);
  }
</script>

<ui-pagination
  {current}
  {total}
  page-size={pageSize}
  on:change={handleChange}
  {...$$restProps}
/>
