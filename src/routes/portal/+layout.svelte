<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser, customers } from '$lib/stores/crmStore';
  import { Compass, FileText, DollarSign, Wallet, Star, LifeBuoy, ArrowLeft, Shield } from 'lucide-svelte';

  $: activeCustId = $currentUser.customerId || 'cust-101';
  $: customer = $customers.find(c => c.id === activeCustId) || $customers[0];

  const portalNav = [
    { label: 'Overview', href: '/portal', icon: Compass },
    { label: 'My Quotations', href: '/portal/quotations', icon: FileText },
    { label: 'Invoices', href: '/portal/invoices', icon: DollarSign },
    { label: 'Payment Log', href: '/portal/payments', icon: Wallet },
    { label: 'Feedback', href: '/portal/feedback', icon: Star },
    { label: 'Support Tickets', href: '/portal/tickets', icon: LifeBuoy }
  ];
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
  <!-- Portal Header Banner -->
  <header class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow">
        CP
      </div>
      <div>
        <h1 class="font-bold text-slate-100 text-sm">Customer Self-Service Portal</h1>
        <span class="text-xs text-emerald-400 font-medium">Logged in as {customer ? customer.name : 'Client'}</span>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <a
        href="/dashboard"
        class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Return to Internal CRM</span>
      </a>
    </div>
  </header>

  <!-- Portal Sub-Nav -->
  <div class="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2 flex items-center gap-2 overflow-x-auto">
    {#each portalNav as nav}
      {@const isActive = $page.url.pathname === nav.href}
      <a
        href={nav.href}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all
          {isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'}"
      >
        <svelte:component this={nav.icon} class="w-3.5 h-3.5" />
        <span>{nav.label}</span>
      </a>
    {/each}
  </div>

  <main class="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
    <slot />
  </main>
</div>
