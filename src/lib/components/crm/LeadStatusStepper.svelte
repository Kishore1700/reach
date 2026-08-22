<script lang="ts">
  import type { LeadStatus } from '$lib/types/crm';
  import { updateLeadStatus } from '$lib/stores/crmStore';
  import Modal from '$lib/components/common/Modal.svelte';
  import { Check, X, ArrowRight, AlertTriangle } from 'lucide-svelte';

  export let leadId: string;
  export let currentStatus: LeadStatus;

  const leadLifecycle: { status: LeadStatus; label: string }[] = [
    { status: 'NEW', label: 'New' },
    { status: 'CONTACTED', label: 'Contacted' },
    { status: 'QUALIFIED', label: 'Qualified' },
    { status: 'REQUIREMENT', label: 'Requirement' },
    { status: 'OPPORTUNITY', label: 'Opportunity' },
    { status: 'QUOTATION', label: 'Quotation' },
    { status: 'NEGOTIATION', label: 'Negotiation' },
    { status: 'WON', label: 'Won' }
  ];

  let showLostModal = false;
  let lostReasonInput = '';

  const currentIndex = leadLifecycle.findIndex(s => s.status === currentStatus);

  function handleStepClick(targetStatus: LeadStatus) {
    if (targetStatus === currentStatus) return;

    if (targetStatus === 'LOST') {
      showLostModal = true;
      return;
    }

    updateLeadStatus(leadId, targetStatus);
  }

  function confirmMarkLost() {
    if (!lostReasonInput.trim()) return;
    const ok = updateLeadStatus(leadId, 'LOST', lostReasonInput);
    if (ok) {
      showLostModal = false;
      lostReasonInput = '';
    }
  }
</script>

<div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-sm font-semibold text-slate-200">Lead Lifecycle Progress</h3>
      <p class="text-xs text-slate-400">Strict sequential status transitions</p>
    </div>
    {#if currentStatus !== 'WON' && currentStatus !== 'LOST'}
      <button
        type="button"
        on:click={() => (showLostModal = true)}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
      >
        <X class="w-3.5 h-3.5" />
        <span>Mark as LOST</span>
      </button>
    {/if}
  </div>

  {#if currentStatus === 'LOST'}
    <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3">
      <AlertTriangle class="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
      <div>
        <h4 class="text-xs font-semibold text-rose-300">Lead Marked as LOST</h4>
        <p class="text-xs text-rose-200/80 mt-1">Preserved in nurture history. Reason for loss was logged.</p>
      </div>
    </div>
  {:else}
    <!-- Stepper Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {#each leadLifecycle as step, idx}
        {@const isPast = idx < currentIndex || currentStatus === 'WON'}
        {@const isCurrent = step.status === currentStatus}
        <button
          type="button"
          on:click={() => handleStepClick(step.status)}
          disabled={currentStatus === 'WON' || currentStatus === 'LOST'}
          class="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200
            {isCurrent ? 'bg-brand-600/30 border-brand-500 text-brand-300 font-bold shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/50' : ''}
            {isPast ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' : ''}
            {!isCurrent && !isPast ? 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300' : ''}"
        >
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1
            {isCurrent ? 'bg-brand-500 text-white' : ''}
            {isPast ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : ''}
            {!isCurrent && !isPast ? 'bg-slate-800 text-slate-400' : ''}"
          >
            {#if isPast}
              <Check class="w-3.5 h-3.5" />
            {:else}
              {idx + 1}
            {/if}
          </div>
          <span class="text-[11px] leading-tight truncate w-full">{step.label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<!-- Modal for LOST reason -->
<Modal isOpen={showLostModal} title="Mark Lead as LOST" on:close={() => (showLostModal = false)}>
  <div class="space-y-4">
    <p class="text-xs text-slate-300">
      Please specify the mandatory reason for losing this lead. This data helps refine marketing ROI and future sales qualification.
    </p>

    <div>
      <label for="lostReasonInput" class="block text-xs font-medium text-slate-300 mb-1">Reason for Loss *</label>
      <textarea
        id="lostReasonInput"
        bind:value={lostReasonInput}
        rows="3"
        placeholder="e.g. Competitor offered lower pricing, Budget cut, Product mismatch..."
        class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
      ></textarea>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button
        type="button"
        on:click={() => (showLostModal = false)}
        class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        on:click={confirmMarkLost}
        disabled={!lostReasonInput.trim()}
        class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors"
      >
        Confirm Mark Lost
      </button>
    </div>
  </div>
</Modal>
