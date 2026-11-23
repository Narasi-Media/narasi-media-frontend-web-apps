const API_BASE = '/api';

export async function fetchDashboard(userId = 'regiami') {
  try {
    const res = await fetch(`${API_BASE}/dashboard/${userId}`);
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return {
      balance: 500000,
      balance_formatted: 'Rp 500.000',
      total_orders: 14,
      total_spent: 1250000,
      total_deposit: 1500000,
      username: 'regiami',
      full_name: 'Regi Ami',
    };
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return [
      { id: 'cat-ig', name: 'Instagram Followers & Likes', icon: 'instagram', sort_order: 1 },
      { id: 'cat-tiktok', name: 'TikTok Followers & Views', icon: 'tiktok', sort_order: 2 },
      { id: 'cat-yt', name: 'YouTube Subscribers & Watchtime', icon: 'youtube', sort_order: 3 },
      { id: 'cat-tw', name: 'Twitter / X Retweet & Followers', icon: 'twitter', sort_order: 4 },
    ];
  }
}

export async function fetchServices() {
  try {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return [
      {
        id: 'SRV-101',
        category_id: 'cat-ig',
        name: 'Instagram Followers REAL Indonesia [Maks 50K] [Garansi 30 Hari]',
        price_user: { amount: 15500 },
        min_order: 100,
        max_order: 50000,
        refill_supported: true,
        refill_days: 30,
        description: 'Akun real aktif Indonesia. Kecepatan 1.000 - 5.000 / hari. Garansi tombol Refill 30 hari.',
        is_active: true
      },
      {
        id: 'SRV-102',
        category_id: 'cat-ig',
        name: 'Instagram Likes Super Instant [Maks 100K] [No Drop]',
        price_user: { amount: 4500 },
        min_order: 50,
        max_order: 100000,
        refill_supported: false,
        refill_days: 0,
        description: 'Proses instan 5 - 10 menit setelah submit. Masukkan link postingan valid.',
        is_active: true
      },
      {
        id: 'SRV-201',
        category_id: 'cat-tiktok',
        name: 'TikTok Followers Organik HQ [Garansi 30 Hari]',
        price_user: { amount: 22000 },
        min_order: 100,
        max_order: 25000,
        refill_supported: true,
        refill_days: 30,
        description: 'Followers TikTok kualitas tinggi dengan foto profil dan video.',
        is_active: true
      },
      {
        id: 'SRV-301',
        category_id: 'cat-yt',
        name: 'YouTube Subscribers Non-Drop [Garansi Seumur Hidup]',
        price_user: { amount: 95000 },
        min_order: 50,
        max_order: 10000,
        refill_supported: true,
        refill_days: 365,
        description: 'Subscribers aman untuk monetisasi YouTube. Kecepatan 100 - 300 / hari.',
        is_active: true
      }
    ];
  }
}

export async function placeOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || json.error || `HTTP ${res.status}: Gagal memproses pesanan`
      };
    }
    return json;
  } catch (err) {
    return {
      success: false,
      message: `Koneksi gagal: ${err.message || 'Tidak dapat terhubung ke server backend'}`
    };
  }
}

export async function massOrder(userId, ordersRaw) {
  try {
    const res = await fetch(`${API_BASE}/orders/mass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, orders_raw: ordersRaw })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || json.error || `HTTP ${res.status}: Gagal memproses pesanan masal`
      };
    }
    return json;
  } catch (err) {
    return {
      success: false,
      message: `Koneksi gagal: ${err.message || 'Tidak dapat terhubung ke server backend'}`
    };
  }
}

export async function requestDeposit(payload) {
  try {
    const res = await fetch(`${API_BASE}/deposits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || json.error || `HTTP ${res.status}: Gagal membuat invoice deposit`
      };
    }
    return json;
  } catch (err) {
    return {
      success: false,
      message: `Koneksi gagal: ${err.message || 'Tidak dapat terhubung ke server backend'}`
    };
  }
}

export async function submitDepositProof(depositId, senderName, proofImageUrl) {
  try {
    const res = await fetch(`${API_BASE}/deposits/${depositId}/proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_name: senderName, proof_image_url: proofImageUrl })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || json.error || `HTTP ${res.status}: Gagal mengunggah bukti pembayaran`
      };
    }
    return json;
  } catch (err) {
    return {
      success: false,
      message: `Koneksi gagal: ${err.message || 'Tidak dapat terhubung ke server backend'}`
    };
  }
}

export function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

export async function fetchUserProfile(username = 'regiami') {
  try {
    const res = await fetch(`${API_BASE}/user/profile/${username}`);
    if (!res.ok) throw new Error('Gagal mengambil profil');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return {
      id: 'USR-8821',
      username: username,
      full_name: 'Regi Pratama Ami',
      email: 'regi@narasi.media',
      whatsapp_number: '081234567890',
      telegram_username: '@regiami_narasi',
      role: 'Member',
      balance: 500000,
      balance_formatted: 'Rp 500.000',
      total_orders: 14,
      total_spent: 1250000,
      total_deposit: 1500000,
      api_key: 'bm_live_9f82bc7190d8a43e7b1a20c3ef',
      webhook_url: 'https://myshop.com/api/smm-callback',
      two_factor_enabled: true,
      registered_at: '15 Jan 2026'
    };
  }
}

export async function adjustUserBalance(username, amount) {
  try {
    const res = await fetch(`${API_BASE}/user/profile/${username}/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount) })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || json.error || `HTTP ${res.status}: Gagal menyesuaikan saldo`
      };
    }
    return json;
  } catch (err) {
    return {
      success: false,
      message: `Koneksi gagal: ${err.message || 'Tidak dapat terhubung ke server backend'}`
    };
  }
}

export async function updateUserProfile(username, data) {
  try {
    const res = await fetch(`${API_BASE}/user/profile/${username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || json.error || `HTTP ${res.status}: Gagal memperbarui profil`
      };
    }
    return json;
  } catch (err) {
    return {
      success: false,
      message: `Koneksi gagal: ${err.message || 'Tidak dapat terhubung ke server backend'}`
    };
  }
}

export async function regenerateApiKey(username) {
  try {
    const res = await fetch(`${API_BASE}/user/profile/${username}/api-key`, {
      method: 'POST'
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || json.error || `HTTP ${res.status}: Gagal memperbarui API Key`
      };
    }
    return json;
  } catch (err) {
    return {
      success: false,
      message: `Koneksi gagal: ${err.message || 'Tidak dapat terhubung ke server backend'}`
    };
  }
}

export async function updateUserPassword(username, currentPassword, newPassword) {
  try {
    const res = await fetch(`${API_BASE}/user/profile/${username}/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || json.error || `HTTP ${res.status}: Gagal mengubah kata sandi`
      };
    }
    return json;
  } catch (err) {
    return {
      success: false,
      message: `Koneksi gagal: ${err.message || 'Tidak dapat terhubung ke server backend'}`
    };
  }
}
