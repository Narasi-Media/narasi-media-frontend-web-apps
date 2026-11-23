<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import {
    fetchUserProfile,
    updateUserProfile,
    regenerateApiKey,
    updateUserPassword,
    adjustUserBalance,
    formatRupiah
  } from '../api.js';

  export let stats = {};
  export let userId = 'regiami';
  export let isDemo = true;

  const dispatch = createEventDispatcher();

  let activeSection = 'info'; // 'info' | 'api' | 'security' | 'notifications'
  let loading = true;
  let saving = false;
  let toastMessage = '';
  let toastType = 'success'; // 'success' | 'error'

  let profile = {
    id: 'USR-8821',
    username: 'regiami',
    full_name: 'Regi Pratama Ami',
    email: 'regi@narasi.media',
    whatsapp_number: '081234567890',
    telegram_username: '@regiami_narasi',
    role: 'Member',
    balance: 500000,
    balance_formatted: 'Rp 500.000',
    total_orders: 14,
    total_spent: 1250000,
    total_deposit: 1500000,
    api_key: 'bm_live_9f82bc7190d8a43e7b1a20c3ef',
    webhook_url: 'https://myshop.com/api/smm-callback',
    two_factor_enabled: true,
    registered_at: '22 Nov 2026'
  };

  // Balance modal states
  let showBalanceModal = false;
  let customBalanceInput = 500000;
  let isUpdatingBalance = false;

  // Form states
  let formName = '';
  let formEmail = '';
  let formWhatsapp = '';
  let formTelegram = '';
  let formWebhook = '';

  // Password state
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let passwordError = '';

  // API Key show state
  let showApiKey = false;
  let copiedKey = false;
  let isRegeneratingKey = false;
  let showRegenerateModal = false;

  // Notification preferences state
  let notifyDeposit = true;
  let notifyOrder = true;
  let notifyLowBalance = true;
  let notifyPromo = false;

  onMount(async () => {
    loading = true;
    try {
      const data = await fetchUserProfile(userId || stats.username || 'regiami');
      if (data) {
        profile = { ...profile, ...data };
      }
    } catch (e) {
      console.warn('Gagal memuat profil remote, memakai data lokal:', e);
    } finally {
      formName = profile.full_name || '';
      formEmail = profile.email || '';
      formWhatsapp = profile.whatsapp_number || '';
      formTelegram = profile.telegram_username || '';
      formWebhook = profile.webhook_url || '';
      loading = false;
    }
  });

  let toastTimeout;
  function showToast(msg, type = 'success', duration = 4000) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMessage = msg;
    toastType = type;
    toastTimeout = setTimeout(() => {
      toastMessage = '';
    }, duration);
  }

  async function handleSaveContact() {
    saving = true;
    try {
      const payload = {
        full_name: formName,
        email: formEmail,
        whatsapp_number: formWhatsapp,
        telegram_username: formTelegram,
        webhook_url: formWebhook,
        two_factor_enabled: profile.two_factor_enabled
      };
      const res = await updateUserProfile(profile.username, payload);
      if (!res.success) {
        throw new Error(res.message || 'Gagal menyimpan profil');
      }
      profile.full_name = formName;
      profile.email = formEmail;
      profile.whatsapp_number = formWhatsapp;
      profile.telegram_username = formTelegram;
      profile.webhook_url = formWebhook;

      dispatch('updateProfile', { fullName: formName });
      showToast('Data informasi kontak akun berhasil disimpan!');
    } catch (e) {
      showToast('Gagal menyimpan profil: ' + e.message, 'error');
    } finally {
      saving = false;
    }
  }

  async function handleCopyApiKey() {
    try {
      await navigator.clipboard.writeText(profile.api_key);
      copiedKey = true;
      showToast('Kunci API berhasil disalin ke papan klip!');
      setTimeout(() => copiedKey = false, 2500);
    } catch (e) {
      showToast('Gagal menyalin API Key', 'error');
    }
  }

  async function handleConfirmRegenerateKey() {
    isRegeneratingKey = true;
    try {
      const res = await regenerateApiKey(profile.username);
      if (!res.success) {
        throw new Error(res.message || 'Gagal regenerasi kunci API');
      }
      if (res.data) {
        profile.api_key = res.data;
      }
      showRegenerateModal = false;
      showToast('Kunci API baru berhasil dibuat! Segera perbarui konfigurasi website Anda.');
    } catch (e) {
      showToast('Gagal regenerasi API key: ' + e.message, 'error');
    } finally {
      isRegeneratingKey = false;
    }
  }

  async function handleUpdatePassword() {
    passwordError = '';
    if (!currentPassword) {
      passwordError = 'Kata sandi saat ini wajib diisi.';
      return;
    }
    if (newPassword.length < 6) {
      passwordError = 'Kata sandi baru minimal 6 karakter.';
      return;
    }
    if (newPassword !== confirmPassword) {
      passwordError = 'Konfirmasi kata sandi tidak cocok.';
      return;
    }

    saving = true;
    try {
      const res = await updateUserPassword(profile.username, currentPassword, newPassword);
      if (res.success) {
        currentPassword = '';
        newPassword = '';
        confirmPassword = '';
        showToast('Kata sandi berhasil diperbarui dengan aman!');
      } else {
        passwordError = res.message || 'Gagal mengubah kata sandi';
      }
    } catch (e) {
      passwordError = 'Terjadi kesalahan sistem';
    } finally {
      saving = false;
    }
  }

  async function handleSetBalance(amount) {
    isUpdatingBalance = true;
    try {
      const res = await adjustUserBalance(profile.username, amount);
      if (!res.success) {
        throw new Error(res.message || 'Gagal mengubah saldo');
      }
      profile.balance = amount;
      profile.balance_formatted = formatRupiah(amount);
      if (stats) stats.balance = amount;
      dispatch('balanceUpdated', { balance: amount });
      showBalanceModal = false;
      showToast(`Saldo akun berhasil diubah menjadi ${formatRupiah(amount)}!`);
    } catch (e) {
      showToast('Gagal mengubah saldo: ' + e.message, 'error');
    } finally {
      isUpdatingBalance = false;
    }
  }
