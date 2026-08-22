<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import Header from '$lib/components/layout/Header.svelte';
  import Toast from '$lib/components/common/Toast.svelte';
  import { page } from '$app/stores';

  $: isPortal = $page.url.pathname.startsWith('/portal');
</script>

<div class="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans">
  {#if isPortal}
    <!-- Portal has its own isolated layout -->
    <slot />
  {:else}
    <div class="flex h-screen overflow-hidden">
      <!-- Main Sidebar -->
      <Sidebar />

      <!-- Content Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <slot />
        </main>
      </div>
    </div>
  {/if}

  <Toast />
</div>
