<script lang="ts">
  import { ChevronRight, Home } from 'lucide-svelte';

  export let items: { label: string; href?: string }[] = [];
</script>

<nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs text-slate-400 mb-4">
  <a href="/dashboard" class="flex items-center gap-1 hover:text-brand-400 transition-colors">
    <Home class="w-3.5 h-3.5" />
    <span>Home</span>
  </a>
  {#each items as item}
    <ChevronRight class="w-3.5 h-3.5 text-slate-600" />
    {#if item.href}
      <a href={item.href} class="hover:text-brand-400 transition-colors">{item.label}</a>
    {:else}
      <span class="font-medium text-slate-200">{item.label}</span>
    {/if}
  {/each}
</nav>
