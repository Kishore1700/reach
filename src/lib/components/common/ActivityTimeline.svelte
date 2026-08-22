<script lang="ts">
  import type { Activity } from '$lib/types/crm';
  import { Clock, User, CheckCircle, FileText, DollarSign, ActivityIcon } from 'lucide-svelte';

  export let activities: Activity[] = [];
  export let title = 'Communication & Workflow Timeline';
</script>

<div class="glass-card rounded-2xl p-6 border border-slate-800">
  <h3 class="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
    <Clock class="w-4 h-4 text-brand-400" />
    <span>{title}</span>
  </h3>

  {#if activities.length === 0}
    <p class="text-xs text-slate-500 py-4 text-center">No recorded activity history yet.</p>
  {:else}
    <div class="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {#each activities as act}
        <div class="relative group">
          <!-- Timeline Bullet -->
          <div class="absolute -left-[21px] top-0.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-brand-500 flex items-center justify-center shadow">
            <div class="w-1.5 h-1.5 rounded-full bg-brand-400"></div>
          </div>

          <div class="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-xs font-semibold text-slate-200">{act.type.replace(/_/g, ' ')}</span>
              <span class="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
            </div>
            <p class="text-xs text-slate-300 mb-2">{act.description}</p>
            <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
              <User class="w-3 h-3 text-slate-500" />
              <span>{act.performedBy}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
