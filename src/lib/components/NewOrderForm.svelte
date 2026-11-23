<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fetchCategories, fetchServices, placeOrder, formatRupiah } from '../api.js';

  export let userBalance = 500000;
  export let userId = 'regiami';
  export let isDemo = true;

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

  $: filteredServices = services.filter(s => s.category_id === selectedCategory && s.is_active !== false);
  $: {
    if (filteredServices.length > 0 && !filteredServices.some(s => s.id === selectedServiceId)) {
      selectedServiceId = filteredServices[0].id;
    }
  }

  $: currentService = services.find(s => s.id === selectedServiceId) || null;
  $: pricePerK = currentService?.price_user?.amount || 0;
  $: calculatedPrice = Math.ceil((quantity / 1000) * pricePerK);
  $: isInsufficient = calculatedPrice > userBalance;

  let errorTimer;
  function setError(msg) {
    if (errorTimer) clearTimeout(errorTimer);
    errorMessage = msg;
    errorTimer = setTimeout(() => {
      errorMessage = '';
    }, 6000);
  }

  let orderResultTimer;
  let orderCountdown = 8;
  function setOrderSuccess(data) {
    orderResult = data;
    orderCountdown = 8;
    if (orderResultTimer) clearInterval(orderResultTimer);
    orderResultTimer = setInterval(() => {
      orderCountdown -= 1;
      if (orderCountdown <= 0) {
        clearInterval(orderResultTimer);
        orderResult = null;
        target = '';
      }
    }, 1000);
  }

  async function handleSubmit() {
    errorMessage = '';
    if (errorTimer) clearTimeout(errorTimer);
    orderResult = null;

    if (!selectedServiceId) {
      setError('Silakan pilih salah satu layanan.');
      return;
    }

    if (!target.trim()) {
      setError('Target link atau username tidak boleh kosong.');
      return;
    }

    if (currentService) {
      if (quantity < currentService.min_order || quantity > currentService.max_order) {
        setError(`Jumlah pesanan harus antara ${currentService.min_order} dan ${currentService.max_order}.`);
        return;
      }
    }

    if (isInsufficient) {
      setError('Saldo tidak mencukupi untuk membuat pesanan ini.');
      return;
    }

    isSubmitting = true;
    try {
      const isDemoOrder = isDemo || userId.toLowerCase().includes('demo') || userId === 'regiami';
      const res = await placeOrder({
        user_id: userId,
        service_id: selectedServiceId,
        target: target.trim(),
        quantity: parseInt(quantity),
        is_demo: isDemoOrder,
        custom_comments: isDemoOrder ? ['[DEMO TRANSACTION]'] : (customComments.trim() ? customComments.split('\n') : null),
      });

      if (res.success) {
        setOrderSuccess(res.data);
        dispatch('orderCreated', { order: res.data, amountDeducted: calculatedPrice });
      } else {
        setError(res.message || 'Gagal memproses pesanan.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="ui-card rounded-xl p-6 lg:p-8 space-y-6">
  <div class="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex items-center justify-between">
    <div>
      <div class="flex items-center space-x-2">
        <span class="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
        <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Buat Pesanan Baru
        </h2>
        {#if isDemo}
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            ⚡ MODE SIMULASI DEMO
          </span>
        {/if}
      </div>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Pilih kategori, spesifikasi layanan, dan masukkan tautan target.</p>
    </div>
  </div>

  {#if orderResult}
    <!-- Success Feedback Alert (shadcn style) -->
    <div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs space-y-2 relative">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 font-semibold">
          <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Pesanan Berhasil Diterima</span>
        </div>
        <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
          Tertutup otomatis dalam {orderCountdown}d
        </span>
      </div>
      <p class="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
        ID: <strong class="text-zinc-900 dark:text-zinc-100">#{orderResult.id}</strong> • Biaya: <strong>{formatRupiah(calculatedPrice)}</strong>
      </p>
      <div class="pt-1 flex items-center space-x-2">
        <button
          type="button"
          class="h-7 px-3 rounded text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
          on:click={() => { if (orderResultTimer) clearInterval(orderResultTimer); orderResult = null; target = ''; }}
        >
          + Pesanan Baru
        </button>
        <button
          type="button"
          class="h-7 px-2.5 rounded text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          on:click={() => { if (orderResultTimer) clearInterval(orderResultTimer); orderResult = null; }}
        >
          Tutup
        </button>
      </div>
    </div>
  {/if}

  {#if errorMessage}
    <div class="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-rose-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{errorMessage}</span>
      </div>
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

  <form on:submit|preventDefault={handleSubmit} class="space-y-5">
    <!-- Category Selector (Minimalist Chips) -->
    <div>
      <span class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Kategori Platform</span>
      <div class="flex flex-wrap gap-1.5">
        {#each categories as cat}
          <button
            type="button"
            class="px-3 py-1.5 rounded-md text-xs font-medium border transition-all {selectedCategory === cat.id ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-sm' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700'}"
            on:click={() => selectedCategory = cat.id}
          >
            {cat.name}
          </button>
        {/each}
      </div>
    </div>

    <!-- Service Dropdown -->
    <div>
      <label for="service-select" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Layanan Tersedia</label>
      <select
        id="service-select"
        bind:value={selectedServiceId}
        class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 transition-all font-medium"
      >
        {#each filteredServices as srv}
          <option value={srv.id}>
            [{srv.id}] {srv.name} — {formatRupiah(srv.price_user?.amount || 0)} / 1K
          </option>
        {/each}
      </select>
    </div>

    <!-- Service Spec Details Card (Linear style inset) -->
    {#if currentService}
      <div class="ui-inset rounded-lg p-3.5 space-y-2 text-xs">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center space-x-4 text-zinc-600 dark:text-zinc-400">
            <div>Min: <strong class="text-zinc-900 dark:text-zinc-100 font-mono">{currentService.min_order?.toLocaleString()}</strong></div>
            <div>Maks: <strong class="text-zinc-900 dark:text-zinc-100 font-mono">{currentService.max_order?.toLocaleString()}</strong></div>
            <div>Harga/1K: <strong class="text-emerald-600 dark:text-emerald-400 font-mono">{formatRupiah(pricePerK)}</strong></div>
          </div>
          {#if currentService.refill_supported}
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/60 dark:border-zinc-700">
              Garansi Refill {currentService.refill_days} Hari
            </span>
          {:else}
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              Tanpa Garansi
            </span>
          {/if}
        </div>
        <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-200 dark:border-zinc-800 pt-2">
          {currentService.description}
        </p>
      </div>
    {/if}

    <!-- Target Link / Username -->
    <div>
      <label for="order-target" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Target URL / Akun</label>
      <input
        id="order-target"
        type="text"
        bind:value={target}
        placeholder="https://instagram.com/akun_target atau username"
        class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 transition-all font-mono"
        required
      />
    </div>

    <!-- Quantity & Real-time Total Price Calculator -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <div>
        <label for="order-quantity" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Jumlah</label>
        <input
          id="order-quantity"
          type="number"
          bind:value={quantity}
          min={currentService?.min_order || 1}
          max={currentService?.max_order || 100000}
          class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 transition-all"
          required
        />
      </div>

      <!-- Real-time Price Preview Box -->
      <div class="ui-inset rounded-lg p-3 flex flex-col justify-center">
        <div class="text-[10px] uppercase tracking-wider text-zinc-400">Total Biaya</div>
        <div class="text-lg font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100">
          {formatRupiah(calculatedPrice)}
        </div>
        {#if isInsufficient}
          <div class="text-[10px] text-rose-500 font-medium mt-0.5">
            Saldo kurang Rp {formatRupiah(calculatedPrice - userBalance)}
          </div>
        {/if}
      </div>
    </div>

    <!-- Submit Button (High-End Solid Linear / Vercel style) -->
    <div class="pt-2">
      <button
        type="submit"
        disabled={isSubmitting || isInsufficient}
        class="w-full h-10 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 disabled:opacity-40 transition-all shadow-sm flex items-center justify-center space-x-2"
      >
        {#if isSubmitting}
          <span>Memproses Pesanan...</span>
        {:else if isDemo}
          <span>⚡ Submit Pesanan (Mode Demo) &middot; {formatRupiah(calculatedPrice)}</span>
        {:else}
          <span>Submit Pesanan &middot; {formatRupiah(calculatedPrice)}</span>
        {/if}
      </button>
    </div>
  </form>
</div>
