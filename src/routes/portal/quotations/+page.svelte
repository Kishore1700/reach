<script lang="ts">
  import { currentUser, customers, quotations } from '$lib/stores/crmStore';
  import Badge from '$lib/components/common/Badge.svelte';
  import { FileText, CheckCircle2 } from 'lucide-svelte';

  $: activeCustId = $currentUser.customerId || 'cust-101';
  $: customer = $customers.find(c => c.id === activeCustId) || $customers[0];
  $: myQuotations = $quotations.filter(q => q.customerId === activeCustId || q.leadId === (customer ? customer.leadId : ''));
</script>

<div class="space-y-6">
  <h2 class="text-lg font-bold text-slate-100">My Quotations & Proposals</h2>

  <div class="space-y-4">
    {#each myQuotations as qt}
      <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-sm font-bold text-slate-100">{qt.quotationNumber} (v{qt.version})</h3>
            <span class="text-xs text-slate-400">Valid Until: {qt.validUntil}</span>
          </div>
          <Badge variant={qt.status === 'ACCEPTED' ? 'success' : 'info'}>{qt.status}</Badge>
        </div>

        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 font-semibold uppercase">
            <tr>
              <th class="p-2">Item</th>
              <th class="p-2">Qty</th>
              <th class="p-2">Price</th>
              <th class="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            {#each qt.items as item}
              <tr>
                <td class="p-2 text-slate-200">{item.description}</td>
                <td class="p-2 text-slate-300">{item.quantity}</td>
                <td class="p-2 text-slate-300">${item.unitPrice.toLocaleString()}</td>
                <td class="p-2 text-right text-slate-200 font-bold">${item.total.toLocaleString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>

        <div class="flex justify-end pt-2 border-t border-slate-800 text-xs">
          <div class="text-right">
            <span class="text-slate-400 block">Grand Total</span>
            <span class="text-base font-bold text-emerald-400">${qt.grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
