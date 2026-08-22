<script lang="ts">
  import { tasks, leads, customers } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { CheckSquare, AlertCircle, Clock, CheckCircle2 } from 'lucide-svelte';

  function toggleTaskStatus(taskId: string) {
    tasks.update(list => list.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  }

  function getPriorityVariant(p: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
    switch (p) {
      case 'URGENT': case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      default: return 'default';
    }
  }
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Follow-ups & Tasks' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Follow-up Task Workbench</h1>
      <p class="text-xs text-slate-400 mt-1">Prevents completed tasks from returning to pending without explicit user action</p>
    </div>
  </div>

  <div class="space-y-3">
    {#each $tasks as task}
      {@const lead = $leads.find(l => l.id === task.leadId)}
      {@const cust = $customers.find(c => c.id === task.customerId)}
      <div class="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <button
            type="button"
            on:click={() => toggleTaskStatus(task.id)}
            class="mt-0.5 w-5 h-5 rounded-lg border border-slate-700 flex items-center justify-center transition-colors
              {task.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-900 text-transparent hover:border-slate-500'}"
          >
            <CheckCircle2 class="w-4 h-4" />
          </button>
          <div>
            <h3 class="text-xs font-bold text-slate-200 {task.status === 'COMPLETED' ? 'line-through text-slate-500' : ''}">
              {task.title}
            </h3>
            <p class="text-[11px] text-slate-400 mt-0.5">
              Assigned: {task.assignedEmployee} • Linked: {lead ? lead.name : cust ? cust.name : 'General Task'}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
          <span class="text-xs font-mono font-bold {task.dueDate < new Date().toISOString().slice(0, 10) && task.status !== 'COMPLETED' ? 'text-rose-400' : 'text-slate-400'}">
            Due: {task.dueDate}
          </span>
        </div>
      </div>
    {/each}
  </div>
</div>
