<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { formatRupiah } from '../api.js';

  export let activeTab = 'dashboard';
  export let balance = 250000;
  export let username = 'regiami';

  const dispatch = createEventDispatcher();

  let isDark = true;

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  function selectTab(tab) {
    activeTab = tab;
    dispatch('tabChange', tab);
  }
</script>

<header class="sticky top-0 z-40 ui-header px-4 lg:px-8 py-3 transition-colors duration-150">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <!-- Brand Logo Button (Linear style) -->
    <button
      type="button"
      class="flex items-center space-x-3 text-left focus:outline-none group"
      on:click={() => selectTab('dashboard')}
    >
      <div class="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs tracking-wider shadow-sm transition-transform group-hover:scale-105">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          buzzer<span class="text-zinc-400 dark:text-zinc-500">.media</span>
        </span>
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
          v2.0
        </span>
      </div>
    </button>

    <!-- Navigation Segmented Tabs (shadcn/ui style) -->
    <nav class="hidden md:flex items-center space-x-0.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
      <button
        type="button"
        class="px-3 py-1.5 rounded-md transition-all {activeTab === 'company' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/60 dark:border-zinc-700/50 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
        on:click={() => selectTab('company')}
      >
        Company Profile
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md transition-all {activeTab === 'dashboard' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/60 dark:border-zinc-700/50 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
        on:click={() => selectTab('dashboard')}
      >
        Dashboard
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md transition-all {activeTab === 'new-order' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/60 dark:border-zinc-700/50 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
        on:click={() => selectTab('new-order')}
      >
        Pesan Baru
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md transition-all {activeTab === 'mass-order' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/60 dark:border-zinc-700/50 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
        on:click={() => selectTab('mass-order')}
      >
        Pesanan Masal
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md transition-all {activeTab === 'history' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/60 dark:border-zinc-700/50 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
        on:click={() => selectTab('history')}
      >
        Riwayat
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md transition-all {activeTab === 'services' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/60 dark:border-zinc-700/50 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
        on:click={() => selectTab('services')}
      >
        Katalog
      </button>
    </nav>

    <!-- Right Controls: Balance, Top-up, Theme Switcher, Profile -->
    <div class="flex items-center space-x-2 sm:space-x-2.5">
      <!-- Balance & Quick Deposit (Minimalist & Dense) -->
      <div class="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 pl-2.5 space-x-2">
        <div class="text-right">
          <div class="text-[9px] uppercase tracking-wider font-semibold text-zinc-400">Saldo</div>
          <div class="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">{formatRupiah(balance)}</div>
        </div>
        <button
          type="button"
          class="h-7 px-2 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium transition-all flex items-center space-x-1"
          title="Deposit QRIS"
          on:click={() => dispatch('openDeposit')}
        >
          <span class="text-xs font-bold leading-none">+</span>
          <span class="hidden sm:inline text-[11px] font-semibold">Top Up</span>
        </button>
      </div>

      <!-- Theme Switcher (Clean Minimalist Icon) -->
      <button
        type="button"
        class="h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 transition-all flex items-center justify-center focus:outline-none"
        title={isDark ? 'White Mode' : 'Dark Mode'}
        on:click={toggleTheme}
      >
        {#if isDark}
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        {:else}
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        {/if}
      </button>

      <!-- User Account Indicator -->
      <div class="hidden sm:flex items-center space-x-2 pl-1 border-l border-zinc-200 dark:border-zinc-800">
        <div class="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] font-bold flex items-center justify-center border border-zinc-300 dark:border-zinc-700 uppercase" title={`@${username}`}>
          {username.slice(0, 2)}
        </div>
      </div>
    </div>
  </div>
</header>
