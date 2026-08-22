<script lang="ts">
  import { currentUser, customers, quotations, invoices, payments, tickets } from '$lib/stores/crmStore';
  import Badge from '$lib/components/common/Badge.svelte';
  import { Compass, FileText, DollarSign, Wallet, LifeBuoy, ShieldCheck } from 'lucide-svelte';

  $: activeCustId = $currentUser.customerId || 'cust-101';
  $: customer = $customers.find(c => c.id === activeCustId) || $customers[0];
  $: myQuotations = $quotations.filter(q => q.customerId === activeCustId || q.leadId === (customer ? customer.leadId : ''));
  $: myInvoices = $invoices.filter(i => i.customerId === activeCustId);
  $: myPayments = $payments.filter(p => p.customerId === activeCustId);
  $: myTickets = $tickets.filter(t => t.customerId === activeCustId);

  $: totalPaid = myPayments.reduce((acc, p) => acc + p.amount, 0);
  $: totalOutstanding = myInvoices.filter(i => i.status !== 'CANCELLED').reduce((acc, i) => acc + i.outstandingAmount, 0);
</script>

<div class="space-y-6">
  <!-- Security Notice -->
  <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
    <div class="flex items-center gap-2">
      <ShieldCheck class="w-4 h-4 text-emerald-400" />
      <span><strong>Isolated Secure Portal:</strong> Viewing only authorized records for {customer ? customer.company : 'Client'}. Internal employee notes & costs are hidden.</span>
    </div>
  </div>

  <!-- Metric Cards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
      <span class="text-xs text-slate-400 font-medium">My Quotations</span>
      <h3 class="text-2xl font-bold text-slate-100">{myQuotations.length}</h3>
    </div>

    <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
      <span class="text-xs text-slate-400 font-medium">Total Paid</span>
      <h3 class="text-2xl font-bold text-emerald-400">${totalPaid.toLocaleString()}</h3>
    </div>

    <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
      <span class="text-xs text-slate-400 font-medium">Outstanding Balance</span>
      <h3 class="text-2xl font-bold text-rose-400">${totalOutstanding.toLocaleString()}</h3>
    </div>
  </div>

  <!-- Invoices Table -->
  <div class="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
    <h3 class="text-sm font-semibold text-slate-200">My Invoices</h3>
    {#if myInvoices.length === 0}
      <p class="text-xs text-slate-500 py-3">No active invoices issued for your account.</p>
    {:else}
      <div class="space-y-2">
        {#each myInvoices as inv}
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span class="font-bold text-slate-200">{inv.invoiceNumber}</span>
              <span class="text-slate-400 ml-2">Issued: {inv.issueDate}</span>
            </div>
            <div class="flex items-center gap-3">
              <Badge variant={inv.status === 'PAID' ? 'success' : 'warning'}>{inv.status}</Badge>
              <span class="font-bold text-emerald-400">${inv.total.toLocaleString()}</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
