<script>
  import { createEventDispatcher } from 'svelte';
  import { formatRupiah } from '../api.js';

  export let stats = {
    balance: 500000,
    total_orders: 14,
    total_spent: 1250000,
    total_deposit: 1500000,
  };

  const dispatch = createEventDispatcher();
</script>

<div class="space-y-6">
  <!-- Minimalist System Notice (No cheesy gradient) -->
  <div class="ui-card rounded-xl p-4 flex items-start justify-between border-l-2 border-l-zinc-900 dark:border-l-zinc-100">
    <div class="flex items-start space-x-3">
      <div class="mt-0.5 w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 flex-shrink-0">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Status Server Buzzer & Jaringan Indonesia</span>
          <span class="text-[10px] text-zinc-400 font-mono">22 Nov 2026</span>
        </div>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
          Semua node pemrosesan beroperasi normal. Layanan <strong>SRV-101 (Instagram REAL Indo)</strong> aktif dengan garansi refill 30 hari. Deposit QRIS manual diproses otomatis dalam 1–5 menit dengan bonus promo saldo 5%.
        </p>
      </div>
    </div>
    <span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> Optimal
    </span>
  </div>

  <!-- KPI Metric Grid (Linear / Vercel minimalist card layout) -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
    <!-- Sisa Saldo -->
    <div class="ui-card rounded-xl p-4 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
      <div>
        <div class="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span>Saldo Tersedia</span>
          <svg class="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
        </div>
        <div class="mt-2 text-2xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100">
          {formatRupiah(stats.balance)}
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <span class="text-[11px] text-zinc-400">Siap untuk order</span>
        <button
          type="button"
          class="text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline flex items-center space-x-1"
          on:click={() => dispatch('openDeposit')}
        >
          <span>Top Up</span>
          <span class="text-[10px]">&rarr;</span>
        </button>
      </div>
    </div>

    <!-- Total Pesanan -->
    <div class="ui-card rounded-xl p-4 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
      <div>
        <div class="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span>Total Pesanan</span>
          <svg class="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          </svg>
        </div>
        <div class="mt-2 text-2xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100">
          {stats.total_orders}
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <span class="text-[11px] text-zinc-500 dark:text-zinc-400">100% Selesai</span>
        <button
          type="button"
          class="text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline flex items-center space-x-1"
          on:click={() => dispatch('navigate', 'history')}
        >
          <span>Riwayat</span>
          <span class="text-[10px]">&rarr;</span>
        </button>
      </div>
    </div>

    <!-- Total Pengeluaran -->
    <div class="ui-card rounded-xl p-4 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
      <div>
        <div class="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span>Total Pengeluaran</span>
          <svg class="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="mt-2 text-2xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100">
          {formatRupiah(stats.total_spent)}
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <span class="text-[11px] text-zinc-400">Akumulasi seumur hidup</span>
      </div>
    </div>

    <!-- Total Deposit -->
    <div class="ui-card rounded-xl p-4 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
      <div>
        <div class="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span>Total Deposit</span>
          <svg class="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="mt-2 text-2xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100">
          {formatRupiah(stats.total_deposit)}
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <span class="text-[11px] text-zinc-400">QRIS & Bank Transfer</span>
      </div>
    </div>
  </div>

  <!-- Clean Action Callouts -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
    <button
      type="button"
      class="ui-card rounded-xl p-5 text-left hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between group focus:outline-none"
      on:click={() => dispatch('navigate', 'new-order')}
    >
      <div>
        <div class="text-[10px] font-mono uppercase font-semibold text-zinc-400">Alur Cepat</div>
        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">Pesan Layanan Buzzer & SMM</div>
        <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Instagram, TikTok, YouTube & X</div>
      </div>
      <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-colors">
        <span class="text-sm font-bold">&rarr;</span>
      </div>
    </button>

    <button
      type="button"
      class="ui-card rounded-xl p-5 text-left hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between group focus:outline-none"
      on:click={() => dispatch('openDeposit')}
    >
      <div>
        <div class="text-[10px] font-mono uppercase font-semibold text-emerald-600 dark:text-emerald-400">Pembayaran Instan</div>
        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">Top-Up Saldo QRIS & Mutasi</div>
        <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">BCA, Mandiri, Dana, GoPay (+5%)</div>
      </div>
      <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-colors">
        <span class="text-sm font-bold">&rarr;</span>
      </div>
    </button>

    <button
      type="button"
      class="ui-card rounded-xl p-5 text-left hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between group focus:outline-none"
      on:click={() => dispatch('navigate', 'profile')}
    >
      <div>
        <div class="text-[10px] font-mono uppercase font-semibold text-blue-600 dark:text-blue-400">Akun & Integrasi</div>
        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">Profil & API Key Reseller</div>
        <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Ganti sandi, kontak WA & kunci API</div>
      </div>
      <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-colors">
        <span class="text-sm font-bold">&rarr;</span>
      </div>
    </button>
  </div>
</div>
