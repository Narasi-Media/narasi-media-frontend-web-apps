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
    }
  ];

  let activeFilter = 'all';
  let searchQuery = '';
  let refillSuccessId = null;

  $: filteredOrders = orders.filter(o => {
    const matchesFilter = activeFilter === 'all' || o.status === activeFilter;
    const matchesSearch = o.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.service_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        {#each filteredOrders as order}
          <tr class="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors">
            <td class="py-3 px-4 font-mono">
              <div class="font-medium text-zinc-900 dark:text-zinc-100">{order.id}</div>
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
      </tbody>
    </table>
  </div>
</div>
