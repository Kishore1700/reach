<script lang="ts">
  import { dashboardMetrics, leads, tasks } from '$lib/stores/crmStore';
  import {
    Users, TrendingUp, Sparkles, ArrowRight, Bell, HelpCircle, Download, Calendar
  } from 'lucide-svelte';

  $: m = $dashboardMetrics;
  let timeRange = 'Last 30 Days';
</script>

<div class="space-y-6 max-w-7xl mx-auto">
  <!-- Top Header Section: Title & Controls -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
      <p class="text-xs text-slate-500 mt-1">Real-time marketing intelligence and lead performance.</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs text-slate-700">
        <Calendar class="w-3.5 h-3.5 text-slate-400" />
        <select bind:value={timeRange} class="bg-transparent font-medium focus:outline-none cursor-pointer">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
      <button class="px-4 py-2 rounded-xl bg-[#00DDB3] hover:bg-[#00C49F] text-[#0F172A] text-xs font-bold shadow-md shadow-[#00DDB3]/20 transition-all flex items-center gap-2">
        <Download class="w-3.5 h-3.5" />
        <span>Export Report</span>
      </button>
    </div>
  </div>

  <!-- Metric Cards Grid (4 Top Cards) -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: TOTAL LEADS -->
    <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-400 tracking-wider uppercase">TOTAL LEADS</span>
        <div class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <Users class="w-3.5 h-3.5" />
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-3xl font-black text-slate-900">4,285</span>
        <span class="text-xs font-bold text-[#00DDB3] bg-[#00DDB3]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
          <TrendingUp class="w-3 h-3" /> +12.4%
        </span>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
        <div>Meta: <span class="font-semibold text-slate-700">1,840</span></div>
        <div>LinkedIn: <span class="font-semibold text-slate-700">1,420</span></div>
        <div>Direct: <span class="font-semibold text-slate-700">1,025</span></div>
      </div>
    </div>

    <!-- Card 2: AVG. LEAD SCORE -->
    <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-400 tracking-wider uppercase">AVG. LEAD SCORE</span>
        <span class="text-[10px] font-bold text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles class="w-3 h-3" /> AI Calculated
        </span>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-3xl font-black text-slate-900">78%</span>
        <span class="text-xs font-bold text-[#00DDB3]">↑ 3 pts</span>
      </div>
      <!-- Progress Bar -->
      <div class="mt-5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div class="bg-gradient-to-r from-[#18223B] to-[#00DDB3] h-full rounded-full" style="width: 78%"></div>
      </div>
    </div>

    <!-- Card 3: MARKETING ROI -->
    <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-400 tracking-wider uppercase">MARKETING ROI</span>
        <div class="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-[#00DDB3]">
          <TrendingUp class="w-3.5 h-3.5" />
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-3xl font-black text-slate-900">4.2x</span>
        <span class="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
          ↘ -0.1x
        </span>
      </div>
      <p class="mt-4 text-[11px] text-slate-400">Target: <span class="font-semibold text-slate-700">4.5x for Q3</span></p>
    </div>

    <!-- Card 4: PROJECTED REVENUE -->
    <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-400 tracking-wider uppercase">PROJECTED REVENUE</span>
        <div class="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-[#00DDB3]">
          <span class="font-black text-xs">$</span>
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-3xl font-black text-slate-900">$8.4M</span>
        <span class="text-xs font-bold text-[#00DDB3] bg-[#00DDB3]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
          <TrendingUp class="w-3 h-3" /> +18%
        </span>
      </div>
      <p class="mt-4 text-[11px] text-slate-400">Based on current active pipeline</p>
    </div>
  </div>

  <!-- Main Grid: Charts and Performance -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left 2 Cols: Lead Acquisition Bar Chart -->
    <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900">Lead Acquisition vs. Conversion</h2>
          <p class="text-xs text-slate-400">Comparing top sources over 7 days</p>
        </div>
        <div class="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[#18223B]"></span>
            <span>Acquired</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[#00DDB3]"></span>
            <span>Converted</span>
          </div>
        </div>
      </div>

      <!-- Bar Chart Mockup matching screenshot -->
      <div class="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
        <!-- Mon -->
        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div class="w-full flex items-end justify-center gap-1.5 h-48">
            <div class="w-1/2 bg-[#18223B] rounded-t-sm" style="height: 45%"></div>
            <div class="w-1/2 bg-[#00DDB3] rounded-t-sm" style="height: 15%"></div>
          </div>
          <span class="text-[11px] font-medium text-slate-400">Mon</span>
        </div>

        <!-- Tue -->
        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div class="w-full flex items-end justify-center gap-1.5 h-48">
            <div class="w-1/2 bg-[#18223B] rounded-t-sm" style="height: 60%"></div>
            <div class="w-1/2 bg-[#00DDB3] rounded-t-sm" style="height: 25%"></div>
          </div>
          <span class="text-[11px] font-medium text-slate-400">Tue</span>
        </div>

        <!-- Wed -->
        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div class="w-full flex items-end justify-center gap-1.5 h-48">
            <div class="w-1/2 bg-[#18223B] rounded-t-sm" style="height: 35%"></div>
            <div class="w-1/2 bg-[#00DDB3] rounded-t-sm" style="height: 12%"></div>
          </div>
          <span class="text-[11px] font-medium text-slate-400">Wed</span>
        </div>

        <!-- Thu -->
        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div class="w-full flex items-end justify-center gap-1.5 h-48">
            <div class="w-1/2 bg-[#18223B] rounded-t-sm" style="height: 85%"></div>
            <div class="w-1/2 bg-[#00DDB3] rounded-t-sm" style="height: 35%"></div>
          </div>
          <span class="text-[11px] font-medium text-slate-400">Thu</span>
        </div>

        <!-- Fri -->
        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div class="w-full flex items-end justify-center gap-1.5 h-48">
            <div class="w-1/2 bg-[#18223B] rounded-t-sm" style="height: 55%"></div>
            <div class="w-1/2 bg-[#00DDB3] rounded-t-sm" style="height: 22%"></div>
          </div>
          <span class="text-[11px] font-medium text-slate-400">Fri</span>
        </div>

        <!-- Sat -->
        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div class="w-full flex items-end justify-center gap-1.5 h-48">
            <div class="w-1/2 bg-[#18223B] rounded-t-sm" style="height: 40%"></div>
            <div class="w-1/2 bg-[#00DDB3] rounded-t-sm" style="height: 18%"></div>
          </div>
          <span class="text-[11px] font-medium text-slate-400">Sat</span>
        </div>

        <!-- Sun -->
        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div class="w-full flex items-end justify-center gap-1.5 h-48">
            <div class="w-1/2 bg-[#18223B] rounded-t-sm" style="height: 30%"></div>
            <div class="w-1/2 bg-[#00DDB3] rounded-t-sm" style="height: 10%"></div>
          </div>
          <span class="text-[11px] font-medium text-slate-400">Sun</span>
        </div>
      </div>
    </div>

    <!-- Right 1 Col: Channel Performance Doughnut Mock -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
      <div>
        <h2 class="text-base font-bold text-slate-900">Channel Performance</h2>
        <p class="text-xs text-slate-400">Distribution of high-scoring leads (&gt;80)</p>
      </div>

      <!-- Doughnut Ring Center -->
      <div class="relative flex items-center justify-center py-4">
        <div class="w-40 h-40 rounded-full border-[14px] border-[#18223B] border-t-[#00DDB3] border-r-[#00DDB3] flex flex-col items-center justify-center">
          <span class="text-2xl font-black text-slate-900">1,245</span>
          <span class="text-[10px] font-medium text-slate-400">Total Qualified</span>
        </div>
      </div>

      <div class="space-y-2.5 pt-2 text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#18223B]"></span>
            <span class="text-slate-700 font-medium">LinkedIn</span>
          </div>
          <span class="font-bold text-slate-900">40%</span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#00DDB3]"></span>
            <span class="text-slate-700 font-medium">Meta Ads</span>
          </div>
          <span class="font-bold text-slate-900">45%</span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#6366F1]"></span>
            <span class="text-slate-700 font-medium">Direct Organic</span>
          </div>
          <span class="font-bold text-slate-900">15%</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Section: High Probability Leads & Dark Predictive Optimizer Card -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left 2 Cols: Recent High-Probability Leads Table -->
    <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-slate-900">Recent High-Probability Leads</h2>
        <a href="/leads" class="text-xs font-semibold text-slate-500 hover:text-slate-800">View All</a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th class="pb-3">LEAD NAME</th>
              <th class="pb-3">SOURCE</th>
              <th class="pb-3 text-center">AI SCORE</th>
              <th class="pb-3">STATUS</th>
              <th class="pb-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td class="py-3.5 font-bold text-slate-900">Acme Corp Enterprise</td>
              <td class="py-3.5 text-slate-500">LinkedIn Sponsored</td>
              <td class="py-3.5 text-center">
                <span class="inline-block px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-bold text-[11px]">94</span>
              </td>
              <td class="py-3.5">
                <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-[#00C49F] font-bold text-[11px]">Meeting Set</span>
              </td>
              <td class="py-3.5 text-right">
                <button class="text-slate-400 hover:text-slate-700">•••</button>
              </td>
            </tr>
            <tr>
              <td class="py-3.5 font-bold text-slate-900">Globex Technologies</td>
              <td class="py-3.5 text-slate-500">Meta Lead Gen</td>
              <td class="py-3.5 text-center">
                <span class="inline-block px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-bold text-[11px]">88</span>
              </td>
              <td class="py-3.5">
                <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">Reviewing</span>
              </td>
              <td class="py-3.5 text-right">
                <button class="text-slate-400 hover:text-slate-700">•••</button>
              </td>
            </tr>
            <tr>
              <td class="py-3.5 font-bold text-slate-900">Stark Industries</td>
              <td class="py-3.5 text-slate-500">Direct Website</td>
              <td class="py-3.5 text-center">
                <span class="inline-block px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-bold text-[11px]">85</span>
              </td>
              <td class="py-3.5">
                <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-[#00C49F] font-bold text-[11px]">Meeting Set</span>
              </td>
              <td class="py-3.5 text-right">
                <button class="text-slate-400 hover:text-slate-700">•••</button>
              </td>
            </tr>
            <tr>
              <td class="py-3.5 font-bold text-slate-900">Wayne Enterprises</td>
              <td class="py-3.5 text-slate-500">LinkedIn Organic</td>
              <td class="py-3.5 text-center">
                <span class="inline-block px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-bold text-[11px]">82</span>
              </td>
              <td class="py-3.5">
                <span class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 font-bold text-[11px]">Follow Up</span>
              </td>
              <td class="py-3.5 text-right">
                <button class="text-slate-400 hover:text-slate-700">•••</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Right 1 Col: Dark Navy Predictive Budget Optimizer Card (Matching Screenshot Bottom Right) -->
    <div class="bg-[#18223B] text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
      <!-- Background subtle grid pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent pointer-events-none"></div>

      <div class="space-y-4 relative z-10">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-[#00DDB3]">
          <Sparkles class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-lg font-bold tracking-tight">Predictive Budget Optimizer</h3>
          <p class="text-xs text-slate-300 mt-2 leading-relaxed">
            Shift <span class="font-bold text-white">15% budget</span> from Meta to LinkedIn for Q4.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#131B30] border border-slate-700/60 flex items-center justify-between text-xs">
          <span class="text-slate-400">Expected Impact</span>
          <span class="font-extrabold text-[#00DDB3] text-sm">+20% ROAS</span>
        </div>
      </div>

      <div class="space-y-3 relative z-10">
        <button class="w-full py-3 rounded-xl bg-[#00DDB3] hover:bg-[#00C49F] text-[#0F172A] font-bold text-xs shadow-lg shadow-[#00DDB3]/20 flex items-center justify-center gap-2 transition-all">
          <span>Apply Recommendation</span>
          <ArrowRight class="w-4 h-4" />
        </button>
        <button class="w-full text-center text-[11px] text-slate-400 hover:text-white transition-colors">
          View detailed analysis
        </button>
      </div>
    </div>
  </div>
</div>

