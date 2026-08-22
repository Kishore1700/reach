<script lang="ts">
  import { quotations, leads, opportunities, acceptQuotation } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-svelte';

  function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
    switch (status) {
      case 'ACCEPTED': return 'success';
      case 'REJECTED': case 'EXPIRED': return 'danger';
      case 'SENT': case 'VIEWED': return 'info';
      default: return 'default';
    }
  }
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Quotations' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Quotations & Proposals</h1>
      <p class="text-xs text-slate-400 mt-1">Calculations enforce Subtotal, Taxable Amount, Tax Rate, and Grand Total</p>
    </div>
  </div>

  <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
          <tr>
            <th class="p-4">Quotation #</th>
            <th class="p-4">Version</th>
            <th class="p-4">Target Lead / Client</th>
            <th class="p-4">Status</th>
            <th class="p-4">Subtotal</th>
            <th class="p-4">Grand Total</th>
            <th class="p-4">Valid Until</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          {#each $quotations as qt}
            {@const lead = $leads.find(l => l.id === qt.leadId)}
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="p-4 font-bold text-slate-200">{qt.quotationNumber}</td>
              <td class="p-4"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">v{qt.version}</span></td>
              <td class="p-4">
                <div class="font-semibold text-slate-200">{lead ? lead.name : 'Client'}</div>
                <div class="text-[11px] text-slate-400">{lead ? lead.company : ''}</div>
              </td>
              <td class="p-4">
                <Badge variant={getStatusVariant(qt.status)}>{qt.status}</Badge>
              </td>
              <td class="p-4 text-slate-300">${qt.subtotal.toLocaleString()}</td>
              <td class="p-4 font-bold text-emerald-400">${qt.grandTotal.toLocaleString()}</td>
              <td class="p-4 text-slate-400">{qt.validUntil}</td>
              <td class="p-4 text-right flex items-center justify-end gap-2">
                {#if qt.status !== 'ACCEPTED'}
                  <button
                    type="button"
                    on:click={() => acceptQuotation(qt.id)}
                    class="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold hover:bg-emerald-600/30 transition-colors inline-flex items-center gap-1"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                {/if}
                <a
                  href="/quotations/{qt.id}"
                  class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 font-semibold hover:bg-brand-600/30 transition-colors"
                >
                  <span>Workbench</span>
                  <ArrowRight class="w-3 h-3" />
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
