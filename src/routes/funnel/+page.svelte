<script lang="ts">
  import { leads, leadStatuses, updateLeadStatus } from '$lib/stores/crmStore';
  import type { LeadStatus } from '$lib/types/crm';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { ArrowRight, Sparkles, Building, Layers } from 'lucide-svelte';

  // Authoritative Table 8: lead_statuses stage mapping
  const stages: { lead_status_id: number; status: LeadStatus; title: string; color: string }[] = [
    { lead_status_id: 1, status: 'NEW', title: '1. New Enquiry', color: 'border-cyan-500' },
    { lead_status_id: 2, status: 'QUALIFIED', title: '2. Interested', color: 'border-blue-500' },
    { lead_status_id: 3, status: 'REQUIREMENT', title: '3. Pricing Enquiry', color: 'border-purple-500' },
    { lead_status_id: 4, status: 'QUOTATION', title: '4. Quotation Sent', color: 'border-orange-500' },
    { lead_status_id: 5, status: 'NEGOTIATION', title: '5. Negotiation', color: 'border-indigo-500' },
    { lead_status_id: 6, status: 'WON', title: '6. Converted', color: 'border-emerald-500' },
    { lead_status_id: 7, status: 'LOST', title: '7. Lost', color: 'border-rose-500' }
  ];
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Lead Funnel Board' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <div class="flex items-center gap-2">
        <Layers class="w-5 h-5 text-growth" />
        <h1 class="text-xl font-bold text-slate-100">7-Stage Database Lead Funnel Board</h1>
      </div>
      <p class="text-xs text-slate-400 mt-1">Direct alignment with Table 8 (`lead_statuses`): New Enquiry → Interested → Pricing Enquiry → Quotation Sent → Negotiation → Converted → Lost</p>
    </div>
  </div>

  <!-- Board Columns -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto pb-4">
    {#each stages as col}
      {@const stageLeads = $leads.filter(l => l.lead_status_id === col.lead_status_id || (col.status === l.status))}
      <div class="bg-slate-900/60 rounded-2xl p-3 border border-slate-800 flex flex-col min-h-[500px]">
        <!-- Column Header -->
        <div class="flex items-center justify-between p-2 border-b-2 {col.color} mb-3">
          <span class="text-xs font-bold text-slate-200">{col.title}</span>
          <span class="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
            {stageLeads.length}
          </span>
        </div>

        <!-- Cards -->
        <div class="space-y-3 flex-1 overflow-y-auto">
          {#each stageLeads as lead}
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group shadow-sm">
              <div class="flex items-start justify-between gap-1">
                <span class="text-xs font-bold text-slate-200 block truncate">{lead.name}</span>
                <span class="text-[10px] text-cyan-400 font-bold flex items-center gap-0.5">
                  <Sparkles class="w-3 h-3" /> {lead.score}
                </span>
              </div>

              <div class="text-[11px] text-slate-400 flex items-center gap-1">
                <Building class="w-3 h-3 text-slate-500" />
                <span class="truncate">{lead.company}</span>
              </div>

              {#if lead.enquiry_subject}
                <div class="text-[10px] text-slate-300 bg-slate-900 p-1.5 rounded border border-slate-800/80 truncate">
                  {lead.enquiry_subject}
                </div>
              {/if}

              <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                <span class="px-1.5 py-0.5 rounded bg-slate-800">{lead.source}</span>
                <a
                  href="/leads/{lead.id}"
                  class="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span>Details</span>
                  <ArrowRight class="w-3 h-3" />
                </a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
