<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/dashboard');
  });
</script>

<div class="h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-xs">
  Redirecting to Executive CRM Dashboard...
</div>
