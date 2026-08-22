<script lang="ts">
  import { toastMessage } from '$lib/stores/crmStore';
  import { CheckCircle2, AlertCircle, Info, X } from 'lucide-svelte';
</script>

{#if $toastMessage}
  <div class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0
    {$toastMessage.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' : ''}
    {$toastMessage.type === 'error' ? 'bg-rose-950/90 border-rose-500/40 text-rose-200' : ''}
    {$toastMessage.type === 'info' ? 'bg-cyan-950/90 border-cyan-500/40 text-cyan-200' : ''}"
  >
    {#if $toastMessage.type === 'success'}
      <CheckCircle2 class="w-5 h-5 text-emerald-400 shrink-0" />
    {:else if $toastMessage.type === 'error'}
      <AlertCircle class="w-5 h-5 text-rose-400 shrink-0" />
    {:else}
      <Info class="w-5 h-5 text-cyan-400 shrink-0" />
    {/if}

    <p class="text-xs font-medium pr-2 max-w-sm">{$toastMessage.text}</p>

    <button
      type="button"
      on:click={() => toastMessage.set(null)}
      class="p-0.5 rounded text-slate-400 hover:text-white transition-colors"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
{/if}
