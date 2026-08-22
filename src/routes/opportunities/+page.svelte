<script lang="ts">
  import { opportunities, leads, quotations } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import QuotationBuilder from '$lib/components/crm/QuotationBuilder.svelte';
  import Modal from '$lib/components/common/Modal.svelte';
  import { Target, Calculator, FileText, ArrowRight, TrendingUp } from 'lucide-svelte';

  let selectedOppId: string | null = null;
  let showQuotationModal = false;

  $: selectedOpp = $opportunities.find(o => o.id === selectedOppId);
  $: totalExpected = $opportunities.reduce((acc, o) => acc + o.expectedValue, 0);
  $: totalWeighted = $opportunities.reduce((acc, o) => acc + o.weightedRevenue, 0);

  function openQuotationModal(oppId: string) {
    selectedOppId = oppId;
    showQuotationModal = true;
  }

  function handleQuotationSaved() {
    showQuotationModal = false;
  }
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Opportunities' }]} />

  <!-- Header Banner -->
  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Opportunity Pipeline</h1>
      <p class="text-xs text-slate-400 mt-1">Calculates Weighted Revenue = Expected Value × Win Probability (%)</p>
    </div>

    <div class="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs">
      <div>
        <span class="text-slate-400 block">Total Pipeline Value</span>
        <span class="font-bold text-slate-200">${totalExpected.toLocaleString()}</span>
      </div>
      <div class="border-l border-slate-800 pl-4">
        <span class="text-slate-400 block">Weighted Forecast</span>
        <span class="font-bold text-emerald-400">${totalWeighted.toLocaleString()}</span>
      </div>
    </div>
  </div>

  <!-- Opportunities List -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each $opportunities as opp}
      {@const lead = $leads.find(l => l.id === opp.leadId)}
      {@const existingQt = $quotations.find(q => q.opportunityId === opp.id)}
      <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Badge variant={opp.stage === 'CLOSED_WON' ? 'success' : opp.stage === 'CLOSED_LOST' ? 'danger' : 'info'}>
              {opp.stage.replace(/_/g, ' ')}
            </Badge>
            <span class="text-[10px] text-slate-500">Close: {opp.expectedCloseDate}</span>
          </div>

          <h3 class="text-sm font-bold text-slate-100">{opp.title}</h3>
          <p class="text-xs text-slate-400 line-clamp-2">{opp.requirement}</p>
        </div>

        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
          <div class="flex justify-between text-slate-400">
            <span>Contract Value:</span>
            <span class="font-bold text-slate-200">${opp.expectedValue.toLocaleString()}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Win Probability:</span>
            <span class="font-bold text-cyan-300">{opp.probability}%</span>
          </div>
          <div class="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-800">
            <span>Weighted Revenue:</span>
            <span>${opp.weightedRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-800">
          <span class="text-xs text-slate-400">Lead: <strong class="text-slate-200">{lead ? lead.name : 'Unknown'}</strong></span>

          {#if existingQt}
            <a
              href="/quotations/{existingQt.id}"
              class="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1"
            >
              <FileText class="w-3.5 h-3.5" />
              <span>View Quotation</span>
            </a>
          {:else}
            <button
              type="button"
              on:click={() => openQuotationModal(opp.id)}
              class="px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 text-xs font-semibold hover:bg-brand-600/30 transition-colors flex items-center gap-1"
            >
              <Calculator class="w-3.5 h-3.5" />
              <span>Build Quotation</span>
            </button>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Modal: Build Quotation for Opportunity -->
<Modal isOpen={showQuotationModal} title="Quotation Builder" maxWidth="max-w-3xl" on:close={() => (showQuotationModal = false)}>
  {#if selectedOpp}
    <QuotationBuilder
      leadId={selectedOpp.leadId}
      opportunityId={selectedOpp.id}
      on:saved={handleQuotationSaved}
    />
  {/if}
</Modal>
