<script lang="ts">
  import type { Quotation, QuotationItem } from '$lib/types/crm';
  import { saveQuotation } from '$lib/stores/crmStore';
  import { Plus, Trash2, Calculator, CheckCircle2 } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  export let leadId: string;
  export let opportunityId: string;
  export let existingQuotation: Quotation | null = null;

  const dispatch = createEventDispatcher();

  let items: Omit<QuotationItem, 'id' | 'total'>[] = existingQuotation
    ? existingQuotation.items.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice, discount: i.discount }))
    : [{ description: 'Enterprise License Tier', quantity: 10, unitPrice: 500, discount: 500 }];

  let taxRate = existingQuotation ? existingQuotation.taxRate : 18;
  let couponCode = existingQuotation ? existingQuotation.couponCode || '' : 'WELCOME10';
  let terms = existingQuotation ? existingQuotation.terms : 'Payment due within 30 days of invoice date.';
  let validDays = 30;

  // Reactive calculations
  $: subtotal = items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
  $: discountTotal = items.reduce((acc, i) => acc + (i.discount || 0), 0);
  $: taxableAmount = Math.max(0, subtotal - discountTotal);
  $: taxAmount = (taxableAmount * taxRate) / 100;
  $: grandTotal = taxableAmount + taxAmount;

  function addItem() {
    items = [...items, { description: 'Additional Service / Support Pack', quantity: 1, unitPrice: 1000, discount: 0 }];
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    items = items.filter((_, idx) => idx !== index);
  }

  function handleSubmit() {
    const quotationNumber = existingQuotation
      ? `QT-2026-V${existingQuotation.version + 1}`
      : `QT-2026-${Date.now().toString().slice(-4)}`;

    const created = saveQuotation({
      quotationNumber,
      opportunityId,
      leadId,
      version: existingQuotation ? existingQuotation.version + 1 : 1,
      status: 'SENT',
      items: items as QuotationItem[],
      taxRate,
      couponCode,
      createdDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      terms
    });

    dispatch('saved', created);
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between border-b border-slate-800 pb-4">
    <div>
      <h3 class="text-sm font-semibold text-slate-100 flex items-center gap-2">
        <Calculator class="w-4 h-4 text-brand-400" />
        <span>{existingQuotation ? `Create Revised Version (V${existingQuotation.version + 1})` : 'New Quotation Builder'}</span>
      </h3>
      <p class="text-xs text-slate-400">Calculations enforce Subtotal - Discount + Tax = Grand Total</p>
    </div>
  </div>

  <!-- Line Items Table -->
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold text-slate-300">Quotation Line Items</span>
      <button
        type="button"
        on:click={addItem}
        class="px-2.5 py-1 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 text-xs font-semibold hover:bg-brand-600/30 transition-colors flex items-center gap-1"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>Add Line Item</span>
      </button>
    </div>

    <div class="space-y-2">
      {#each items as item, idx}
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div class="sm:col-span-5">
            <label for={`item-desc-${idx}`} class="block text-[10px] text-slate-400 mb-0.5">Description</label>
            <input
              id={`item-desc-${idx}`}
              type="text"
              bind:value={item.description}
              placeholder="Product or service description..."
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div class="sm:col-span-2">
            <label for={`item-qty-${idx}`} class="block text-[10px] text-slate-400 mb-0.5">Qty</label>
            <input
              id={`item-qty-${idx}`}
              type="number"
              min="1"
              bind:value={item.quantity}
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div class="sm:col-span-2">
            <label for={`item-price-${idx}`} class="block text-[10px] text-slate-400 mb-0.5">Unit Price ($)</label>
            <input
              id={`item-price-${idx}`}
              type="number"
              min="0"
              bind:value={item.unitPrice}
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div class="sm:col-span-2">
            <label for={`item-disc-${idx}`} class="block text-[10px] text-slate-400 mb-0.5">Discount ($)</label>
            <input
              id={`item-disc-${idx}`}
              type="number"
              min="0"
              bind:value={item.discount}
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div class="sm:col-span-1 flex justify-end pt-3 sm:pt-0">
            <button
              type="button"
              on:click={() => removeItem(idx)}
              disabled={items.length <= 1}
              class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Coupon & Terms -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
    <div>
      <label for="quotationCouponCode" class="block text-xs font-medium text-slate-300 mb-1">Coupon Code / Special Discount</label>
      <input
        id="quotationCouponCode"
        type="text"
        bind:value={couponCode}
        placeholder="e.g. ENTERPRISE10"
        class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
      />
    </div>

    <div>
      <label for="quotationTaxRate" class="block text-xs font-medium text-slate-300 mb-1">Tax Rate (%)</label>
      <input
        id="quotationTaxRate"
        type="number"
        min="0"
        max="50"
        bind:value={taxRate}
        class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
      />
    </div>
  </div>

  <!-- Financial Calculation Summary Card -->
  <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
    <div class="flex justify-between text-xs text-slate-400">
      <span>Subtotal</span>
      <span>${subtotal.toLocaleString()}</span>
    </div>
    <div class="flex justify-between text-xs text-rose-400">
      <span>Total Discount</span>
      <span>-${discountTotal.toLocaleString()}</span>
    </div>
    <div class="flex justify-between text-xs text-slate-300 font-medium pt-1 border-t border-slate-800">
      <span>Taxable Amount</span>
      <span>${taxableAmount.toLocaleString()}</span>
    </div>
    <div class="flex justify-between text-xs text-slate-400">
      <span>Tax ({taxRate}%)</span>
      <span>+${taxAmount.toLocaleString()}</span>
    </div>
    <div class="flex justify-between text-sm font-bold text-emerald-400 pt-2 border-t border-slate-800">
      <span>Grand Total</span>
      <span>${grandTotal.toLocaleString()}</span>
    </div>
  </div>

  <!-- Actions -->
  <div class="flex justify-end gap-3 pt-2">
    <button
      type="button"
      on:click={handleSubmit}
      class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
    >
      <CheckCircle2 class="w-4 h-4" />
      <span>{existingQuotation ? 'Save Revised Quotation' : 'Generate & Send Quotation'}</span>
    </button>
  </div>
</div>
