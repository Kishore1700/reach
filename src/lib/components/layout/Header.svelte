<script lang="ts">
  import { currentUser, users, setRole } from '$lib/stores/crmStore';
  import type { UserRole } from '$lib/types/crm';
  import { Search, Bell, UserCheck, Shield } from 'lucide-svelte';

  let searchQuery = '';
  const roles: UserRole[] = ['ADMIN', 'SALES', 'MARKETING', 'FINANCE', 'SUPPORT', 'CUSTOMER'];

  function handleRoleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    setRole(target.value as UserRole);
  }
</script>

<header class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
  <!-- Search input -->
  <div class="relative w-72">
    <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search leads, quotations, invoices..."
      class="w-full bg-slate-100 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-400"
    />
  </div>

  <!-- Right Controls: Role Switcher & Notifications -->
  <div class="flex items-center gap-4">
    <!-- Role Switcher -->
    <div class="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 shadow-inner">
      <Shield class="w-3.5 h-3.5 text-emerald-500" />
      <span class="text-xs text-slate-600 font-medium">Switch Role:</span>
      <select
        value={$currentUser.role}
        on:change={handleRoleChange}
        class="bg-transparent text-xs font-semibold text-emerald-600 focus:outline-none cursor-pointer"
      >
        {#each roles as r}
          <option value={r} class="bg-white text-slate-800">{r}</option>
        {/each}
      </select>
    </div>

    <!-- Notification Button -->
    <button
      type="button"
      class="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
      title="Notifications"
    >
      <Bell class="w-4 h-4" />
      <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse"></span>
    </button>

    <!-- User Badge -->
    <div class="flex items-center gap-2.5 pl-3 border-l border-slate-200">
      <div class="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
        {$currentUser.name.slice(0, 2).toUpperCase()}
      </div>
      <div class="hidden sm:block text-left">
        <p class="text-xs font-medium text-slate-800 leading-none">{$currentUser.name}</p>
        <span class="text-[10px] text-emerald-600 font-medium">{$currentUser.role}</span>
      </div>
    </div>
  </div>
</header>
