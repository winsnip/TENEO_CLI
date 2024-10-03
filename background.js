// background.js

// Impor Supabase
importScripts('https://unpkg.com/@supabase/supabase-js@2.21.0');

// Fungsi untuk mendapatkan token akses dari session storage
function getAccessToken() {
  const supabaseAuth = JSON.parse(sessionStorage.getItem('sb-ikknnrgxuxgjhplbpey-auth-token'));
  return supabaseAuth ? supabaseAuth.access_token : null;
}

// Inisialisasi Supabase client
const SUPABASE_URL = 'https://ikknnrgxuxgjhplbpey.supabase.co';
const accessToken = getAccessToken();
const supabase = supabase.createClient(SUPABASE_URL, null, {
  global: {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
  },
});

// Fungsi untuk mendapatkan data pengguna
async function getFullUserData() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error mendapatkan data pengguna:', error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan poin pengguna
async function getUserPoints(userId) {
  try {
    const { data, error } = await supabase
      .from('user_points')
      .select('points_total, points_today')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data || { points_total: 0, points_today: 0 };
  } catch (error) {
    console.error('Error fetching user points:', error.message);
    return { points_total: 0, points_today: 0 };
  }
}

// Fungsi untuk koneksi WebSocket
function connectWebSocket(userId) {
  const wsUrl = `wss://secure.ws.teneo.pro/websocket?userId=${encodeURIComponent(userId)}&version=v0.2`;
  const socket = new WebSocket(wsUrl);
  
  socket.onopen = () => {
    console.log('WebSocket terhubung');
    socket.send(JSON.stringify({ type: "CONNECT" }));
  };

  socket.onmessage = (event) => {
    console.log('Pesan diterima:', event.data);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = (event) => {
    console.log('WebSocket ditutup. Kode:', event.code, 'Alasan:', event.reason);
  };

  return socket;
}

// Fungsi untuk memulai pembaruan poin
function startPointsUpdate(socket, initialPoints, user) {
  let points = initialPoints;
  
  setInterval(() => {
    const newPointsToday = points.points_today + Math.floor(Math.random() * 5);
    const newPointsTotal = points.points_total + (newPointsToday - points.points_today);

    points = { points_total: newPointsTotal, points_today: newPointsToday };

    console.log('Points updated:');
    console.log('Total points:', newPointsTotal);
    console.log('Points today:', newPointsToday);

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "UPDATE_POINTS",
        userId: user.id,
        email: user.email,
        pointsTotal: newPointsTotal,
        pointsToday: newPointsToday
      }));
    }
  }, 60000); // Update setiap 1 menit
}

// Fungsi utama
async function main() {
  try {
    console.log('Mengambil data pengguna...');
    const user = await getFullUserData();

    if (!user) {
      console.log('Tidak ada pengguna ditemukan atau terjadi kesalahan.');
      return;
    }

    console.log('Data pengguna ditemukan:');
    console.log('ID:', user.id);
    console.log('Email:', user.email);

    const userPoints = await getUserPoints(user.id);
    console.log('Poin pengguna saat ini:');
    console.log('Total poin:', userPoints.points_total);
    console.log('Poin hari ini:', userPoints.points_today);

    console.log('Menghubungkan WebSocket...');
    const socket = connectWebSocket(user.id);

    // Tunggu sebentar untuk memastikan koneksi WebSocket terbuka
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket terhubung dan siap untuk komunikasi');
      startPointsUpdate(socket, userPoints, user);
    } else {
      console.log('WebSocket belum terhubung. Status:', socket.readyState);
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
  }
}

// Jalankan fungsi main saat ekstensi dimuat
chrome.runtime.onInstalled.addListener(() => {
  main();
});

// Listener untuk menerima pesan dari content script atau popup jika diperlukan
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPoints") {
    getUserPoints(request.userId).then(points => {
      sendResponse(points);
    });
    return true; // Indicates that the response is asynchronous
  }
});
