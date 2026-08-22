<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores/crmStore';
  import {
    LayoutDashboard, Users, Megaphone, HelpCircle,
    Target, FileText, CheckSquare, DollarSign, Wallet,
    Sparkles, ShieldCheck, BarChart3, Workflow, MessageSquare,
    LifeBuoy, Settings, Compass, Layers
  } from 'lucide-svelte';

  $: role = $currentUser.role;

  interface NavItem {
    label: string;
    href: string;
    icon: any;
    roles?: string[];
  }

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Leads Management', href: '/leads', icon: Users, roles: ['ADMIN', 'SALES', 'MARKETING'] },
    { label: 'Lead Funnel Board', href: '/funnel', icon: Layers, roles: ['ADMIN', 'SALES'] },
    { label: 'Inquiries', href: '/inquiries', icon: HelpCircle, roles: ['ADMIN', 'SALES', 'SUPPORT'] },
    { label: 'Opportunities', href: '/opportunities', icon: Target, roles: ['ADMIN', 'SALES'] },
    { label: 'Quotations', href: '/quotations', icon: FileText, roles: ['ADMIN', 'SALES', 'FINANCE'] },
    { label: 'Customers', href: '/customers', icon: Compass, roles: ['ADMIN', 'SALES', 'SUPPORT', 'FINANCE'] },
    { label: 'Invoices', href: '/invoices', icon: DollarSign, roles: ['ADMIN', 'FINANCE', 'SALES'] },
    { label: 'Payments', href: '/payments', icon: Wallet, roles: ['ADMIN', 'FINANCE'] },
    { label: 'Service Orders', href: '/service-orders', icon: ShieldCheck, roles: ['ADMIN', 'SUPPORT', 'FINANCE', 'SALES'] },
    { label: 'Follow-ups & Tasks', href: '/follow-ups', icon: CheckSquare, roles: ['ADMIN', 'SALES', 'SUPPORT'] },
    { label: 'Campaigns & ROI', href: '/campaigns', icon: Megaphone, roles: ['ADMIN', 'MARKETING'] },
    { label: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['ADMIN', 'MARKETING', 'SALES', 'FINANCE'] },
    { label: 'Post-Sale Feedback', href: '/feedback', icon: MessageSquare, roles: ['ADMIN', 'SUPPORT', 'SALES'] },
    { label: 'Support Tickets', href: '/tickets', icon: LifeBuoy, roles: ['ADMIN', 'SUPPORT'] },
    { label: 'Workflow Engine', href: '/workflows', icon: Workflow, roles: ['ADMIN'] },
    { label: 'AI Lead Scoring', href: '/ai-insights', icon: Sparkles, roles: ['ADMIN', 'SALES', 'MARKETING'] },
    { label: 'Settings & Audit', href: '/settings', icon: Settings, roles: ['ADMIN'] }
  ];

  $: filteredNav = navItems.filter(item => !item.roles || item.roles.includes(role));
</script>

<aside class="w-64 bg-[#18223B] border-r border-slate-800/60 flex flex-col h-screen sticky top-0 z-30 shadow-xl">
  <!-- Brand Header -->
  <div class="h-16 border-b border-slate-800/60 flex items-center justify-between px-6 bg-[#131B30]">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-[#00DDB3] flex items-center justify-center font-extrabold text-[#0F172A] shadow-md">
        SR
      </div>
      <div>
        <h1 class="font-bold text-white text-base tracking-tight leading-none">SymphoReach</h1>
        <span class="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Marketing Intelligence</span>
      </div>
    </div>
  </div>

  <!-- Role Banner Badge -->
  <div class="px-4 py-2.5 bg-[#131B30]/50 border-b border-slate-800/40 flex items-center gap-2">
    <ShieldCheck class="w-3.5 h-3.5 text-[#00DDB3] shrink-0" />
    <div class="text-xs">
      <span class="text-slate-400">Current Role: </span>
      <span class="font-semibold text-[#00DDB3]">{role}</span>
    </div>
  </div>

  <!-- Navigation Items -->
  <nav class="flex-1 overflow-y-auto p-3 space-y-1">
    {#each filteredNav as item}
      {@const isActive = $page.url.pathname === item.href || ($page.url.pathname.startsWith(item.href) && item.href !== '/dashboard')}
      <a
        href={item.href}
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group
          {isActive 
            ? 'bg-[#00DDB3] text-[#0F172A] font-bold shadow-md shadow-[#00DDB3]/20' 
            : 'text-slate-300 hover:bg-white/5 hover:text-white'}"
      >
        <svelte:component 
          this={item.icon} 
          class="w-4 h-4 transition-colors {isActive ? 'text-[#0F172A]' : 'text-slate-400 group-hover:text-slate-200'}" 
        />
        <span>{item.label}</span>
      </a>
    {/each}

    {#if role === 'CUSTOMER' || role === 'ADMIN'}
      <div class="pt-3 mt-3 border-t border-slate-800/60">
        <span class="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Client Self-Service</span>
        <a
          href="/portal"
          class="mt-2 flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#00DDB3] hover:bg-[#00DDB3]/10 border border-[#00DDB3]/30 transition-all"
        >
          <Compass class="w-4 h-4" />
          <span>Customer Portal</span>
        </a>
      </div>
    {/if}
  </nav>

  <!-- User Profile Footer -->
  <div class="p-4 border-t border-slate-800/60 bg-[#131B30] flex items-center gap-3">
    <img src={$currentUser.avatar} alt={$currentUser.name} class="w-8 h-8 rounded-full object-cover border border-slate-700" />
    <div class="min-w-0 flex-1">
      <p class="text-xs font-semibold text-white truncate">{$currentUser.name}</p>
      <p class="text-[10px] text-slate-400 truncate">{$currentUser.email}</p>
    </div>
  </div>
</aside>
