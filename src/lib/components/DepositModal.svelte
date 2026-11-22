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
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
  <div class="relative w-full max-w-md bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-zinc-900 dark:text-zinc-100 transition-colors">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
      <div>
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
          <span>Deposit Saldo QRIS</span>
        </h3>
        <p class="text-[11px] text-zinc-500 mt-0.5">BCA, Mandiri, BRI, Dana, GoPay, OVO, ShopeePay</p>
      </div>
      <button
        type="button"
        class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        on:click={closeModal}
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    {#if errorMessage}
      <div class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
        {errorMessage}
      </div>
    {/if}

    <!-- STEP 1: Input Nominal -->
    {#if step === 1}
      <div class="space-y-4">
        <div>
          <label for="deposit-amount-input" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Nominal Deposit</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-xs font-mono font-bold text-zinc-400">Rp</span>
            <input
              id="deposit-amount-input"
              type="number"
              bind:value={amount}
              min="10000"
              step="5000"
              class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 transition-all"
            />
          </div>
        </div>

        <!-- Quick Select Buttons -->
        <div>
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {#each quickAmounts as q}
              <button
                type="button"
                class="py-1.5 px-1 text-[11px] font-mono rounded border transition-all {amount === q ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 font-semibold' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'}"
                on:click={() => amount = q}
              >
                {formatRupiah(q)}
              </button>
            {/each}
          </div>
        </div>

        <!-- Info Proses Note -->
        <div class="ui-inset rounded-lg p-3 text-xs flex items-center justify-between">
          <span class="text-zinc-500 dark:text-zinc-400">Verifikasi Pembayaran:</span>
          <span class="font-medium text-zinc-800 dark:text-zinc-200">
            Otomatis & Nonstop 24 Jam
          </span>
        </div>

        <button
          type="button"
          class="w-full h-10 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-40"
          disabled={isSubmitting}
          on:click={handleCreateDeposit}
        >
          <span>Lanjutkan ke QRIS</span>
        </button>
      </div>
    {/if}

    <!-- STEP 2: QRIS Barcode & Upload Bukti Pembayaran -->
    {#if step === 2 && depositData}
      <div class="space-y-4">
        <!-- Transfer Exact Amount Card -->
        <div class="ui-inset rounded-lg p-3 text-center space-y-1">
          <div class="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Total Yang Harus Ditransfer:</div>
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
            {formatRupiah(depositData.total_to_pay?.amount || (amount + depositData.unique_code))}
          </div>
          <div class="text-[11px] text-zinc-500 font-medium">
            Termasuk 3-digit kode unik: <strong class="text-zinc-900 dark:text-zinc-100 font-mono">{depositData.unique_code}</strong>
          </div>
        </div>

        <!-- QRIS Barcode Container -->
        <div class="bg-white p-4 rounded-lg flex flex-col items-center justify-center space-y-1.5 max-w-[220px] mx-auto border border-zinc-200 shadow-sm">
          <div class="text-[10px] font-bold text-zinc-900 tracking-wider">QRIS STANDAR NASIONAL</div>
          <svg class="w-40 h-40" viewBox="0 0 100 100" fill="black">
            <rect x="5" y="5" width="25" height="25" fill="none" stroke="black" stroke-width="4" />
            <rect x="11" y="11" width="13" height="13" fill="black" />
            <rect x="70" y="5" width="25" height="25" fill="none" stroke="black" stroke-width="4" />
            <rect x="76" y="11" width="13" height="13" fill="black" />
            <rect x="5" y="70" width="25" height="25" fill="none" stroke="black" stroke-width="4" />
            <rect x="11" y="76" width="13" height="13" fill="black" />
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
          <div class="text-[9px] text-zinc-500 font-mono">NMID: ID20261122001</div>
        </div>

        <!-- Upload Proof Section -->
        <div class="space-y-3 pt-1">
          <div>
            <label for="sender-name-input" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Nama Pengirim</label>
            <input
              id="sender-name-input"
              type="text"
              bind:value={senderName}
              placeholder="Nama pemilik rekening / e-wallet"
              class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 transition-all font-medium"
            />
          </div>

          <div>
            <label for="proof-file-input" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Foto Bukti Struk</label>
            <input
              id="proof-file-input"
              type="file"
              accept="image/*"
              on:change={handleFileChange}
              class="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-zinc-100 file:text-zinc-800 dark:file:bg-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-200 cursor-pointer"
            />
          </div>

          {#if proofImagePreview}
            <div class="p-2 ui-inset rounded-lg flex items-center space-x-2 text-xs">
              <img src={proofImagePreview} alt="Preview Bukti" class="w-10 h-10 object-cover rounded border border-zinc-300 dark:border-zinc-700" />
              <span class="text-zinc-600 dark:text-zinc-300 font-medium">Foto siap dikirim</span>
            </div>
          {/if}

          <button
            type="button"
            class="w-full h-10 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-40 mt-2"
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
      <div class="text-center py-4 space-y-3">
        <div class="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Bukti Pembayaran Diterima</h4>
          <p class="text-xs text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Invoice Anda dalam antrean verifikasi staf admin. Saldo sebesar <strong>{formatRupiah(Math.floor(amount * 1.05))}</strong> akan langsung aktif setelah disetujui.
          </p>
        </div>
        <button
          type="button"
          class="h-9 px-4 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-all shadow-sm"
          on:click={closeModal}
        >
          Selesai & Tutup
        </button>
      </div>
    {/if}
  </div>
</div>
