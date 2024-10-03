require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

// Fungsi untuk menampilkan logo
function displayLogo() {
  console.log('\x1b[34m'); // Mengatur warna teks menjadi biru
  console.log('██     ██ ██ ███    ██ ███████ ███    ██ ██ ██████  ');
  console.log('██     ██ ██ ████   ██ ██      ████   ██ ██ ██   ██ ');
  console.log('██  █  ██ ██ ██ ██  ██ ███████ ██ ██  ██ ██ ██████  ');
  console.log('██ ███ ██ ██ ██  ██ ██      ██ ██  ██ ██ ██ ██      ');
  console.log(' ███ ███  ██ ██   ████ ███████ ██   ████ ██ ██      ');
  console.log('                                                   ');
  console.log('\x1b[0m'); // Mengembalikan warna teks ke default
  console.log("Join our Telegram channel: https://t.me/winsnip");
  console.log(''); // Baris kosong untuk pemisah
}

// Panggil fungsi displayLogo di awal script
displayLogo();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY (first 10 chars):', process.env.SUPABASE_KEY.substring(0, 10));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getUserPoints(userId) {
  try {
    const { data, error } = await supabase
      .from('user_points')
      .select('points_total, points_today')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    if (data) {
      return data;
    } else {
      console.log('Tidak ada data poin untuk pengguna ini. Mengembalikan nilai default.');
      return { points_total: 0, points_today: 0 };
    }
  } catch (error) {
    console.error('Error mengambil poin pengguna:', error.message);
    return { points_total: 0, points_today: 0 };
  }
}

function connectWebSocket(userId, accessToken) {
  const wsUrl = `wss://secure.ws.teneo.pro/websocket?userId=${encodeURIComponent(userId)}&version=v0.2`;
  const socket = new WebSocket(wsUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  
  socket.on('open', () => {
    console.log('WebSocket terhubung');
    socket.send(JSON.stringify({ type: "CONNECT" }));
  });

  socket.on('message', (data) => {
    console.log('Pesan diterima:', data.toString());
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  socket.on('close', (code, reason) => {
    console.log('WebSocket ditutup:', code, reason);
  });

  return socket;
}

function startPointsUpdate(socket, initialPoints) {
  let points = initialPoints;
  
  setInterval(() => {
    const newPointsToday = points.points_today + Math.floor(Math.random() * 5);
    const newPointsTotal = points.points_total + (newPointsToday - points.points_today);

    points = { points_total: newPointsTotal, points_today: newPointsToday };

    console.log('Poin diperbarui:');
    console.log('Total poin:', newPointsTotal);
    console.log('Poin hari ini:', newPointsToday);

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "UPDATE_POINTS",
        pointsTotal: newPointsTotal,
        pointsToday: newPointsToday
      }));
    }
  }, 60000); // Update setiap 1 menit
}

async function main() {
  try {
    console.log('Menggunakan token akses untuk autentikasi...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: process.env.SUPABASE_USER_EMAIL,
      password: process.env.SUPABASE_USER_PASSWORD,
    });

    if (error) throw error;

    if (!data.user || !data.session) {
      console.log('Autentikasi gagal atau tidak ada data sesi.');
      return;
    }

    console.log('Autentikasi berhasil');
    console.log('Access Token:', data.session.access_token);
    console.log('Refresh Token:', data.session.refresh_token);
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Last Sign In:', data.user.last_sign_in_at);

    // Simpan token untuk penggunaan selanjutnya
    supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    });

    const userPoints = await getUserPoints(data.user.id);
    console.log('Poin pengguna saat ini:');
    console.log('Total poin:', userPoints.points_total);
    console.log('Poin hari ini:', userPoints.points_today);

    const socket = connectWebSocket(data.user.id, data.session.access_token);

    startPointsUpdate(socket, userPoints);
    
    // Menangani refresh token
    setInterval(async () => {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('Error refreshing session:', refreshError);
      } else if (refreshData.session) {
        console.log('Session refreshed. New access token:', refreshData.session.access_token);
        supabase.auth.setSession({
          access_token: refreshData.session.access_token,
          refresh_token: refreshData.session.refresh_token
        });
      }
    }, 3000000); // Refresh setiap 50 menit (3000000 ms)

  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    if (error.response) {
      console.error('Data respons:', error.response.data);
      console.error('Status respons:', error.response.status);
    } else if (error.request) {
      console.error('Tidak ada respons diterima:', error.request);
    } else {
      console.error('Detail kesalahan:', error);
    }
  }
}

main();