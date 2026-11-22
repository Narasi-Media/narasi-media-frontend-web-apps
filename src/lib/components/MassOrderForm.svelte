<script>
  import { massOrder, formatRupiah } from '../api.js';

  export let userId = 'regiami';

  let rawOrders = `SRV-101|https://instagram.com/akun_demo_1|500\nSRV-102|https://instagram.com/p/C-xyz123|1000\nSRV-201|https://tiktok.com/@buzzer_id|300`;
  let isSubmitting = false;
  let batchResult = null;
  let errorMessage = '';

  $: linesCount = rawOrders.split('\n').filter(l => l.trim().length > 0).length;

  async function handleBatchSubmit() {
    errorMessage = '';
    batchResult = null;

    if (linesCount === 0) {
      errorMessage = 'Silakan masukkan minimal satu baris pesanan.';
      return;
    }

    isSubmitting = true;
    try {
      const res = await massOrder(userId, rawOrders);
      if (res.success) {
        batchResult = res.data;
      } else {
        errorMessage = res.message || 'Gagal memproses pesanan masal.';
      }
    } catch (err) {
      errorMessage = err.message || 'Terjadi kesalahan sistem.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="glass-card rounded-2xl p-6 lg:p-8 space-y-6 transition-colors">
  <div class="border-b border-slate-200 dark:border-white/5 pb-4">
    <h2 class="text-xl font-bold text-slate-900 dark:text-gray-100 flex items-center space-x-2">
      <span class="w-3 h-3 rounded-full bg-violet-600 dark:bg-violet-500"></span>
      <span>Pesanan Masal (Mass Order)</span>
    </h2>
    <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Submit puluhan hingga ratusan pesanan sekaligus dalam satu klik.</p>
  </div>

  <!-- Instruction Box -->
  <div class="bg-slate-50 dark:bg-gray-900/80 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-xs space-y-2 transition-colors">
    <div class="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Format Syntax Pesanan Masal:</div>
    <div class="bg-slate-200/60 dark:bg-black/50 p-3 rounded-lg font-mono text-emerald-700 dark:text-emerald-300 text-xs border border-slate-300 dark:border-white/5">
      ID_Layanan|Target_Link|Jumlah
    </div>
    <p class="text-slate-600 dark:text-gray-400 leading-relaxed">
      Contoh:<br/>
      <span class="font-mono text-slate-800 dark:text-gray-300">SRV-101|https://instagram.com/brand_a|1000</span><br/>
      <span class="font-mono text-slate-800 dark:text-gray-300">SRV-201|https://tiktok.com/@brand_b|500</span>
    </p>
  </div>

  {#if batchResult}
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-white/10 space-y-3 transition-colors">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-slate-800 dark:text-gray-200">Hasil Pemrosesan Batch:</span>
        <div class="flex space-x-3">
          <span class="text-emerald-600 dark:text-emerald-400 font-bold">✓ {batchResult.successful_orders} Sukses</span>
          {#if batchResult.failed_orders > 0}
            <span class="text-rose-600 dark:text-rose-400 font-bold">✕ {batchResult.failed_orders} Gagal</span>
          {/if}
        </div>
      </div>
      <div class="max-h-60 overflow-y-auto space-y-1.5 pr-2">
        {#each batchResult.items as item}
          <div class="p-2.5 rounded-lg text-xs font-mono flex items-center justify-between {item.success ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20'}">
            <span class="truncate">Baris {item.line}: {item.raw}</span>
            <span class="font-bold uppercase tracking-wider text-[10px] ml-2 flex-shrink-0">
              {item.success ? 'Sukses' : item.error || 'Gagal'}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if errorMessage}
    <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
      {errorMessage}
    </div>
  {/if}

  <form on:submit|preventDefault={handleBatchSubmit} class="space-y-4">
    <div>
      <div class="flex justify-between items-center mb-2">
        <label for="mass-order-textarea" class="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider">Input Baris Pesanan ({linesCount} Baris)</label>
        <span class="text-[11px] text-slate-400 dark:text-gray-500 font-mono">1 Baris = 1 Pesanan</span>
      </div>
      <textarea
        id="mass-order-textarea"
        bind:value={rawOrders}
        rows="8"
        class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-white/10 rounded-xl p-4 text-xs font-mono text-slate-900 dark:text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed"
        placeholder="SRV-101|https://instagram.com/target|1000"
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={isSubmitting || linesCount === 0}
      class="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
    >
      {#if isSubmitting}
        <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Memproses Batch...</span>
      {:else}
        <span>Eksekusi {linesCount} Pesanan Masal Sekaligus</span>
      {/if}
    </button>
  </form>
</div>
