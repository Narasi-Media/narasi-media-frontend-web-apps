<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { formatRupiah } from '../api.js';

  export let activeTab = 'company';
  export let balance = 500000;
  export let username = 'regiami';
  export let isDemo = true;
  export let isLoggedIn = false;

  const dispatch = createEventDispatcher();

  let isDark = false;

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

<header class="sticky top-0 z-40 ui-header px-4 lg:px-8 py-2.5 transition-colors duration-150 backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800">
  <div class="max-w-7xl mx-auto">
    <!-- MODE 1: PUBLIC COMPANY PROFILE HEADER -->
    {#if activeTab === 'company'}
      <div class="flex items-center justify-between">
        <!-- Brand & Corporate Legal Entity Identity -->
        <div class="flex items-center space-x-3">
          <button
            type="button"
            class="flex items-center space-x-2.5 text-left focus:outline-none group"
            on:click={() => selectTab('company')}
          >
            <div class="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs tracking-wider shadow-sm transition-transform group-hover:scale-105">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div>
              <div class="flex items-center space-x-1.5">
                <span class="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  narasi<span class="text-zinc-400 dark:text-zinc-500">.media</span>
                </span>
              </div>
              <div class="text-[10px] text-zinc-400 hidden sm:block">
                PT Narasi Media Solusindo &bull; Kominfo PSE
              </div>
            </div>
          </button>
        </div>

        <!-- Corporate Landing Navigation Anchor Links -->
        <nav class="hidden lg:flex items-center space-x-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <a
            href="#tentang-pt"
            class="px-2.5 py-1.5 rounded-md hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all"
          >
            Profil PT
          </a>
          <a
            href="#legalitas-resmi"
            class="px-2.5 py-1.5 rounded-md hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all"
          >
            Legalitas & Visi
          </a>
          <a
            href="#interactive-simulator"
            class="px-2.5 py-1.5 rounded-md hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all"
          >
            Simulasi Viral
          </a>
          <a
            href="#pricing-table"
            class="px-2.5 py-1.5 rounded-md hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all"
          >
            Katalog Publik
          </a>
          <a
            href="#kontak-kantor"
            class="px-2.5 py-1.5 rounded-md hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all"
          >
            Kantor & CS
          </a>
        </nav>

        <!-- Right Side: Theme Switcher & Primary Action (Enter Web App) -->
        <div class="flex items-center space-x-2.5">
          <!-- Theme Switcher -->
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

          <!-- Direct Entry Button to Web App / Dashboard or Login -->
          {#if isLoggedIn}
            <button
              type="button"
              on:click={() => selectTab('dashboard')}
              class="h-8 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 focus:outline-none"
            >
              <span>Buka Dashboard</span>
              <span>&rarr;</span>
            </button>
          {:else}
            <button
              type="button"
              on:click={() => dispatch('openLogin')}
              class="h-8 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 focus:outline-none"
            >
              <span>Masuk Akun</span>
              <span>&rarr;</span>
            </button>
          {/if}
        </div>
      </div>

    <!-- MODE 2: USER WEB APP & DASHBOARD WORKSPACE HEADER -->
    {:else}
      <div class="flex items-center justify-between">
        <!-- Brand Logo + Quick Return to Company Profile -->
        <div class="flex items-center space-x-3">
          <button
            type="button"
            class="flex items-center space-x-2 text-left focus:outline-none group"
            on:click={() => selectTab('dashboard')}
          >
            <div class="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs tracking-wider shadow-sm transition-transform group-hover:scale-105">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                narasi<span class="text-zinc-400 dark:text-zinc-500">.media</span>
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
                Aplikasi
              </span>
            </div>
          </button>

          <!-- Back to Company Profile Pill Button -->
          <button
            type="button"
            on:click={() => selectTab('company')}
            class="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800 transition-all"
            title="Kembali ke Halaman Profil Perusahaan PT"
          >
            <span>🌐</span>
            <span>Profil Perusahaan PT</span>
          </button>
        </div>

        <!-- Application Operational Tabs (No Company Profile mixed here!) -->
        <nav class="hidden md:flex items-center space-x-0.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
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
            Katalog Layanan
          </button>
        </nav>

        <!-- Right Controls: Balance, Top-up, Theme Switcher, User Account Profile -->
        <div class="flex items-center space-x-2 sm:space-x-2.5">
          <!-- Balance & Quick Deposit -->
          <div class="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 pl-2.5 space-x-2 shadow-2xs">
            <div class="text-right">
              <div class="text-[9px] uppercase tracking-wider font-semibold text-zinc-400 flex items-center justify-end space-x-1">
                <span>{isDemo ? 'Saldo Demo' : 'Saldo'}</span>
                {#if isDemo}
                  <span class="text-[8px] font-mono px-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30">
                    SIMULASI
                  </span>
                {/if}
              </div>
              <div class="text-xs font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100">{formatRupiah(balance)}</div>
            </div>
            <button
              type="button"
              class="h-7 px-2 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium transition-all flex items-center space-x-1"
              title="Deposit Saldo QRIS"
              on:click={() => dispatch('openDeposit')}
            >
              <span class="text-xs font-bold leading-none">+</span>
              <span class="hidden sm:inline text-[11px] font-semibold">Top Up</span>
            </button>
          </div>

          <!-- Theme Switcher -->
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

          <!-- User Account Shortcut Button + Demo Pill -->
          <button
            type="button"
            on:click={() => selectTab('profile')}
            class="flex items-center space-x-1.5 pl-2 border-l border-zinc-200 dark:border-zinc-800 group focus:outline-none {activeTab === 'profile' ? 'opacity-100' : 'opacity-90 hover:opacity-100'}"
            title="Buka Profil Akun Pengguna"
          >
            <div class="w-7 h-7 rounded-full text-zinc-700 dark:text-zinc-300 font-mono text-[11px] font-bold flex items-center justify-center border transition-all {activeTab === 'profile' ? 'ring-2 ring-zinc-900 dark:ring-zinc-100 border-transparent bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-500'} uppercase">
              {username.slice(0, 2)}
            </div>
            <div class="text-left hidden xl:block">
              <div class="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight flex items-center space-x-1">
                <span>@{username}</span>
                {#if isDemo}
                  <span class="text-[9px] font-mono px-1 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30">
                    DEMO
                  </span>
                {/if}
                {#if activeTab === 'profile'}
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {/if}
              </div>
              <div class="text-[9px] text-zinc-400 font-mono">{isDemo ? 'Akun Simulasi' : 'Profil Saya'}</div>
            </div>
          </button>

          <!-- Login / Switch Account Button -->
          <button
            type="button"
            on:click={() => dispatch('openLogin')}
            class="px-2 py-1 rounded-md text-[10px] font-mono font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors"
            title="Ganti akun pengguna"
          >
            Ganti Akun
          </button>

          <!-- Logout Button -->
          <button
            type="button"
            on:click={() => dispatch('logout')}
            class="px-2 py-1 rounded-md text-[10px] font-mono font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30 transition-colors"
            title="Keluar dari sesi akun"
          >
            Keluar
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Secondary Bar for Web App -->
      <div class="flex md:hidden overflow-x-auto space-x-1 pt-2 pb-0.5 text-xs font-medium no-scrollbar border-t border-zinc-200/60 dark:border-zinc-800/60 mt-2">
        <button
          type="button"
          class="px-2 py-1 rounded text-[11px] whitespace-nowrap bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
          on:click={() => selectTab('company')}
        >
          🌐 Profil PT
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-md whitespace-nowrap transition-all {activeTab === 'dashboard' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold' : 'text-zinc-600 dark:text-zinc-400'}"
          on:click={() => selectTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-md whitespace-nowrap transition-all {activeTab === 'new-order' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold' : 'text-zinc-600 dark:text-zinc-400'}"
          on:click={() => selectTab('new-order')}
        >
          Pesan
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-md whitespace-nowrap transition-all {activeTab === 'mass-order' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold' : 'text-zinc-600 dark:text-zinc-400'}"
          on:click={() => selectTab('mass-order')}
        >
          Masal
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-md whitespace-nowrap transition-all {activeTab === 'history' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold' : 'text-zinc-600 dark:text-zinc-400'}"
          on:click={() => selectTab('history')}
        >
          Riwayat
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-md whitespace-nowrap transition-all {activeTab === 'services' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold' : 'text-zinc-600 dark:text-zinc-400'}"
          on:click={() => selectTab('services')}
        >
          Katalog
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-md whitespace-nowrap transition-all {activeTab === 'profile' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold' : 'text-zinc-600 dark:text-zinc-400'}"
          on:click={() => selectTab('profile')}
        >
          Profil Saya
        </button>
      </div>
    {/if}
  </div>
</header>
