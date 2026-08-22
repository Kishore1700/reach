<script lang="ts">
  import { leads, createLead } from '$lib/stores/crmStore';
  import type { LeadStatus, LeadSource, Lead } from '$lib/types/crm';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import Modal from '$lib/components/common/Modal.svelte';
  import { Plus, Search, Filter, ArrowRight, UserPlus, Sparkles } from 'lucide-svelte';

  let searchQuery = '';
  let selectedStatus: LeadStatus | 'ALL' = 'ALL';
  let selectedSource: LeadSource | 'ALL' = 'ALL';
  let showCreateModal = false;

  // New Lead Form state
  let newName = '';
  let newCompany = '';
  let newEmail = '';
  let newPhone = '';
  let newSource: LeadSource = 'Website';
  let newMarketingCost = 50;
  let newAssigned = 'Sarah Jenkins';
  let newNotes = '';

  $: filteredLeads = $leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
    const matchSource = selectedSource === 'ALL' || l.source === selectedSource;
    return matchSearch && matchStatus && matchSource;
  });

  function handleCreateLead() {
    if (!newName || !newEmail || !newCompany) return;

    createLead({
      name: newName,
      company: newCompany,
      email: newEmail,
      phone: newPhone || '+1 (555) 000-0000',
      status: 'NEW',
      source: newSource,
      marketingCost: newMarketingCost,
      assignedEmployee: newAssigned,
      notes: newNotes
    });

    showCreateModal = false;
    newName = '';
    newCompany = '';
    newEmail = '';
    newPhone = '';
    newNotes = '';
  }

  function getStatusVariant(status: LeadStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
    switch (status) {
      case 'WON': return 'success';
      case 'LOST': return 'danger';
      case 'NEW': return 'info';
      case 'QUALIFIED': return 'purple';
      case 'QUOTATION': return 'warning';
      default: return 'default';
    }
  }
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Leads Management' }]} />

  <!-- Header Banner -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
    <div>
      <h1 class="text-xl font-bold text-slate-100">Leads Management</h1>
      <p class="text-xs text-slate-400 mt-1">Track lead capture, marketing source attribution, AI score, and qualification stage</p>
    </div>
    <button
      type="button"
      on:click={() => (showCreateModal = true)}
      class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
    >
      <UserPlus class="w-4 h-4" />
      <span>Capture New Lead</span>
    </button>
  </div>

  <!-- Filters & Search Bar -->
  <div class="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
    <div class="relative flex-1 min-w-[240px]">
      <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search lead name, company, email..."
        class="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
      />
    </div>

    <div class="flex items-center gap-3">
      <!-- Status Filter -->
      <select
        bind:value={selectedStatus}
        class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
      >
        <option value="ALL">All Statuses</option>
        <option value="NEW">NEW</option>
        <option value="CONTACTED">CONTACTED</option>
        <option value="QUALIFIED">QUALIFIED</option>
        <option value="REQUIREMENT">REQUIREMENT</option>
        <option value="OPPORTUNITY">OPPORTUNITY</option>
        <option value="QUOTATION">QUOTATION</option>
        <option value="NEGOTIATION">NEGOTIATION</option>
        <option value="WON">WON</option>
        <option value="LOST">LOST</option>
      </select>

      <!-- Source Filter -->
      <select
        bind:value={selectedSource}
        class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
      >
        <option value="ALL">All Sources</option>
        <option value="Website">Website</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="Instagram">Instagram</option>
        <option value="Meta Ads">Meta Ads</option>
        <option value="College Referral">College Referral</option>
        <option value="Student Network">Student Network</option>
        <option value="Direct Inquiry">Direct Inquiry</option>
      </select>
    </div>
  </div>

  <!-- Lead Roster Table -->
  <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
          <tr>
            <th class="p-4">Lead Name / Company</th>
            <th class="p-4">Lifecycle Status</th>
            <th class="p-4">Source Attribution</th>
            <th class="p-4">AI Score</th>
            <th class="p-4">Cost</th>
            <th class="p-4">Assigned To</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          {#if filteredLeads.length === 0}
            <tr>
              <td colspan="7" class="p-8 text-center text-slate-500">
                No matching leads found for current search/filter.
              </td>
            </tr>
          {:else}
            {#each filteredLeads as lead}
              <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="p-4">
                  <div class="font-semibold text-slate-200">{lead.name}</div>
                  <div class="text-[11px] text-slate-400">{lead.company} • {lead.email}</div>
                </td>
                <td class="p-4">
                  <Badge variant={getStatusVariant(lead.status)}>
                    {lead.status}
                  </Badge>
                </td>
                <td class="p-4">
                  <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">{lead.source}</span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-1.5 font-bold text-cyan-300">
                    <Sparkles class="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lead.score}/100</span>
                  </div>
                </td>
                <td class="p-4 text-slate-300">${lead.marketingCost}</td>
                <td class="p-4 text-slate-400">{lead.assignedEmployee}</td>
                <td class="p-4 text-right">
                  <a
                    href="/leads/{lead.id}"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 font-semibold hover:bg-brand-600/30 transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowRight class="w-3 h-3" />
                  </a>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Modal: Capture New Lead -->
<Modal isOpen={showCreateModal} title="Capture New Lead" on:close={() => (showCreateModal = false)}>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label for="leadNewNameInput" class="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
        <input
          id="leadNewNameInput"
          type="text"
          bind:value={newName}
          placeholder="e.g. Jordan Miller"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label for="leadNewCompanyInput" class="block text-xs font-medium text-slate-300 mb-1">Company / Org *</label>
        <input
          id="leadNewCompanyInput"
          type="text"
          bind:value={newCompany}
          placeholder="e.g. Acme Corp"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label for="leadNewEmailInput" class="block text-xs font-medium text-slate-300 mb-1">Corporate Email *</label>
        <input
          id="leadNewEmailInput"
          type="email"
          bind:value={newEmail}
          placeholder="jordan@acme.com"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label for="leadNewPhoneInput" class="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
        <input
          id="leadNewPhoneInput"
          type="text"
          bind:value={newPhone}
          placeholder="+1 (555) 000-0000"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label for="leadNewSourceSelect" class="block text-xs font-medium text-slate-300 mb-1">Lead Source *</label>
        <select
          id="leadNewSourceSelect"
          bind:value={newSource}
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        >
          <option value="Website">Website</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Instagram">Instagram</option>
          <option value="Meta Ads">Meta Ads</option>
          <option value="College Referral">College Referral</option>
          <option value="Student Network">Student Network</option>
          <option value="Friends & Family">Friends & Family</option>
          <option value="Direct Inquiry">Direct Inquiry</option>
        </select>
      </div>

      <div>
        <label for="leadNewMarketingCostInput" class="block text-xs font-medium text-slate-300 mb-1">Marketing Cost ($)</label>
        <input
          id="leadNewMarketingCostInput"
          type="number"
          bind:value={newMarketingCost}
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        />
      </div>
    </div>

    <div>
      <label for="leadNewNotesInput" class="block text-xs font-medium text-slate-300 mb-1">Initial Requirement Notes</label>
      <textarea
        id="leadNewNotesInput"
        bind:value={newNotes}
        rows="3"
        placeholder="Requirements discussed during initial inquiry..."
        class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
      ></textarea>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button
        type="button"
        on:click={() => (showCreateModal = false)}
        class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        on:click={handleCreateLead}
        disabled={!newName || !newEmail || !newCompany}
        class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-50 transition-colors"
      >
        Save & Score Lead
      </button>
    </div>
  </div>
</Modal>
