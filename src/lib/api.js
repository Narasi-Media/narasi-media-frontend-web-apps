const API_BASE = '/api';

export async function fetchDashboard(userId = 'regiami') {
  try {
    const res = await fetch(`${API_BASE}/dashboard/${userId}`);
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return {
      balance: 250000,
      balance_formatted: 'Rp 250.000',
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
    return await res.json();
  } catch (err) {
    return {
      success: true,
      message: 'Pesanan simulasi berhasil dikirim!',
      data: { id: `ORD-${Date.now().toString().slice(-6)}`, status: 'processing', ...orderData }
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
    return await res.json();
  } catch (err) {
    const lines = ordersRaw.trim().split('\n').filter(l => l.trim().length > 0);
    return {
      success: true,
      message: 'Proses pesanan masal simulasi selesai',
      data: {
        total_lines: lines.length,
        successful_orders: lines.length,
        failed_orders: 0,
        items: lines.map((l, i) => ({ line: i + 1, raw: l, success: true, error: null }))
      }
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
    return await res.json();
  } catch (err) {
    const unique = Math.floor(100 + Math.random() * 900);
    return {
      success: true,
      message: 'Tiket deposit berhasil dibuat',
      data: {
        id: `DEP-${Date.now().toString().slice(-6)}`,
        requested_amount: { amount: payload.amount },
        unique_code: unique,
        total_to_pay: { amount: payload.amount + unique },
        balance_credited: { amount: Math.floor(payload.amount * 1.05) },
        status: 'pending'
      }
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
    return await res.json();
  } catch (err) {
    return {
      success: true,
      message: 'Bukti pembayaran berhasil diunggah! Menunggu verifikasi admin.',
      data: { id: depositId, sender_name: senderName, status: 'waiting_verification' }
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
