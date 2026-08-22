<script lang="ts">
  import { inquiries, leads, customers } from '$lib/stores/crmStore';
  import type { InquiryCategory } from '$lib/types/crm';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { HelpCircle, MessageCircle, User, CheckCircle2 } from 'lucide-svelte';

  let selectedCategory: InquiryCategory | 'ALL' = 'ALL';

  $: filteredInquiries = $inquiries.filter(i => selectedCategory === 'ALL' || i.category === selectedCategory);
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Inquiry Management' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Customer Inquiries & Clarifications</h1>
      <p class="text-xs text-slate-400 mt-1">Categorized into Feature, Pricing, Discount, Coupon, and General Queries</p>
    </div>
  </div>

  <div class="flex items-center gap-2 overflow-x-auto pb-2">
    {#each ['ALL', 'FEATURE', 'PRICING', 'DISCOUNT', 'COUPON', 'GENERAL'] as cat}
      <button
        type="button"
        on:click={() => (selectedCategory = cat as any)}
        class="px-4 py-2 rounded-xl text-xs font-semibold border transition-all
          {selectedCategory === cat ? 'bg-brand-600/30 border-brand-500 text-brand-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'}"
      >
        {cat}
      </button>
    {/each}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each filteredInquiries as inq}
      {@const lead = $leads.find(l => l.id === inq.leadId)}
      <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <Badge variant="purple">{inq.category}</Badge>
          <span class="text-[10px] text-slate-500 font-mono">{inq.inquiryDate}</span>
        </div>

        <div>
          <h3 class="text-xs font-bold text-slate-200">Question:</h3>
          <p class="text-xs text-slate-300 mt-0.5">{inq.question}</p>
        </div>

        {#if inq.response}
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span class="font-semibold text-brand-400 block mb-0.5">Response:</span>
            <p class="text-slate-300">{inq.response}</p>
          </div>
        {/if}

        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span>Target: <strong class="text-slate-200">{lead ? lead.name : 'Customer'}</strong></span>
          <span>Assigned: {inq.assignedEmployee}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
