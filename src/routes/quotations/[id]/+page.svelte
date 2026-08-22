<script lang="ts">
  import { page } from '$app/stores';
  import { quotations, leads, acceptQuotation } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import QuotationBuilder from '$lib/components/crm/QuotationBuilder.svelte';
  import Modal from '$lib/components/common/Modal.svelte';
  import { FileText, CheckCircle2, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-svelte';

  $: qtId = $page.params.id;
  $: quotation = $quotations.find(q => q.id === qtId);
  $: lead = quotation ? $leads.find(l => l.id === quotation.leadId) : null;

  let showRevisionModal = false;

  function handleAccept() {
    if (!quotation) return;
    acceptQuotation(quotation.id);
  }
</script>

{#if !quotation}
  <div class="p-8 text-center text-slate-400">
    <p>Quotation record not found.</p>
    <a href="/quotations" class="text-brand-400 font-semibold underline mt-2 block">Back to Quotation List</a>
  </div>
{:else}
  <div class="space-y-6">
    <Breadcrumb items={[{ label: 'Quotations', href: '/quotations' }, { label: quotation.quotationNumber }]} />

    <!-- Header Banner -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-slate-100">{quotation.quotationNumber}</h1>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-slate-300">v{quotation.version}</span>
          <Badge variant={quotation.status === 'ACCEPTED' ? 'success' : 'info'}>{quotation.status}</Badge>
        </div>
        <p class="text-xs text-slate-400 mt-1">Issued for: <strong class="text-slate-200">{lead ? `${lead.name} (${lead.company})` : 'Client'}</strong></p>
      </div>

      <div class="flex items-center gap-3">
        {#if quotation.status !== 'ACCEPTED'}
          <button
            type="button"
            on:click={() => (showRevisionModal = true)}
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw class="w-4 h-4" />
            <span>Create Revised Version</span>
          </button>

          <button
            type="button"
            on:click={handleAccept}
            class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Accept Quotation & Convert Deal</span>
          </button>
        {:else}
          <div class="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <ShieldCheck class="w-4 h-4" />
            <span>Quotation Accepted & Converted to Invoice</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Quotation Document View -->
    <div class="glass-card p-8 rounded-2xl border border-slate-800 space-y-6">
      <div class="flex justify-between items-start border-b border-slate-800 pb-6">
        <div>
          <h2 class="text-lg font-bold text-slate-100">QUOTATION DOCUMENT</h2>
          <p class="text-xs text-slate-400 mt-1">Valid Until: {quotation.validUntil}</p>
        </div>
        <div class="text-right text-xs">
          <p class="font-bold text-brand-400">SymphoReach Inc.</p>
          <p class="text-slate-400">Enterprise Solutions Division</p>
        </div>
      </div>

      <!-- Line Items Table -->
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase">
          <tr>
            <th class="p-3">Description</th>
            <th class="p-3">Qty</th>
            <th class="p-3">Unit Price</th>
            <th class="p-3">Discount</th>
            <th class="p-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          {#each quotation.items as item}
            <tr>
              <td class="p-3 font-medium text-slate-200">{item.description}</td>
              <td class="p-3 text-slate-300">{item.quantity}</td>
              <td class="p-3 text-slate-300">${item.unitPrice.toLocaleString()}</td>
              <td class="p-3 text-rose-400">-${item.discount.toLocaleString()}</td>
              <td class="p-3 text-right font-bold text-slate-200">${item.total.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Financial Calculation Block -->
      <div class="flex justify-end pt-4 border-t border-slate-800">
        <div class="w-72 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div class="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span>${quotation.subtotal.toLocaleString()}</span>
          </div>
          <div class="flex justify-between text-rose-400">
            <span>Total Discount</span>
            <span>-${quotation.discountTotal.toLocaleString()}</span>
          </div>
          <div class="flex justify-between font-semibold text-slate-200 pt-1 border-t border-slate-800">
            <span>Taxable Amount</span>
            <span>${quotation.taxableAmount.toLocaleString()}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Tax ({quotation.taxRate}%)</span>
            <span>+${quotation.taxAmount.toLocaleString()}</span>
          </div>
          <div class="flex justify-between font-bold text-sm text-emerald-400 pt-2 border-t border-slate-800">
            <span>Grand Total</span>
            <span>${quotation.grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for Creating Revised Version -->
  <Modal isOpen={showRevisionModal} title="Create Revised Quotation Version" maxWidth="max-w-3xl" on:close={() => (showRevisionModal = false)}>
    <QuotationBuilder
      leadId={quotation.leadId}
      opportunityId={quotation.opportunityId}
      existingQuotation={quotation}
      on:saved={() => (showRevisionModal = false)}
    />
  </Modal>
{/if}
