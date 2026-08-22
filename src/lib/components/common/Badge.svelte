<script lang="ts">
  export let variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'customer' | 'manager' | 'growth' | 'empathy' | 'clarity' = 'default';
  export let size: 'sm' | 'md' = 'md';
</script>

<span
  class="inline-flex items-center gap-1.5 font-semibold rounded-full border transition-all
    {size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}
    {variant === 'growth' || variant === 'success' ? 'bg-growth/10 text-growth border-growth/30' : ''}
    {variant === 'customer' || variant === 'info' ? 'bg-customer/10 text-customer border-customer/30' : ''}
    {variant === 'empathy' || variant === 'purple' ? 'bg-empathy/15 text-empathy border-empathy/30' : ''}
    {variant === 'manager' ? 'bg-manager-light/20 text-blue-300 border-manager-light/40' : ''}
    {variant === 'clarity' ? 'bg-slate-800 text-clarity border-slate-700' : ''}
    {variant === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
    {variant === 'danger' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
    {variant === 'default' ? 'bg-slate-800 text-slate-300 border-slate-700' : ''}"
>
  <slot />
</span>
