<script lang="ts">
  import { campaigns } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { Megaphone, TrendingUp, DollarSign, Users, Award } from 'lucide-svelte';
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Marketing Campaigns' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Marketing Campaigns & Channel Performance</h1>
      <p class="text-xs text-slate-400 mt-1">Calculates Conversion Rate (%) and Marketing ROI (%) with zero-division safety</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each $campaigns as cmp}
      {@const safeRoi = cmp.budget > 0 ? ((cmp.revenue - cmp.budget) / cmp.budget) * 100 : 0}
      {@const safeConv = cmp.leadsGenerated > 0 ? (cmp.customersAcquired / cmp.leadsGenerated) * 100 : 0}
      <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Badge variant="purple">{cmp.channel}</Badge>
            <span class="text-[10px] text-slate-500 font-mono">{cmp.startDate} to {cmp.endDate}</span>
          </div>

          <h3 class="text-base font-bold text-slate-100">{cmp.name}</h3>
          <p class="text-xs text-slate-400">Audience: {cmp.targetAudience}</p>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <span class="text-[10px] text-slate-400 block">Leads Generated</span>
            <span class="font-bold text-slate-200">{cmp.leadsGenerated}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">Customers Won</span>
            <span class="font-bold text-emerald-400">{cmp.customersAcquired}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">Budget Spend</span>
            <span class="font-bold text-slate-300">${cmp.budget.toLocaleString()}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">Realized Revenue</span>
            <span class="font-bold text-emerald-300">${cmp.revenue.toLocaleString()}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            <span class="text-[10px] text-slate-400 block">Conversion Rate</span>
            <span class="text-xs font-bold text-cyan-300">{safeConv.toFixed(1)}%</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 block">Marketing ROI</span>
            <span class="text-xs font-extrabold text-purple-400">+{safeRoi.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
