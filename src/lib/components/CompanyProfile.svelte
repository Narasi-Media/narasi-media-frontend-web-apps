<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fetchCategories, fetchServices, formatRupiah } from '../api.js';

  const dispatch = createEventDispatcher();

  let categories = [];
  let services = [];
  let loading = true;

  // Filter & Search
  let activeCategory = 'all';
  let searchQuery = '';

  // Interactive Live Growth Simulator (Card Generator)
  let simPlatform = 'instagram'; // 'instagram', 'tiktok', 'youtube', 'twitter'
  let simUsername = 'brandkreatif.id';
  let simCaption = 'Peluncuran koleksi eksklusif kita hari ini! Diskon 50% khusus 100 pembeli pertama 🔥';
  let simImageCategory = 'fashion'; // 'fashion', 'gadget', 'food', 'creator'
  let simBoostPackage = 'viral'; // 'starter', 'viral', 'pro'

  // Live Counter Animation State
  let isSimulating = false;
  let simulatedLikes = 28;
  let simulatedViews = 145;
  let simulatedFollowers = 420;
  let targetLikes = 12450;
  let targetViews = 85200;
  let targetFollowers = 15800;
  let showSimulationSuccess = false;
  let animationInterval = null;

  // Image Presets for Simulator
  const sampleImages = {
    fashion: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    gadget: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
    food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    creator: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80'
  };

  // Before & After Interactive Slider (0 - 100)
  let compareSliderVal = 50;

  // Live Toast Stream
  let liveToasts = [
    { id: 1, text: 'Member @fashion.id baru saja memesan 2.500 Instagram Likes', time: '8 detik lalu', icon: '❤️' },
    { id: 2, text: 'Top up deposit QRIS Rp 100.215 sukses diverifikasi otomatis 24 jam', time: '24 detik lalu', icon: '💳' },
    { id: 3, text: 'Pesanan 10.000 TikTok Views selesai diproses untuk @kuliner_nusantara', time: '41 detik lalu', icon: '🚀' },
    { id: 4, text: 'Member @techreview baru saja mengklaim Refill Garansi 30 Hari', time: '1 menit lalu', icon: '🛡️' }
  ];
  let currentToastIndex = 0;
  let activeToast = liveToasts[0];
  let toastTimer = null;

  // Interactive Live Calculator
  let calcQuantity = 2000;
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

    // Live Toast stream interval
    toastTimer = setInterval(() => {
      currentToastIndex = (currentToastIndex + 1) % liveToasts.length;
      activeToast = liveToasts[currentToastIndex];
    }, 6000);
  });

  onDestroy(() => {
    if (animationInterval) clearInterval(animationInterval);
    if (toastTimer) clearInterval(toastTimer);
  });

  $: filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.category_id === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Services Catalog Pagination State
  let servicesCurrentPage = 1;
  let servicesPageSize = 8;

  $: servicesTotalPages = Math.max(1, Math.ceil(filteredServices.length / servicesPageSize));
  $: if (servicesCurrentPage > servicesTotalPages) servicesCurrentPage = servicesTotalPages;
  $: if (activeCategory || searchQuery) {
    // Reset to page 1 on search or category filter change
  }

  $: paginatedServices = filteredServices.slice((servicesCurrentPage - 1) * servicesPageSize, servicesCurrentPage * servicesPageSize);

  function goToServicesPage(p) {
    if (p >= 1 && p <= servicesTotalPages) {
      servicesCurrentPage = p;
    }
  }

  $: calcTotalPrice = selectedCalcService
    ? Math.ceil((calcQuantity / 1000) * (selectedCalcService.price_user?.amount || 0))
    : 0;

  // Run Animated Visual Simulation
  function runBoostSimulation() {
    isSimulating = true;
    showSimulationSuccess = false;

    // reset initial numbers
    simulatedLikes = 28;
    simulatedViews = 145;
    simulatedFollowers = 420;

    let targetL = 12450;
    let targetV = 85200;
    let targetF = 15800;

    if (simBoostPackage === 'starter') {
      targetL = 1250;
      targetV = 8500;
      targetF = 2100;
    } else if (simBoostPackage === 'pro') {
      targetL = 25000;
      targetV = 180000;
      targetF = 35000;
    }

    let progress = 0;
    if (animationInterval) clearInterval(animationInterval);

    animationInterval = setInterval(() => {
      progress += 0.05;
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      simulatedLikes = Math.floor(28 + (targetL - 28) * ease);
      simulatedViews = Math.floor(145 + (targetV - 145) * ease);
      simulatedFollowers = Math.floor(420 + (targetF - 420) * ease);

      if (progress >= 1) {
        simulatedLikes = targetL;
        simulatedViews = targetV;
        simulatedFollowers = targetF;
        clearInterval(animationInterval);
        isSimulating = false;
        showSimulationSuccess = true;
      }
    }, 40);
  }

  function toggleFaq(index) {
    openFaq = openFaq === index ? null : index;
  }

  function goToApp(tab = 'dashboard') {
    dispatch('navigateToApp', { tab });
  }

  function orderThisService(srv) {
    dispatch('navigateToApp', { tab: 'new-order', serviceId: srv.id, categoryId: srv.category_id });
  }

  function orderFromSimulator() {
    const defaultSrv = services.length > 0 ? services[0] : null;
    dispatch('navigateToApp', {
      tab: 'new-order',
      serviceId: defaultSrv ? defaultSrv.id : 'SRV-101',
      target: simUsername.startsWith('@') ? `https://instagram.com/${simUsername.slice(1)}` : `https://instagram.com/${simUsername}`
    });
  }
