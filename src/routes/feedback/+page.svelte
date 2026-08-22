<script lang="ts">
  import { feedbacks, customers, serviceOrders } from '$lib/stores/crmStore';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { Star, MessageSquare, ShieldCheck, User } from 'lucide-svelte';
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'Post-Sale Feedback' }]} />

  <!-- Customer Sky Blue (#0EA5E9) Feedback Header Panel -->
  <div class="panel-customer p-6 rounded-2xl flex items-center justify-between shadow-lg">
    <div>
      <div class="flex items-center gap-2">
        <MessageSquare class="w-5 h-5 text-customer" />
        <h1 class="text-xl font-bold text-clarity">Customer Service & Fulfillment Feedback</h1>
      </div>
      <p class="text-xs text-customer-light mt-1">Tracks Table 17 (`feedback`): `feedback_id`, `customer_id`, `service_order_id`, `rating`, `comments`, and `submitted_at`</p>
    </div>
    <Badge variant="customer">Customer Experience</Badge>
  </div>

  <!-- Feedback Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each $feedbacks as fb}
      {@const cust = $customers.find(c => c.customer_id === fb.customer_id || c.id === fb.customerId)}
      {@const order = $serviceOrders.find(s => s.service_order_id === fb.service_order_id)}
      <div class="card-empathy p-5 rounded-2xl space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1 font-bold text-amber-400">
            <Star class="w-4 h-4 fill-amber-400" />
            <span>{fb.rating} / 5 Rating</span>
          </div>
          <Badge variant="growth">SO-#{fb.service_order_id}</Badge>
        </div>

        <div class="chat-bubble-customer p-3.5 rounded-xl text-xs font-medium">
          "{fb.comments || fb.comment}"
        </div>

        {#if fb.improvementSuggestion}
          <div class="p-3 rounded-xl bg-manager-dark/80 border border-customer/25 text-xs">
            <span class="text-[10px] font-bold text-customer block mb-0.5">Improvement Suggestion:</span>
            <p class="text-slate-300">{fb.improvementSuggestion}</p>
          </div>
        {/if}

        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-empathy/20">
          <span class="flex items-center gap-1">
            <User class="w-3 h-3 text-customer" />
            <strong class="text-clarity">{cust ? cust.name : 'Client'}</strong>
          </span>
          <span class="font-mono text-empathy-light">{fb.submitted_at ? fb.submitted_at.slice(0, 10) : fb.createdDate}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
