<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let show = false;
  export let initialMode = 'tour'; // 'tour' or 'docs'

  const dispatch = createEventDispatcher();

  let mode = initialMode;
  let currentStep = 0;
  let activeDocCategory = 'quickstart';
  let docSearchQuery = '';

  $: if (show) {
    mode = initialMode;
  }

  // 1. TOUR STEPS DATA
  const tourSteps = [
    {
      id: 'dashboard',
      tabTarget: 'dashboard',
      badge: 'Langkah 1 / 6',
      icon: '📊',
      title: 'Dashboard & Pemantauan Saldo Real-Time',
      summary: 'Pusat kontrol akun untuk memantau saldo, omset pengeluaran, dan status kesehatan server pemrosesan.',
      details: [
        'Saldo Akun: Menampilkan sisa dana Anda yang siap digunakan untuk memesan ribuan layanan kapan saja.',
        'Metrik Pengeluaran: Pantau total pesanan yang selesai dan akumulasi dana yang telah dialokasikan.',
        'Status Server 24 Jam: Sistem kami terhubung langsung ke edge worker dengan latensi pemrosesan super cepat (<60 detik).'
      ],
      tip: 'Anda dapat menekan tombol "+ Top Up" di navbar kapan saja untuk mengisi saldo via QRIS otomatis.'
    },
    {
      id: 'new-order',
      tabTarget: 'new-order',
      badge: 'Langkah 2 / 6',
      icon: '🛒',
      title: 'Membuat Pesanan Layanan Baru',
      summary: 'Pilih ribuan layanan sosial media (Instagram, TikTok, YouTube, X) dengan harga modal termurah se-Indonesia.',
      details: [
        'Pilih Platform: Filter kategori sesuai kebutuhan Anda (contoh: TikTok Followers, Instagram Likes, YouTube Views).',
        'Input Link Target: Masukkan hanya username atau link postingan publik. Kami TIDAK PERNAH meminta password.',
        'Kalkulasi Otomatis: Masukkan kuantitas, sistem akan menghitung total biaya secara instan sebelum Anda checkout.'
      ],
      tip: 'Pastikan akun target Anda berstatus Publik (tidak di-private) selama proses pengiriman berlangsung.'
    },
    {
      id: 'mass-order',
      tabTarget: 'mass-order',
      badge: 'Langkah 3 / 6',
      icon: '⚡',
      title: 'Pemesanan Massal (Mass Order)',
      summary: 'Kirim puluhan hingga ratusan pesanan berbeda dalam satu kali klik untuk efisiensi agensi dan reseller.',
      details: [
        'Format Sederhana: Tulis satu baris per pesanan dengan format: ID_Layanan | URL_Target | Kuantitas.',
        'Contoh Penggunaan: 101 | https://instagram.com/akun1 | 1000.',
        'Validasi Otomatis: Sistem akan memeriksa saldo dan mengeksekusi seluruh antrean secara paralel.'
      ],
      tip: 'Gunakan fitur ini jika Anda mengelola banyak akun klien sekaligus untuk menghemat waktu.'
    },
    {
      id: 'deposit',
      tabTarget: 'dashboard',
      badge: 'Langkah 4 / 6',
      icon: '💳',
      title: 'Deposit Saldo Instan via QRIS Otomatis',
      summary: 'Isi saldo 24 jam nonstop dengan QRIS Standar Bank Indonesia dari semua bank dan e-wallet.',
      details: [
        'Dukungan Penuh: BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay, LinkAja.',
        'Kode Unik 3 Digit: Nominal otomatis ditambahkan 3 digit acak untuk verifikasi instan tanpa salah sasaran.',
        'Modern Drag & Drop Struk: Cukup seret atau pilih screenshot bukti transfer Anda, saldo akan langsung disetujui.'
      ],
      tip: 'Seluruh pembayaran 100% dalam mata uang Rupiah (IDR) tanpa biaya admin tambahan.'
    },
    {
      id: 'history',
      tabTarget: 'history',
      badge: 'Langkah 5 / 6',
      icon: '🛡️',
      title: 'Riwayat Pesanan & Garansi Refill 30 Hari',
      summary: 'Lacak kemajuan pesanan (Pending, Processing, Success, Partial) dan klaim pengisian ulang mandiri.',
      details: [
        'Progress Counter: Pantau kuantitas awal (start count) dan sisa target (remains) secara transparan.',
        'Tombol Refill Mandiri: Jika layanan bergaransi mengalami penurunan kuantitas, tombol Refill akan aktif otomatis.',
        'Penanganan Error Cepat: Jika target salah atau link private, sistem membatalkan pesanan dan mengembalikan saldo 100%.'
      ],
      tip: 'Klaim refill dapat ditekan setiap 24 jam sekali selama masa garansi aktif.'
    },
    {
      id: 'demo-mode',
      tabTarget: 'dashboard',
      badge: 'Langkah 6 / 6',
      icon: '🎮',
      title: 'Mode Akun Demo (@regiami) & Eksplorasi Aman',
      summary: 'Fitur sandbox bebas risiko untuk menguji seluruh alur kerja sistem Narasi Media sebelum bertransaksi riil.',
      details: [
        'Saldo Simulasi Rp 500.000: Saldo khusus demo untuk mencoba submit order dan deposit struk.',
        'Isolasi Data: Seluruh transaksi berlabel [DEMO] dan tidak mengotori pembukuan atau database produksi.',
        'Mudah Beralih: Anda dapat mengganti ke akun produksi riil kapan saja melalui tombol "Keluar" atau "Ganti Akun".'
      ],
      tip: 'Akun demo ini sangat cocok untuk mempelajari sistem atau presentasi kepada tim Anda.'
    }
  ];

  // 2. KNOWLEDGE BASE ARTICLES DATA
  const docArticles = [
    {
      category: 'quickstart',
      title: 'Panduan Memulai Cepat (Quickstart 3 Menit)',
      icon: '🚀',
      content: `
### Cara Memulai di Narasi Media
Selamat datang di platform **Narasi Media**. Ikuti 3 langkah mudah berikut untuk melakukan pemesanan pertama Anda:

1. **Masuk ke Akun Anda**:
   Gunakan akun riil Anda atau coba langsung menggunakan **Akun Demo (@regiami)** untuk menjelajah tanpa risiko.
2. **Periksa Saldo atau Lakukan Top Up**:
   Klik tombol **"+ Top Up"** pada navbar untuk membuat invoice deposit QRIS. Saldo minimal deposit hanya Rp 10.000.
3. **Pilih Layanan & Masukkan Target Link**:
   Buka tab **Pesan Baru**, pilih platform (Instagram, TikTok, YouTube), masukkan URL target publik, dan klik **Buat Pesanan**.
4. **Pantau di Riwayat Transaksi**:
   Buka tab **Riwayat** untuk melihat status pesanan yang langsung dikirim ke server pemrosesan otomatis.
      `
    },
    {
      category: 'order-rules',
      title: 'Ketentuan Format Link & Aturan Pemesanan',
      icon: '🛒',
      content: `
### Format Target Link yang Benar per Platform

Untuk memastikan pesanan Anda tidak mengalami error atau pembatalan otomatis, gunakan format URL target berikut:

* **Instagram Followers**: \`https://instagram.com/username\` atau cukup tulis \`@username\`.
* **Instagram Likes / Views**: \`https://instagram.com/p/CODE_POSTINGAN/\` atau link Reels \`https://instagram.com/reel/CODE/\`.
* **TikTok Followers**: \`https://tiktok.com/@username\`.
* **TikTok Video Views / Likes**: \`https://vt.tiktok.com/CODE/\` atau link web \`https://tiktok.com/@user/video/1234567\`.
* **YouTube Subscribers / Jam Tayang**: \`https://youtube.com/@NamaChannel\` atau link video \`https://youtube.com/watch?v=VIDEO_ID\`.
* **Twitter / X Followers & Retweet**: \`https://x.com/username\` atau tautan status tweet.

> [!WARNING]
> **PENTING**: Akun target HARUS berstatus **PUBLIK** (tidak digembok / private). Jangan mengubah username akun selama proses pengiriman masih berstatus *Processing*.
      `
    },
    {
      category: 'deposit-qris',
      title: 'Panduan Deposit QRIS & Kode Unik',
      icon: '💳',
      content: `
### Alur Deposit QRIS Otomatis & Manual

Narasi Media mendukung pembayaran QRIS Standar Bank Indonesia yang dapat dibayar dari aplikasi m-Banking (BCA, Mandiri, BRI, BNI, CIMB, Permata) serta seluruh dompet digital (GoPay, OVO, Dana, ShopeePay).

1. **Membuat Tagihan Deposit**:
   Masukkan nominal yang ingin Anda setor (contoh: Rp 50.000). Sistem akan secara otomatis menambahkan **3 digit kode unik** (contoh: Rp 50.387).
2. **Transfer Sesuai Nominal Persis**:
   Pastikan Anda mentransfer sesuai angka hingga 3 digit terakhir agar sistem dapat mencocokkan mutasi rekening Anda secara instan.
3. **Upload Bukti Struk Transfer**:
   Gunakan formulir **Drag & Drop** modern kami untuk mengunggah screenshot struk pembayaran (format JPG, PNG, atau WEBP maks 5MB).
4. **Saldo Dikreditkan**:
   Setelah disetujui, saldo sebesar nominal permintaan + kode unik (atau bonus deposit) akan langsung aktif di saldo akun Anda.
      `
    },
    {
      category: 'refill-policy',
      title: 'Kebijakan Garansi Refill & Penurunan Kuantitas',
      icon: '🛡️',
      content: `
### Bagaimana Cara Kerja Garansi Refill?

Sebagian besar layanan berkualitas tinggi di Narasi Media dilengkapi dengan **Garansi Refill (30 hingga 365 hari)**:

* **Pemicu Refill**:
  Jika setelah beberapa hari kuantitas followers atau views mengalami penurunan alami dan berada di bawah jumlah target pesanan, Anda berhak mendapatkan pengisian ulang gratis.
* **Cara Klaim Refill Mandiri**:
  1. Masuk ke tab **Riwayat Transaksi**.
  2. Cari pesanan yang memiliki badge *Refill Didukung*.
  3. Klik tombol **Refill** di kolom Aksi.
  4. Permintaan Anda akan langsung diteruskan ke provider server untuk proses pengisian ulang.
* **Interval Refill**:
  Klaim refill dapat diajukan kembali setiap 24 jam sekali sampai masa garansi berakhir.
      `
    },
    {
      category: 'demo-sandbox',
      title: 'Penjelasan Mode Simulasi & Akun Demo (@regiami)',
      icon: '⚡',
      content: `
### Mengapa Ada Fitur Akun Demo?

Kami menyediakan akun demo khusus (**@regiami**) agar calon mitra, agensi, dan reseller dapat menguji seluruh kemampuan sistem tanpa harus mendepositkan uang riil terlebih dahulu:

* **Ciri Visual Akun Demo**:
  * Terdapat badge kuning mencolok \`[DEMO MODE]\` di navbar.
  * Teks indikator menunjukkan \`Saldo Demo Rp 500.000 (SIMULASI)\`.
  * Banner peringatan di bagian atas mengingatkan mode sandbox aktif.
* **Flagging Transaksi Otomatis**:
  * Seluruh order diberi kode \`DEMO-ORD-...\` dengan parameter \`is_demo: true\`.
  * Pada Admin Panel, pesanan demo ditandai dengan badge khusus \`⚡ DEMO\` sehingga tidak mengganggu laporan keuangan atau operasional riil.
* **Kredensial Login Demo**:
  * Username: \`regiami\`
  * Password: \`Regi@Dem026!\`
      `
    },
    {
      category: 'api-reseller',
      title: 'Dokumentasi Integrasi API Reseller (v2)',
      icon: '🔌',
      content: `
### Integrasi API untuk Pemilik Website SMM & Developer

Narasi Media menyediakan REST API cURL berkecepatan tinggi yang kompatibel dengan protokol standar industri SMM (PerfectPanel, SmartPanel, dsb):

\`\`\`bash
# Endpoint API
POST https://narasi-media-api.narasi-media.workers.dev/api/v2

# Parameter Tambah Pesanan (Add Order)
curl -X POST https://narasi-media-api.narasi-media.workers.dev/api/v2 \\
  -d "key=YOUR_API_KEY" \\
  -d "action=add" \\
  -d "service=101" \\
  -d "link=https://instagram.com/target_username" \\
  -d "quantity=1000"
\`\`\`

* **Parameter Wajib**:
  * \`key\`: Kunci API rahasia Anda (dapat disalin dari tab Profil Akun).
  * \`action\`: \`services\` (cek katalog), \`add\` (buat order), \`status\` (cek progress), \`balance\` (cek saldo).
      `
    }
  ];

  $: filteredDocArticles = docArticles.filter(art => {
    if (!docSearchQuery) return true;
    const q = docSearchQuery.toLowerCase();
    return art.title.toLowerCase().includes(q) || art.content.toLowerCase().includes(q);
  });

  $: currentDoc = docArticles.find(a => a.category === activeDocCategory) || docArticles[0];

  function nextStep() {
    if (currentStep < tourSteps.length - 1) {
      currentStep += 1;
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep -= 1;
    }
  }

  function jumpToStep(idx) {
    currentStep = idx;
  }

  function navigateToTab(tab) {
    dispatch('navigateToTab', tab);
    close();
  }

  function close() {
    dispatch('close');
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-900 dark:text-zinc-100 transition-colors"
    >
      <!-- HEADER -->
      <div class="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/70 dark:bg-zinc-900/40">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-xs">
            📖
          </div>
          <div>
            <h2 class="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <span>Pusat Panduan &amp; Onboarding Narasi Media</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                Resmi
              </span>
            </h2>
            <p class="text-[11px] text-zinc-500 dark:text-zinc-400">
              Pelajari seluruh alur kerja, tips order, deposit QRIS, dan garansi refill tanpa bingung.
            </p>
          </div>
        </div>

        <!-- Mode Toggle & Close -->
        <div class="flex items-center space-x-2 self-end sm:self-auto">
          <div class="bg-zinc-200/70 dark:bg-zinc-800 p-0.5 rounded-lg flex items-center text-xs font-semibold">
            <button
              type="button"
              class="px-3 py-1 rounded-md transition-all {mode === 'tour' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}"
              on:click={() => mode = 'tour'}
            >
              🎯 Tour Interaktif
            </button>
            <button
              type="button"
              class="px-3 py-1 rounded-md transition-all {mode === 'docs' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}"
              on:click={() => mode = 'docs'}
            >
              📚 Panduan Bacaan
            </button>
          </div>

          <button
            type="button"
            class="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Tutup (Esc)"
            on:click={close}
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- BODY CONTENT -->
      <div class="flex-1 overflow-y-auto">
        <!-- ========================================================================= -->
        <!-- MODE 1: STEP-BY-STEP INTERACTIVE WALKTHROUGH TOUR -->
        <!-- ========================================================================= -->
        {#if mode === 'tour'}
          {@const step = tourSteps[currentStep]}
          <div class="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <!-- Step Progress Indicator -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-medium text-zinc-500">
                <span class="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">{step.badge}</span>
                <span class="font-mono text-[11px]">{currentStep + 1} dari {tourSteps.length} langkah</span>
              </div>
              <!-- Progress Bar -->
              <div class="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                  style="width: {((currentStep + 1) / tourSteps.length) * 100}%"
                ></div>
              </div>
            </div>

            <!-- Step Cards Content -->
            <div class="ui-card p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5 bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900/70 dark:to-zinc-900/30 shadow-sm animate-in fade-in duration-200">
              <div class="flex items-start space-x-3.5">
                <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                  {step.icon}
                </div>
                <div class="space-y-1">
                  <h3 class="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {step.title}
                  </h3>
                  <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {step.summary}
                  </p>
                </div>
              </div>

              <!-- Bullet Points Detail -->
              <div class="space-y-2.5 pt-2 border-t border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
                {#each step.details as item}
                  <div class="flex items-start space-x-2.5">
                    <span class="text-blue-500 font-bold leading-none mt-0.5">✓</span>
                    <span class="leading-relaxed">{item}</span>
                  </div>
                {/each}
              </div>

              <!-- Helpful Tip Box -->
              {#if step.tip}
                <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-2.5">
                  <span class="text-sm shrink-0">💡</span>
                  <div class="leading-relaxed">
                    <strong>Tips Praktis:</strong> {step.tip}
                  </div>
                </div>
              {/if}

              <!-- Direct Action Link Button to Tab -->
              <div class="pt-2">
                <button
                  type="button"
                  on:click={() => navigateToTab(step.tabTarget)}
                  class="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 shadow-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Buka &amp; Coba Fitur Ini Sekarang</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            <!-- Steps Dots Selector -->
            <div class="flex items-center justify-center space-x-2 pt-2">
              {#each tourSteps as s, i}
                <button
                  type="button"
                  on:click={() => jumpToStep(i)}
                  class="h-2 rounded-full transition-all {currentStep === i ? 'w-6 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'}"
                  title={s.title}
                ></button>
              {/each}
            </div>

            <!-- Navigation Controls -->
            <div class="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <button
                type="button"
                disabled={currentStep === 0}
                on:click={prevStep}
                class="px-4 py-2 rounded-xl font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ‹ Sebelumnya
              </button>

              <button
                type="button"
                on:click={() => mode = 'docs'}
                class="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium underline text-[11px]"
              >
                Lihat Panduan Bacaan Lengkap &rarr;
              </button>

              {#if currentStep < tourSteps.length - 1}
                <button
                  type="button"
                  on:click={nextStep}
                  class="px-4 py-2 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center space-x-1"
                >
                  <span>Selanjutnya</span>
                  <span>›</span>
                </button>
              {:else}
                <button
                  type="button"
                  on:click={close}
                  class="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
                >
                  Selesai &amp; Mulai Menggunakan ✓
                </button>
              {/if}
            </div>
          </div>

        <!-- ========================================================================= -->
        <!-- MODE 2: KNOWLEDGE BASE READING GUIDE -->
        <!-- ========================================================================= -->
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            <!-- Sidebar Category Navigation (4 cols) -->
            <div class="md:col-span-4 border-r border-zinc-200 dark:border-zinc-800 p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/30">
              <!-- Search Input inside docs -->
              <div class="relative">
                <input
                  type="text"
                  bind:value={docSearchQuery}
                  placeholder="Cari topik panduan..."
                  class="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                />
                <span class="absolute left-2.5 top-2 text-zinc-400 text-xs">🔍</span>
              </div>

              <!-- Category Menu List -->
              <nav class="space-y-1">
                {#each filteredDocArticles as article}
                  <button
                    type="button"
                    on:click={() => activeDocCategory = article.category}
                    class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all {activeDocCategory === article.category ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 font-medium'}"
                  >
                    <span class="text-sm shrink-0">{article.icon}</span>
                    <span class="truncate">{article.title}</span>
                  </button>
                {/each}
              </nav>

              <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-2">
                <div class="font-bold text-zinc-700 dark:text-zinc-300">Butuh Bantuan Lain?</div>
                <p class="leading-relaxed">
                  Hubungi tim operasional 24 Jam kami melalui WhatsApp di SCBD Jakarta.
                </p>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Narasi%20Media%2C%20saya%20butuh%20bantuan%20fitur"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  <span>Chat WhatsApp CS 24 Jam &rarr;</span>
                </a>
              </div>
            </div>

            <!-- Reading Content Pane (8 cols) -->
            <div class="md:col-span-8 p-6 sm:p-8 space-y-4 overflow-y-auto">
              <div class="flex items-center space-x-2.5 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span class="text-2xl">{currentDoc.icon}</span>
                <h3 class="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {currentDoc.title}
                </h3>
              </div>

              <!-- Article Content Display -->
              <div class="prose dark:prose-invert max-w-none text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-3 font-sans">
                <!-- Render structured text -->
                {#each currentDoc.content.trim().split('\n\n') as paragraph}
                  {#if paragraph.startsWith('### ')}
                    <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
                      {paragraph.replace('### ', '')}
                    </h4>
                  {:else if paragraph.startsWith('> [!WARNING]')}
                    <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed my-2">
                      {@html paragraph.replace('> [!WARNING]\n> ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                    </div>
                  {:else if paragraph.startsWith('```')}
                    <div class="p-4 rounded-xl bg-zinc-900 dark:bg-black border border-zinc-800 font-mono text-[11px] text-zinc-200 overflow-x-auto my-3">
                      <pre>{paragraph.replace(/```[a-z]*\n?/g, '').trim()}</pre>
                    </div>
                  {:else if paragraph.includes('* ')}
                    <ul class="list-disc pl-5 space-y-1.5 my-2">
                      {#each paragraph.split('\n') as item}
                        {#if item.trim().startsWith('* ')}
                          <li>{@html item.replace('* ', '').replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">$1</code>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
                        {/if}
                      {/each}
                    </ul>
                  {:else if paragraph.match(/^[0-9]\. /)}
                    <ol class="list-decimal pl-5 space-y-2 my-2">
                      {#each paragraph.split('\n') as item}
                        {#if item.trim().match(/^[0-9]\. /)}
                          <li>{@html item.replace(/^[0-9]\. /, '').replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">$1</code>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
                        {/if}
                      {/each}
                    </ol>
                  {:else}
                    <p>{@html paragraph.replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">$1</code>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
                  {/if}
                {/each}
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- FOOTER -->
      <div class="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-500">
        <div class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[11px]">Sistem Narasi Media v2.4 • Operasional Aktif</span>
        </div>
        <button
          type="button"
          on:click={close}
          class="px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-medium text-xs transition-all shadow-2xs"
        >
          Tutup Jendela Panduan
        </button>
      </div>
    </div>
  </div>
{/if}
