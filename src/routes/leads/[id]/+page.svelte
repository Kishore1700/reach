<script lang="ts">
  import { page } from '$app/stores';
  import { leads, inquiries, opportunities, activities, createOpportunity } from '$lib/stores/crmStore';
  import { aiService } from '$lib/services/aiService';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import LeadStatusStepper from '$lib/components/crm/LeadStatusStepper.svelte';
  import ActivityTimeline from '$lib/components/common/ActivityTimeline.svelte';
  import Modal from '$lib/components/common/Modal.svelte';
  import { User, Building, Mail, Phone, Sparkles, Target, HelpCircle, Plus } from 'lucide-svelte';

  $: leadId = $page.params.id;
  $: lead = $leads.find(l => l.id === leadId);
  $: leadInquiries = $inquiries.filter(i => i.leadId === leadId);
  $: leadOpportunities = $opportunities.filter(o => o.leadId === leadId);
  $: leadActivities = $activities.filter(a => a.entityId === leadId);

  // AI Lead Score calculation
  $: aiAnalysis = lead ? aiService.calculateLeadScore(lead) : null;

  // Opportunity creation modal state
  let showOppModal = false;
  let oppTitle = '';
  let oppRequirement = '';
  let oppExpectedValue = 25000;
  let oppProbability = 70;

  $: if (lead && !oppTitle) {
    oppTitle = `${lead.company} Contract Opportunity`;
    oppRequirement = lead.notes || 'Enterprise licensing deployment';
  }

  function handleCreateOpportunity() {
    if (!lead || !oppTitle) return;
    createOpportunity({
      leadId: lead.id,
      title: oppTitle,
      requirement: oppRequirement,
      expectedValue: oppExpectedValue,
      probability: oppProbability,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      assignedSalesperson: lead.assignedEmployee,
      stage: 'PROPOSAL_SENT',
      notes: 'Created from lead detail workbench'
    });
    showOppModal = false;
  }
</script>

{#if !lead}
  <div class="p-8 text-center text-slate-400">
    <p>Lead not found or has been archived.</p>
    <a href="/leads" class="text-brand-400 font-semibold underline mt-2 block">Return to Lead List</a>
  </div>
{:else}
  <div class="space-y-6">
    <Breadcrumb items={[{ label: 'Leads Management', href: '/leads' }, { label: lead.name }]} />

    <!-- Lead Profile Header -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
          {lead.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-bold text-slate-100">{lead.name}</h1>
            <Badge variant={lead.status === 'WON' ? 'success' : lead.status === 'LOST' ? 'danger' : 'info'}>
              {lead.status}
            </Badge>
          </div>
          <p class="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
            <span class="flex items-center gap-1"><Building class="w-3.5 h-3.5 text-slate-500" /> {lead.company}</span>
            <span class="flex items-center gap-1"><Mail class="w-3.5 h-3.5 text-slate-500" /> {lead.email}</span>
            <span class="flex items-center gap-1"><Phone class="w-3.5 h-3.5 text-slate-500" /> {lead.phone}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        {#if lead.status !== 'WON' && lead.status !== 'LOST'}
          <button
            type="button"
            on:click={() => (showOppModal = true)}
            class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <Target class="w-4 h-4" />
            <span>Create Opportunity</span>
          </button>
        {/if}
      </div>
    </div>

    <!-- Stepper Component -->
    <LeadStatusStepper leadId={lead.id} currentStatus={lead.status} />

    <!-- Grid Layout: AI Lead Intelligence & Opportunities -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- AI Intelligence Box -->
      {#if aiAnalysis}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-cyan-400" />
              <span>AI Lead Intelligence</span>
            </h3>
            <Badge variant={aiAnalysis.tier === 'HOT' ? 'success' : aiAnalysis.tier === 'WARM' ? 'warning' : 'default'}>
              {aiAnalysis.tier} TIER
            </Badge>
          </div>

          <div class="text-center py-2">
            <div class="text-3xl font-extrabold text-cyan-300">{aiAnalysis.score} / 100</div>
            <p class="text-[11px] text-slate-400 mt-0.5">Calculated Predictive Score</p>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-800">
            <span class="text-[11px] font-semibold text-slate-400 block">Scoring Breakdown:</span>
            {#each aiAnalysis.breakdown as item}
              <div class="flex justify-between items-center text-xs">
                <span class="text-slate-300 truncate max-w-[200px]">{item.factor}</span>
                <span class="font-bold text-emerald-400">+{item.impact}</span>
              </div>
            {/each}
          </div>

          <div class="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
            <span class="font-bold block mb-1">Recommended Action:</span>
            {aiAnalysis.recommendedAction}
          </div>
        </div>
      {/if}

      <!-- Opportunities & Quotations section -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Associated Opportunities -->
        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Target class="w-4 h-4 text-brand-400" />
              <span>Linked Opportunities</span>
            </h3>
            <span class="text-xs text-slate-400">{leadOpportunities.length} total</span>
          </div>

          {#if leadOpportunities.length === 0}
            <p class="text-xs text-slate-500 py-3">No active opportunity created yet for this lead.</p>
          {:else}
            <div class="space-y-3">
              {#each leadOpportunities as opp}
                <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 class="text-xs font-bold text-slate-200">{opp.title}</h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">{opp.requirement}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-xs font-bold text-emerald-400">${opp.expectedValue.toLocaleString()}</div>
                    <span class="text-[10px] text-slate-400">Prob: {opp.probability}% (Weighted: ${opp.weightedRevenue.toLocaleString()})</span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Activity Timeline -->
        <ActivityTimeline activities={leadActivities} />
      </div>
    </div>
  </div>

  <!-- Create Opportunity Modal -->
  <Modal isOpen={showOppModal} title="Convert Lead to Opportunity" on:close={() => (showOppModal = false)}>
    <div class="space-y-4">
      <div>
        <label for="oppTitleInput" class="block text-xs font-medium text-slate-300 mb-1">Opportunity Title *</label>
        <input
          id="oppTitleInput"
          type="text"
          bind:value={oppTitle}
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label for="oppRequirementInput" class="block text-xs font-medium text-slate-300 mb-1">Specific Client Requirement</label>
        <textarea
          id="oppRequirementInput"
          bind:value={oppRequirement}
          rows="2"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="oppExpectedValueInput" class="block text-xs font-medium text-slate-300 mb-1">Expected Contract Value ($)</label>
          <input
            id="oppExpectedValueInput"
            type="number"
            bind:value={oppExpectedValue}
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label for="oppProbabilityInput" class="block text-xs font-medium text-slate-300 mb-1">Win Probability (%)</label>
          <input
            id="oppProbabilityInput"
            type="number"
            min="0"
            max="100"
            bind:value={oppProbability}
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          on:click={() => (showOppModal = false)}
          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          on:click={handleCreateOpportunity}
          class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors"
        >
          Confirm Opportunity
        </button>
      </div>
    </div>
  </Modal>
{/if}
