<script lang="ts">
  import { currentUser, tickets, submitSupportTicket } from '$lib/stores/crmStore';
  import Badge from '$lib/components/common/Badge.svelte';
  import { LifeBuoy, Plus, Send } from 'lucide-svelte';

  $: activeCustId = $currentUser.customerId || 'cust-101';
  $: myTickets = $tickets.filter(t => t.customerId === activeCustId);

  let subject = '';
  let description = '';
  let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';

  function handleCreateTicket() {
    if (!subject.trim() || !description.trim()) return;
    submitSupportTicket({
      customerId: activeCustId,
      subject,
      description,
      priority,
      assignedAgent: 'Marcus Vance'
    });
    subject = '';
    description = '';
  }
</script>

<div class="space-y-6">
  <h2 class="text-lg font-bold text-slate-100">Customer Support Tickets</h2>

  <!-- Create Ticket Form -->
  <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
    <h3 class="text-sm font-semibold text-slate-200">Create Technical / Support Ticket</h3>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="sm:col-span-2">
        <label for="portalTicketSubjectInput" class="block text-xs font-medium text-slate-300 mb-1">Subject / Issue Summary *</label>
        <input
          id="portalTicketSubjectInput"
          type="text"
          bind:value={subject}
          placeholder="e.g. Requesting API webhook schema clarification"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label for="portalTicketPrioritySelect" class="block text-xs font-medium text-slate-300 mb-1">Priority</label>
        <select
          id="portalTicketPrioritySelect"
          bind:value={priority}
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
      </div>
    </div>

    <div>
      <label for="portalTicketDescriptionInput" class="block text-xs font-medium text-slate-300 mb-1">Detailed Description *</label>
      <textarea
        id="portalTicketDescriptionInput"
        bind:value={description}
        rows="3"
        placeholder="Provide exact details of your request or issue..."
        class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
      ></textarea>
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        on:click={handleCreateTicket}
        disabled={!subject.trim() || !description.trim()}
        class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
      >
        <Send class="w-4 h-4" />
        <span>Open Ticket</span>
      </button>
    </div>
  </div>

  <!-- Ticket History -->
  <div class="space-y-3">
    <h3 class="text-sm font-semibold text-slate-200">My Support Tickets</h3>
    {#each myTickets as tkt}
      <div class="glass-card p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-200">{tkt.ticketNumber}</span>
            <Badge variant="purple">{tkt.status}</Badge>
          </div>
          <span class="text-[10px] text-slate-500">{tkt.createdDate}</span>
        </div>
        <h4 class="font-bold text-slate-100">{tkt.subject}</h4>
        <p class="text-slate-400">{tkt.description}</p>
      </div>
    {/each}
  </div>
</div>
