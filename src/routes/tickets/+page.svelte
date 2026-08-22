<script lang="ts">
  import { tickets, customers } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { LifeBuoy, AlertTriangle, CheckCircle } from 'lucide-svelte';
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Support Tickets' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Customer Support Tickets</h1>
      <p class="text-xs text-slate-400 mt-1">Lifecycle tracking: OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED</p>
    </div>
  </div>

  <div class="space-y-3">
    {#each $tickets as tkt}
      {@const cust = $customers.find(c => c.id === tkt.customerId)}
      <div class="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-200">{tkt.ticketNumber}</span>
            <Badge variant="purple">{tkt.status}</Badge>
            <Badge variant={tkt.priority === 'HIGH' || tkt.priority === 'URGENT' ? 'danger' : 'warning'}>{tkt.priority}</Badge>
          </div>
          <h3 class="text-sm font-semibold text-slate-100">{tkt.subject}</h3>
          <p class="text-xs text-slate-400">{tkt.description}</p>
        </div>

        <div class="text-right text-xs text-slate-400">
          <div>Client: <strong class="text-slate-200">{cust ? cust.name : 'Customer'}</strong></div>
          <div>Agent: {tkt.assignedAgent}</div>
          <div class="text-[10px] text-slate-500 font-mono mt-1">{tkt.createdDate}</div>
        </div>
      </div>
    {/each}
  </div>
</div>
