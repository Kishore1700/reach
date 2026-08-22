<script lang="ts">
  import { leads, opportunities, customers } from '$lib/stores/crmStore';
  import { aiService } from '$lib/services/aiService';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
  import Badge from '$lib/components/common/Badge.svelte';
  import { Sparkles, TrendingUp, AlertTriangle, Target } from 'lucide-svelte';
</script>

<div class="space-y-6">
  <Breadcrumb items={[{ label: 'AI Lead Scoring & Insights' }]} />

  <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-100 flex items-center gap-2">
        <Sparkles class="w-5 h-5 text-cyan-400" />
        <span>AI Lead Scoring & Predictive Analytics</span>
      </h1>
      <p class="text-xs text-slate-400 mt-1">Evaluates lead source, engagement speed, domain validity, and predicted conversion probability</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each $leads as lead}
      {@const aiRes = aiService.calculateLeadScore(lead)}
      <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <Badge variant={aiRes.tier === 'HOT' ? 'success' : aiRes.tier === 'WARM' ? 'warning' : 'default'}>
            {aiRes.tier} TIER
          </Badge>
          <span class="text-lg font-extrabold text-cyan-300">{aiRes.score} / 100</span>
        </div>

        <div>
          <h3 class="text-sm font-bold text-slate-100">{lead.name}</h3>
          <p class="text-xs text-slate-400">{lead.company} • {lead.source}</p>
        </div>

        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
          <span class="text-[10px] font-bold text-slate-400 block">Recommended Next Action:</span>
          <p class="text-slate-300 font-medium">{aiRes.recommendedAction}</p>
        </div>
      </div>
    {/each}
  </div>
</div>
