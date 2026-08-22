<script lang="ts">
  import { dashboardMetrics, leads, campaigns } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { BarChart3, TrendingUp, PieChart, DollarSign } from 'lucide-svelte';

  $: m = $dashboardMetrics;
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Analytics' }]} />

  <!-- Manager Navy Blue (#1E3A8A) Strategic Header -->
  <div class="header-manager p-6 rounded-2xl flex items-center justify-between shadow-xl">
    <div>
      <div class="flex items-center gap-2">
        <BarChart3 class="w-5 h-5 text-growth" />
        <h1 class="text-xl font-bold text-clarity">Enterprise CRM Analytics</h1>
      </div>
      <p class="text-xs text-slate-300 mt-1">Reliable & Strategic — authority, trust, and leadership decision metrics</p>
    </div>
    <Badge variant="manager">Strategic Leadership</Badge>
  </div>

  <!-- Strategic Analytics Cards (Shared Growth #10B981 & Empathy #A78BFA) -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="kpi-growth p-6 rounded-2xl border border-growth/30 space-y-4 shadow-lg">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-clarity">Overall Win Rate</h3>
        <TrendingUp class="w-4 h-4 text-growth" />
      </div>
      <div class="text-4xl font-extrabold text-growth">{m.conversionRate}%</div>
      <p class="text-xs text-slate-300">Shared Growth — Total Leads Converted</p>
    </div>

    <div class="card-empathy p-6 rounded-2xl space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-clarity">Blended Marketing ROI</h3>
        <PieChart class="w-4 h-4 text-empathy" />
      </div>
      <div class="text-4xl font-extrabold text-empathy-light">+{m.marketingRoi}%</div>
      <p class="text-xs text-slate-300">Empathy & Connection — Marketing Capital</p>
    </div>

    <div class="glass-card p-6 rounded-2xl border border-customer/30 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-clarity">Realized Revenue</h3>
        <DollarSign class="w-4 h-4 text-customer" />
      </div>
      <div class="text-4xl font-extrabold text-customer-light">${m.totalRevenue.toLocaleString()}</div>
      <p class="text-xs text-slate-300">Customer Transparency & Verified Invoices</p>
    </div>
  </div>
</div>
