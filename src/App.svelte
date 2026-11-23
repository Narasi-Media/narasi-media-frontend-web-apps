<script>
  import { onMount } from 'svelte';
  import Navbar from './lib/components/Navbar.svelte';
  import CompanyProfile from './lib/components/CompanyProfile.svelte';
  import DashboardStats from './lib/components/DashboardStats.svelte';
  import NewOrderForm from './lib/components/NewOrderForm.svelte';
  import MassOrderForm from './lib/components/MassOrderForm.svelte';
  import OrderHistoryTable from './lib/components/OrderHistoryTable.svelte';
  import UserProfile from './lib/components/UserProfile.svelte';
  import DepositModal from './lib/components/DepositModal.svelte';
  import { fetchDashboard, fetchServices, formatRupiah } from './lib/api.js';

  let activeTab = 'company';
  let isDepositModalOpen = false;
  let stats = {
    balance: 500000,
    total_orders: 14,
    total_spent: 1250000,
    total_deposit: 1500000,
    username: 'regiami',
    full_name: 'Regi Ami',
  };
  let services = [];

  onMount(async () => {
    // Default to white/light mode for company profile
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme || savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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

<div class="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-150">
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
    {#if activeTab === 'company'}
      <CompanyProfile on:navigateToApp={(e) => activeTab = e.detail.tab} />
    {:else if activeTab === 'dashboard'}
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
      <!-- Service Catalog Page (shadcn style) -->
      <div class="ui-card rounded-xl p-6 lg:p-8 space-y-5">
        <div class="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
            <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Katalog Layanan Aktif
            </h2>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Daftar harga modal & jual per 1.000, kuota min/maks, serta status garansi refill.</p>
        </div>

        <div class="overflow-x-auto -mx-6 lg:-mx-8">
          <table class="w-full text-left text-xs text-zinc-600 dark:text-zinc-300 min-w-[700px]">
            <thead class="bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 font-medium border-y border-zinc-200 dark:border-zinc-800 text-[11px]">
              <tr>
                <th class="py-2.5 px-4">ID</th>
                <th class="py-2.5 px-4">Nama Layanan</th>
                <th class="py-2.5 px-4 text-right">Harga / 1K</th>
                <th class="py-2.5 px-4 text-center">Min / Maks</th>
                <th class="py-2.5 px-4 text-center">Garansi</th>
                <th class="py-2.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800/80">
              {#each services as srv}
                <tr class="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                  <td class="py-3 px-4 font-mono font-medium text-zinc-900 dark:text-zinc-200">{srv.id}</td>
                  <td class="py-3 px-4 max-w-sm">
                    <div class="font-medium text-zinc-900 dark:text-zinc-100">{srv.name}</div>
                    <div class="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{srv.description}</div>
                  </td>
                  <td class="py-3 px-4 text-right font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatRupiah(srv.price_user?.amount || 0)}
                  </td>
                  <td class="py-3 px-4 text-center font-mono text-zinc-600 dark:text-zinc-400">
                    {srv.min_order?.toLocaleString()} / {srv.max_order?.toLocaleString()}
                  </td>
                  <td class="py-3 px-4 text-center">
                    {#if srv.refill_supported}
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        Refill {srv.refill_days} Hari
                      </span>
                    {:else}
                      <span class="text-zinc-400 text-xs">Tanpa Garansi</span>
                    {/if}
                  </td>
                  <td class="py-3 px-4 text-center">
                    <button
                      type="button"
                      class="h-7 px-3 rounded text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all"
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
    {:else if activeTab === 'profile'}
      <UserProfile
        {stats}
        userId={stats.username}
        on:backToDashboard={() => activeTab = 'dashboard'}
        on:openDeposit={() => isDepositModalOpen = true}
        on:updateProfile={(e) => stats.full_name = e.detail.fullName}
        on:balanceUpdated={(e) => stats.balance = e.detail.balance}
      />
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
  <footer class="border-t border-zinc-200 dark:border-zinc-800/80 py-5 px-4 text-xs text-zinc-500 dark:text-zinc-400 transition-colors">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center space-x-2">
        <span class="font-semibold text-zinc-800 dark:text-zinc-200">narasi.media</span>
        <span>&middot;</span>
        <span>Solusi Pemasaran Sosial Media &amp; Jaringan Narasi Media Terpercaya Indonesia</span>
      </div>
      <div class="flex items-center space-x-3 text-zinc-400 text-[11px]">
        <span>Layanan Otomatis 24 Jam &bull; Garansi Refill &bull; Keamanan Terjamin</span>
      </div>
    </div>
  </footer>
</div>
