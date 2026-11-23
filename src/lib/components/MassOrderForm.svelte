<script>
  import { massOrder, formatRupiah } from '../api.js';

  export let userId = 'regiami';

  let rawOrders = `SRV-101|https://instagram.com/akun_demo_1|500\nSRV-102|https://instagram.com/p/C-xyz123|1000\nSRV-201|https://tiktok.com/@narasi_id|300`;
  let isSubmitting = false;
  let batchResult = null;
  let errorMessage = '';

  $: linesCount = rawOrders.split('\n').filter(l => l.trim().length > 0).length;

  let errorTimer;
  function setError(msg) {
    if (errorTimer) clearTimeout(errorTimer);
    errorMessage = msg;
    errorTimer = setTimeout(() => {
      errorMessage = '';
    }, 6000);
  }

  async function handleBatchSubmit() {
    errorMessage = '';
    if (errorTimer) clearTimeout(errorTimer);
    batchResult = null;

    if (linesCount === 0) {
      setError('Silakan masukkan minimal satu baris pesanan.');
      return;
    }

    isSubmitting = true;
    try {
      const res = await massOrder(userId, rawOrders);
      if (res.success) {
        batchResult = res.data;
      } else {
        setError(res.message || 'Gagal memproses pesanan masal.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="ui-card rounded-xl p-6 lg:p-8 space-y-6">
  <div class="border-b border-zinc-200 dark:border-zinc-800 pb-4">
    <div class="flex items-center space-x-2">
      <span class="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
      <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Pesanan Masal (Batch Order)
      </h2>
    </div>
    <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Submit puluhan hingga ratusan pesanan sekaligus dalam format satu baris per pesanan.</p>
  </div>

  <!-- Instruction Inset -->
  <div class="ui-inset rounded-lg p-3.5 text-xs space-y-1.5">
    <div class="font-mono text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Format Syntax:</div>
    <div class="bg-white dark:bg-zinc-950 p-2.5 rounded border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-800 dark:text-zinc-200">
      ID_Layanan|Target_Link|Jumlah
    </div>
    <p class="text-[11px] text-zinc-500 dark:text-zinc-400">
      Contoh: <span class="font-mono text-zinc-700 dark:text-zinc-300">SRV-101|https://instagram.com/target|1000</span>
    </p>
  </div>

  {#if batchResult}
    <div class="ui-inset rounded-lg p-3.5 space-y-2 text-xs">
      <div class="flex items-center justify-between font-medium">
        <span class="text-zinc-700 dark:text-zinc-300">Hasil Pemrosesan:</span>
        <div class="flex space-x-3 font-mono text-[11px]">
          <span class="text-emerald-600 dark:text-emerald-400">✓ {batchResult.successful_orders} Sukses</span>
          {#if batchResult.failed_orders > 0}
            <span class="text-rose-500">✕ {batchResult.failed_orders} Gagal</span>
          {/if}
        </div>
      </div>
      <div class="max-h-48 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
        {#each batchResult.items as item}
          <div class="p-2 rounded flex items-center justify-between {item.success ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'}">
            <span class="truncate">#{item.line}: {item.raw}</span>
            <span class="font-bold uppercase text-[9px] ml-2 flex-shrink-0">
              {item.success ? 'Sukses' : item.error || 'Gagal'}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if errorMessage}
    <div class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center justify-between">
      <span>{errorMessage}</span>
      <button
        type="button"
        on:click={() => { if (errorTimer) clearTimeout(errorTimer); errorMessage = ''; }}
        class="text-rose-500 hover:text-rose-700 text-xs font-bold px-1"
        title="Tutup pesan error"
      >
        ✕
      </button>
    </div>
  {/if}

  <form on:submit|preventDefault={handleBatchSubmit} class="space-y-4">
    <div>
      <div class="flex justify-between items-center mb-2">
        <label for="mass-order-textarea" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Input Data ({linesCount} Baris)</label>
        <span class="text-[11px] text-zinc-400 font-mono">1 Baris = 1 Order</span>
      </div>
      <textarea
        id="mass-order-textarea"
        bind:value={rawOrders}
        rows="7"
        class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 transition-all leading-relaxed"
        placeholder="SRV-101|https://instagram.com/target|1000"
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={isSubmitting || linesCount === 0}
      class="w-full h-10 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 disabled:opacity-40 transition-all shadow-sm flex items-center justify-center space-x-2"
    >
      {#if isSubmitting}
        <span>Memproses Batch...</span>
      {:else}
        <span>Eksekusi {linesCount} Pesanan Masal</span>
      {/if}
    </button>
  </form>
</div>
