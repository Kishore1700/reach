<script lang="ts">
  import { auditLogs, currentUser } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { Shield, Settings, History, Lock } from 'lucide-svelte';
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Settings & Audit Log' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100">System Settings & Audit Log</h1>
      <p class="text-xs text-slate-400 mt-1">Tracks change history (actor, old value, new value, timestamp) for sensitive lifecycle events</p>
    </div>
  </div>

  <!-- Role Permissions Grid -->
  <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
    <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
      <Shield class="w-4 h-4 text-cyan-400" />
      <span>Role-Based Access Control (RBAC) Matrix</span>
    </h3>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
        <span class="font-bold text-cyan-300 block mb-1">ADMIN</span>
        <span class="text-[10px] text-slate-400">Full System Access</span>
      </div>
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
        <span class="font-bold text-emerald-300 block mb-1">SALES</span>
        <span class="text-[10px] text-slate-400">Leads & Quotations</span>
      </div>
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
        <span class="font-bold text-purple-300 block mb-1">MARKETING</span>
        <span class="text-[10px] text-slate-400">Campaigns & ROI</span>
      </div>
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
        <span class="font-bold text-amber-300 block mb-1">FINANCE</span>
        <span class="text-[10px] text-slate-400">Invoices & Payments</span>
      </div>
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
        <span class="font-bold text-blue-300 block mb-1">SUPPORT</span>
        <span class="text-[10px] text-slate-400">Tickets & Feedback</span>
      </div>
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
        <span class="font-bold text-rose-300 block mb-1">CUSTOMER</span>
        <span class="text-[10px] text-slate-400">Isolated Portal Only</span>
      </div>
    </div>
  </div>

  <!-- Audit Logs Table -->
  <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
    <div class="p-4 border-b border-slate-800 bg-slate-950/40 font-semibold text-xs text-slate-200 flex items-center gap-2">
      <History class="w-4 h-4 text-brand-400" />
      <span>System Audit Trail</span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase">
          <tr>
            <th class="p-4">Timestamp</th>
            <th class="p-4">Actor</th>
            <th class="p-4">Action</th>
            <th class="p-4">Entity</th>
            <th class="p-4">Field Changes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          {#each $auditLogs as log}
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="p-4 font-mono text-slate-400">{log.timestamp}</td>
              <td class="p-4 font-semibold text-slate-200">{log.actor}</td>
              <td class="p-4"><Badge variant="info">{log.action}</Badge></td>
              <td class="p-4 text-slate-300">{log.entity} ({log.entityId})</td>
              <td class="p-4 text-slate-400">
                {#each log.changes as chg}
                  <span class="block text-[11px]">
                    <strong class="text-slate-300">{chg.field}:</strong>
                    <span class="line-through text-rose-400">{chg.oldValue ?? 'null'}</span>
                    <span class="text-emerald-400 font-bold"> → {chg.newValue}</span>
                  </span>
                {/each}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
