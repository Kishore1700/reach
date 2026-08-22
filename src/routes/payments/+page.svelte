<script lang="ts">
  import { payments, invoices, customers } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { Wallet, CheckCircle2, ShieldCheck } from 'lucide-svelte';

  $: totalRealized = $payments.reduce((acc, p) => acc + p.amount, 0);
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Payments' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Realized Payments Log</h1>
      <p class="text-xs text-slate-400 mt-1">Verified financial transactions linked directly to issued invoices</p>
    </div>

    <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-right">
      <span class="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider block">Total Realized Revenue</span>
      <span class="text-xl font-extrabold text-emerald-400">${totalRealized.toLocaleString()}</span>
    </div>
  </div>

  <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
          <tr>
            <th class="p-4">Payment #</th>
            <th class="p-4">Invoice Ref</th>
            <th class="p-4">Customer</th>
            <th class="p-4">Payment Date</th>
            <th class="p-4">Method</th>
            <th class="p-4">Txn Ref #</th>
            <th class="p-4 text-right">Amount Received</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          {#each $payments as pay}
            {@const inv = $invoices.find(i => i.id === pay.invoiceId)}
            {@const cust = $customers.find(c => c.id === pay.customerId)}
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="p-4 font-bold text-slate-200">{pay.paymentNumber}</td>
              <td class="p-4 font-mono text-cyan-300">{inv ? inv.invoiceNumber : 'Invoice'}</td>
              <td class="p-4">
                <div class="font-semibold text-slate-200">{cust ? cust.name : 'Client'}</div>
                <div class="text-[11px] text-slate-400">{cust ? cust.company : ''}</div>
              </td>
              <td class="p-4 text-slate-400">{pay.paymentDate}</td>
              <td class="p-4"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">{pay.method}</span></td>
              <td class="p-4 font-mono text-slate-400">{pay.referenceNumber}</td>
              <td class="p-4 text-right font-extrabold text-emerald-400">${pay.amount.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
