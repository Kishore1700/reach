<script lang="ts">
  import { currentUser, invoices } from '$lib/stores/crmStore';
  import Badge from '$lib/components/common/Badge.svelte';
  import { DollarSign } from 'lucide-svelte';

  $: activeCustId = $currentUser.customerId || 'cust-101';
  $: myInvoices = $invoices.filter(i => i.customerId === activeCustId);
</script>

<div class="space-y-6">
  <h2 class="text-lg font-bold text-slate-100">My Invoices</h2>

  <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase">
          <tr>
            <th class="p-4">Invoice #</th>
            <th class="p-4">Issue Date</th>
            <th class="p-4">Due Date</th>
            <th class="p-4">Status</th>
            <th class="p-4">Total Amount</th>
            <th class="p-4 text-right">Outstanding</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          {#each myInvoices as inv}
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="p-4 font-bold text-slate-200">{inv.invoiceNumber}</td>
              <td class="p-4 text-slate-400">{inv.issueDate}</td>
              <td class="p-4 text-slate-400">{inv.dueDate}</td>
              <td class="p-4"><Badge variant={inv.status === 'PAID' ? 'success' : 'warning'}>{inv.status}</Badge></td>
              <td class="p-4 font-bold text-slate-200">${inv.total.toLocaleString()}</td>
              <td class="p-4 text-right font-bold text-rose-400">${inv.outstandingAmount.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
