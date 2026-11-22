<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fetchCategories, fetchServices, placeOrder, formatRupiah } from '../api.js';

  export let userBalance = 250000;
  export let userId = 'regiami';

  const dispatch = createEventDispatcher();

  let categories = [];
  let services = [];
  let selectedCategory = '';
  let selectedServiceId = '';
  let target = '';
  let quantity = 1000;
  let customComments = '';
  let isSubmitting = false;
  let orderResult = null;
  let errorMessage = '';

  onMount(async () => {
    categories = await fetchCategories();
    services = await fetchServices();
    if (categories.length > 0) {
      selectedCategory = categories[0].id;
    }
  });

  $: filteredServices = services.filter(s => s.category_id === selectedCategory);
  $: {
    if (filteredServices.length > 0 && !filteredServices.some(s => s.id === selectedServiceId)) {
      selectedServiceId = filteredServices[0].id;
    }
  }

  $: currentService = services.find(s => s.id === selectedServiceId) || null;
  $: pricePerK = currentService?.price_user?.amount || 0;
  $: calculatedPrice = Math.ceil((quantity / 1000) * pricePerK);
  $: isInsufficient = calculatedPrice > userBalance;

  async function handleSubmit() {
    errorMessage = '';
    orderResult = null;

    if (!target.trim()) {
      errorMessage = 'Target URL atau username tidak boleh kosong.';
      return;
    }

    if (currentService) {
      if (quantity < currentService.min_order || quantity > currentService.max_order) {
        errorMessage = `Jumlah pesanan harus antara ${currentService.min_order} dan ${currentService.max_order}.`;
        return;
      }
    }

    if (isInsufficient) {
      errorMessage = 'Saldo tidak mencukupi. Silakan lakukan deposit terlebih dahulu.';
      return;
    }

    isSubmitting = true;
    try {
      const res = await placeOrder({
        user_id: userId,
        service_id: selectedServiceId,
        target: target.trim(),
        quantity: parseInt(quantity),
        custom_comments: customComments.trim() ? customComments.split('\n') : null,
      });

      if (res.success) {
        orderResult = res.data;
        dispatch('orderCreated', { order: res.data, amountDeducted: calculatedPrice });
      } else {
        errorMessage = res.message || 'Gagal memproses pesanan.';
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
      <span class="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500"></span>
      <span>Pemesanan Baru (Single Order)</span>
    </h2>
    <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Pilih kategori, layanan, dan masukkan link postingan atau username target.</p>
  </div>

  {#if orderResult}
    <!-- Success Feedback Alert -->
    <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-2">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-bold text-sm">Pesanan Berhasil Disubmit!</span>
      </div>
      <p class="text-xs">
        ID Pesanan: <strong class="font-mono text-slate-900 dark:text-white">#{orderResult.id}</strong> • Total Biaya: <strong>{formatRupiah(calculatedPrice)}</strong>
      </p>
      <div class="pt-2">
        <button
          type="button"
          class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
          on:click={() => { orderResult = null; target = ''; }}
        >
          + Buat Pesanan Lainnya
        </button>
      </div>
    </div>
  {/if}

  {#if errorMessage}
    <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
      <svg class="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{errorMessage}</span>
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-5">
    <!-- Category Selector -->
    <div>
      <span class="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-2">1. Pilih Kategori</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {#each categories as cat}
          <button
            type="button"
            class="px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center space-x-2 {selectedCategory === cat.id ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-gray-800/40 dark:border-white/5 dark:text-gray-400 dark:hover:border-white/20'}"
            on:click={() => selectedCategory = cat.id}
          >
            <span class="w-2 h-2 rounded-full {selectedCategory === cat.id ? 'bg-indigo-600 dark:bg-indigo-400 animate-pulse' : 'bg-slate-400 dark:bg-gray-600'}"></span>
            <span class="truncate">{cat.name}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Service Dropdown -->
    <div>
      <label for="service-select" class="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-2">2. Pilih Layanan</label>
      <select
        id="service-select"
        bind:value={selectedServiceId}
        class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
      >
        {#each filteredServices as srv}
          <option value={srv.id}>
            [{srv.id}] {srv.name} — {formatRupiah(srv.price_user?.amount || 0)} / 1K
          </option>
        {/each}
      </select>
    </div>

    <!-- Service Spec Details Card -->
    {#if currentService}
      <div class="bg-slate-50 dark:bg-gradient-to-r dark:from-gray-900/90 dark:to-gray-800/60 border border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-3 transition-colors">
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center space-x-4">
            <div>
              <span class="text-slate-500 dark:text-gray-400 font-medium">Min:</span>
              <span class="text-slate-900 dark:text-gray-200 font-bold ml-1">{currentService.min_order?.toLocaleString()}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-gray-400 font-medium">Maks:</span>
              <span class="text-slate-900 dark:text-gray-200 font-bold ml-1">{currentService.max_order?.toLocaleString()}</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-gray-400 font-medium">Harga/1K:</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-bold ml-1">{formatRupiah(pricePerK)}</span>
            </div>
          </div>
          {#if currentService.refill_supported}
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
              🛡️ Refill {currentService.refill_days} Hari
            </span>
          {:else}
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-gray-700/50 dark:text-gray-400 border border-slate-300 dark:border-gray-600">
              Tanpa Refill
            </span>
          {/if}
        </div>
        <p class="text-xs text-slate-600 dark:text-gray-400 border-t border-slate-200 dark:border-white/5 pt-2 leading-relaxed">
          {currentService.description}
        </p>
      </div>
    {/if}

    <!-- Target Link / Username -->
    <div>
      <label for="order-target" class="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-2">3. Data Target (Link / Username)</label>
      <input
        id="order-target"
        type="text"
        bind:value={target}
        placeholder="https://www.instagram.com/p/... atau username"
        class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
        required
      />
    </div>

    <!-- Quantity & Real-time Total Price Calculator -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="order-quantity" class="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-2">4. Jumlah Pesan</label>
        <input
          id="order-quantity"
          type="number"
          bind:value={quantity}
          min={currentService?.min_order || 1}
          max={currentService?.max_order || 100000}
          class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono font-bold"
          required
        />
      </div>

      <!-- Real-time Price Preview Box -->
      <div class="bg-slate-100 dark:bg-gray-900/80 border border-slate-200 dark:border-white/10 rounded-xl p-3 flex flex-col justify-center transition-colors">
        <div class="text-[11px] text-slate-500 dark:text-gray-400 font-medium">Estimasi Total Harga:</div>
        <div class="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
          {formatRupiah(calculatedPrice)}
        </div>
        {#if isInsufficient}
          <div class="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1 flex items-center space-x-1">
            <span>⚠️ Saldo kurang Rp {formatRupiah(calculatedPrice - userBalance)}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Submit Button -->
    <div class="pt-2">
      <button
        type="submit"
        disabled={isSubmitting || isInsufficient}
        class="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
      >
        {#if isSubmitting}
          <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Memproses Pesanan...</span>
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Konfirmasi & Buat Pesanan ({formatRupiah(calculatedPrice)})</span>
        {/if}
      </button>
    </div>
  </form>
</div>
