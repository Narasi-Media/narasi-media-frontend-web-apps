<script>
  import { createEventDispatcher } from 'svelte';

  export let show = false;
  export let currentUsername = 'regiami';

  const dispatch = createEventDispatcher();

  let loginUsername = currentUsername;
  let loginPassword = '';
  let errorMessage = '';
  let isSubmitting = false;

  function handleLogin() {
    errorMessage = '';
    const u = loginUsername.trim().toLowerCase();
    if (!u) {
      errorMessage = 'Username wajib diisi.';
      return;
    }

    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      // Periksa apakah ini akun demo atau akun reguler
      const isDemo = u === 'regiami' || u.includes('demo');

      dispatch('loginSuccess', {
        username: u,
        isDemo,
        fullName: isDemo ? 'Regi Ami (Akun Demo)' : u
      });
      show = false;
    }, 400);
  }

  function handleQuickDemoLogin() {
    loginUsername = 'regiami';
    loginPassword = 'Regi@Dem026!';
    handleLogin();
  }
</script>

{#if show}
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:keydown={(e) => e.key === 'Escape' && (show = false)}
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    on:click|self={() => (show = false)}
  >
    <div class="relative max-w-sm w-full bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
            NM
          </div>
          <div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Masuk Akun Narasi Media
            </h3>
            <p class="text-[11px] text-zinc-400">
              Bisa login hanya menggunakan <strong class="text-zinc-700 dark:text-zinc-300">Username saja</strong>
            </p>
          </div>
        </div>
        <button
          type="button"
          on:click={() => (show = false)}
          class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          ✕
        </button>
      </div>

      {#if errorMessage}
        <div class="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs">
          {errorMessage}
        </div>
      {/if}

      <!-- Form Login -->
      <form on:submit|preventDefault={handleLogin} class="space-y-3.5">
        <div>
          <label for="login-username" class="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono mb-1">
            Username (Bisa Username Saja)
          </label>
          <input
            id="login-username"
            type="text"
            bind:value={loginUsername}
            placeholder="Masukkan username akun Anda"
            class="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            required
          />
        </div>

        <div>
          <label for="login-password" class="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono mb-1">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            bind:value={loginPassword}
            placeholder="Masukkan password akun"
            class="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
          <p class="text-[10px] text-zinc-400 mt-1">
            Untuk akun demo <code class="font-mono text-zinc-700 dark:text-zinc-300">regiami</code> password: <code class="font-mono text-blue-600 dark:text-blue-400 font-bold">Regi@Dem026!</code>
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition-all shadow-sm"
        >
          {isSubmitting ? 'Memverifikasi...' : 'Masuk Sekarang'}
        </button>
      </form>

      <!-- One-Click Demo Login Box -->
      <div class="border-t border-zinc-200 dark:border-zinc-800 pt-3 space-y-2">
        <div class="text-[11px] text-zinc-500 dark:text-zinc-400 text-center font-medium">
          Mau langsung uji coba fitur tanpa input manual?
        </div>
        <button
          type="button"
          on:click={handleQuickDemoLogin}
          class="w-full py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
        >
          <span>⚡</span>
          <span>Masuk Sebagai Akun Demo (@regiami)</span>
        </button>
        <p class="text-[10px] text-zinc-400 text-center">
          *Akun demo memiliki saldo simulasi dan transaksi otomatis diflagging sebagai DEMO.
        </p>
      </div>
    </div>
  </div>
{/if}
