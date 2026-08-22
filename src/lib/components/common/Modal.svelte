<script lang="ts">
  import { X } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let title = '';
  export let maxWidth = 'max-w-xl';

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      on:click={close}
      on:keydown={e => e.key === 'Escape' && close()}
      role="button"
      tabindex="0"
    ></div>

    <!-- Modal Content Window -->
    <div class="relative w-full {maxWidth} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-8">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
        <h3 class="text-base font-semibold text-slate-100">{title}</h3>
        <button
          type="button"
          on:click={close}
          class="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 max-h-[75vh] overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
{/if}
