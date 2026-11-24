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
  import LoginModal from './lib/components/LoginModal.svelte';
  import FeatureGuideModal from './lib/components/FeatureGuideModal.svelte';
  import { fetchDashboard, fetchServices, formatRupiah } from './lib/api.js';

  let activeTab = 'company';
  let isDepositModalOpen = false;
  let isLoginModalOpen = false;
  let isGuideModalOpen = false;
  let guideInitialMode = 'tour';
  let isDemoAccount = true;
  let isLoggedIn = false;
  let stats = {
    balance: 500000,
    total_orders: 14,
    total_spent: 1250000,
    total_deposit: 1500000,
    username: 'regiami',
    full_name: 'Regi Ami (Demo)',
  };
  let services = [];

  onMount(async () => {
    // Default to white/light mode for company profile
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme || savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    const sessionStr = localStorage.getItem('narasi_client_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.username) {
          isLoggedIn = true;
          stats.username = session.username;
          stats.full_name = session.fullName || session.username;
          isDemoAccount = session.isDemo;
          await loadUserData(session.username);
        }
      } catch (e) {
        localStorage.removeItem('narasi_client_session');
      }
    }

    services = await fetchServices();
  });

  async function loadUserData(username) {
    stats = await fetchDashboard(username);
    isDemoAccount = username === 'regiami' || username.includes('demo');
  }

  function handleTabChange(event) {
    const targetTab = event.detail;
    if (targetTab !== 'company' && !isLoggedIn) {
      isLoginModalOpen = true;
      return;
    }
    activeTab = targetTab;
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

  function handleLoginSuccess(detail) {
    isLoggedIn = true;
    stats.username = detail.username;
    stats.full_name = detail.fullName;
    isDemoAccount = detail.isDemo;
    localStorage.setItem('narasi_client_session', JSON.stringify({
      username: detail.username,
      fullName: detail.fullName,
      isDemo: detail.isDemo,
      loggedInAt: new Date().toISOString()
    }));
    loadUserData(detail.username);
    if (activeTab === 'company') {
      activeTab = 'dashboard';
    }
  }

  function handleLogout() {
    localStorage.removeItem('narasi_client_session');
    isLoggedIn = false;
    activeTab = 'company';
  }

  function openGuide(mode = 'tour') {
    guideInitialMode = mode;
    isGuideModalOpen = true;
  }
</script>

<div class="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-150">
  <!-- Navbar -->
  <Navbar
    bind:activeTab
    balance={stats.balance}
    username={stats.username}
    isDemo={isDemoAccount}
    {isLoggedIn}
    on:tabChange={handleTabChange}
    on:openDeposit={() => isDepositModalOpen = true}
    on:openLogin={() => isLoginModalOpen = true}
    on:openGuide={(e) => openGuide(e.detail || 'tour')}
    on:logout={handleLogout}
  />

  {#if isLoggedIn && isDemoAccount}
    <div class="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30">
            ⚡ AKUN DEMO (@{stats.username})
          </span>
          <span>
            Mode Simulasi Aktif: Saldo Rp 500.000 & semua pesanan/deposit otomatis berlabel <strong>[DEMO]</strong>.
          </span>
        </div>
        <button
          type="button"
          on:click={() => isLoginModalOpen = true}
          class="text-[11px] underline font-semibold hover:text-amber-950 dark:hover:text-amber-100"
        >
          Ganti Akun &rarr;
        </button>
      </div>
    </div>
  {/if}

  <!-- Main Content Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
    {#if activeTab !== 'company' && !isLoggedIn}
      <div class="py-16 text-center max-w-md mx-auto space-y-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm my-8">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center text-2xl font-bold">
          🔒
        </div>
        <div>
          <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Wajib Masuk Terlebih Dahulu
          </h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
            Untuk mengakses Dashboard, Katalog Layanan, dan membuat Pesanan, silakan login menggunakan akun Anda terlebih dahulu.
          </p>
        </div>
        <div class="pt-2">
          <button
            type="button"
            on:click={() => isLoginModalOpen = true}
            class="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-sm transition-all"
          >
            Masuk Sekarang &rarr;
          </button>
        </div>
      </div>
    {:else if activeTab === 'company'}
      <CompanyProfile on:navigateToApp={(e) => activeTab = e.detail.tab} />
    {:else if activeTab === 'dashboard'}
      <DashboardStats
        {stats}
        on:openDeposit={() => isDepositModalOpen = true}
        on:openGuide={(e) => openGuide(e.detail || 'tour')}
        on:navigate={(e) => activeTab = e.detail}
      />
    {:else if activeTab === 'new-order'}
      <NewOrderForm
        userBalance={stats.balance}
        userId={stats.username}
        isDemo={isDemoAccount}
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
        isDemo={isDemoAccount}
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
      isDemo={isDemoAccount}
      on:close={() => isDepositModalOpen = false}
      on:depositSubmitted={handleDepositSubmitted}
    />
  {/if}

  <!-- Login Modal -->
  <LoginModal
    bind:show={isLoginModalOpen}
    currentUsername={stats.username}
    on:loginSuccess={(e) => handleLoginSuccess(e.detail)}
  />

  <!-- Feature Guide & Onboarding Walkthrough Modal -->
  <FeatureGuideModal
    bind:show={isGuideModalOpen}
    initialMode={guideInitialMode}
    on:close={() => isGuideModalOpen = false}
    on:navigateToTab={(e) => {
      activeTab = e.detail;
      if (!isLoggedIn && activeTab !== 'company') {
        isLoginModalOpen = true;
      }
    }}
  />

  <!-- Floating Guide Helper Pill Button -->
  <button
    type="button"
    class="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xl border border-zinc-700/80 dark:border-zinc-300 font-semibold text-xs flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all duration-200 group focus:outline-none"
    title="Buka Pusat Panduan & Tour Fitur Narasi Media"
    on:click={() => openGuide('tour')}
  >
    <span class="text-base group-hover:rotate-12 transition-transform">💡</span>
    <span class="tracking-tight hidden sm:inline">Panduan Fitur</span>
    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
  </button>

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
