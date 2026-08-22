<script lang="ts">
  import { invoices, customers } from '$lib/stores/crmStore';
  import type { Invoice } from '$lib/types/crm';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import PaymentModal from '$lib/components/crm/PaymentModal.svelte';
  import { Wallet } from 'lucide-svelte';

  let selectedInvoice: Invoice | null = null;
  let showPaymentModal = false;

  function openPaymentModal(inv: Invoice) {
    selectedInvoice = inv;
    showPaymentModal = true;
  }
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Invoices' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Proforma & Tax Invoices</h1>
      <p class="text-xs text-slate-400 mt-1">Tracks Invoice Total, Paid Amount, and Real-time Outstanding Balance</p>
    </div>
  </div>

  <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
          <tr>
            <th class="p-4">Invoice #</th>
            <th class="p-4">Type</th>
            <th class="p-4">Customer</th>
            <th class="p-4">Status</th>
            <th class="p-4">Total Amount</th>
            <th class="p-4">Paid</th>
            <th class="p-4">Outstanding</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          {#each $invoices as inv}
            {@const cust = $customers.find(c => c.id === inv.customerId)}
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="p-4 font-bold text-slate-200">{inv.invoiceNumber}</td>
              <td class="p-4"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{inv.type}</span></td>
              <td class="p-4">
                <div class="font-semibold text-slate-200">{cust ? cust.name : 'Customer'}</div>
                <div class="text-[11px] text-slate-400">{cust ? cust.company : ''}</div>
              </td>
              <td class="p-4">
                <Badge variant={inv.status === 'PAID' ? 'success' : inv.status === 'PARTIALLY_PAID' ? 'warning' : 'info'}>
                  {inv.status}
                </Badge>
              </td>
              <td class="p-4 font-bold text-slate-200">${inv.total.toLocaleString()}</td>
              <td class="p-4 text-emerald-400">${inv.paidAmount.toLocaleString()}</td>
              <td class="p-4 font-bold text-rose-400">${inv.outstandingAmount.toLocaleString()}</td>
              <td class="p-4 text-right">
                {#if inv.outstandingAmount > 0 && inv.status !== 'CANCELLED'}
                  <button
                    type="button"
                    on:click={() => openPaymentModal(inv)}
                    class="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold hover:bg-emerald-600/30 transition-colors flex items-center gap-1 inline-flex"
                  >
                    <Wallet class="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>
                {:else}
                  <span class="text-[11px] text-slate-500 font-semibold">Fully Settled</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<PaymentModal isOpen={showPaymentModal} invoice={selectedInvoice} on:close={() => (showPaymentModal = false)} />
