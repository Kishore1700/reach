<script lang="ts">
  import { currentUser, payments } from '$lib/stores/crmStore';
  import { Wallet } from 'lucide-svelte';

  $: activeCustId = $currentUser.customerId || 'cust-101';
  $: myPayments = $payments.filter(p => p.customerId === activeCustId);
</script>

<div class="space-y-6">
  <h2 class="text-lg font-bold text-slate-100">My Payment Receipts</h2>

  <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase">
          <tr>
            <th class="p-4">Receipt #</th>
            <th class="p-4">Payment Date</th>
            <th class="p-4">Method</th>
            <th class="p-4">Reference #</th>
            <th class="p-4 text-right">Amount Paid</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          {#each myPayments as pay}
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="p-4 font-bold text-slate-200">{pay.paymentNumber}</td>
              <td class="p-4 text-slate-400">{pay.paymentDate}</td>
              <td class="p-4 text-slate-300">{pay.method}</td>
              <td class="p-4 font-mono text-slate-400">{pay.referenceNumber}</td>
              <td class="p-4 text-right font-extrabold text-emerald-400">${pay.amount.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
