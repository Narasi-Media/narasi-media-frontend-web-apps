<script>
  import { formatRupiah } from '../api.js';

  export const userId = 'regiami';

  let orders = [
    {
      id: 'ORD-984120',
      created_at: '2026-11-22 07:45:10',
      service_name: 'Instagram Followers REAL Indonesia [Maks 50K]',
      target: 'https://instagram.com/regi_digital',
      quantity: 1000,
      start_count: 1250,
      remains: 0,
      total_price: { amount: 15500 },
      status: 'success',
      refill_supported: true
    },
    {
      id: 'ORD-984119',
      created_at: '2026-11-22 07:12:05',
      service_name: 'TikTok Followers Organik HQ [Garansi 30 Hari]',
      target: 'https://tiktok.com/@narasi_viral',
      quantity: 500,
      start_count: 320,
      remains: 120,
      total_price: { amount: 11000 },
      status: 'processing',
      refill_supported: true
    },
    {
      id: 'ORD-984102',
      created_at: '2026-11-21 21:30:15',
      service_name: 'Instagram Likes Super Instant [Maks 100K]',
      target: 'https://instagram.com/p/DB12345',
      quantity: 2000,
      start_count: 50,
      remains: 0,
      total_price: { amount: 9000 },
      status: 'success',
      refill_supported: false
    },
    {
      id: 'ORD-984088',
      created_at: '2026-11-21 14:10:44',
      service_name: 'YouTube Subscribers Non-Drop',
      target: 'https://youtube.com/c/TeknoID',
      quantity: 100,
      start_count: 850,
      remains: 40,
      total_price: { amount: 9500 },
      status: 'partial',
      refill_supported: true
    },
    {
      id: 'ORD-984075',
      created_at: '2026-11-20 18:22:11',
      service_name: 'Twitter / X Retweet & Likes Viral Pack',
      target: 'https://x.com/narasi/status/1234567',
      quantity: 500,
      start_count: 120,
      remains: 0,
      total_price: { amount: 18000 },
      status: 'success',
      refill_supported: true
    },
    {
      id: 'ORD-984061',
      created_at: '2026-11-20 11:05:30',
      service_name: 'TikTok Video Shares Real Indo',
      target: 'https://tiktok.com/@bisnis_kuliner',
      quantity: 1000,
      start_count: 45,
      remains: 0,
      total_price: { amount: 7500 },
      status: 'success',
      refill_supported: false
    },
    {
      id: 'ORD-984050',
      created_at: '2026-11-19 22:40:19',
      service_name: 'Instagram Story Views High Quality',
      target: 'https://instagram.com/regi_digital',
      quantity: 2500,
      start_count: 10,
      remains: 0,
      total_price: { amount: 5000 },
      status: 'success',
      refill_supported: false
    },
    {
      id: 'ORD-984033',
      created_at: '2026-11-19 16:15:02',
      service_name: 'Shopee Live Stream Spectators 30 Menit',
      target: 'https://live.shopee.co.id/share?from=live',
      quantity: 200,
      start_count: 5,
      remains: 0,
      total_price: { amount: 22000 },
      status: 'success',
      refill_supported: true
    },
    {
      id: 'ORD-984012',
      created_at: '2026-11-18 09:12:45',
      service_name: 'YouTube Watch Hours Monetisasi HQ',
      target: 'https://youtube.com/watch?v=sample123',
      quantity: 500,
      start_count: 1200,
      remains: 0,
      total_price: { amount: 45000 },
      status: 'success',
      refill_supported: true
    }
  ];

  let activeFilter = 'all';
  let searchQuery = '';
  let refillSuccessId = null;

  // Pagination State
  let currentPage = 1;
  let pageSize = 5;

  $: filteredOrders = orders.filter(o => {
    const matchesFilter = activeFilter === 'all' || o.status === activeFilter;
    const matchesSearch = o.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.service_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  $: totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  $: if (currentPage > totalPages) currentPage = totalPages;
  $: if (activeFilter || searchQuery) {
    // Reset to page 1 on filter or search
  }

  function handleFilterChange(filter) {
    activeFilter = filter;
    currentPage = 1;
  }

  function handleSearchChange() {
    currentPage = 1;
  }

  $: paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function goToPage(p) {
    if (p >= 1 && p <= totalPages) {
      currentPage = p;
    }
  }

  function handleRefill(orderId) {
    refillSuccessId = orderId;
    setTimeout(() => {
      refillSuccessId = null;
    }, 4000);
  }

  function getStatusDot(status) {
    switch (status) {
      case 'success':
        return 'bg-emerald-500';
      case 'processing':
        return 'bg-blue-500 animate-pulse';
      case 'pending':
        return 'bg-amber-500';
      case 'partial':
        return 'bg-orange-500';
      case 'error':
      case 'canceled':
        return 'bg-rose-500';
      default:
        return 'bg-zinc-400';
    }
  }
</script>

<div class="ui-card rounded-xl p-6 lg:p-8 space-y-5">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
    <div>
      <div class="flex items-center space-x-2">
        <span class="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
        <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Riwayat Transaksi & Garansi
        </h2>
      </div>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Status pengiriman pesanan, progress count, dan klaim garansi refill.</p>
    </div>

    <!-- Search Input (shadcn style) -->
    <div class="w-full sm:w-60">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Filter ID / link target..."
        class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 font-mono"
      />
    </div>
  </div>

  <!-- Filter Status Segmented Buttons -->
  <div class="flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-800 pb-3 text-xs">
    {#each [
      { id: 'all', label: 'Semua' },
      { id: 'pending', label: 'Pending' },
      { id: 'processing', label: 'Processing' },
      { id: 'success', label: 'Success' },
      { id: 'partial', label: 'Partial' },
      { id: 'error', label: 'Error' }
    ] as tab}
      <button
        type="button"
        class="px-2.5 py-1 rounded-md text-xs font-medium transition-all {activeFilter === tab.id ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}"
        on:click={() => activeFilter = tab.id}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#if refillSuccessId}
    <div class="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 flex items-center space-x-2">
      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      <span>Permintaan Refill untuk pesanan #{refillSuccessId} telah diteruskan ke server provider.</span>
    </div>
  {/if}

  <!-- DataGrid Table -->
  <div class="overflow-x-auto -mx-6 lg:-mx-8">
    <table class="w-full text-left text-xs text-zinc-600 dark:text-zinc-300 min-w-[750px]">
      <thead class="bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 font-medium border-y border-zinc-200 dark:border-zinc-800 text-[11px]">
        <tr>
          <th class="py-2.5 px-4">ID & Waktu</th>
          <th class="py-2.5 px-4">Layanan</th>
          <th class="py-2.5 px-4">Target Link</th>
          <th class="py-2.5 px-4 text-center">Jumlah / Sisa</th>
          <th class="py-2.5 px-4 text-right">Biaya</th>
          <th class="py-2.5 px-4 text-center">Status</th>
          <th class="py-2.5 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800/80">
        {#if paginatedOrders.length === 0}
          <tr>
            <td colspan="7" class="py-8 text-center text-zinc-400 dark:text-zinc-500 text-xs">
              Tidak ada data transaksi yang ditemukan.
            </td>
          </tr>
        {:else}
          {#each paginatedOrders as order}
            <tr class="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors">
              <td class="py-3 px-4 font-mono">
                <div class="font-medium text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                  <span>{order.id}</span>
                  {#if order.id.startsWith('DEMO') || order.is_demo}
                    <span class="px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                      DEMO
                    </span>
                  {/if}
                </div>
                <div class="text-[10px] text-zinc-400">{order.created_at}</div>
              </td>
              <td class="py-3 px-4 max-w-xs">
                <span class="font-medium text-zinc-900 dark:text-zinc-200 truncate block">{order.service_name}</span>
              </td>
              <td class="py-3 px-4 font-mono max-w-[200px] truncate">
                <a href={order.target} target="_blank" rel="noreferrer" class="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline">
                  <span class="truncate">{order.target}</span>
                </a>
              </td>
              <td class="py-3 px-4 text-center font-mono">
                <div class="font-semibold text-zinc-900 dark:text-zinc-100">{order.quantity?.toLocaleString()}</div>
                {#if order.remains > 0}
                  <div class="text-[10px] text-zinc-400 font-normal">Sisa: {order.remains}</div>
                {/if}
              </td>
              <td class="py-3 px-4 text-right font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                {formatRupiah(order.total_price?.amount || 0)}
              </td>
              <td class="py-3 px-4 text-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 {getStatusDot(order.status)}"></span>
                  <span class="capitalize">{order.status}</span>
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                {#if order.status === 'success' && order.refill_supported}
                  <button
                    type="button"
                    class="h-6 px-2.5 rounded text-[11px] font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all"
                    on:click={() => handleRefill(order.id)}
                  >
                    Refill
                  </button>
                {:else}
                  <span class="text-zinc-400 text-xs">-</span>
                {/if}
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  <!-- Modern Pagination Bar -->
  {#if filteredOrders.length > 0}
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs">
      <div class="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 text-[11px]">
        <span>Menampilkan <strong class="text-zinc-800 dark:text-zinc-200 font-mono">{(currentPage - 1) * pageSize + 1}</strong> - <strong class="text-zinc-800 dark:text-zinc-200 font-mono">{Math.min(currentPage * pageSize, filteredOrders.length)}</strong> dari <strong class="text-zinc-800 dark:text-zinc-200 font-mono">{filteredOrders.length}</strong> transaksi</span>
        
        <span class="text-zinc-300 dark:text-zinc-700">•</span>

        <div class="flex items-center space-x-1">
          <span>Baris:</span>
          <select
            bind:value={pageSize}
            on:change={() => currentPage = 1}
            class="px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div class="flex items-center space-x-1">
        <button
          type="button"
          disabled={currentPage === 1}
          on:click={() => goToPage(currentPage - 1)}
          class="px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          ‹ Sebelumnya
        </button>

        {#each Array(totalPages) as _, idx}
          {@const p = idx + 1}
          <button
            type="button"
            on:click={() => goToPage(p)}
            class="w-7 h-7 rounded-md text-xs font-mono font-medium transition-all {currentPage === p ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
          >
            {p}
          </button>
        {/each}

        <button
          type="button"
          disabled={currentPage === totalPages}
          on:click={() => goToPage(currentPage + 1)}
          class="px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Selanjutnya ›
        </button>
      </div>
    </div>
  {/if}
</div>