</script>

<div class="space-y-24 pb-20 relative">
  <!-- FLOATING REAL-TIME SOCIAL PROOF TOAST (Bottom Right) -->
  {#if activeToast}
    <div class="fixed bottom-5 right-5 z-50 max-w-sm bg-white/95 dark:bg-[#121215]/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-2xl flex items-center space-x-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
      <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm shadow-inner flex-shrink-0">
        {activeToast.icon}
      </div>
      <div class="flex-1 min-w-0 text-xs">
        <p class="font-medium text-zinc-900 dark:text-zinc-100 truncate leading-snug">
          {activeToast.text}
        </p>
        <span class="text-[10px] text-zinc-400 font-mono">{activeToast.time} • Verifikasi Otomatis</span>
      </div>
      <button
        type="button"
        on:click={() => (activeToast = null)}
        class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs p-1"
      >
        ✕
      </button>
    </div>
  {/if}

  <!-- HERO SECTION WITH GENERATED VISUAL SHOWCASE -->
  <section class="max-w-6xl mx-auto space-y-10 pt-4">
    <div class="text-center space-y-6 max-w-4xl mx-auto">
      <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-700 dark:text-zinc-300 shadow-sm">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="font-mono text-[11px] font-medium tracking-wide">Platform Optimasi Sosial Media No. 1 Indonesia • Layanan Aktif 24 Jam</span>
      </div>

      <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
        Tingkatkan Engagement & <br class="hidden sm:inline" />
        <span class="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
          Popularitas Media Sosial
        </span> Anda
      </h1>

      <p class="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        Server reseller tangan pertama nomor #1 di Indonesia. Naikkan followers, likes, views, dan komentar di <strong>Instagram, TikTok, YouTube, dan Twitter/X</strong> secara instan dengan garansi refill otomatis.
      </p>

      <!-- Hero Action CTAs -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          on:click={() => goToApp('new-order')}
          class="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-semibold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <span>Mulai Pesan Sekarang</span>
          <span>→</span>
        </button>

        <a
          href="#interactive-simulator"
          class="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <span>⚡ Coba Simulator Viral</span>
        </a>

        <a
          href="#pricing-table"
          class="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-medium text-xs shadow-sm transition-all text-center"
        >
          Lihat Katalog Harga
        </a>
      </div>
    </div>

    <!-- GENERATED 3D HERO GRAPHIC DISPLAY WITH FLOATING HUD -->
    <div class="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-zinc-950 group">
      <img
        src="/narasi_media_hero_banner.jpg"
        alt="Narasi Media Viral Growth Platform Architecture"
        class="w-full h-auto object-cover max-h-[480px] opacity-95 transition-transform duration-700 group-hover:scale-[1.01]"
      />

      <!-- Floating Glass HUD Overlay (Left & Right) -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div class="space-y-1.5 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-md">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span class="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Sistem Pengerjaan Cepat & Otomatis
              </span>
            </div>
            <p class="text-xs text-zinc-200 leading-snug">
              Pesanan langsung mulai diproses dalam waktu kurang dari 3 menit. Dilengkapi verifikasi pembayaran instan dan garansi isi ulang jika kuantitas berkurang.
            </p>
          </div>

          <div class="flex items-center space-x-2 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 font-mono text-xs text-white">
            <span class="text-emerald-400 font-bold">1.850.000+</span>
            <span class="text-zinc-400">Pesanan Sukses Selesai</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PROFIL PERUSAHAAN & SEJARAH (ABOUT US) -->
  <section id="tentang-pt" class="max-w-6xl mx-auto space-y-8 pt-4">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div class="lg:col-span-7 space-y-4">
        <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold">
          <span>🏛️ PROFIL PERUSAHAAN</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
          PT Narasi Media Solusindo
        </h2>
        <p class="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Didirikan pada tahun 2023 di Jakarta, <strong>PT Narasi Media Solusindo</strong> adalah perusahaan teknologi dan media digital terkemuka yang menyediakan infrastruktur akselerasi visibilitas media sosial, otomasi distribusi konten, dan jaringan narasi media profesional nomor satu di Indonesia.
        </p>
        <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Dengan arsitektur sistem berbasis cloud mikroservis terdistribusi dan koneksi API langsung ke jaringan media global, kami telah melayani lebih dari <strong>48.200+ pengguna aktif</strong>, ratusan agensi periklanan digital ternama, kreator konten, serta pelaku UMKM nasional dengan standar keandalan 99.98% uptime.
        </p>

        <!-- Company Metrics Highlights -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <div class="text-xl font-black text-zinc-900 dark:text-zinc-100 font-mono">1.85M+</div>
            <div class="text-[11px] text-zinc-500 mt-0.5">Pesanan Berhasil</div>
          </div>
          <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">99.98%</div>
            <div class="text-[11px] text-zinc-500 mt-0.5">Server Uptime SLA</div>
          </div>
          <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 col-span-2 sm:col-span-1">
            <div class="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">48.200+</div>
            <div class="text-[11px] text-zinc-500 mt-0.5">Member &amp; Reseller</div>
          </div>
        </div>
      </div>

      <!-- Visi & Misi Card -->
      <div class="lg:col-span-5 space-y-4 ui-card rounded-2xl p-6 lg:p-7 border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-50/60 dark:bg-zinc-900/30">
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Visi Perusahaan</h3>
          </div>
          <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Menjadi penyedia infrastruktur otomasi pertumbuhan media sosial dan ekosistem pemasaran digital paling andal, transparan, dan patuh regulasi di Asia Tenggara.
          </p>
        </div>

        <div class="border-t border-zinc-200 dark:border-zinc-800/80 pt-4 space-y-2">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Misi Utama</h3>
          </div>
          <ul class="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed">
            <li class="flex items-start space-x-2">
              <span class="text-emerald-500 font-bold">&check;</span>
              <span>Menyediakan layanan optimasi media sosial berkecepatan tinggi dengan harga tangan pertama tanpa perantara.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald-500 font-bold">&check;</span>
              <span>Menjamin keamanan privasi klien 100% tanpa meminta password akun target.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald-500 font-bold">&check;</span>
              <span>Memberikan garansi isi ulang (refill) otomatis untuk menjaga kepercayaan mitra jangka panjang.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- LEGALITAS RESMI & SERTIFIKASI BADAN USAHA -->
  <section id="legalitas-resmi" class="max-w-6xl mx-auto space-y-6">
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
        <span>🛡️ LEGALITAS RESMI BADAN USAHA</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Entitas Badan Usaha Terdaftar & Berizin
      </h2>
      <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        Narasi Media beroperasi penuh secara resmi di bawah payung hukum Republik Indonesia dengan perizinan lengkap.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Legal Card 1 -->
      <div class="ui-card p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
        <div class="text-[10px] font-mono text-zinc-400 uppercase font-semibold">SK Kemenkumham RI</div>
        <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">AHU-0038921.AH.01.01</div>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Akta Pendirian Notaris &amp; Pengesahan Badan Hukum Perseroan Terbatas resmi Republik Indonesia.
        </p>
      </div>

      <!-- Legal Card 2 -->
      <div class="ui-card p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
        <div class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-semibold">PSE Kominfo RI</div>
        <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">008921.01/DJAI.PSE</div>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Terdaftar resmi sebagai Penyelenggara Sistem Elektronik (PSE) Domestik di Kementerian Komunikasi &amp; Informatika.
        </p>
      </div>

      <!-- Legal Card 3 -->
      <div class="ui-card p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
        <div class="text-[10px] font-mono text-zinc-400 uppercase font-semibold">Nomor Induk Berusaha (NIB)</div>
        <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">9120008412891</div>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Izin usaha berlaku efektif skala nasional untuk operasi portal web dan platform digital komersial.
        </p>
      </div>

      <!-- Legal Card 4 -->
      <div class="ui-card p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
        <div class="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase font-semibold">Klasifikasi KBLI</div>
        <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">63122 &amp; 73100</div>
        <p class="text-xs text-zinc-500 leading-relaxed">
          KBLI 63122 (Portal Web Platform Digital) dan KBLI 73100 (Periklanan &amp; Riset Pemasaran Digital).
        </p>
      </div>
    </div>
  </section>

  <!-- ACTION BRIDGE BANNER TO USER APP DASHBOARD -->
  <section class="max-w-6xl mx-auto rounded-2xl p-6 sm:p-8 bg-zinc-900 dark:bg-zinc-950 text-white border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="space-y-2 text-center md:text-left">
      <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono">
        <span>● PORTAL PENGGUNA TERSEDIA</span>
      </div>
      <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-white">
        Sudah Memiliki Akun Member Terdaftar?
      </h3>
      <p class="text-xs text-zinc-400 max-w-xl leading-relaxed">
        Masuk langsung ke Dashboard Aplikasi untuk melihat saldo, memantau riwayat pesanan, atau melakukan deposit saldo instan melalui QRIS otomatis.
      </p>
    </div>
    <div class="flex items-center space-x-3 flex-shrink-0">
      <button
        type="button"
        on:click={() => goToApp('dashboard')}
        class="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs shadow-md transition-all flex items-center space-x-2"
      >
        <span>Buka Dashboard Member</span>
        <span>&rarr;</span>
      </button>
      <button
        type="button"
        on:click={() => goToApp('new-order')}
        class="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all"
      >
        Pesan Baru
      </button>
    </div>
  </section>

  <!-- INTERACTIVE VIRAL BOOST SIMULATOR & CARD GENERATOR -->
  <section id="simulator" class="max-w-6xl mx-auto space-y-6 pt-6 scroll-mt-20">
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
        <span>⚡ GENERATOR INTERAKTIF</span>
      </div>
      <h2 class="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Simulasi Pertumbuhan Akun & Visual Card
      </h2>
      <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        Ubah parameter di bawah ini dan tekan tombol simulasi untuk melihat visual transformasi postingan Anda menjadi viral secara live!
      </p>
    </div>

    <!-- Simulator Interactive Studio (2-Column Grid) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ui-card rounded-2xl p-6 lg:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
      <!-- Left Column: Controls (5 cols) -->
      <div class="lg:col-span-5 space-y-5 text-xs">
        <div>
          <span class="text-[10px] font-mono uppercase font-bold text-zinc-400">Langkah 1:</span>
          <label for="sim-platform-select" class="block font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">Pilih Platform Sosial Media</label>
          <div class="grid grid-cols-4 gap-2 mt-2" id="sim-platform-select">
            {#each [
              { id: 'instagram', label: 'Instagram', icon: '📸' },
              { id: 'tiktok', label: 'TikTok', icon: '🎵' },
              { id: 'youtube', label: 'YouTube', icon: '▶️' },
              { id: 'twitter', label: 'Twitter/X', icon: '🐦' }
            ] as item}
              <button
                type="button"
                on:click={() => simPlatform = item.id}
                class="flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all {simPlatform === item.id ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-md font-bold' : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'}"
              >
                <span class="text-base">{item.icon}</span>
                <span class="text-[11px] mt-1">{item.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <div>
          <span class="text-[10px] font-mono uppercase font-bold text-zinc-400">Langkah 2:</span>
          <label for="sim-handle-input" class="block font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">Username / Target Akun Anda</label>
          <div class="relative mt-1">
            <span class="absolute left-3 top-2 text-zinc-400 font-mono text-xs">@</span>
            <input
              id="sim-handle-input"
              type="text"
              bind:value={simUsername}
              placeholder="username_anda"
              class="w-full pl-8 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono font-semibold focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div>
          <label for="sim-caption-input" class="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Teks Caption Postingan</label>
          <textarea
            id="sim-caption-input"
            rows="2"
            bind:value={simCaption}
            class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none focus:border-zinc-500"
          ></textarea>
        </div>

        <div>
          <label for="sim-category-select" class="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Tema / Gambar Mockup</label>
          <div class="grid grid-cols-4 gap-2" id="sim-category-select">
            {#each [
              { id: 'fashion', label: 'Fashion' },
              { id: 'gadget', label: 'Tech' },
              { id: 'food', label: 'F&B' },
              { id: 'creator', label: 'Creator' }
            ] as cat}
              <button
                type="button"
                on:click={() => simImageCategory = cat.id}
                class="py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all {simImageCategory === cat.id ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 font-bold' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'}"
              >
                {cat.label}
              </button>
            {/each}
          </div>
        </div>

        <div>
          <span class="text-[10px] font-mono uppercase font-bold text-zinc-400">Langkah 3:</span>
          <label for="sim-boost-select" class="block font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">Pilih Target Paket Boost</label>
          <div class="space-y-2 mt-2" id="sim-boost-select">
            {#each [
              { id: 'starter', title: 'Starter Boost', spec: '+1.200 Likes • +2.000 Followers', price: 'Rp 9.500' },
              { id: 'viral', title: 'Viral FYP Explorer', spec: '+12.400 Likes • +15.800 Followers • +85.000 Views', price: 'Rp 22.500', popular: true },
              { id: 'pro', title: 'Scale Influencer Pro', spec: '+25.000 Likes • +35.000 Followers • Garansi 365 Hari', price: 'Rp 145.000' }
            ] as pkg}
              <button
                type="button"
                on:click={() => simBoostPackage = pkg.id}
                class="w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all {simBoostPackage === pkg.id ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-200 shadow-sm' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'}"
              >
                <div>
                  <div class="font-bold flex items-center space-x-1.5">
                    <span>{pkg.title}</span>
                    {#if pkg.popular}
                      <span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500 text-white font-bold">Populer</span>
                    {/if}
                  </div>
                  <div class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">{pkg.spec}</div>
                </div>
                <div class="font-mono font-bold text-xs">{pkg.price}</div>
              </button>
            {/each}
          </div>
        </div>

        <!-- GENERATE BUTTON -->
        <button
          type="button"
          on:click={runBoostSimulation}
          disabled={isSimulating}
          class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {#if isSimulating}
            <span class="animate-spin">🔄</span>
            <span>Mengkalkulasi Efek Viral...</span>
          {:else}
            <span>🚀 Simulasikan & Generate Visual Boost</span>
          {/if}
        </button>
      </div>

      <!-- Right Column: Visual Mockup Phone Card (7 cols) -->
      <div class="lg:col-span-7 flex flex-col items-center">
        <!-- Phone Device Frame -->
        <div class="w-full max-w-sm rounded-[32px] p-3 bg-zinc-900 dark:bg-zinc-950 border-4 border-zinc-300 dark:border-zinc-800 shadow-2xl relative">
          <!-- Speaker notch -->
          <div class="w-20 h-3 bg-zinc-800 rounded-full mx-auto mb-3"></div>

          <!-- Inside Screen -->
          <div class="bg-white dark:bg-black rounded-[24px] overflow-hidden border border-zinc-200 dark:border-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans">
            <!-- App Bar Header -->
            <div class="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-xs">
              <div class="flex items-center space-x-2">
                <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5">
                  <div class="w-full h-full bg-white dark:bg-black rounded-full flex items-center justify-center text-[10px] font-bold">
                    {simUsername.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <div class="flex items-center space-x-1">
                  <span class="font-bold text-xs truncate max-w-[140px]">@{simUsername.replace('@', '')}</span>
                  <span class="text-blue-500 text-xs" title="Verified Creator">✓</span>
                </div>
              </div>
              <span class="text-zinc-400 text-xs font-mono">•••</span>
            </div>

            <!-- Post Media Visual -->
            <div class="relative aspect-square bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
              <img
                src={sampleImages[simImageCategory]}
                alt="Mockup Visual"
                class="w-full h-full object-cover"
              />

              <!-- Floating Live Heart Burst Indicator when simulating -->
              {#if isSimulating}
                <div class="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                  <span class="text-6xl animate-ping">❤️</span>
                </div>
              {/if}

              <!-- Explore / FYP Tag -->
              <div class="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                🔥 FYP RECOMMENDATION
              </div>
            </div>

            <!-- Engagement Icons & Metrics -->
            <div class="p-3.5 space-y-2">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center space-x-3">
                  <span class="text-red-500 cursor-pointer">❤️</span>
                  <span class="text-zinc-600 dark:text-zinc-300 cursor-pointer">💬</span>
                  <span class="text-zinc-600 dark:text-zinc-300 cursor-pointer">↗️</span>
                </div>
                <span class="text-zinc-400 text-xs cursor-pointer">🔖</span>
              </div>

              <!-- Live Dynamic Ticker Counts -->
              <div class="space-y-0.5 pt-1">
                <div class="font-extrabold font-mono text-xs text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                  <span>{simulatedLikes.toLocaleString()} Suka</span>
                  <span class="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 font-sans">
                    (+{simBoostPackage === 'starter' ? '1.2K' : simBoostPackage === 'viral' ? '12.4K' : '25K'} Interaksi)
                  </span>
                </div>
                <div class="text-[11px] font-mono text-zinc-500">
                  {simulatedViews.toLocaleString()} Tayangan Video
                </div>
              </div>

              <!-- Post Caption Preview -->
              <div class="text-xs pt-1 leading-snug text-zinc-800 dark:text-zinc-200">
                <strong class="mr-1">@{simUsername.replace('@', '')}</strong>
                <span>{simCaption}</span>
              </div>

              <div class="text-[10px] text-zinc-400 uppercase font-mono pt-1">
                2 MENIT YANG LALU • VIRAL ALGORITHM BOOSTED
              </div>
            </div>
          </div>
        </div>

        <!-- Simulation Result & Conversion Card -->
        {#if showSimulationSuccess}
          <div class="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs w-full max-w-sm space-y-2 shadow-lg animate-in fade-in">
            <div class="flex items-center justify-between font-bold">
              <span>✨ Simulasi Berhasil Dihasilkan!</span>
              <span class="font-mono text-emerald-600 dark:text-emerald-400">Skor Viral: 98.4%</span>
            </div>
            <p class="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Dengan paket ini, postingan Anda diproyeksikan menjangkau <strong>{simulatedViews.toLocaleString()} penonton</strong> dan menaikkan kredibilitas akun secara instan.
            </p>
            <button
              type="button"
              on:click={orderFromSimulator}
              class="w-full py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs hover:opacity-90 shadow-sm transition-all"
            >
              Wujudkan Boost Ini Sekarang (Order Instan) →
            </button>
          </div>
        {/if}
      </div>
    </div>
  </section>

  <!-- BEFORE VS AFTER INTERACTIVE COMPARISON SLIDER -->
  <section class="max-w-5xl mx-auto space-y-6">
    <div class="text-center space-y-2">
      <h2 class="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Perbandingan: Sebelum vs Sesudah Optimasi Narasi Media
      </h2>
      <p class="text-xs sm:text-sm text-zinc-500">
        Geser slider di bawah ini untuk melihat kontras engagement dan daya tarik akun Anda.
      </p>
    </div>

    <div class="ui-card rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
      <!-- Slider Control -->
      <div class="flex items-center space-x-3 max-w-md mx-auto">
        <span class="text-xs font-semibold text-zinc-500">Sebelum</span>
        <input
          type="range"
          min="0"
          max="100"
          bind:value={compareSliderVal}
          class="w-full accent-emerald-500 cursor-pointer"
        />
        <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">Sesudah Boost</span>
      </div>

      <!-- Split Cards Display based on slider -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <!-- Before Card -->
        <div class="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3 {compareSliderVal > 70 ? 'opacity-40' : 'opacity-100'} transition-opacity">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              SEBELUM MENGGUNAKAN
            </span>
            <span class="text-xs text-red-500 font-mono">Dormant</span>
          </div>
          <div class="space-y-1 font-mono">
            <div class="text-xl font-bold text-zinc-700 dark:text-zinc-300">23 Likes</div>
            <div class="text-xs text-zinc-400">142 Views • 0 Komentar</div>
          </div>
          <p class="text-xs text-zinc-500 leading-relaxed">
            Postingan sepi membuat calon pembeli atau klien ragu bertransaksi karena profil dinilai belum kredibel atau tidak aktif.
          </p>
        </div>

        <!-- After Card -->
        <div class="p-5 rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-3 {compareSliderVal < 30 ? 'opacity-40' : 'opacity-100'} transition-opacity">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-white">
              SESUDAH BOOST NARASI MEDIA
            </span>
            <span class="text-xs text-emerald-500 font-mono font-bold">🔥 Viral Explore</span>
          </div>
          <div class="space-y-1 font-mono">
            <div class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">15.420 Likes</div>
            <div class="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">92.000 Views • 420 Komentar Positif</div>
          </div>
          <p class="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Meningkatkan konversi penjualan hingga <strong>300%</strong> berkat efek social proof instan dan dorongan rekomendasi algoritma.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- LIVE PRICE CALCULATOR & TRANSPARENT PUBLIC SERVICE CATALOG -->
  <section id="katalog-harga" class="space-y-6 pt-6 max-w-6xl mx-auto scroll-mt-20">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
      <div>
        <div class="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
          <span>Katalog Tarif Resmi</span>
        </div>
        <h2 class="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
          Daftar Harga Transparan & Kalkulator Real-Time
        </h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Seluruh harga tercantum adalah tarif per 1.000 kuantitas tanpa biaya tersembunyi.
        </p>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center space-x-1 overflow-x-auto pb-1">
        <button
          type="button"
          on:click={() => activeCategory = 'all'}
          class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all {activeCategory === 'all' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'}"
        >
          Semua ({services.length})
        </button>
        {#each categories as cat}
          <button
            type="button"
            on:click={() => activeCategory = cat.id}
            class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all {activeCategory === cat.id ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'}"
          >
            {cat.name}
          </button>
        {/each}
      </div>
    </div>

    <!-- Live Interactive Calculator Box -->
    <div class="ui-card rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 space-y-4">
      <div class="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center space-x-2">
        <span class="text-sm">🧮</span>
        <span>Kalkulator Estimasi Biaya Cepat:</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label for="calc-srv-picker" class="block text-[11px] font-medium text-zinc-500 mb-1">Pilih Layanan</label>
          <select
            id="calc-srv-picker"
            bind:value={selectedCalcService}
            class="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium focus:outline-none"
          >
            {#each services as srv}
              <option value={srv}>{srv.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between text-[11px] font-medium text-zinc-500 mb-1">
            <label for="calc-qty-num">Jumlah Kuantitas:</label>
            <span class="font-mono font-bold text-zinc-800 dark:text-zinc-200">{calcQuantity.toLocaleString()}</span>
          </div>
          <input
            id="calc-qty-slider"
            type="range"
            min="100"
            max="50000"
            step="100"
            bind:value={calcQuantity}
            class="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div class="flex items-center justify-between sm:justify-end space-x-4 bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div>
            <div class="text-[10px] text-zinc-400 uppercase font-mono">Estimasi Biaya:</div>
            <div class="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              {formatRupiah(calcTotalPrice)}
            </div>
          </div>
          {#if selectedCalcService}
            <button
              type="button"
              on:click={() => orderThisService(selectedCalcService)}
              class="px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold hover:opacity-90 shadow-md transition-all"
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
        class="w-full pl-8 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
      />
      <span class="absolute left-2.5 top-2.5 text-zinc-400 text-xs">🔍</span>
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
              {#each paginatedServices as srv}
                <tr class="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors">
                  <td class="px-4 py-3 font-mono font-medium text-zinc-500 whitespace-nowrap">{srv.id}</td>
                  <td class="px-4 py-3">
                    <div class="font-semibold text-zinc-900 dark:text-zinc-100">{srv.name}</div>
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
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
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
                      class="px-3 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 font-semibold text-xs transition-all shadow-sm"
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

      <!-- Modern Pagination Bar for Public Services -->
      {#if filteredServices.length > 0}
        <div class="p-3 bg-zinc-50/60 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 text-[11px]">
            <span>Menampilkan <strong class="text-zinc-900 dark:text-zinc-100 font-mono">{(servicesCurrentPage - 1) * servicesPageSize + 1}</strong> - <strong class="text-zinc-900 dark:text-zinc-100 font-mono">{Math.min(servicesCurrentPage * servicesPageSize, filteredServices.length)}</strong> dari <strong class="text-zinc-900 dark:text-zinc-100 font-mono">{filteredServices.length}</strong> layanan</span>
            
            <span class="text-zinc-300 dark:text-zinc-700">•</span>

            <div class="flex items-center space-x-1">
              <span>Per halaman:</span>
              <select
                bind:value={servicesPageSize}
                on:change={() => servicesCurrentPage = 1}
                class="px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={32}>32</option>
              </select>
            </div>
          </div>

          <div class="flex items-center space-x-1">
            <button
              type="button"
              disabled={servicesCurrentPage === 1}
              on:click={() => goToServicesPage(servicesCurrentPage - 1)}
              class="px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ‹ Sebelumnya
            </button>

            {#each Array(servicesTotalPages) as _, idx}
              {@const p = idx + 1}
              <button
                type="button"
                on:click={() => goToServicesPage(p)}
                class="w-7 h-7 rounded-md text-xs font-mono font-medium transition-all {servicesCurrentPage === p ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
              >
                {p}
              </button>
            {/each}

            <button
              type="button"
              disabled={servicesCurrentPage === servicesTotalPages}
              on:click={() => goToServicesPage(servicesCurrentPage + 1)}
              class="px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Selanjutnya ›
            </button>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <!-- DEVELOPER & RESELLER API INTEGRATION -->
  <section class="max-w-6xl mx-auto ui-card rounded-2xl p-6 lg:p-8 space-y-4 bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-xl">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <span class="text-[10px] font-mono uppercase text-emerald-400 font-bold">Koneksi Otomatis Mitra Bisnis</span>
        <h3 class="text-lg font-bold text-white mt-0.5">Integrasi API untuk Reseller & Pemilik Website</h3>
      </div>
      <button
        type="button"
        on:click={() => goToApp('dashboard')}
        class="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-900 text-xs font-bold hover:bg-white transition-all self-start shadow"
      >
        Dapatkan Kunci Akses API →
      </button>
    </div>
    <p class="text-xs text-zinc-400 max-w-2xl leading-relaxed">
      Hubungkan website atau aplikasi Anda ke sistem Narasi Media untuk pemesanan otomatis dengan harga agen reseller termurah.
    </p>
    <div class="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto space-y-1">
      <div class="text-zinc-500"># Contoh request submit order via cURL</div>
      <div>curl -X POST https://api.narasi.media/api/v2 \</div>
      <div class="pl-4">-d "key=YOUR_API_KEY" \</div>
      <div class="pl-4">-d "action=add" \</div>
      <div class="pl-4">-d "service=101" \</div>
      <div class="pl-4">-d "link=https://instagram.com/akun_target" \</div>
      <div class="pl-4">-d "quantity=1000"</div>
    </div>
  </section>

  <!-- GEO FOCUS & REGIONAL COVERAGE SECTION (INDONESIA) -->
  <section id="jangkauan-wilayah" class="space-y-6 max-w-6xl mx-auto scroll-mt-20">
    <div class="text-center space-y-2 max-w-2xl mx-auto">
      <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20">
        <span>🇮🇩</span>
        <span>Jangkauan Nasional &amp; GEO Targeted Indonesia</span>
      </div>
      <h2 class="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Layanan SMM &amp; Buzzer Terintegrasi di Seluruh Wilayah Indonesia
      </h2>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
        Didukung infrastruktur server berkecepatan tinggi dengan optimasi algoritma lokal, transaksi mata uang Rupiah (IDR), dan pembayaran QRIS otomatis terhubung ke seluruh kota besar di Indonesia.
      </p>
    </div>

    <!-- Regional Coverage Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- 1. Jabodetabek -->
      <div class="ui-card rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">🏙️</span>
            <div>
              <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">DKI Jakarta &amp; Jabodetabek</h3>
              <span class="text-[10px] text-zinc-400 font-mono">SCBD, Sudirman, BSD, Depok, Bekasi</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">HQ Server</span>
        </div>
        <p class="text-[11px] text-zinc-500 leading-relaxed">
          Pusat operasional kampanye korporat, agency periklanan, dan buzzer trending Twitter/X &amp; TikTok FYP tercepat dengan latensi server &lt;10ms.
        </p>
        <div class="flex items-center space-x-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-zinc-400 font-mono">
          <span>⚡ SLA: Instan (&lt;60 detik)</span>
          <span>•</span>
          <span>Target: Real Indo</span>
        </div>
      </div>

      <!-- 2. Jawa Timur & Bali -->
      <div class="ui-card rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">🏝️</span>
            <div>
              <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Jawa Timur &amp; Bali</h3>
              <span class="text-[10px] text-zinc-400 font-mono">Surabaya, Malang, Denpasar, Badung</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">Hub Timur</span>
        </div>
        <p class="text-[11px] text-zinc-500 leading-relaxed">
          Optimasi media sosial industri hospitality, destinasi pariwisata, TikTok Live Shop, dan eksportir lokal dengan interaksi organik tinggi.
        </p>
        <div class="flex items-center space-x-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-zinc-400 font-mono">
          <span>📈 Garansi Refill 30 Hari</span>
          <span>•</span>
          <span>QRIS Aktif 24 Jam</span>
        </div>
      </div>

      <!-- 3. Jawa Barat & Banten -->
      <div class="ui-card rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">🎨</span>
            <div>
              <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Jawa Barat &amp; Banten</h3>
              <span class="text-[10px] text-zinc-400 font-mono">Bandung, Bogor, Cirebon, Serang</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">Kreatif Hub</span>
        </div>
        <p class="text-[11px] text-zinc-500 leading-relaxed">
          Penyedia followers dan likes aktif untuk ratusan brand fashion distro Bandung, resto kuliner, serta content creator Jawa Barat.
        </p>
        <div class="flex items-center space-x-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-zinc-400 font-mono">
          <span>👥 Jaringan 25.000+ Buzzer</span>
          <span>•</span>
          <span>Keamanan 100%</span>
        </div>
      </div>

      <!-- 4. Sumatera -->
      <div class="ui-card rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">🌿</span>
            <div>
              <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Pulau Sumatera</h3>
              <span class="text-[10px] text-zinc-400 font-mono">Medan, Palembang, Batam, Pekanbaru</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">Sumbagut/sel</span>
        </div>
        <p class="text-[11px] text-zinc-500 leading-relaxed">
          Mendukung ekspansi digital bisnis retail, e-commerce Batam, properti, dan engagement Instagram akun bisnis lokal di seluruh Sumatera.
        </p>
        <div class="flex items-center space-x-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-zinc-400 font-mono">
          <span>🛡️ Non-Drop Guarantee</span>
          <span>•</span>
          <span>Support Lokal</span>
        </div>
      </div>

      <!-- 5. Jawa Tengah & DI Yogyakarta -->
      <div class="ui-card rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">🏛️</span>
            <div>
              <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Jawa Tengah &amp; DIY</h3>
              <span class="text-[10px] text-zinc-400 font-mono">Semarang, Solo, Jogja, Purwokerto</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">Edukasi &amp; Seni</span>
        </div>
        <p class="text-[11px] text-zinc-500 leading-relaxed">
          Optimasi jam tayang monetisasi YouTube, engagement akun mahasiswa, instansi pendidikan, dan UMKM cinderamata Yogyakarta.
        </p>
        <div class="flex items-center space-x-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-zinc-400 font-mono">
          <span>📺 YouTube 4.000 Jam</span>
          <span>•</span>
          <span>Metode Organik</span>
        </div>
      </div>

      <!-- 6. Sulawesi & Indonesia Timur -->
      <div class="ui-card rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">🌅</span>
            <div>
              <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Kalimantan, Sulawesi &amp; Timur</h3>
              <span class="text-[10px] text-zinc-400 font-mono">Makassar, Manado, Balikpapan, Ambon</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400">Timur Indo</span>
        </div>
        <p class="text-[11px] text-zinc-500 leading-relaxed">
          Solusi optimasi digital untuk pengusaha regional di wilayah IKN Nusantara, Makassar, hingga Papua dengan kemudahan bayar QRIS instan.
        </p>
        <div class="flex items-center space-x-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-zinc-400 font-mono">
          <span>🚀 Serverless WASM</span>
          <span>•</span>
          <span>Uptime 99.98%</span>
        </div>
      </div>
    </div>

    <!-- Regional Trust & Payment Banner -->
    <div class="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center text-xl shadow-xs border border-zinc-200 dark:border-zinc-700">
          💳
        </div>
        <div>
          <div class="font-bold text-zinc-900 dark:text-zinc-100">Standar Transaksi Resmi Perbankan Indonesia</div>
          <div class="text-[11px] text-zinc-500">Mendukung QRIS Bank Indonesia, BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay.</div>
        </div>
      </div>
      <div class="flex items-center space-x-2 shrink-0">
        <span class="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
          🇮🇩 100% RUPIAH (IDR)
        </span>
        <span class="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
          ✓ BEBAS BIAYA ADMIN
        </span>
      </div>
    </div>
  </section>

  <!-- FAQ SECTION -->
  <section id="faq" class="space-y-6 max-w-3xl mx-auto scroll-mt-20">
    <div class="text-center space-y-2">
      <h2 class="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Pertanyaan Umum (FAQ)
      </h2>
      <p class="text-xs text-zinc-500">
        Hal-hal penting seputar keamanan akun, garansi, dan cara kerja Narasi Media.
      </p>
    </div>

    <div class="space-y-3">
      {#each [
        { q: 'Apakah akun saya aman dan tidak meminta password?', a: 'Sangat aman. Kami tidak pernah meminta password akun Anda sama sekali. Seluruh proses pengerjaan berjalan dari luar secara legal menggunakan username atau URL postingan publik.' },
        { q: 'Bagaimana cara kerja Garansi Refill jika terjadi penurunan?', a: 'Jika layanan memiliki badge Garansi Refill (30-365 hari) dan kuantitas berkurang, Anda cukup mengklik tombol Refill pada halaman Riwayat Pesanan di dashboard. Sistem otomatis mengisi ulang kembali.' },
        { q: 'Berapa minimal saldo untuk deposit?', a: 'Minimal deposit saldo hanya Rp 10.000 melalui QRIS otomatis dari semua m-Banking dan e-Wallet (BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay).' },
        { q: 'Berapa lama pesanan mulai dikerjakan?', a: 'Sebagian besar pesanan mulai berjalan dalam waktu 1 hingga 5 menit setelah submit ke server.' }
      ] as faq, i}
        <div class="ui-card rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <button
            type="button"
            on:click={() => toggleFaq(i)}
            class="w-full px-5 py-4 text-left text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
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

  <!-- COMPANY PROFILE FOOTER WITH SCBD ADDRESS & DIRECT WHATSAPP CS -->
  <footer id="kontak-kantor" class="border-t border-zinc-200 dark:border-zinc-800 pt-10 text-xs text-zinc-500 space-y-6 max-w-6xl mx-auto scroll-mt-20">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="space-y-2 md:col-span-2">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono font-bold text-xs flex items-center justify-center">
            NM
          </div>
          <span class="font-bold text-zinc-900 dark:text-zinc-100 text-sm">PT Narasi Media Solusindo</span>
        </div>
        <p class="text-xs text-zinc-500 max-w-sm leading-relaxed">
          Penyedia infrastruktur optimasi media sosial, penyedia jaringan amplifikasi narasi &amp; media digital terintegrasi, dan reseller panel SMM nomor 1 di Indonesia dengan sistem pengerjaan otomatis 24 jam nonstop.
        </p>
        <div class="space-y-1 text-[11px] text-zinc-400">
          <div>📍 <strong>Kantor Operasional:</strong> Gedung Cyber 2 Tower Lantai 18, Jl. HR Rasuna Said Blok X-5, Setiabudi, Jakarta Selatan 12950</div>
          <div>🏢 <strong>Perizinan:</strong> SK Kemenkumham AHU-0038921.AH.01.01 &bull; NIB 9120008412891 &bull; PSE Kominfo 008921.01/DJAI.PSE</div>
        </div>
      </div>

      <div class="space-y-2">
        <div class="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Navigasi Langsung</div>
        <ul class="space-y-1 text-xs">
          <li><a href="#interactive-simulator" class="hover:underline">Simulator Viral</a></li>
          <li><a href="#pricing-table" class="hover:underline">Daftar Harga Publik</a></li>
          <li><button type="button" on:click={() => goToApp('dashboard')} class="hover:underline">Dashboard Member</button></li>
          <li><button type="button" on:click={() => goToApp('new-order')} class="hover:underline">Buat Pesanan Baru</button></li>
        </ul>
      </div>

      <div class="space-y-2">
        <div class="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Customer Support Resmi</div>
        <p class="text-xs text-zinc-500">Layanan bantuan pelanggan 24/7 responsif.</p>
        <div class="space-y-1 pt-1">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <span>💬</span>
            <span>WhatsApp CS 24 Jam</span>
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-zinc-200 dark:border-zinc-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
      <div>© 2026 PT Narasi Media Solusindo. All rights reserved.</div>
      <div class="flex space-x-4">
        <span>Syarat & Ketentuan</span>
        <span>Kebijakan Privasi</span>
        <span>Dokumentasi API v2</span>
      </div>
    </div>
  </footer>
</div>
