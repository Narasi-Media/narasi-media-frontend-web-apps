<script>
  import { createEventDispatcher } from 'svelte';
  import { formatRupiah } from '../api.js';

  export let stats = {
    balance: 250000,
    total_orders: 14,
    total_spent: 1250000,
    total_deposit: 1500000,
  };

  const dispatch = createEventDispatcher();
</script>

<div class="space-y-6">
  <!-- Announcement Banner -->
  <div class="relative overflow-hidden glass-card rounded-2xl p-5 border-l-4 border-l-indigo-600 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 dark:from-indigo-950/40 dark:via-gray-900/60 dark:to-gray-900/40 transition-colors">
    <div class="flex items-start space-x-4">
      <div class="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>
      <div class="flex-1">
        <div class="flex items-center space-x-2">
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Pemberitahuan Sistem</span>
          <span class="text-xs text-slate-500 dark:text-gray-500">• 22 November 2026</span>
        </div>
        <h3 class="text-sm font-bold text-slate-900 dark:text-gray-200 mt-0.5">Update Server Buzzer Indonesia & Instagram Garansi</h3>
        <p class="text-xs text-slate-600 dark:text-gray-400 mt-1 leading-relaxed">
          Server <strong>SRV-101 (Instagram Followers REAL Indo)</strong> beroperasi pada kecepatan optimal (1.000 - 5.000/hari). Fitur garansi tombol Refill 30 hari aktif otomatis. Top-up deposit via <strong>QRIS Manual</strong> aktif 24 jam dengan bonus promo saldo 5%.
        </p>
      </div>
    </div>
  </div>

  <!-- KPI Cards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Saldo Aktif -->
    <div class="glass-card rounded-2xl p-5 hover:border-indigo-500/40 transition-all group">
      <div class="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-semibold">
        <span>Sisa Saldo</span>
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div class="mt-2 flex items-baseline justify-between">
        <span class="text-xl lg:text-2xl font-bold text-slate-900 dark:text-gray-100 font-mono tracking-tight">{formatRupiah(stats.balance)}</span>
      </div>
      <div class="mt-3">
        <button
          type="button"
          class="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center space-x-1"
          on:click={() => dispatch('openDeposit')}
        >
          <span>+ Top Up Saldo</span>
        </button>
      </div>
    </div>

    <!-- Total Pesanan -->
    <div class="glass-card rounded-2xl p-5 hover:border-indigo-500/40 transition-all group">
      <div class="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-semibold">
        <span>Total Pesanan</span>
        <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      </div>
      <div class="mt-2">
        <span class="text-xl lg:text-2xl font-bold text-slate-900 dark:text-gray-100 font-mono">{stats.total_orders}</span>
        <span class="text-xs text-slate-500 dark:text-gray-400 ml-1">transaksi</span>
      </div>
      <div class="mt-3 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 space-x-1 font-medium">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>100% Pesanan Terverifikasi</span>
      </div>
    </div>

    <!-- Total Pengeluaran -->
    <div class="glass-card rounded-2xl p-5 hover:border-indigo-500/40 transition-all group">
      <div class="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-semibold">
        <span>Total Pengeluaran</span>
        <div class="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      <div class="mt-2">
        <span class="text-xl lg:text-2xl font-bold text-slate-900 dark:text-gray-100 font-mono tracking-tight">{formatRupiah(stats.total_spent)}</span>
      </div>
      <div class="mt-3 text-[11px] text-slate-500 dark:text-gray-400">
        Akumulasi belanja seumur hidup
      </div>
    </div>

    <!-- Total Deposit -->
    <div class="glass-card rounded-2xl p-5 hover:border-indigo-500/40 transition-all group">
      <div class="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-semibold">
        <span>Total Deposit Masuk</span>
        <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </div>
      <div class="mt-2">
        <span class="text-xl lg:text-2xl font-bold text-slate-900 dark:text-gray-100 font-mono tracking-tight">{formatRupiah(stats.total_deposit)}</span>
      </div>
      <div class="mt-3 text-[11px] text-slate-500 dark:text-gray-400">
        QRIS & Virtual Account
      </div>
    </div>
  </div>

  <!-- Quick Action Buttons -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <button
      type="button"
      class="glass-card rounded-2xl p-6 text-left cursor-pointer hover:border-indigo-500/60 transition-all relative overflow-hidden group focus:outline-none"
      on:click={() => dispatch('navigate', 'new-order')}
    >
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Aksi Cepat</span>
          <h4 class="text-lg font-bold text-slate-900 dark:text-gray-100 mt-1">Buat Pesanan Baru</h4>
          <p class="text-xs text-slate-600 dark:text-gray-400 mt-1">Pilih ribuan layanan Instagram, TikTok, YouTube & Twitter</p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </button>

    <button
      type="button"
      class="glass-card rounded-2xl p-6 text-left cursor-pointer hover:border-emerald-500/60 transition-all relative overflow-hidden group focus:outline-none"
      on:click={() => dispatch('openDeposit')}
    >
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Metode QRIS & VA</span>
          <h4 class="text-lg font-bold text-slate-900 dark:text-gray-100 mt-1">Top-Up Saldo Instan</h4>
          <p class="text-xs text-slate-600 dark:text-gray-400 mt-1">Deposit otomatis atau manual QRIS tanpa potongan biaya admin</p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    </button>
  </div>
</div>
