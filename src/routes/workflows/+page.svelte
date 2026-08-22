<script lang="ts">
  import { workflows } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { Workflow, Play, CheckCircle2, ShieldCheck } from 'lucide-svelte';
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Workflow Engine' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Workflow Automation Engine</h1>
      <p class="text-xs text-slate-400 mt-1">Rule Engine: TRIGGER → CONDITION → ACTION. Duplicate execution guard enforced.</p>
    </div>
  </div>

  <div class="space-y-4">
    {#each $workflows as wf}
      <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Workflow class="w-4 h-4 text-brand-400" />
            <span>{wf.name}</span>
          </h3>
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400">Executions: <strong class="text-cyan-300">{wf.executionCount}</strong></span>
            <Badge variant={wf.enabled ? 'success' : 'default'}>{wf.enabled ? 'Active' : 'Disabled'}</Badge>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <span class="text-[10px] font-bold text-slate-400 block uppercase">1. Trigger</span>
            <span class="font-mono text-cyan-300">{wf.trigger}</span>
          </div>

          <div>
            <span class="text-[10px] font-bold text-slate-400 block uppercase">2. Condition</span>
            <span class="font-mono text-amber-300">{wf.condition}</span>
          </div>

          <div>
            <span class="text-[10px] font-bold text-slate-400 block uppercase">3. Action</span>
            <span class="font-mono text-emerald-400">{wf.action}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
