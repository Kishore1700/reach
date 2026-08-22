<script lang="ts">
  import { currentUser, feedbacks, sales, submitFeedback } from '$lib/stores/crmStore';
  import Badge from '$lib/components/common/Badge.svelte';
  import { Star, Send } from 'lucide-svelte';

  $: activeCustId = $currentUser.customerId || 'cust-101';
  $: myFeedbacks = $feedbacks.filter(f => f.customerId === activeCustId);
  $: mySale = $sales.find(s => s.customerId === activeCustId) || $sales[0];

  let rating = 5;
  let serviceQuality: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' = 'EXCELLENT';
  let comment = '';
  let improvementSuggestion = '';

  function handleSubmit() {
    if (!comment.trim()) return;
    submitFeedback({
      saleId: mySale ? mySale.id : 'sle-501',
      customerId: activeCustId,
      rating,
      serviceQuality,
      comment,
      improvementSuggestion
    });
    comment = '';
    improvementSuggestion = '';
  }
</script>

<div class="space-y-6">
  <h2 class="text-lg font-bold text-slate-100">Post-Sale Experience Feedback</h2>

  <!-- Submit Feedback Form -->
  <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
    <h3 class="text-sm font-semibold text-slate-200">Submit Service Feedback</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="feedbackRatingSelect" class="block text-xs font-medium text-slate-300 mb-1">Overall Rating (1 to 5 Stars)</label>
        <select
          id="feedbackRatingSelect"
          bind:value={rating}
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value={5}>5 Stars - Excellent</option>
          <option value={4}>4 Stars - Good</option>
          <option value={3}>3 Stars - Average</option>
          <option value={2}>2 Stars - Needs Improvement</option>
          <option value={1}>1 Star - Poor</option>
        </select>
      </div>

      <div>
        <label for="feedbackServiceQualitySelect" class="block text-xs font-medium text-slate-300 mb-1">Service Quality Tier</label>
        <select
          id="feedbackServiceQualitySelect"
          bind:value={serviceQuality}
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="EXCELLENT">EXCELLENT</option>
          <option value="GOOD">GOOD</option>
          <option value="AVERAGE">AVERAGE</option>
          <option value="POOR">POOR</option>
        </select>
      </div>
    </div>

    <div>
      <label for="feedbackCommentInput" class="block text-xs font-medium text-slate-300 mb-1">Your Comments *</label>
      <textarea
        id="feedbackCommentInput"
        bind:value={comment}
        rows="3"
        placeholder="How was your onboarding experience?"
        class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
      ></textarea>
    </div>

    <div>
      <label for="feedbackSuggestionInput" class="block text-xs font-medium text-slate-300 mb-1">Suggestions for Future Enhancements</label>
      <input
        id="feedbackSuggestionInput"
        type="text"
        bind:value={improvementSuggestion}
        placeholder="Feature request or UI suggestion..."
        class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
      />
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        on:click={handleSubmit}
        disabled={!comment.trim()}
        class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
      >
        <Send class="w-4 h-4" />
        <span>Submit Feedback</span>
      </button>
    </div>
  </div>

  <!-- Past Submissions -->
  <div class="space-y-3">
    <h3 class="text-sm font-semibold text-slate-200">Past Feedback Submissions</h3>
    {#each myFeedbacks as fb}
      <div class="glass-card p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
        <div class="flex justify-between items-center">
          <span class="font-bold text-amber-400 flex items-center gap-1"><Star class="w-3.5 h-3.5 fill-amber-400" /> {fb.rating}/5 ({fb.serviceQuality})</span>
          <span class="text-[10px] text-slate-500">{fb.createdDate}</span>
        </div>
        <p class="text-slate-300">"{fb.comment}"</p>
      </div>
    {/each}
  </div>
</div>