</script>

<div class="space-y-6">
  <!-- Toast Notification Feedback (with auto-dismiss & close button) -->
  {#if toastMessage}
    <div
      class="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center space-x-2.5 transition-all {toastType === 'success' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-700/50' : 'bg-rose-600 text-white'}"
    >
      <span>{toastType === 'success' ? '✓' : '⚠'}</span>
      <span>{toastMessage}</span>
      <button
        type="button"
        on:click={() => { if (toastTimeout) clearTimeout(toastTimeout); toastMessage = ''; }}
        class="ml-2 pl-1.5 opacity-70 hover:opacity-100 text-xs font-bold"
        title="Tutup notifikasi"
      >
        ✕
      </button>
    </div>
  {/if}

  <!-- Context Navigation Breadcrumb -->
  <div class="flex items-center justify-between pb-1">
    <div class="flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400">
      <button
        type="button"
        on:click={() => dispatch('backToDashboard')}
        class="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center space-x-1 font-semibold transition-colors"
      >
        <span>&larr;</span>
        <span>Kembali ke Dashboard</span>
      </button>
      <span>/</span>
      <span class="text-zinc-900 dark:text-zinc-100 font-bold">Profil Akun Pengguna</span>
    </div>

    <div class="text-[11px] text-zinc-400 font-mono hidden sm:flex items-center space-x-1.5">
      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      <span>Akun Member Terverifikasi</span>
    </div>
  </div>

  <!-- Header Identity Card (Linear / Vercel aesthetic) -->
  <div class="ui-card rounded-2xl p-6 lg:p-8 space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
      <!-- User Avatar & Identity Details -->
      <div class="flex items-start sm:items-center space-x-4 sm:space-x-5">
        <div class="relative">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-zinc-950 font-mono font-bold text-xl sm:text-2xl flex items-center justify-center shadow-md uppercase tracking-tight">
            {profile.username ? profile.username.slice(0, 2) : 'NM'}
          </div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#121215] flex items-center justify-center text-[10px] text-white" title="Akun Aktif & Terverifikasi">
            ✓
          </div>
        </div>

        <div class="space-y-1">
          <div class="flex items-center space-x-2.5">
            <h1 class="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {profile.full_name || profile.username}
            </h1>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {profile.role || 'Member'}
            </span>
            {#if isDemo || profile.username === 'regiami'}
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                ⚡ AKUN DEMO
              </span>
            {/if}
          </div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span class="font-mono">@{profile.username}</span>
            <span>&bull;</span>
            <span>ID: <code class="font-mono text-zinc-700 dark:text-zinc-300">{profile.id}</code></span>
            <span>&bull;</span>
            <span>Bergabung {profile.registered_at}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-2.5 self-start md:self-auto">
        <button
          type="button"
          on:click={() => dispatch('openDeposit')}
          class="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
        >
          <span>+</span>
          <span>Top Up Saldo</span>
        </button>
        <button
          type="button"
          on:click={handleCopyApiKey}
          class="h-9 px-3.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-xs font-medium transition-all flex items-center space-x-1.5"
          title="Salin Kunci API Reseller"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>{copiedKey ? 'Tersalin!' : 'Salin API Key'}</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Stat Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono uppercase font-semibold text-zinc-400">Saldo Akun</span>
            <button
              type="button"
              on:click={() => { customBalanceInput = profile.balance || 500000; showBalanceModal = true; }}
              class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              title="Ubah nominal saldo akun"
            >
              Ubah Saldo
            </button>
          </div>
          <div class="text-xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            {formatRupiah(profile.balance || stats.balance || 0)}
          </div>
        </div>
        <div class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Siap digunakan order</div>
      </div>

      <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80">
        <div class="text-[10px] font-mono uppercase font-semibold text-zinc-400">Total Transaksi</div>
        <div class="text-xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
          {profile.total_orders || stats.total_orders || 0} Pesanan
        </div>
        <div class="text-[10px] text-zinc-400 mt-1">100% diproses otomatis</div>
      </div>

      <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80">
        <div class="text-[10px] font-mono uppercase font-semibold text-zinc-400">Total Belanja</div>
        <div class="text-xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
          {formatRupiah(profile.total_spent || stats.total_spent || 0)}
        </div>
        <div class="text-[10px] text-zinc-400 mt-1">Akumulasi seumur hidup</div>
      </div>

      <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80">
        <div class="text-[10px] font-mono uppercase font-semibold text-zinc-400">Total Deposit</div>
        <div class="text-xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
          {formatRupiah(profile.total_deposit || stats.total_deposit || 0)}
        </div>
        <div class="text-[10px] text-zinc-400 mt-1">Akumulasi deposit berhasil</div>
      </div>
    </div>
  </div>

  <!-- Profile Settings Tabs & Sub-sections -->
  <div class="space-y-4">
    <!-- Segmented Navigation (shadcn/ui style) -->
    <div class="flex items-center space-x-1 border-b border-zinc-200 dark:border-zinc-800 pb-1 text-xs font-medium">
      <button
        type="button"
        on:click={() => activeSection = 'info'}
        class="px-4 py-2 rounded-lg transition-all {activeSection === 'info' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
      >
        Informasi Kontak & Akun
      </button>
      <button
        type="button"
        on:click={() => activeSection = 'api'}
        class="px-4 py-2 rounded-lg transition-all {activeSection === 'api' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
      >
        Koneksi API Reseller
      </button>
      <button
        type="button"
        on:click={() => activeSection = 'security'}
        class="px-4 py-2 rounded-lg transition-all {activeSection === 'security' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
      >
        Keamanan & Kata Sandi
      </button>
      <button
        type="button"
        on:click={() => activeSection = 'notifications'}
        class="px-4 py-2 rounded-lg transition-all {activeSection === 'notifications' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
      >
        Preferensi Notifikasi
      </button>
    </div>

    <!-- SECTION 1: INFORMASI KONTAK & AKUN -->
    {#if activeSection === 'info'}
      <div class="ui-card rounded-2xl p-6 lg:p-8 space-y-6">
        <div>
          <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Informasi Pribadi & Kontak
          </h2>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Pastikan nomor WhatsApp dan email aktif untuk penerimaan bukti deposit dan notifikasi transaksi penting.
          </p>
        </div>

        <form on:submit|preventDefault={handleSaveContact} class="space-y-4 max-w-2xl">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Username (Readonly) -->
            <div>
              <label for="prof-username" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Username Akun
              </label>
              <input
                id="prof-username"
                type="text"
                readonly
                value={profile.username}
                class="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-mono text-xs cursor-not-allowed"
              />
            </div>

            <!-- Full Name -->
            <div>
              <label for="prof-fullname" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nama Lengkap
              </label>
              <input
                id="prof-fullname"
                type="text"
                bind:value={formName}
                required
                placeholder="cth. Regi Pratama Ami"
                class="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:outline-none"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="prof-email" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Alamat Email
              </label>
              <input
                id="prof-email"
                type="email"
                bind:value={formEmail}
                required
                placeholder="nama@domain.com"
                class="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:outline-none"
              />
            </div>

            <!-- WhatsApp Number -->
            <div>
              <label for="prof-whatsapp" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nomor WhatsApp (Aktif)
              </label>
              <input
                id="prof-whatsapp"
                type="text"
                bind:value={formWhatsapp}
                required
                placeholder="cth. 081234567890"
                class="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:outline-none"
              />
            </div>

            <!-- Telegram Username -->
            <div>
              <label for="prof-telegram" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Username Telegram <span class="text-zinc-400 font-normal">(Opsional)</span>
              </label>
              <input
                id="prof-telegram"
                type="text"
                bind:value={formTelegram}
                placeholder="cth. @regiami_narasi"
                class="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:outline-none"
              />
            </div>

            <!-- Webhook URL -->
            <div>
              <label for="prof-webhook" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Webhook Callback URL <span class="text-zinc-400 font-normal">(Reseller)</span>
              </label>
              <input
                id="prof-webhook"
                type="url"
                bind:value={formWebhook}
                placeholder="https://domainanda.com/api/callback"
                class="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              class="h-9 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? 'Menyimpan Perubahan...' : 'Simpan Data Kontak'}
            </button>
          </div>
        </form>
      </div>

    <!-- SECTION 2: KONEKSI API RESELLER -->
    {:else if activeSection === 'api'}
      <div class="ui-card rounded-2xl p-6 lg:p-8 space-y-6">
        <div>
          <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Koneksi API Reseller & Integrasi Sistem
          </h2>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Gunakan Kunci Akses API ini untuk menghubungkan website reseller Anda langsung ke jaringan Narasi Media secara otomatis 24 jam.
          </p>
        </div>

        <div class="space-y-4 max-w-3xl">
          <!-- API Key Display Box -->
          <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-zinc-700 dark:text-zinc-300">Kunci Akses API (Live Key)</span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                ● Aktif & Siap Pakai
              </span>
            </div>

            <div class="flex items-center space-x-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                readonly
                value={profile.api_key}
                class="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                on:click={() => showApiKey = !showApiKey}
                class="h-9 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                {showApiKey ? 'Sembunyikan' : 'Tampilkan'}
              </button>
              <button
                type="button"
                on:click={handleCopyApiKey}
                class="h-9 px-4 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                {copiedKey ? 'Tersalin!' : 'Salin'}
              </button>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
              <span>Jangan pernah membagikan API Key Anda kepada pihak lain yang tidak dipercaya.</span>
              <button
                type="button"
                on:click={() => showRegenerateModal = true}
                class="text-rose-600 dark:text-rose-400 hover:underline font-medium"
              >
                Regenerasi Kunci Baru
              </button>
            </div>
          </div>

          <!-- Documentation Endpoint & Example -->
          <div class="space-y-2">
            <span class="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Contoh Request Pemesanan Otomatis (cURL)
            </span>
            <div class="p-3.5 rounded-xl bg-zinc-950 text-zinc-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-zinc-800">
              <div>curl -X POST https://api.narasi.media/api/v2 \</div>
              <div class="pl-4">-H "Content-Type: application/json" \</div>
              <div class="pl-4">-d '&#123;</div>
              <div class="pl-8">"key": "{showApiKey ? profile.api_key : 'bm_live_••••••••••••'}",</div>
              <div class="pl-8">"action": "add",</div>
              <div class="pl-8">"service": "SRV-101",</div>
              <div class="pl-8">"link": "https://instagram.com/username",</div>
              <div class="pl-8">"quantity": 1000</div>
              <div class="pl-4">&#125;'</div>
            </div>
          </div>
        </div>
      </div>

    <!-- SECTION 3: KEAMANAN & KATA SANDI -->
    {:else if activeSection === 'security'}
      <div class="ui-card rounded-2xl p-6 lg:p-8 space-y-6">
        <div>
          <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Keamanan Akun & Ganti Kata Sandi
          </h2>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Perbarui kata sandi secara berkala dan pastikan verifikasi 2 langkah aktif demi keamanan saldo Anda.
          </p>
        </div>

        {#if passwordError}
          <div class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            {passwordError}
          </div>
        {/if}

        <form on:submit|preventDefault={handleUpdatePassword} class="space-y-4 max-w-md">
          <div>
            <label for="sec-current" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Kata Sandi Saat Ini
            </label>
            <input
              id="sec-current"
              type="password"
              bind:value={currentPassword}
              required
              class="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="sec-new" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Kata Sandi Baru
            </label>
            <input
              id="sec-new"
              type="password"
              bind:value={newPassword}
              required
              minlength="6"
              class="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:outline-none"
            />
            <span class="text-[10px] text-zinc-400 mt-0.5 block">Minimal 6 karakter kombinasi huruf dan angka.</span>
          </div>

          <div>
            <label for="sec-confirm" class="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              id="sec-confirm"
              type="password"
              bind:value={confirmPassword}
              required
              class="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:outline-none"
            />
          </div>

          <div class="pt-2">
            <button
              type="submit"
              disabled={saving}
              class="h-9 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? 'Memproses...' : 'Ubah Kata Sandi'}
            </button>
          </div>
        </form>

        <div class="pt-6 border-t border-zinc-200 dark:border-zinc-800 max-w-xl space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <div>
              <div class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Verifikasi 2 Langkah (WhatsApp OTP)</div>
              <div class="text-[11px] text-zinc-500 mt-0.5">Meminta konfirmasi OTP WhatsApp setiap login dari perangkat baru.</div>
            </div>
            <button
              type="button"
              on:click={() => {
                profile.two_factor_enabled = !profile.two_factor_enabled;
                showToast(`2FA WhatsApp telah ${profile.two_factor_enabled ? 'diaktifkan' : 'dinonaktifkan'}`);
              }}
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none {profile.two_factor_enabled ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'}"
            >
              <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {profile.two_factor_enabled ? 'translate-x-6' : 'translate-x-1'}"></span>
            </button>
          </div>
        </div>
      </div>

    <!-- SECTION 4: PREFERENSI NOTIFIKASI -->
    {:else if activeSection === 'notifications'}
      <div class="ui-card rounded-2xl p-6 lg:p-8 space-y-6">
        <div>
          <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Preferensi Notifikasi Real-Time
          </h2>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Pilih jenis pemberitahuan otomatis yang ingin Anda terima melalui WhatsApp dan email.
          </p>
        </div>

        <div class="space-y-3 max-w-xl">
          <label class="flex items-start space-x-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer">
            <input type="checkbox" bind:checked={notifyDeposit} class="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
            <div>
              <div class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Notifikasi Deposit Disetujui</div>
              <div class="text-[11px] text-zinc-500 mt-0.5">Kirim pesan WhatsApp otomatis ketika admin memverifikasi deposit QRIS Anda.</div>
            </div>
          </label>

          <label class="flex items-start space-x-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer">
            <input type="checkbox" bind:checked={notifyOrder} class="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
            <div>
              <div class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Notifikasi Pesanan Selesai / Refund</div>
              <div class="text-[11px] text-zinc-500 mt-0.5">Dapatkan update instan saat pesanan berhasil 100% atau jika ada pengembalian sisa kuota.</div>
            </div>
          </label>

          <label class="flex items-start space-x-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer">
            <input type="checkbox" bind:checked={notifyLowBalance} class="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
            <div>
              <div class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Peringatan Saldo Menipis (&lt; Rp 50.000)</div>
              <div class="text-[11px] text-zinc-500 mt-0.5">Peringatan dini agar integrasi API reseller Anda tidak terputus karena saldo habis.</div>
            </div>
          </label>

          <label class="flex items-start space-x-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer">
            <input type="checkbox" bind:checked={notifyPromo} class="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
            <div>
              <div class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Informasi Promo & Penurunan Harga Layanan</div>
              <div class="text-[11px] text-zinc-500 mt-0.5">Kabar berkala saat ada flash sale atau penambahan server Instagram/TikTok baru.</div>
            </div>
          </label>
        </div>

        <div class="pt-2">
          <button
            type="button"
            on:click={() => showToast('Preferensi notifikasi berhasil disimpan!')}
            class="h-9 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-sm transition-all"
          >
            Simpan Pengaturan Notifikasi
          </button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Modal Regenerasi Kunci API -->
  {#if showRegenerateModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="w-full max-w-sm bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div class="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
          <span class="text-lg">⚠</span>
          <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Regenerasi Kunci API?
          </h3>
        </div>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Kunci API lama Anda akan langsung dinonaktifkan. Semua website reseller atau bot yang menggunakan kunci lama akan terputus hingga Anda menggantinya dengan kunci baru.
        </p>
        <div class="flex items-center justify-end space-x-2 pt-2">
          <button
            type="button"
            on:click={() => showRegenerateModal = false}
            class="h-8 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isRegeneratingKey}
            on:click={handleConfirmRegenerateKey}
            class="h-8 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
          >
            {isRegeneratingKey ? 'Memproses...' : 'Ya, Buat Kunci Baru'}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Modal Atur Saldo Akun -->
  {#if showBalanceModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="w-full max-w-sm bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Atur Nominal Saldo Akun
            </h3>
          </div>
          <button
            type="button"
            on:click={() => showBalanceModal = false}
            class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs"
          >
            ✕
          </button>
        </div>

        <p class="text-xs text-zinc-500 leading-relaxed">
          Pilih salah satu nominal preset atau ketik saldo yang Anda inginkan untuk simulasi transaksi.
        </p>

        <!-- Presets -->
        <div class="grid grid-cols-3 gap-2">
          {#each [0, 100000, 500000, 1000000, 2500000, 5000000] as preset}
            <button
              type="button"
              on:click={() => customBalanceInput = preset}
              class="py-1.5 px-2 rounded-lg text-xs font-semibold tabular-nums border transition-all {customBalanceInput === preset ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}"
            >
              {formatRupiah(preset)}
            </button>
          {/each}
        </div>

        <!-- Custom Input -->
        <div class="space-y-1 pt-1">
          <label for="custom-bal" class="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
            Ketik Nominal Saldo Bebas (IDR)
          </label>
          <input
            id="custom-bal"
            type="number"
            bind:value={customBalanceInput}
            min="0"
            step="10000"
            class="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs tabular-nums font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>

        <div class="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            on:click={() => showBalanceModal = false}
            class="h-8 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isUpdatingBalance}
            on:click={() => handleSetBalance(customBalanceInput)}
            class="h-8 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-sm disabled:opacity-50"
          >
            {isUpdatingBalance ? 'Menyimpan...' : 'Terapkan Saldo'}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
