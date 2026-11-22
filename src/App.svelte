<script>
  import { onMount } from 'svelte';
  import Navbar from './lib/components/Navbar.svelte';
  import DashboardStats from './lib/components/DashboardStats.svelte';
  import NewOrderForm from './lib/components/NewOrderForm.svelte';
  import MassOrderForm from './lib/components/MassOrderForm.svelte';
  import OrderHistoryTable from './lib/components/OrderHistoryTable.svelte';
  import DepositModal from './lib/components/DepositModal.svelte';
  import { fetchDashboard, fetchServices, formatRupiah } from './lib/api.js';

  let activeTab = 'dashboard';
  let isDepositModalOpen = false;
  let stats = {
    balance: 250000,
    total_orders: 14,
    total_spent: 1250000,
    total_deposit: 1500000,
    username: 'regiami',
    full_name: 'Regi Ami',
  };
  let services = [];

  onMount(async () => {
    stats = await fetchDashboard('regiami');
    services = await fetchServices();
  });

  function handleTabChange(event) {
    activeTab = event.detail;
  }

  function handleOrderCreated(event) {
    const { amountDeducted } = event.detail;
    stats.balance -= amountDeducted;
    stats.total_orders += 1;
    stats.total_spent += amountDeducted;
  }

  function handleDepositSubmitted(event) {
    // Deposit waiting for admin approval
  }
</script>

<div class="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col">
  <!-- Navbar -->
  <Navbar
    bind:activeTab
    balance={stats.balance}
    username={stats.username}
    on:tabChange={handleTabChange}
    on:openDeposit={() => isDepositModalOpen = true}
  />

  <!-- Main Content Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
    {#if activeTab === 'dashboard'}
      <DashboardStats
        {stats}
        on:openDeposit={() => isDepositModalOpen = true}
        on:navigate={(e) => activeTab = e.detail}
      />
    {:else if activeTab === 'new-order'}
      <NewOrderForm
        userBalance={stats.balance}
        userId={stats.username}
        on:orderCreated={handleOrderCreated}
      />
    {:else if activeTab === 'mass-order'}
      <MassOrderForm userId={stats.username} />
    {:else if activeTab === 'history'}
      <OrderHistoryTable userId={stats.username} />
    {:else if activeTab === 'services'}
      <!-- Service Catalog Page -->
      <div class="glass-card rounded-2xl p-6 lg:p-8 space-y-6">
        <div class="border-b border-white/5 pb-4">
          <h2 class="text-xl font-bold text-gray-100 flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-cyan-500"></span>
            <span>Katalog Seluruh Layanan Aktif</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1">Daftar harga per 1.000, batas minimal & maksimal, serta garansi refill.</p>
        </div>

        <div class="overflow-x-auto -mx-6 lg:-mx-8">
          <table class="w-full text-left text-xs text-gray-300 min-w-[700px]">
            <thead class="bg-gray-900/80 text-gray-400 font-semibold border-y border-white/5 uppercase tracking-wider text-[10px]">
              <tr>
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Nama Layanan</th>
                <th class="py-3 px-4 text-right">Harga / 1K</th>
                <th class="py-3 px-4 text-center">Min / Maks</th>
                <th class="py-3 px-4 text-center">Garansi</th>
                <th class="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              {#each services as srv}
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="py-3 px-4 font-mono font-bold text-gray-200">{srv.id}</td>
                  <td class="py-3 px-4 max-w-sm">
                    <div class="font-medium text-gray-100">{srv.name}</div>
                    <div class="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{srv.description}</div>
                  </td>
                  <td class="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    {formatRupiah(srv.price_user?.amount || 0)}
                  </td>
                  <td class="py-3 px-4 text-center font-mono text-gray-300">
                    {srv.min_order?.toLocaleString()} / {srv.max_order?.toLocaleString()}
                  </td>
                  <td class="py-3 px-4 text-center">
                    {#if srv.refill_supported}
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        🛡️ Refill {srv.refill_days} Hari
                      </span>
                    {:else}
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-700/40 text-gray-400 border border-gray-600/40">
                        Tanpa Refill
                      </span>
                    {/if}
                  </td>
                  <td class="py-3 px-4 text-center">
                    <button
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
                      on:click={() => activeTab = 'new-order'}
                    >
                      Pesan
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </main>

  <!-- Deposit Modal -->
  {#if isDepositModalOpen}
    <DepositModal
      userId={stats.username}
      on:close={() => isDepositModalOpen = false}
      on:depositSubmitted={handleDepositSubmitted}
    />
  {/if}

  <!-- Footer -->
  <footer class="border-t border-white/5 py-6 px-4 text-center text-xs text-gray-500">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
      <div>
        © 2026 <strong>Buzzer Media</strong>. Hak Cipta Dilindungi Undang-Undang.
      </div>
      <div class="flex items-center space-x-4 text-gray-400">
        <span>Arsitektur DDD & TDD</span>
        <span>•</span>
        <span>Cloudflare Worker & VPS Agnostic</span>
      </div>
    </div>
  </footer>
</div>
