<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fetchCategories, fetchServices, formatRupiah } from '../api.js';

  const dispatch = createEventDispatcher();

  let categories = [];
  let services = [];
  let loading = true;

  // Filter & Search
  let activeCategory = 'all';
  let searchQuery = '';

  // Interactive Calculator
  let calcQuantity = 1000;
  let selectedCalcService = null;

  // FAQ Accordion State
  let openFaq = null;

  onMount(async () => {
    try {
      const [cats, srvs] = await Promise.all([
        fetchCategories(),
        fetchServices()
      ]);
      categories = cats || [];
      services = (srvs || []).filter(s => s.is_active !== false);
      if (services.length > 0) {
        selectedCalcService = services[0];
      }
    } catch (e) {
      // fallback
    } finally {
      loading = false;
    }
  });

  $: filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.category_id === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  $: calcTotalPrice = selectedCalcService
    ? Math.ceil((calcQuantity / 1000) * (selectedCalcService.price_user?.amount || 0))
    : 0;

  function toggleFaq(index) {
    openFaq = openFaq === index ? null : index;
  }

  function goToApp(tab = 'dashboard') {
    dispatch('navigateToApp', { tab });
  }

  function orderThisService(srv) {
    dispatch('navigateToApp', { tab: 'new-order', serviceId: srv.id, categoryId: srv.category_id });
  }
</script>

