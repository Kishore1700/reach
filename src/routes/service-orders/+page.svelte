<script lang="ts">
  import { serviceOrders, customers, invoices, updateServiceOrderStatus } from '$lib/stores/crmStore';
  import type { ServiceOrder } from '$lib/types/crm';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { ShieldCheck, CheckCircle2, Clock, PlayCircle, PauseCircle, AlertCircle, FileText, User } from 'lucide-svelte';

  function getStatusVariant(status: ServiceOrder['service_status']): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'INITIATED': return 'purple';
      case 'ON_HOLD': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  }

  function handleStatusChange(orderId: number, e: Event) {
    const target = e.target as HTMLSelectElement;
    updateServiceOrderStatus(orderId, target.value as ServiceOrder['service_status']);
  }
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Service Orders & Fulfillment' }]} />

  <!-- Header Banner -->
  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <div class="flex items-center gap-2">
        <ShieldCheck class="w-5 h-5 text-growth" />
        <h1 class="text-xl font-bold text-slate-100">Service Orders & Post-Purchase Fulfillment</h1>
      </div>
      <p class="text-xs text-slate-400 mt-1">Tracks Table 16 (`service_orders`): Start Date, Completion Date, Service Status, and Remarks</p>
    </div>
  </div>

  <!-- Orders Grid / Table -->
  <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
          <tr>
            <th class="p-4">Service Order #</th>
            <th class="p-4">Customer</th>
            <th class="p-4">Linked Invoice</th>
            <th class="p-4">Start Date</th>
            <th class="p-4">Completion Date</th>
            <th class="p-4">Fulfillment Status</th>
            <th class="p-4">Remarks</th>
            <th class="p-4 text-right">Update Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          {#each $serviceOrders as order}
            {@const cust = $customers.find(c => c.customer_id === order.customer_id || c.id === `cust-${order.customer_id}`)}
            {@const inv = $invoices.find(i => i.invoice_id === order.invoice_id || i.id === `inv-${order.invoice_id}`)}
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="p-4 font-bold text-slate-200 font-mono">SO-#{order.service_order_id}</td>
              <td class="p-4">
                <div class="font-semibold text-slate-200 flex items-center gap-1.5">
                  <User class="w-3.5 h-3.5 text-customer" />
                  <span>{cust ? cust.name : order.customerName || 'Client'}</span>
                </div>
                <div class="text-[11px] text-slate-400">{cust ? cust.company : ''}</div>
              </td>
              <td class="p-4">
                <div class="font-mono text-emerald-400 flex items-center gap-1">
                  <FileText class="w-3.5 h-3.5 text-slate-400" />
                  <span>{inv ? inv.invoiceNumber : order.invoiceNumber || 'INV-REF'}</span>
                </div>
              </td>
              <td class="p-4 text-slate-300">{order.start_date}</td>
              <td class="p-4 text-slate-300">{order.completion_date || 'In Progress'}</td>
              <td class="p-4">
                <Badge variant={getStatusVariant(order.service_status)}>
                  {order.service_status}
                </Badge>
              </td>
              <td class="p-4 text-slate-300 max-w-xs truncate">{order.remarks || 'No remarks added'}</td>
              <td class="p-4 text-right">
                <select
                  value={order.service_status}
                  on:change={(e) => handleStatusChange(order.service_order_id, e)}
                  class="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-growth"
                >
                  <option value="INITIATED">INITIATED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ON_HOLD">ON_HOLD</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
