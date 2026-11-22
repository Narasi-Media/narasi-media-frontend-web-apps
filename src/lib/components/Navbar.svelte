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

<header class="sticky top-0 z-40 glass-header px-4 lg:px-8 py-3.5 transition-colors duration-200">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <!-- Brand Logo Button -->
    <button
      type="button"
      class="flex items-center space-x-3 text-left group focus:outline-none"
      on:click={() => selectTab('dashboard')}
    >
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Buzzer<span class="text-indigo-600 dark:text-indigo-400">Media</span>
          </span>
          <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse mr-1"></span> v2.0
          </span>
        </div>
        <p class="text-[11px] text-slate-500 dark:text-gray-400 font-medium">SMM & Buzzer Network</p>
      </div>
    </button>

    <!-- Navigation Tabs -->
    <nav class="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-gray-900/60 p-1.5 rounded-xl border border-slate-200 dark:border-white/5 transition-colors">
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}"
        on:click={() => selectTab('dashboard')}
      >
        Dashboard
      </button>
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'new-order' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}"
        on:click={() => selectTab('new-order')}
      >
        Pesan Baru
      </button>
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'mass-order' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}"
        on:click={() => selectTab('mass-order')}
      >
        Pesanan Masal
      </button>
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}"
        on:click={() => selectTab('history')}
      >
        Riwayat
      </button>
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'services' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}"
        on:click={() => selectTab('services')}
      >
        Daftar Layanan
      </button>
    </nav>

    <!-- Right Controls: Theme Switcher, Balance, Profile -->
    <div class="flex items-center space-x-2.5 sm:space-x-3">
      <!-- Theme Switcher Button (Dark <-> Light / White Mode) -->
      <button
        type="button"
        class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-900/80 dark:hover:bg-gray-800 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center shadow-sm"
        title={isDark ? 'Beralih ke White Mode (Terang)' : 'Beralih ke Dark Mode (Gelap)'}
        on:click={toggleTheme}
      >
        {#if isDark}
          <!-- Sun Icon (Active Dark -> Switch to Light) -->
          <svg class="w-4 h-4 text-amber-400 transform rotate-0 hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        {:else}
          <!-- Moon Icon (Active Light -> Switch to Dark) -->
          <svg class="w-4 h-4 text-indigo-600 transform rotate-0 hover:-rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        {/if}
      </button>

      <!-- Balance Pill -->
      <div class="flex items-center bg-slate-100 dark:bg-gray-900/80 border border-slate-200 dark:border-white/10 rounded-xl p-1.5 pl-3 space-x-2 transition-colors">
        <div class="text-right">
          <div class="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Sisa Saldo</div>
          <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">{formatRupiah(balance)}</div>
        </div>
        <button
          type="button"
          class="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          title="Deposit / Top Up Saldo QRIS"
          on:click={() => dispatch('openDeposit')}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- User Profile Badge -->
      <div class="hidden sm:flex items-center space-x-2.5 bg-slate-100 dark:bg-gray-800/50 border border-slate-200 dark:border-white/5 py-1 px-2.5 rounded-xl transition-colors">
        <div class="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
          {username.slice(0, 2)}
        </div>
        <div class="text-left">
          <div class="text-xs font-bold text-slate-800 dark:text-gray-200">@{username}</div>
          <div class="text-[10px] text-slate-500 dark:text-gray-400 font-medium">VIP Member</div>
        </div>
      </div>
    </div>
  </div>
</header>
