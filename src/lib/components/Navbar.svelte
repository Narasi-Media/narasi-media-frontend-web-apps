<script>
  import { createEventDispatcher } from 'svelte';
  import { formatRupiah } from '../api.js';

  export let activeTab = 'dashboard';
  export let balance = 250000;
  export let username = 'regiami';

  const dispatch = createEventDispatcher();

  function selectTab(tab) {
    activeTab = tab;
    dispatch('tabChange', tab);
  }
</script>

<header class="sticky top-0 z-40 glass-header px-4 lg:px-8 py-3.5 transition-all">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <!-- Brand Logo -->
    <div class="flex items-center space-x-3 cursor-pointer" on:click={() => selectTab('dashboard')}>
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Buzzer<span class="text-indigo-400">Media</span>
          </span>
          <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span> v2.0
          </span>
        </div>
        <p class="text-[11px] text-gray-400 font-medium">SMM & Buzzer Network</p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="hidden md:flex items-center space-x-1 bg-gray-900/60 p-1.5 rounded-xl border border-white/5">
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-gray-400 hover:text-gray-200'}"
        on:click={() => selectTab('dashboard')}
      >
        Dashboard
      </button>
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'new-order' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-gray-400 hover:text-gray-200'}"
        on:click={() => selectTab('new-order')}
      >
        Pesan Baru
      </button>
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'mass-order' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-gray-400 hover:text-gray-200'}"
        on:click={() => selectTab('mass-order')}
      >
        Pesanan Masal
      </button>
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-gray-400 hover:text-gray-200'}"
        on:click={() => selectTab('history')}
      >
        Riwayat
      </button>
      <button
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all {activeTab === 'services' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-gray-400 hover:text-gray-200'}"
        on:click={() => selectTab('services')}
      >
        Daftar Layanan
      </button>
    </nav>

    <!-- User & Balance Info -->
    <div class="flex items-center space-x-3">
      <!-- Balance Pill -->
      <div class="flex items-center bg-gray-900/80 border border-white/10 rounded-xl p-1.5 pl-3 space-x-2">
        <div class="text-right">
          <div class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Sisa Saldo</div>
          <div class="text-sm font-bold text-emerald-400 font-mono tracking-tight">{formatRupiah(balance)}</div>
        </div>
        <button
          class="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          title="Deposit / Top Up Saldo"
          on:click={() => dispatch('openDeposit')}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- User Profile Badge -->
      <div class="hidden sm:flex items-center space-x-2.5 bg-gray-800/50 border border-white/5 py-1 px-2.5 rounded-xl">
        <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
          {username.slice(0, 2)}
        </div>
        <div class="text-left">
          <div class="text-xs font-bold text-gray-200">@{username}</div>
          <div class="text-[10px] text-gray-400 font-medium">VIP Member</div>
        </div>
      </div>
    </div>
  </div>
</header>
