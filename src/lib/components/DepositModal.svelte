<script>
  import { createEventDispatcher } from 'svelte';
  import { requestDeposit, submitDepositProof, formatRupiah } from '../api.js';

  export let userId = 'regiami';

  const dispatch = createEventDispatcher();

  let step = 1; // 1: Nominal, 2: QRIS Display & Upload Proof, 3: Completed
  let amount = 50000;
  let depositData = null;
  let senderName = '';
  let proofImagePreview = null;
  let isSubmitting = false;
  let errorMessage = '';

  const quickAmounts = [20000, 50000, 100000, 250000, 500000];

  async function handleCreateDeposit() {
    errorMessage = '';
    if (amount < 10000) {
      errorMessage = 'Minimal deposit adalah Rp 10.000';
      return;
    }

    isSubmitting = true;
    try {
      const res = await requestDeposit({
        user_id: userId,
        method: 'manual_qris',
        amount: parseInt(amount)
      });

      if (res.success) {
        depositData = res.data;
        step = 2;
      } else {
        errorMessage = res.message || 'Gagal membuat invoice deposit.';
      }
    } catch (err) {
      errorMessage = err.message || 'Terjadi kesalahan sistem.';
    } finally {
      isSubmitting = false;
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        proofImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmitProof() {
    errorMessage = '';
    if (!senderName.trim()) {
      errorMessage = 'Masukkan nama akun pengirim (contoh: Budi Santoso / Akun Dana)';
      return;
    }
    if (!proofImagePreview) {
      errorMessage = 'Silakan pilih file foto / screenshot bukti transfer QRIS.';
      return;
    }

    isSubmitting = true;
    try {
      const res = await submitDepositProof(depositData.id, senderName, proofImagePreview);
      if (res.success) {
        step = 3;
        dispatch('depositSubmitted', depositData);
      } else {
        errorMessage = res.message || 'Gagal mengunggah bukti.';
      }
    } catch (err) {
      errorMessage = err.message || 'Terjadi kesalahan sistem.';
    } finally {
      isSubmitting = false;
    }
  }

  function closeModal() {
    dispatch('close');
  }
</script>

<!-- Modal Overlay -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
  <div class="relative w-full max-w-lg glass-card bg-gray-950 border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-white/5 pb-4">
      <div>
        <h3 class="text-lg font-bold text-gray-100 flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Deposit Saldo via QRIS Manual</span>
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">Scan barcode QRIS dari BCA, Mandiri, Dana, GoPay, OVO, ShopeePay</p>
      </div>
      <button
        class="text-gray-400 hover:text-gray-200 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
        on:click={closeModal}
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {#if errorMessage}
      <div class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
        <span>⚠️ {errorMessage}</span>
      </div>
    {/if}

    <!-- STEP 1: Input Nominal -->
    {#if step === 1}
      <div class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Pilih / Masukkan Nominal Deposit</label>
          <div class="relative">
            <span class="absolute left-4 top-3.5 text-sm font-bold text-gray-500 font-mono">Rp</span>
            <input
              type="number"
              bind:value={amount}
              min="10000"
              step="5000"
              class="w-full bg-gray-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-lg font-bold font-mono text-emerald-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <!-- Quick Select Buttons -->
        <div>
          <div class="text-[11px] text-gray-400 font-medium mb-2">Pilihan Cepat:</div>
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {#each quickAmounts as q}
              <button
                type="button"
                class="py-2 px-1 text-xs font-semibold rounded-xl border transition-all {amount === q ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm' : 'bg-gray-800/40 border-white/5 text-gray-400 hover:text-gray-200'}"
                on:click={() => amount = q}
              >
                {formatRupiah(q)}
              </button>
            {/each}
          </div>
        </div>

        <!-- Promo Bonus Note -->
        <div class="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-indigo-300 flex items-start space-x-2">
          <span class="text-base">🎁</span>
          <div>
            <strong class="font-bold">Promo Bonus Saldo +5%:</strong>
            <p class="text-indigo-400/90 text-[11px] mt-0.5">
              Deposit Rp {formatRupiah(amount)} akan menghasilkan saldo masuk sebesar <strong>{formatRupiah(Math.floor(amount * 1.05))}</strong>.
            </p>
          </div>
        </div>

        <button
          class="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          disabled={isSubmitting}
          on:click={handleCreateDeposit}
        >
          <span>Lanjutkan ke Pembayaran QRIS</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    {/if}

    <!-- STEP 2: QRIS Barcode & Upload Bukti Pembayaran -->
    {#if step === 2 && depositData}
      <div class="space-y-5">
        <!-- Transfer Exact Amount Card -->
        <div class="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-5 text-center space-y-2">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Transfer Tepat Hingga 3 Digit Terakhir:</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight bg-black/40 py-2.5 px-4 rounded-xl border border-white/5 inline-block">
            {formatRupiah(depositData.total_to_pay?.amount || (amount + depositData.unique_code))}
          </div>
          <div class="text-[11px] text-amber-400 font-medium">
            ⚠️ Termasuk kode unik: <strong>{depositData.unique_code}</strong> (agar verifikasi cepat)
          </div>
        </div>

        <!-- Official QRIS Barcode Render -->
        <div class="bg-white p-5 rounded-2xl flex flex-col items-center justify-center space-y-2 max-w-xs mx-auto shadow-xl">
          <div class="text-xs font-black text-gray-900 tracking-wider uppercase flex items-center space-x-1">
            <span>QRIS BUZZER MEDIA</span>
          </div>
          <!-- Clean SVG QR Code Representation -->
          <svg class="w-48 h-48" viewBox="0 0 100 100" fill="black">
            <!-- Outer border / markers -->
            <rect x="5" y="5" width="25" height="25" fill="none" stroke="black" stroke-width="4" />
            <rect x="11" y="11" width="13" height="13" fill="black" />
            <rect x="70" y="5" width="25" height="25" fill="none" stroke="black" stroke-width="4" />
            <rect x="76" y="11" width="13" height="13" fill="black" />
            <rect x="5" y="70" width="25" height="25" fill="none" stroke="black" stroke-width="4" />
            <rect x="11" y="76" width="13" height="13" fill="black" />
            <!-- Inner cyber dots -->
            <rect x="36" y="8" width="6" height="6" />
            <rect x="48" y="14" width="6" height="6" />
            <rect x="40" y="24" width="6" height="6" />
            <rect x="52" y="30" width="6" height="6" />
            <rect x="8" y="42" width="6" height="6" />
            <rect x="20" y="48" width="6" height="6" />
            <rect x="34" y="46" width="6" height="6" />
            <rect x="44" y="44" width="12" height="12" />
            <rect x="62" y="48" width="6" height="6" />
            <rect x="76" y="40" width="6" height="6" />
            <rect x="86" y="48" width="6" height="6" />
            <rect x="40" y="66" width="6" height="6" />
            <rect x="50" y="76" width="6" height="6" />
            <rect x="68" y="66" width="6" height="6" />
            <rect x="78" y="74" width="6" height="6" />
            <rect x="64" y="86" width="6" height="6" />
          </svg>
          <div class="text-[10px] text-gray-600 font-semibold uppercase">NMID: ID20261122001</div>
        </div>

        <!-- Upload Proof Section -->
        <div class="space-y-3 pt-2">
          <div>
            <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Nama Akun Pengirim Rekening / E-Wallet</label>
            <input
              type="text"
              bind:value={senderName}
              placeholder="Contoh: Budi Santoso (BCA) / Akun Dana"
              class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Unggah Foto / Screenshot Bukti Struk</label>
            <input
              type="file"
              accept="image/*"
              on:change={handleFileChange}
              class="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/30 file:text-indigo-300 hover:file:bg-indigo-600 hover:file:text-white transition-all cursor-pointer"
            />
          </div>

          {#if proofImagePreview}
            <div class="mt-2 p-2 bg-black/40 border border-white/10 rounded-xl flex items-center space-x-3">
              <img src={proofImagePreview} alt="Preview Bukti" class="w-16 h-16 object-cover rounded-lg border border-white/10" />
              <div class="text-xs text-emerald-400 font-semibold">
                ✓ Bukti foto siap diunggah
              </div>
            </div>
          {/if}

          <button
            class="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
            disabled={isSubmitting}
            on:click={handleSubmitProof}
          >
            {#if isSubmitting}
              <span>Mengunggah Bukti...</span>
            {:else}
              <span>Kirim Bukti Pembayaran</span>
            {/if}
          </button>
        </div>
      </div>
    {/if}

    <!-- STEP 3: Completed / Waiting Verification -->
    {#if step === 3}
      <div class="text-center py-6 space-y-4">
        <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h4 class="text-lg font-bold text-gray-100">Bukti Pembayaran Terkirim!</h4>
          <p class="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Invoice Anda sedang dalam antrean verifikasi staf keuangan admin. Saldo sebesar <strong>{formatRupiah(Math.floor(amount * 1.05))}</strong> akan langsung masuk setelah diverifikasi (estimasi 1 - 5 menit).
          </p>
        </div>
        <button
          class="py-2.5 px-6 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
          on:click={closeModal}
        >
          Selesai & Tutup
        </button>
      </div>
    {/if}
  </div>
</div>
