<script lang="ts">
  import { page } from '$app/stores';
  import { customers, leads, campaigns, sales, invoices, feedbacks, tickets, activities } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import ActivityTimeline from '$lib/components/common/ActivityTimeline.svelte';
  import { Compass, Megaphone, DollarSign, Award, Star, LifeBuoy, ArrowRight } from 'lucide-svelte';

  $: custId = $page.params.id;
  $: customer = $customers.find(c => c.id === custId);
  $: lead = customer ? $leads.find(l => l.id === customer.leadId) : null;
  $: campaign = customer && customer.campaignId ? $campaigns.find(cmp => cmp.id === customer.campaignId) : null;
  $: custInvoices = customer ? $invoices.filter(i => i.customerId === customer.id) : [];
  $: custFeedbacks = customer ? $feedbacks.filter(f => f.customerId === customer.id) : [];
  $: custTickets = customer ? $tickets.filter(t => t.customerId === customer.id) : [];
  $: custActivities = customer ? $activities.filter(a => a.entityId === customer.id || (lead && a.entityId === lead.id)) : [];
</script>

{#if !customer}
  <div class="p-8 text-center text-slate-400">
    <p>Customer profile not found.</p>
    <a href="/customers" class="text-brand-400 font-semibold underline mt-2 block">Back to Customer Roster</a>
  </div>
{:else}
  <div class="space-y-6">
    <Breadcrumb items={[{ label: 'Customers', href: '/customers' }, { label: customer.name }]} />

    <!-- Profile Banner -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-slate-100">{customer.name}</h1>
          <Badge variant="purple">{customer.segment}</Badge>
        </div>
        <p class="text-xs text-slate-400 mt-1">{customer.company} • {customer.email} • {customer.phone}</p>
      </div>

      <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-right">
        <span class="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider block">Realized Revenue</span>
        <span class="text-xl font-extrabold text-emerald-400">${customer.totalSpent.toLocaleString()}</span>
      </div>
    </div>

    <!-- Complete Lifecycle Attribution Chain Card -->
    <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
      <h2 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <Award class="w-4 h-4 text-cyan-400" />
        <span>End-to-End Attribution Lifecycle Chain</span>
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span class="text-[10px] text-slate-500 block">1. Original Channel</span>
          <span class="font-bold text-cyan-300">{customer.originalSource}</span>
        </div>

        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span class="text-[10px] text-slate-500 block">2. Campaign</span>
          <span class="font-bold text-purple-300">{campaign ? campaign.name : 'Direct Nurture'}</span>
        </div>

        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span class="text-[10px] text-slate-500 block">3. Origin Lead</span>
          <span class="font-bold text-slate-200">{lead ? lead.name : 'Converted Lead'}</span>
        </div>

        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span class="text-[10px] text-slate-500 block">4. Winning Deal</span>
          <span class="font-bold text-amber-300">Opportunity Closed Won</span>
        </div>

        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span class="text-[10px] text-slate-500 block">5. Total Realized Value</span>
          <span class="font-bold text-emerald-400">${customer.totalSpent.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <!-- Layout Grid: Invoices & Timeline -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Invoices List -->
        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 class="text-sm font-semibold text-slate-200">Customer Invoices</h3>
          <div class="space-y-2">
            {#each custInvoices as inv}
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
        </div>

        <!-- Post Sale Feedback -->
        {#if custFeedbacks.length > 0}
          <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Star class="w-4 h-4 text-amber-400" />
              <span>Customer Post-Sale Feedback</span>
            </h3>
            {#each custFeedbacks as fb}
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div class="flex justify-between font-bold text-amber-300">
                  <span>Rating: {fb.rating} / 5 ({fb.serviceQuality})</span>
                  <span class="text-slate-500 font-mono">{fb.createdDate}</span>
                </div>
                <p class="text-slate-300">"{fb.comment}"</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Activity History -->
      <div>
        <ActivityTimeline activities={custActivities} />
      </div>
    </div>
  </div>
{/if}
