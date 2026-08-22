<script lang="ts">
  import type { Invoice, Payment } from '$lib/types/crm';
  import { recordPayment } from '$lib/stores/crmStore';
  import Modal from '$lib/components/common/Modal.svelte';
  import { DollarSign, Wallet, CheckCircle } from 'lucide-svelte';

  export let isOpen = false;
  export let invoice: Invoice | null = null;

  let amount = invoice ? invoice.outstandingAmount : 0;
  let method: Payment['method'] = 'BANK_TRANSFER';
  let referenceNumber = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  let notes = '';

  $: if (invoice) {
    amount = invoice.outstandingAmount;
  }

  function handleRecordPayment() {
    if (!invoice) return;
    const ok = recordPayment(invoice.id, amount, method, referenceNumber, notes);
    if (ok) {
      isOpen = false;
    }
  }
</script>

<Modal {isOpen} title="Record Invoice Payment" on:close={() => (isOpen = false)}>
  {#if invoice}
    <div class="space-y-4">
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span class="text-slate-400">Invoice: </span>
          <span class="font-bold text-slate-200">{invoice.invoiceNumber}</span>
        </div>
        <div>
          <span class="text-slate-400">Outstanding: </span>
          <span class="font-bold text-emerald-400">${invoice.outstandingAmount.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <label for="paymentAmountInput" class="block text-xs font-medium text-slate-300 mb-1">Payment Amount ($) *</label>
        <input
          id="paymentAmountInput"
          type="number"
          min="1"
          max={invoice.outstandingAmount}
          bind:value={amount}
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        />
        <p class="text-[10px] text-slate-500 mt-1">Cannot exceed outstanding balance of ${invoice.outstandingAmount.toLocaleString()}</p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="paymentMethodSelect" class="block text-xs font-medium text-slate-300 mb-1">Payment Method</label>
          <select
            id="paymentMethodSelect"
            bind:value={method}
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="BANK_TRANSFER">Bank Transfer (ACH/Wire)</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="UPI">UPI / Digital Wallet</option>
            <option value="CHECK">Check</option>
          </select>
        </div>

        <div>
          <label for="paymentRefInput" class="block text-xs font-medium text-slate-300 mb-1">Transaction Ref #</label>
          <input
            id="paymentRefInput"
            type="text"
            bind:value={referenceNumber}
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div>
        <label for="paymentNotesInput" class="block text-xs font-medium text-slate-300 mb-1">Notes / Internal Reference</label>
        <input
          id="paymentNotesInput"
          type="text"
          bind:value={notes}
          placeholder="e.g. Received via Chase Corporate wire"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          on:click={() => (isOpen = false)}
          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          on:click={handleRecordPayment}
          disabled={amount <= 0 || amount > invoice.outstandingAmount}
          class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors flex items-center gap-1.5"
        >
          <CheckCircle class="w-4 h-4" />
          <span>Confirm Payment</span>
        </button>
      </div>
    </div>
  {/if}
</Modal>
