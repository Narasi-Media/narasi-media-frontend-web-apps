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
      target: 'https://tiktok.com/@buzzer_viral',
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

  function getStatusBadge(status) {
    switch (status) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'processing':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 animate-pulse';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'partial':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'error':
      case 'canceled':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-gray-400 border-slate-500/20';
    }
  }
</script>

<div class="glass-card rounded-2xl p-6 lg:p-8 space-y-6 transition-colors">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
    <div>
      <h2 class="text-xl font-bold text-slate-900 dark:text-gray-100 flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-500"></span>
        <span>Riwayat Pesanan</span>
      </h2>
      <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Lacak status proses pesanan, jumlah awal, sisa pengiriman, dan klaim garansi refill.</p>
    </div>

    <!-- Search Input -->
    <div class="w-full sm:w-64">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari ID / Link Target..."
        class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all font-mono"
      />
    </div>
  </div>

  <!-- Filter Status Tabs -->
  <div class="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-white/5 pb-3">
    {#each [
      { id: 'all', label: 'Semua Status' },
      { id: 'pending', label: 'Pending' },
      { id: 'processing', label: 'Processing' },
      { id: 'success', label: 'Success' },
      { id: 'partial', label: 'Partial' },
      { id: 'error', label: 'Error' }
    ] as tab}
      <button
        type="button"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all {activeFilter === tab.id ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-600/30 dark:border-indigo-500 dark:text-white shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-gray-800/30 dark:border-white/5 dark:text-gray-400 dark:hover:text-gray-200'}"
        on:click={() => activeFilter = tab.id}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#if refillSuccessId}
    <div class="p-3 rounded-xl bg-indigo-50 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-xs flex items-center space-x-2 animate-bounce">
      <span>🛡️ Permintaan Refill untuk pesanan #{refillSuccessId} telah dikirim ke server provider.</span>
    </div>
  {/if}

  <!-- DataGrid Table -->
  <div class="overflow-x-auto -mx-6 lg:-mx-8">
    <table class="w-full text-left text-xs text-slate-700 dark:text-gray-300 min-w-[750px]">
      <thead class="bg-slate-100 dark:bg-gray-900/80 text-slate-600 dark:text-gray-400 font-semibold border-y border-slate-200 dark:border-white/5 uppercase tracking-wider text-[10px]">
        <tr>
          <th class="py-3 px-4">ID / Waktu</th>
          <th class="py-3 px-4">Layanan</th>
          <th class="py-3 px-4">Target Link</th>
          <th class="py-3 px-4 text-center">Jumlah / Sisa</th>
          <th class="py-3 px-4 text-right">Harga</th>
          <th class="py-3 px-4 text-center">Status</th>
          <th class="py-3 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 dark:divide-white/5">
        {#each filteredOrders as order}
          <tr class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
            <td class="py-3 px-4 font-mono">
              <div class="font-bold text-slate-900 dark:text-gray-200">{order.id}</div>
              <div class="text-[10px] text-slate-400 dark:text-gray-500">{order.created_at}</div>
            </td>
            <td class="py-3 px-4 max-w-xs">
              <span class="font-medium text-slate-800 dark:text-gray-200 truncate block">{order.service_name}</span>
            </td>
            <td class="py-3 px-4 font-mono max-w-[200px] truncate text-indigo-600 dark:text-indigo-400">
              <a href={order.target} target="_blank" rel="noreferrer" class="hover:underline flex items-center space-x-1">
                <span class="truncate">{order.target}</span>
              </a>
            </td>
            <td class="py-3 px-4 text-center font-mono">
              <div class="font-bold text-slate-900 dark:text-gray-100">{order.quantity?.toLocaleString()}</div>
              {#if order.remains > 0}
                <div class="text-[10px] text-orange-500 dark:text-orange-400 font-medium">Sisa: {order.remains}</div>
              {/if}
            </td>
            <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {formatRupiah(order.total_price?.amount || 0)}
            </td>
            <td class="py-3 px-4 text-center">
              <span class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider {getStatusBadge(order.status)}">
                {order.status}
              </span>
            </td>
            <td class="py-3 px-4 text-center">
              {#if order.status === 'success' && order.refill_supported}
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:bg-indigo-600/30 dark:hover:bg-indigo-600 dark:text-indigo-300 dark:hover:text-white dark:border-indigo-500/30 transition-all"
                  on:click={() => handleRefill(order.id)}
                >
                  🛡️ Refill
                </button>
              {:else}
                <span class="text-slate-400 dark:text-gray-600 text-[11px]">-</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