<div class="space-y-20 pb-20">
  <!-- Top Notification / Announcement Bar -->
  <div class="bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 py-2.5 px-4 text-center text-xs font-medium rounded-lg flex items-center justify-center space-x-2 shadow-sm">
    <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 dark:bg-amber-500/30 dark:text-amber-900 border border-amber-500/30">
      PROMO QRIS
    </span>
    <span>Bonus Saldo +10% untuk setiap deposit via QRIS Otomatis & Manual!</span>
    <button
      type="button"
      on:click={() => goToApp('dashboard')}
      class="underline font-bold hover:opacity-80 transition-opacity ml-1"
    >
      Klaim Bonus →
    </button>
  </div>

  <!-- HERO SECTION -->
  <section class="text-center space-y-6 max-w-4xl mx-auto pt-6">
    <div class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 shadow-sm">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span class="font-mono text-[11px] font-medium">Server API v2 Online • SLA 99.98%</span>
    </div>

    <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
      Infrastruktur Buzzer & Marketing <br class="hidden sm:inline" />
      <span class="text-zinc-500 dark:text-zinc-400">Media Sosial Terdepan</span> di Indonesia
    </h1>

    <p class="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
      Tingkatkan followers, likes, views, dan engagement di Instagram, TikTok, YouTube, serta Twitter/X secara instan. Layanan tangan pertama dengan garansi auto-refill dan harga terbaik.
    </p>

    <!-- Hero CTA Buttons -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
      <button
        type="button"
        on:click={() => goToApp('new-order')}
        class="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
      >
        <span>Mulai Pesan Sekarang</span>
        <span>→</span>
      </button>

      <a
        href="#pricing-table"
        class="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-medium text-xs shadow-sm transition-all text-center"
      >
        Lihat Katalog Harga Publik
      </a>

      <button
        type="button"
        on:click={() => goToApp('dashboard')}
        class="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 dark:text-zinc-300 font-medium text-xs transition-all"
      >
        Masuk Dashboard Client
      </button>
    </div>

    <!-- Live Performance Metrics -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-zinc-200 dark:border-zinc-800 max-w-3xl mx-auto text-left">
      <div class="p-3">
        <div class="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">1.850.000+</div>
        <div class="text-[11px] text-zinc-500 mt-0.5">Pesanan Berhasil</div>
      </div>
      <div class="p-3">
        <div class="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">&lt; 3 Menit</div>
        <div class="text-[11px] text-zinc-500 mt-0.5">Rata-rata Proses Mulai</div>
      </div>
      <div class="p-3">
        <div class="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">30-365 Hari</div>
        <div class="text-[11px] text-zinc-500 mt-0.5">Garansi Refill Tombol</div>
      </div>
      <div class="p-3">
        <div class="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">24/7</div>
        <div class="text-[11px] text-zinc-500 mt-0.5">Server Otomatis & QRIS</div>
      </div>
    </div>
  </section>

  <!-- VALUE PROPOSITION (6 KEUNGGULAN UTAMA) -->
  <section class="space-y-8">
    <div class="text-center max-w-xl mx-auto space-y-2">
      <h2 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Mengapa Memilih Buzzer Media?
      </h2>
      <p class="text-xs text-zinc-500 dark:text-zinc-400">
        Dirancang khusus untuk agency, influencer, digital marketer, dan pemilik toko online di Indonesia.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="ui-card rounded-xl p-6 space-y-3">
        <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
          ⚡
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Server Tangan Pertama</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Terhubung langsung ke provider upstream tier-1 tanpa pihak ketiga. Harga paling murah dan kecepatan eksekusi tinggi.
        </p>
      </div>

      <div class="ui-card rounded-xl p-6 space-y-3">
        <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
          🛡️
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Garansi Tombol Refill</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Jika kuantitas follower atau like berkurang dalam masa garansi (30-365 hari), cukup klik 1 tombol refill di dashboard.
        </p>
      </div>

      <div class="ui-card rounded-xl p-6 space-y-3">
        <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
          💳
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Deposit QRIS 24 Jam</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Mendukung QRIS instan dari semua bank dan e-wallet (GoPay, OVO, Dana, ShopeePay) dengan kode unik anti-salah.
        </p>
      </div>

      <div class="ui-card rounded-xl p-6 space-y-3">
        <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
          👥
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Akun Real & Organik</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Tersedia opsi followers real Indonesia berprofil aktif, aman dari shadowban algoritma media sosial.
        </p>
      </div>

      <div class="ui-card rounded-xl p-6 space-y-3">
        <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
          💻
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Reseller & Developer Ready</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Dilengkapi RESTful API v2 standar industri. Sambungkan web panel reseller Anda sendiri secara mudah.
        </p>
      </div>

      <div class="ui-card rounded-xl p-6 space-y-3">
        <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
          🔒
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">100% Aman Tanpa Password</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Kami tidak pernah meminta password akun Anda. Cukup masukkan link postingan atau username target.
        </p>
      </div>
    </div>
  </section>

  <!-- INTERACTIVE LIVE PRICE CALCULATOR & PUBLIC CATALOG -->
  <section id="pricing-table" class="space-y-6 pt-4">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
      <div>
        <div class="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
          <span>Katalog Layanan Publik</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          Daftar Harga Transparan & Kalkulator Biaya
        </h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Lihat daftar tarif lengkap tanpa perlu login. Harga per 1.000 kuantitas pesanan.
        </p>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center space-x-1 overflow-x-auto pb-1">
        <button
          type="button"
          on:click={() => activeCategory = 'all'}
          class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all {activeCategory === 'all' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'}"
        >
          Semua ({services.length})
        </button>
        {#each categories as cat}
          <button
            type="button"
            on:click={() => activeCategory = cat.id}
            class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all {activeCategory === cat.id ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'}"
          >
            {cat.name}
          </button>
        {/each}
      </div>
    </div>

    <!-- Live Interactive Calculator Box -->
    <div class="ui-card rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
      <div class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center space-x-2">
        <span>🧮</span>
        <span>Simulasi Hitung Harga Cepat:</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label for="calc-srv" class="block text-[11px] font-medium text-zinc-500 mb-1">Pilih Layanan</label>
          <select
            id="calc-srv"
            bind:value={selectedCalcService}
            class="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium focus:outline-none"
          >
            {#each services as srv}
              <option value={srv}>{srv.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="calc-qty" class="block text-[11px] font-medium text-zinc-500 mb-1">Jumlah Pesanan</label>
          <input
            id="calc-qty"
            type="number"
            step="100"
            bind:value={calcQuantity}
            class="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono font-bold focus:outline-none"
          />
        </div>

        <div class="flex items-center justify-between sm:justify-end space-x-4 bg-white dark:bg-zinc-900/90 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div>
            <div class="text-[10px] text-zinc-400 uppercase font-mono">Estimasi Biaya:</div>
            <div class="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {formatRupiah(calcTotalPrice)}
            </div>
          </div>
          {#if selectedCalcService}
            <button
              type="button"
              on:click={() => orderThisService(selectedCalcService)}
              class="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90"
            >
              Pesan Ini →
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Search Input -->
    <div class="relative max-w-sm">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari nama layanan..."
        class="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
      />
      <span class="absolute left-2.5 top-2 text-zinc-400 text-xs">🔍</span>
    </div>

    <!-- Service Catalog Table -->
    <div class="ui-card rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-zinc-100/60 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase text-zinc-500">
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Nama Layanan</th>
              <th class="px-4 py-3 text-right">Harga / 1.000</th>
              <th class="px-4 py-3 text-center">Min / Max</th>
              <th class="px-4 py-3 text-center">Garansi</th>
              <th class="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            {#if loading}
              <tr>
                <td colspan="6" class="px-4 py-8 text-center text-zinc-400">Memuat katalog harga...</td>
              </tr>
            {:else if filteredServices.length === 0}
              <tr>
                <td colspan="6" class="px-4 py-8 text-center text-zinc-400">Tidak ada layanan yang ditemukan.</td>
              </tr>
            {:else}
              {#each filteredServices as srv}
                <tr class="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors">
                  <td class="px-4 py-3 font-mono font-medium text-zinc-500 whitespace-nowrap">{srv.id}</td>
                  <td class="px-4 py-3">
                    <div class="font-medium text-zinc-900 dark:text-zinc-100">{srv.name}</div>
                    {#if srv.description}
                      <div class="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{srv.description}</div>
                    {/if}
                  </td>
                  <td class="px-4 py-3 font-mono font-bold text-zinc-900 dark:text-zinc-100 text-right whitespace-nowrap">
                    {formatRupiah(srv.price_user?.amount || 0)}
                  </td>
                  <td class="px-4 py-3 font-mono text-zinc-500 text-center whitespace-nowrap">
                    {srv.min_order?.toLocaleString()} - {srv.max_order?.toLocaleString()}
                  </td>
                  <td class="px-4 py-3 text-center whitespace-nowrap">
                    {#if srv.refill_supported}
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        {srv.refill_days} Hari
                      </span>
                    {:else}
                      <span class="text-zinc-400 text-[11px]">-</span>
                    {/if}
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      on:click={() => orderThisService(srv)}
                      class="px-2.5 py-1 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 font-medium text-[11px]"
                    >
                      Pesan
                    </button>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- 3 CARA MUDAH MEMESAN -->
  <section class="space-y-8">
    <div class="text-center max-w-xl mx-auto space-y-2">
      <h2 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Cara Memulai dalam 3 Langkah
      </h2>
      <p class="text-xs text-zinc-500">
        Hanya butuh 2 menit untuk mulai menaikkan kredibilitas akun Anda.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="ui-card rounded-xl p-6 space-y-3 relative">
        <div class="text-2xl font-extrabold font-mono text-zinc-300 dark:text-zinc-700">01</div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Buka Akun & Login</h3>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Masuk ke dashboard member Buzzer Media. Anda langsung mendapatkan akses ke seluruh katalog layanan.
        </p>
      </div>

      <div class="ui-card rounded-xl p-6 space-y-3 relative">
        <div class="text-2xl font-extrabold font-mono text-zinc-300 dark:text-zinc-700">02</div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Isi Saldo via QRIS</h3>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Scan QRIS dari m-Banking atau e-Wallet favorit Anda. Saldo langsung masuk beserta bonus tambahan.
        </p>
      </div>

      <div class="ui-card rounded-xl p-6 space-y-3 relative">
        <div class="text-2xl font-extrabold font-mono text-zinc-300 dark:text-zinc-700">03</div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Submit Link & Berjalan Otomatis</h3>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Pilih paket layanan, masukkan link target profil atau postingan, dan pantau status pengerjaan secara real-time.
        </p>
      </div>
    </div>
  </section>

  <!-- DEVELOPER API PREVIEW -->
  <section class="ui-card rounded-xl p-6 lg:p-8 space-y-4 bg-zinc-900 text-zinc-100 border border-zinc-800">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <span class="text-[10px] font-mono uppercase text-emerald-400 font-bold">Standard SMM v2 API</span>
        <h3 class="text-base font-bold text-white mt-0.5">Integrasi Reseller & Developer</h3>
      </div>
      <button
        type="button"
        on:click={() => goToApp('dashboard')}
        class="px-3.5 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-semibold hover:bg-white transition-all self-start"
      >
        Dapatkan API Key
      </button>
    </div>
    <p class="text-xs text-zinc-400 max-w-2xl leading-relaxed">
      Hubungkan sistem website panel Anda langsung ke server Buzzer Media menggunakan protokol standar industri.
    </p>
    <div class="p-3.5 rounded-lg bg-black/60 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
      <div class="text-zinc-500"># Contoh request submit order via cURL</div>
      <div>curl -X POST https://api.buzzer.media/api/v2 \</div>
      <div class="pl-4">-d "key=YOUR_API_KEY" \</div>
      <div class="pl-4">-d "action=add" \</div>
      <div class="pl-4">-d "service=101" \</div>
      <div class="pl-4">-d "link=https://instagram.com/akun_target" \</div>
      <div class="pl-4">-d "quantity=1000"</div>
    </div>
  </section>

  <!-- FAQ SECTION -->
  <section class="space-y-6 max-w-3xl mx-auto">
    <div class="text-center space-y-2">
      <h2 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Pertanyaan yang Sering Diajukan (FAQ)
      </h2>
      <p class="text-xs text-zinc-500">
        Informasi seputar keamanan akun, garansi, dan cara kerja Buzzer Media.
      </p>
    </div>

    <div class="space-y-3">
      {#each [
        { q: 'Apakah aman untuk akun media sosial saya?', a: 'Sangat aman. Kami tidak pernah meminta password akun Anda. Pengerjaan dilakukan dari luar secara legal menggunakan link profil atau postingan publik.' },
        { q: 'Berapa lama waktu yang dibutuhkan sampai pesanan selesai?', a: 'Sebagian besar pesanan mulai diproses dalam waktu 1-5 menit setelah pembayaran. Kecepatan pengiriman berkisar antara 1.000 hingga 10.000 per hari tergantung spesifikasi layanan yang Anda pilih.' },
        { q: 'Bagaimana cara kerja Garansi Refill jika followers turun?', a: 'Jika layanan memiliki badge Garansi Refill dan terjadi penurunan jumlah follower melebihi batas toleransi, Anda cukup menekan tombol Refill di tabel Riwayat Pesanan pada dashboard.' },
        { q: 'Apakah ada minimal deposit saldo?', a: 'Minimal deposit saldo sangat terjangkau, yaitu mulai dari Rp 10.000 melalui QRIS otomatis (BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay).' }
      ] as faq, i}
        <div class="ui-card rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <button
            type="button"
            on:click={() => toggleFaq(i)}
            class="w-full px-5 py-3.5 text-left text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
          >
            <span>{faq.q}</span>
            <span class="text-zinc-400 font-mono text-sm">{openFaq === i ? '−' : '+'}</span>
          </button>
          {#if openFaq === i}
            <div class="px-5 pb-4 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
              {faq.a}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <!-- COMPANY PROFILE & CONTACT FOOTER SECTION -->
  <footer class="border-t border-zinc-200 dark:border-zinc-800 pt-10 text-xs text-zinc-500 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="space-y-2 md:col-span-2">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono font-bold text-xs flex items-center justify-center">
            BM
          </div>
          <span class="font-bold text-zinc-900 dark:text-zinc-100 text-sm">PT Buzzer Media Solusindo</span>
        </div>
        <p class="text-xs text-zinc-500 max-w-sm leading-relaxed">
          Penyedia infrastruktur optimasi media sosial, penyedia jasa buzzer, dan reseller panel SMM nomor 1 di Indonesia dengan sistem pengerjaan otomatis 24 jam nonstop.
        </p>
        <div class="text-[11px] text-zinc-400">
          📍 Jl. Sudirman Central Business District (SCBD), Jakarta Selatan 12190
        </div>
      </div>

      <div class="space-y-2">
        <div class="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Navigasi Cepat</div>
        <ul class="space-y-1 text-xs">
          <li><a href="#pricing-table" class="hover:underline">Daftar Harga Publik</a></li>
          <li><button type="button" on:click={() => goToApp('dashboard')} class="hover:underline">Dashboard Member</button></li>
          <li><button type="button" on:click={() => goToApp('new-order')} class="hover:underline">Buat Pesanan Baru</button></li>
          <li><button type="button" on:click={() => goToApp('history')} class="hover:underline">Riwayat Pesanan</button></li>
        </ul>
      </div>

      <div class="space-y-2">
        <div class="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Customer Support</div>
        <p class="text-xs text-zinc-500">Tim kami siap membantu Anda 24 jam setiap hari.</p>
        <div class="space-y-1 pt-1">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm"
          >
            <span>💬</span>
            <span>WhatsApp CS 24 Jam</span>
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-zinc-200 dark:border-zinc-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
      <div>© 2026 PT Buzzer Media Solusindo. All rights reserved.</div>
      <div class="flex space-x-4">
        <span>Syarat & Ketentuan</span>
        <span>Kebijakan Privasi</span>
        <span>Dokumentasi API</span>
      </div>
    </div>
  </footer>
</div>
