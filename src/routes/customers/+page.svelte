<script lang="ts">
  import { customers, leads } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { Compass, ArrowRight, Award, ShieldCheck } from 'lucide-svelte';

  function getSegmentVariant(seg: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
    switch (seg) {
      case 'High Value': return 'purple';
      case 'New Customer': return 'info';
      case 'Returning Customer': return 'success';
      default: return 'default';
    }
  }
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Customers' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Customer Roster</h1>
      <p class="text-xs text-slate-400 mt-1">Preserves full lifecycle attribution: Original Source → Campaign → Lead → Opportunity → Sale → Realized Revenue</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each $customers as cust}
      {@const lead = $leads.find(l => l.id === cust.leadId)}
      <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Badge variant={getSegmentVariant(cust.segment)}>{cust.segment}</Badge>
            <span class="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">Source: {cust.originalSource}</span>
          </div>

          <h3 class="text-base font-bold text-slate-100">{cust.name}</h3>
          <p class="text-xs text-slate-400">{cust.company} • {cust.email}</p>
        </div>

        <!-- Lifetime Spend Block -->
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <span class="text-xs text-slate-400">Total Realized Revenue:</span>
          <span class="text-sm font-extrabold text-emerald-400">${cust.totalSpent.toLocaleString()}</span>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-800">
          <span class="text-[11px] text-slate-400">Since: {cust.createdDate}</span>
          <a
            href="/customers/{cust.id}"
            class="px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 text-xs font-semibold hover:bg-brand-600/30 transition-colors flex items-center gap-1"
          >
            <span>Full Profile & Attribution</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
