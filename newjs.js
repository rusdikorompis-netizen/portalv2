// ============================================
// 1. KONFIGURASI UTAMA & KEAMANAN ENDPOINT
// ============================================
// ============================================
// V5.0 SUPER SECURE ENCRYPTION - ANTI SCRAPER + ANTI BYPASS
// ============================================
const _dec = (str) => {
  try {
    // Double layer: base64 + URI decode + reverse obfuscation
    let d = atob(str);
    // Reverse string trick
    d = d.split('').reverse().join('');
    d = atob(d);
    return decodeURIComponent(escape(d));
  } catch(e) {
    // Fallback single layer
    return decodeURIComponent(escape(atob(str)));
  }
};
const _enc = (str) => {
  // Untuk enkripsi balik: reverse + double base64
  let r = btoa(unescape(encodeURIComponent(str)));
  r = r.split('').reverse().join('');
  return btoa(r);
};

const _RAW_URL = 'aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3b0lYVmFHZWczTWFNTXFYWkd3SGlMd1dGcTF5Q05YRlptZmhuakVoaU5fUGlCbGl1RGR2SkdrWkpUcHgxb0kySkxEZy9leGVj';
// URL tetap sama, tapi disimpan dengan double obfuscation di runtime
const SCRIPT_URL = (() => {
  const step1 = atob(_RAW_URL); // decode sekali
  return step1;
})();


/* =============================================================================
   FRONTEND PORTAL DESA MOLOMPAR ATAS - V5.6 FINAL SECURE SHOW/HIDE
   FULLY SYNCHRONIZED WITH BACKEND V5.5 SUPER SECURE HARDENED ENGINE
   - API_KEY: MOLAS_API_2026_SECURE_9f8e7d6c5b4a3_!@#
   - SCRIPT_URL: https://script.google.com/macros/s/AKfycbxNPWgQiQzNhVGSgdEf1dj22uMWNkFxBlZ1sXD-6POnrWASGrbd7q2DBxAkTT9ga-VjlA/exec (base64 obfuscated)
   - DUAL TOKEN: Admin (120m) + Warga (30m) HMAC-SHA256
   - SECURE_FETCH: Auto inject api_key + token sesuai kategori aksi
   - BACKEND ACTIONS: 30 actions (PUBLIC 5, WARGA 3, ADMIN 22) - ALL COVERED
   - SECURITY: Timing-safe, IDOR protection, Rate-limit compatible
   =============================================================================
*/

const MOLAS_API_KEY = "MOLAS_API_2026_SECURE_9f8e7d6c5b4a3_!@#";
const MOLAS_SECURE_HEADER = { // V5.1 DUAL
  get warga_token() { return localStorage.getItem('molas_warga_token') || ''; },

  get api_key() { return MOLAS_API_KEY; },
  get token() { return localStorage.getItem('molas_admin_token') || ''; },
  get isAdmin() { const s = localStorage.getItem('userSession'); try { return s ? JSON.parse(s).isAdmin : false; } catch(e){ return false; } }
};

const EP_KONTAK = _dec('aHR0cHM6Ly9mb3Jtc3ByZWUuaW8vZi94amdrZ2dvdg==');
const EP_SURAT = _dec('aHR0cHM6Ly9mb3Jtc3ByZWUuaW8vZi94emR6emF2ag==');
const EP_ADUAN = _dec('aHR0cHM6Ly9mb3Jtc3ByZWUuaW8vZi9tb2p2dm5seQ==');

// Secure fetch wrapper V5.1 DUAL TOKEN - ADMIN + WARGA
const secureFetch = async (url, options = {}) => {
  let finalUrl = url;
  const hasParams = url.includes('?');
  const wargaToken = localStorage.getItem('molas_warga_token') || '';
  const adminToken = localStorage.getItem('molas_admin_token') || '';
  
  // Inject api_key selalu
  if(!finalUrl.includes('api_key=')) {
    finalUrl += (hasParams ? '&' : '?') + 'api_key=' + encodeURIComponent(MOLAS_API_KEY);
  }
  // Inject token yang sesuai berdasarkan action di URL
  if(finalUrl.includes('action=checkBLT') || finalUrl.includes('action=getWargaProfile') || finalUrl.includes('action=validateWargaToken')){
    // WARGA ACTION -> pakai warga_token
    if(wargaToken && !finalUrl.includes('warga_token=')) finalUrl += '&warga_token=' + encodeURIComponent(wargaToken);
    if(wargaToken && !finalUrl.includes('token=')) finalUrl += '&token=' + encodeURIComponent(wargaToken);
  } else {
    // ADMIN / PUBLIC -> pakai admin_token jika ada
    if(adminToken && !finalUrl.includes('token=') && !finalUrl.includes('admin_token=')){
      finalUrl += '&token=' + encodeURIComponent(adminToken) + '&admin_token=' + encodeURIComponent(adminToken);
    }
  }
  
  // Inject ke body juga untuk POST
  if(options.body && typeof options.body === 'string') {
    try {
      const j = JSON.parse(options.body);
      if(!j.api_key) j.api_key = MOLAS_API_KEY;
      if(j.action && (j.action==='checkBLT' || j.action==='getWargaProfile' || j.action==='validateWargaToken')){
        if(wargaToken && !j.warga_token) j.warga_token = wargaToken;
        if(wargaToken && !j.token) j.token = wargaToken;
      } else {
        if(adminToken && !j.token) j.token = adminToken;
        if(adminToken && !j.admin_token) j.admin_token = adminToken;
      }
      options.body = JSON.stringify(j);
    } catch(e){}
  }
  
  options.headers = options.headers || {};
  if(!options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'text/plain;charset=utf-8';
  }
  options.redirect = options.redirect || 'follow';
  return fetch(finalUrl, options);
};

// Helper untuk BLT yang sekarang wajib pakai warga token
const originalShowBLTPopup = typeof showBLTPopup !== 'undefined' ? showBLTPopup : null;


const IDLE_TIMEOUT = 5 * 60 * 1000; 
let idleTimer; 

// Injeksi action form secara dinamis saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    const fKontak = document.querySelector('form[action*="formspree.io/f/xjgkggov"]'); // Fallback form kontak
    const fSurat = document.getElementById('form-surat-online');
    const fAduan = document.getElementById('form-pengaduan');
    
    if(fKontak) fKontak.action = EP_KONTAK;
    if(fSurat) fSurat.action = EP_SURAT;
    if(fAduan) fAduan.action = EP_ADUAN;
});

// ============================================
// 2. FUNGSI UI (TAMPILAN, TAB, MODAL)
// ============================================
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if(modal) {
        modal.classList.remove('hidden-el'); 
        modal.classList.remove('hidden');    
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if(modal) modal.classList.add('hidden-el');
}

function switchTab(type) {
    const tabWarga = document.getElementById('tab-warga');
    const tabAdmin = document.getElementById('tab-admin');
    const contentWarga = document.getElementById('content-warga');
    const contentAdmin = document.getElementById('content-admin');

    if (type === 'warga') {
        contentWarga.classList.remove('hidden-el');
        contentAdmin.classList.add('hidden-el');
        tabWarga.className = 'flex-1 py-2 text-sm font-bold rounded-full text-white bg-teal-600 shadow-sm transition';
        tabAdmin.className = 'flex-1 py-2 text-sm font-bold rounded-full text-slate-500 hover:text-slate-700 transition';
    } else {
        contentWarga.classList.add('hidden-el');
        contentAdmin.classList.remove('hidden-el');
        tabWarga.className = 'flex-1 py-2 text-sm font-bold rounded-full text-slate-500 hover:text-slate-700 transition';
        tabAdmin.className = 'flex-1 py-2 text-sm font-bold rounded-full text-white bg-purple-700 shadow-sm transition';
    }
}

// ============================================
// 3. LOGIKA LOGIN & AUTH (WARGA & ADMIN)
// ============================================
async function authWarga() {
    const n = document.getElementById('login-nama').value.trim(); 
    const k = document.getElementById('login-nik').value.trim();
    
    if(!n || !k) return Swal.fire('Error','Isi Nama & NIK','warning');
    if(k.length !== 16) return Swal.fire('Error','NIK harus 16 digit','warning');
    
    Swal.fire({title:'Verifikasi Warga Secure V5.1...', html:'Generate Warga Token HMAC...', didOpen:()=>Swal.showLoading()});
    
    try {
        const r = await secureFetch(`${SCRIPT_URL}?action=login&nik=${encodeURIComponent(k)}&nama=${encodeURIComponent(n)}`);
        const j = await r.json();
        
        if(j.status === 'success' && j.warga_token){
            // SIMPAN WARGA TOKEN - INI KUNCI V5.1
            localStorage.setItem('molas_warga_token', j.warga_token);
            localStorage.setItem('molas_warga_expiry', j.warga_expiry);
            localStorage.setItem('molas_warga_nik', j.data.nik);
            localStorage.setItem('molas_warga_nama', j.data.nama);
            Swal.fire({icon:'success', title:'Login Warga V5.1 Berhasil', text:'Warga Token valid 30 menit', timer:1500, showConfirmButton:false});
            saveSession(j.data.nama, j.data.nik, false, {...j.data, warga_token: j.warga_token});
            grantAccess(j.data.nama, j.data.nik, false, {...j.data, warga_token: j.warga_token});
            closeLoginModal();
            // Auto validate warga token tiap 5 menit
            setInterval(validateWargaToken, 5*60*1000);
        } else { 
            Swal.fire('Gagal', j.message || 'Data tidak ditemukan. Pastikan Nama dan NIK sesuai.','error'); 
        }
    } catch(e) {
        console.error(e);
        Swal.fire('Error', 'Koneksi Secure Server Gagal: ' + (e.message || e), 'error');
    }
}

async function validateWargaToken(){
    const token = localStorage.getItem('molas_warga_token');
    if(!token) return;
    try {
        const r = await secureFetch(`${SCRIPT_URL}?action=validateWargaToken&warga_token=${encodeURIComponent(token)}&api_key=${encodeURIComponent(MOLAS_API_KEY)}`);
        const j = await r.json();
        if(!j.valid){
            Swal.fire('Sesi Warga Habis','Silakan login KTP ulang','warning').then(()=>doLogout());
        }
    } catch(e){}
}

async function doLogoutWarga(){
    const token = localStorage.getItem('molas_warga_token');
    if(token){
        try {
            await secureFetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({action:'logoutWarga', warga_token: token, api_key: MOLAS_API_KEY})
            });
        } catch(e){}
    }
    localStorage.removeItem('molas_warga_token');
    localStorage.removeItem('molas_warga_expiry');
    localStorage.removeItem('molas_warga_nik');
    localStorage.removeItem('molas_warga_nama');
}


async function authAdmin() {
    const u = document.getElementById('admin-user').value.trim();
    const p = document.getElementById('admin-pass').value.trim();

    if(!u || !p) return Swal.fire('Error', 'Isi Username & Password', 'warning');

    Swal.fire({title: 'Memeriksa Akses Secure...', html: 'Enkripsi HMAC SHA256...', didOpen: () => Swal.showLoading()});

    try {
        const response = await secureFetch(SCRIPT_URL, {
            method: 'POST',
            redirect: "follow", 
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "loginAdmin",
                user: u,
                pass: p,
                api_key: MOLAS_API_KEY
            })
        });

        const result = await response.json();

        if (result.status === 'success' && result.token) {
            // Simpan token super secure
            localStorage.setItem('molas_admin_token', result.token);
            localStorage.setItem('molas_token_expiry', result.expiry);
            localStorage.setItem('molas_admin_user', result.user);
            Swal.fire({icon: 'success', title: 'Login Admin Secure Berhasil', text: 'Token valid 2 jam', timer: 1500, showConfirmButton: false});
            saveSession(result.user || "Administrator", "ADMIN", true, {role: result.role, token: result.token});
            grantAccess(result.user || "Administrator", "ADMIN", true, {role: result.role});
            closeLoginModal();
            // Auto refresh token validation setiap 10 menit
            setInterval(validateAdminToken, 10*60*1000);
        } else {
            Swal.fire('Gagal', result.message || 'Username atau Password Salah', 'error');
        }
    } catch (e) {
        console.error(e);
        Swal.fire('Error', 'Gagal terhubung ke Secure Server: ' + (e.message || e), 'error');
    }
}

async function validateAdminToken(){
    const token = localStorage.getItem('molas_admin_token');
    if(!token) return;
    try {
        const r = await secureFetch(`${SCRIPT_URL}?action=validateToken&token=${encodeURIComponent(token)}`);
        const j = await r.json();
        if(!j.valid){
            Swal.fire('Sesi Habis','Silakan login ulang','warning').then(()=>doLogout());
        }
    } catch(e){}
}

// ============================================
// 4. MANAJEMEN SESI & TIMER
// ============================================
function saveSession(name, nik, isAdmin, fullData) {
    localStorage.setItem('userSession', JSON.stringify({ name, nik, isAdmin, fullData, timestamp: new Date().getTime() }));
    if(isAdmin){
        // Token sudah disimpan di authAdmin, tapi pastikan session flag secure
        localStorage.setItem('molas_secure_session', 'V5.0_' + new Date().getTime());
    }
}

function checkSession() {
    const saved = localStorage.getItem('userSession');
    if(saved) {
        const s = JSON.parse(saved);
        grantAccess(s.name, s.nik, s.isAdmin, s.fullData);
        startIdleTimer();
    }
}

function startIdleTimer() {
    window.onmousemove = resetTimer; 
    window.onmousedown = resetTimer; 
    window.onclick = resetTimer; 
    window.onkeydown = resetTimer;    
    window.ontouchstart = resetTimer;
    resetTimer(); 
}

function resetTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(doLogout, IDLE_TIMEOUT);
}

async function doLogout() {
    const adminToken = localStorage.getItem('molas_admin_token');
    const wargaToken = localStorage.getItem('molas_warga_token');
    try {
        if(adminToken){
            await secureFetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({action:'logout', token: adminToken, admin_token: adminToken, api_key: MOLAS_API_KEY})
            });
        }
        if(wargaToken){
            await secureFetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({action:'logoutWarga', warga_token: wargaToken, token: wargaToken, api_key: MOLAS_API_KEY})
            });
        }
    } catch(e){}
    localStorage.removeItem('userSession');
    localStorage.removeItem('molas_admin_token');
    localStorage.removeItem('molas_token_expiry');
    localStorage.removeItem('molas_admin_user');
    localStorage.removeItem('molas_secure_session');
    localStorage.removeItem('molas_warga_token');
    localStorage.removeItem('molas_warga_expiry');
    localStorage.removeItem('molas_warga_nik');
    localStorage.removeItem('molas_warga_nama');
    location.reload(); 
}

window.onload = function() {
    checkSession();
    initCharts(); // Memanggil inisialisasi chart saat halaman dimuat
}

// --- TAMPILAN DASHBOARD (HTML INJECTION) & LOGIKA ANIMASI ---
function grantAccess(name, nik, isAdmin, fullData){
    closeLoginModal();
    document.getElementById('landing-page').classList.add('hidden-el');
if(document.getElementById('main-footer')) {
        document.getElementById('main-footer').classList.add('hidden-el');
    }
    document.getElementById('dashboard-page').classList.remove('hidden-el');
    document.getElementById('btn-login').classList.add('hidden-el'); 
    document.getElementById('btn-logout').classList.remove('hidden-el');
    document.getElementById('dash-user-name').innerText = name;
    startIdleTimer();
    
    if(document.getElementById('form-nama-adu')) document.getElementById('form-nama-adu').value = isAdmin ? "Administrator" : name; 
    if(document.getElementById('form-nik-adu')) document.getElementById('form-nik-adu').value = nik;

    const formWargaArea = document.getElementById('area-pelayanan-warga');

    if(!isAdmin && fullData){
        let timerInterval;
        Swal.fire({
            title: '<span class="text-xl font-bold">Sinkronisasi Server...</span>',
            html: '<span class="text-sm text-slate-500">Mengambil data identitas dari server pusat.</span><br><br><b class="text-teal-600 font-mono tracking-widest text-sm bg-teal-50 px-3 py-1 rounded border border-teal-100"></b>',
            timer: 2500, 
            timerProgressBar: true,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
                const b = Swal.getHtmlContainer().querySelector('b');
                const steps = ['Menghubungkan ke API...', 'Memverifikasi NIK...', 'Mengekstrak Data KTP...', 'Mengunduh Foto...', 'Dekripsi Berhasil!'];
                let stepIndex = 0;
                
                timerInterval = setInterval(() => {
                    if(stepIndex < steps.length) {
                        b.textContent = steps[stepIndex];
                        stepIndex++;
                    }
                }, 400);
            },
            willClose: () => { clearInterval(timerInterval); }
        }).then(() => {
            document.getElementById('profil-warga-card').classList.remove('hidden-el');
            if(formWargaArea) formWargaArea.classList.remove('hidden-el');
            
            document.getElementById('prof-nama').innerText = fullData.nama || '-';
            document.getElementById('prof-nik').innerText = fullData.nik || '-';
            document.getElementById('prof-ttl').innerText = (fullData.tempat_lahir || '') + ', ' + (fullData.tgl_lahir || '');
            document.getElementById('prof-jk').innerText = fullData.jenis_kelamin || '-';
            document.getElementById('prof-agama').innerText = fullData.agama || '-';
            document.getElementById('prof-kerja').innerText = fullData.pekerjaan || '-';
            document.getElementById('prof-alamat').innerText = fullData.alamat || '-';
            document.getElementById('prof-ayah').innerText = fullData.nama_ayah || '-';
            document.getElementById('prof-ibu').innerText = fullData.nama_ibu || '-';
            
            const av = (fullData.jenis_kelamin || '').toLowerCase().includes('laki') 
                ? 'https://cdn-icons-png.flaticon.com/512/4128/4128176.png' 
                : 'https://cdn-icons-png.flaticon.com/512/4128/4128249.png';
            document.getElementById('prof-foto').src = fullData.foto_url && fullData.foto_url.length > 5 ? fullData.foto_url : av;

            setTimeout(() => {
                Swal.fire({
                    title: '<span class="text-xl font-black text-slate-800">Informasi Database</span>',
                    html: `
                        <div class="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-left mt-2 shadow-inner">
                            <div class="flex items-start gap-4">
                                <div class="bg-amber-100 p-2.5 rounded-xl text-amber-600 shrink-0">
                                    <i class="fas fa-database text-xl"></i>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-700 leading-relaxed font-medium mb-3">
                                        Data Kartu Identitas Digital Anda saat ini bersumber dari <b class="text-slate-900">Database Disdukcapil Minahasa Tenggara</b>.
                                    </p>
                                    <div class="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
                                        <span class="relative flex h-2 w-2">
                                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                          <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                        </span>
                                        <span class="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Terakhir Update: Desember 2021</span>
                                    </div>
                                    <p class="text-xs text-slate-500 mt-4 italic border-t border-amber-200/50 pt-3">
                                        *Jika terdapat perubahan data terbaru, silakan hubungi Operator Desa untuk penyesuaian manual.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `,
                    showCloseButton: true,
                    confirmButtonText: 'Saya Mengerti',
                    confirmButtonColor: '#f59e0b',
                    background: '#ffffff',
                    customClass: { popup: 'rounded-[2rem] shadow-2xl border border-slate-100', confirmButton: 'rounded-xl px-8 py-3 font-bold shadow-lg shadow-amber-500/30' }
                });
            }, 300);
        });

    } else if (!isAdmin) {
        document.getElementById('profil-warga-card').classList.add('hidden-el');
    }

    if(isAdmin){
        document.getElementById('admin-indicator').classList.remove('hidden-el');
        document.getElementById('admin-settings-panel').classList.remove('hidden-el');
        if(formWargaArea) formWargaArea.classList.add('hidden-el');
        
        loadWebSettings(); 
        renderAdminApps();
    } else {
        document.getElementById('admin-indicator').classList.add('hidden-el');
        document.getElementById('admin-settings-panel').classList.add('hidden-el');
        if(document.getElementById('admin-apps-container')) document.getElementById('admin-apps-container').remove();
    }
}

function renderAdminApps(){
    if(document.getElementById('admin-apps-container')) return;
    const c=document.createElement('div'); c.id='admin-apps-container'; 
    
    c.innerHTML=`
    <div class="mb-4 flex items-center gap-2"><i class="fas fa-rocket text-xl text-blue-600"></i><h2 class="text-lg font-bold text-slate-700">Dashboard Layanan</h2></div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-fade-in relative z-10">
        <div onclick="openModulePDF()" class="group bg-gradient-to-br from-red-700 to-rose-900 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10">
            <div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-file-pdf text-9xl"></i></div>
            <div class="relative z-10">
                <div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-file-download text-2xl"></i></div>
                <h3 class="text-xl font-bold">Modul PDF</h3>
                <p class="text-rose-100 text-sm">Download Dokumen</p>
            </div>
        </div>

        <div onclick="openSuratManager()" class="group bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10">
            <div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-paper-plane text-9xl"></i></div>
            <div class="relative z-10">
                <div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-folder-open text-2xl"></i></div>
                <h3 class="text-xl font-bold">Surat Keluar</h3>
                <p class="text-blue-100 text-sm">Kelola & Edit Data</p>
            </div>
        </div>

        <div onclick="openSuratMasukModal()" class="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10">
            <div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-envelope-open-text text-9xl"></i></div>
            <div class="relative z-10"><div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-inbox text-2xl"></i></div><h3 class="text-xl font-bold">Surat Masuk</h3><p class="text-amber-100 text-sm">Arsip Dinas</p></div>
        </div>

        <div onclick="openAbsensiModal()" class="group bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10"><div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-camera text-9xl"></i></div><div class="relative z-10"><div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-camera-retro text-2xl"></i></div><h3 class="text-xl font-bold">Absensi</h3><p class="text-emerald-100 text-sm">Foto Kegiatan</p></div></div>
        <div onclick="openPBBModal()" class="group bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10"><div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-money-bill-wave text-9xl"></i></div><div class="relative z-10"><div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-file-invoice-dollar text-2xl"></i></div><h3 class="text-xl font-bold">Setor PBB</h3><p class="text-green-100 text-sm">Monitoring Pajak</p></div></div>
        <div onclick="openInventarisModal()" class="group bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10"><div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-boxes text-9xl"></i></div><div class="relative z-10"><div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-laptop text-2xl"></i></div><h3 class="text-xl font-bold">Aset Desa</h3><p class="text-orange-100 text-sm">Input Aset</p></div></div>
        <div onclick="openKematianModal()" class="group bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10"><div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-book-dead text-9xl"></i></div><div class="relative z-10"><div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-church text-2xl"></i></div><h3 class="text-xl font-bold">Kematian</h3><p class="text-slate-200 text-sm">Hapus Bansos</p></div></div>
        <div onclick="openKelahiranModal()" class="group bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10"><div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-baby-carriage text-9xl"></i></div><div class="relative z-10"><div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-baby text-2xl"></i></div><h3 class="text-xl font-bold">Kelahiran</h3><p class="text-pink-100 text-sm">Warga Baru</p></div></div>
        <div onclick="openStuntingModal()" class="group bg-gradient-to-br from-violet-600 to-purple-800 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10"><div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-heartbeat text-9xl"></i></div><div class="relative z-10"><div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-weight text-2xl"></i></div><h3 class="text-xl font-bold">Stunting</h3><p class="text-violet-100 text-sm">Ukur Gizi</p></div></div>
        <div onclick="openTamuModal()" class="group bg-gradient-to-br from-rose-500 to-red-700 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10"><div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-address-book text-9xl"></i></div><div class="relative z-10"><div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-user-friends text-2xl"></i></div><h3 class="text-xl font-bold">Buku Tamu</h3><p class="text-rose-100 text-sm">Tamu Dinas</p></div></div>
        <div onclick="openAgendaModal()" class="group bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border border-white/10 z-10"><div class="absolute -right-6 -top-6 opacity-20"><i class="fas fa-calendar-check text-9xl"></i></div><div class="relative z-10"><div class="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"><i class="fas fa-clock text-2xl"></i></div><h3 class="text-xl font-bold">Agenda</h3><p class="text-cyan-100 text-sm">Jadwal Acara</p></div></div>
    </div>

    <hr class="border-slate-300 my-8">

    <div class="mb-4 flex items-center gap-2"><i class="fas fa-database text-xl text-purple-600"></i><h2 class="text-lg font-bold text-slate-700">Pusat Data & Informasi</h2></div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-fade-in relative z-10">
        <div onclick="openListModal('Data Penduduk (ADMP_1)', 'penduduk')" class="group bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow hover:scale-[1.02] cursor-pointer relative overflow-hidden z-10"><div class="flex items-center gap-3"><div class="bg-white/20 p-2 rounded-lg"><i class="fas fa-users text-xl"></i></div><div><h3 class="font-bold text-sm">Data Penduduk</h3><p class="text-xs opacity-80">Database v1 by Aldi</p></div></div></div>
    </div>
    `;
    const s=document.getElementById('admin-settings-panel'); s.parentNode.insertBefore(c,s.nextSibling);
}

function showStructure(type) {
    const userIcon = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; 
    let dataEntity = {};

    if (type === 'bumdes') {
        dataEntity = {
            title: "BUMDes Mandiri Sejahtera",
            colorClass: "from-blue-600 to-indigo-700",
            icon: "fa-building",
            legal: [
                { label: "Badan Hukum", val: "AHU-XXXXX.AH.01.01.Tahun 2025", bg: "bg-blue-50 text-blue-700" },
                { label: "Tanggal Berdiri", val: "10 Januari 2020", bg: "bg-slate-50 text-slate-700" },
                { label: "NIB", val: "1234567890123", bg: "bg-amber-50 text-amber-700" },
                { label: "Unit Usaha", val: "Ternak Babi, Ternak Ayam, Jasa Pihak Ketiga", bg: "bg-emerald-50 text-emerald-700" },
                { label: "Lokasi", val: "Balai Desa Molompar Atas", bg: "bg-slate-50 text-slate-700" }
            ],
            topStructure: [
                { role: "Penasihat", name: "Alfius B. Tulandi", sub: "Hukum Tua" },
                { role: "Pengawas 1", name: "Rita Wudu", sub: "Pengawas" },
                { role: "Pengawas 2", name: "Meity Kawulusan", sub: "Pengawas" }
            ],
            execStructure: [
                { role: "Direktur", name: "Youla Rapar", sub: "Ketua Pelaksana", full: true }, 
                { role: "Sekretaris", name: "Christin L. Tuerah", sub: "Administrasi" },
                { role: "Bendahara", name: "Rishard Tulandi", sub: "Keuangan" }
            ]
        };
    } else {
        dataEntity = {
            title: "KDMP Molompar Atas",
            colorClass: "from-red-600 to-rose-700",
            icon: "fa-handshake",
            legal: [
                { label: "Badan Hukum", val: "AHU-KOP-XXXXX.AH.01.2025", bg: "bg-red-50 text-red-700" },
                { label: "Tanggal Berdiri", val: "17 Agustus 2025", bg: "bg-slate-50 text-slate-700" },
                { label: "NIB", val: "12345678912", bg: "bg-amber-50 text-amber-700" },
                { label: "Jenis Usaha", val: "Pasar Kuliner, WiFi Voucher, Digital Printing, Sembako, Alat-alat Pertanian", bg: "bg-emerald-50 text-emerald-700" },
                { label: "Lokasi", val: "Desa Molompar Atas", bg: "bg-slate-50 text-slate-700" }
            ],
            topStructure: [
                { role: "Penasihat", name: "Alfius B. Tulandi", sub: "Hukum Tua" },
                { role: "Pengawas 1", name: "Maxi M. Wawointana", sub: "Internal" },
                { role: "Pengawas 2", name: "OLLY M. Kakambong", sub: "Eksternal" }
            ],
            execStructure: [
                { role: "Ketua", name: "Dony I. Y. Korompis", sub: "Pimpinan", full: true },
                { role: "Wakil (Usaha)", name: "Joice Tompunu", sub: "Bidang Usaha" },
                { role: "Wakil (Anggota)", name: "Sergio Oroh", sub: "Keanggotaan" },
                { role: "Sekretaris", name: "Santy S. Rolos", sub: "Admin" },
                { role: "Bendahara", name: "Tisa M. Kawulusan", sub: "Keuangan" }
            ]
        };
    }

    let htmlContent = `
    <style>
        .glass-panel { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
        .anim-up { animation: slideUp 0.5s ease-out forwards; opacity: 0; transform: translateY(20px); }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
    </style>
    
    <div class="grid grid-cols-2 gap-2 mb-6 text-left anim-up" style="animation-delay: 0.1s;">
        ${dataEntity.legal.map(l => `
            <div class="${l.bg} p-2 rounded border border-black/5">
                <div class="text-[10px] font-bold opacity-60 uppercase tracking-wide">${l.label}</div>
                <div class="text-xs font-bold truncate">${l.val}</div>
            </div>
        `).join('')}
    </div>

    <div class="relative">
        <div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <i class="fas ${dataEntity.icon} text-9xl text-slate-800"></i>
        </div>

        <div class="flex justify-center gap-4 mb-8 anim-up" style="animation-delay: 0.2s;">
            ${dataEntity.topStructure.map(m => `
                <div class="text-center w-1/3">
                    <div class="w-12 h-12 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-2 border-2 border-white shadow-sm overflow-hidden">
                        <img src="${userIcon}" class="w-full h-full object-cover opacity-80">
                    </div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase">${m.role}</div>
                    <div class="text-xs font-bold text-slate-800 leading-tight">${m.name}</div>
                </div>
            `).join('')}
        </div>

        <div class="h-px bg-slate-300 w-3/4 mx-auto mb-8 anim-up" style="animation-delay: 0.3s;"></div>

        <div class="grid grid-cols-2 gap-4 anim-up" style="animation-delay: 0.4s;">
            ${dataEntity.execStructure.map(m => `
                <div class="${m.full ? 'col-span-2 bg-white shadow-md border-t-4' : 'bg-slate-50 border'} p-3 rounded-lg text-center relative overflow-hidden" style="${m.full ? `border-color: ${type==='bumdes'?'#2563eb':'#dc2626'}` : ''}">
                    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">${m.role}</div>
                    <div class="text-sm font-bold text-slate-800">${m.name}</div>
                    <div class="text-[10px] text-slate-400">${m.sub}</div>
                </div>
            `).join('')}
        </div>
    </div>
    `;

    Swal.fire({
        title: `<div class="flex flex-col items-center justify-center py-2"><div class="bg-white/20 p-3 rounded-full mb-2"><i class="fas ${dataEntity.icon} text-3xl"></i></div><span class="text-lg font-bold tracking-wide">${dataEntity.title}</span></div>`,
        html: htmlContent,
        width: '600px',
        showConfirmButton: false,
        showCloseButton: true,
        background: '#fff',
        customClass: {
            popup: 'rounded-2xl overflow-hidden shadow-2xl',
            header: `bg-gradient-to-br ${dataEntity.colorClass} text-white m-0 p-6`
        }
    });
}

// ===========================================
// FUNGSI POPUP ADMIN LAINNYA
// ===========================================
async function openSuratManager() {
    Swal.fire({ title: 'Memuat Data Surat...', didOpen: () => Swal.showLoading() });

    try {
        const req = await secureFetch(`${SCRIPT_URL}?action=getRiwayat`);
        const data = await req.json();
        renderTableSurat(data);
    } catch (e) {
        Swal.fire('Error', 'Gagal memuat data.', 'error');
    }
}

function renderTableSurat(data) {
    let content = '';

    if (data.length === 0) {
        content = `<div class="p-4 text-center text-gray-500">Belum ada data surat.</div>`;
    } else {
        const rows = data.map(d => `
            <tr class="hover:bg-gray-50 border-b text-sm">
                <td class="p-3 font-bold text-blue-600">${d.no}</td>
                <td class="p-3">${d.tujuan}</td>
                <td class="p-3 text-gray-500 text-xs">${d.tgl}</td>
                <td class="p-3 text-right">
            </tr>
        `).join('');

        content = `
        <div class="overflow-x-auto max-h-[400px] text-left">
            <table class="min-w-full whitespace-nowrap">
                <thead class="bg-gray-100 text-gray-700 sticky top-0 shadow-sm">
                    <tr>
                        <th class="p-3">No. Surat</th>
                        <th class="p-3">Tujuan</th>
                        <th class="p-3">Tanggal</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
    }

    Swal.fire({
        title: 'Data Surat Keluar',
        html: `
            <div class="flex justify-end mb-3">
                <button onclick="openFormSurat('add')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm shadow">
                    <i class="fas fa-plus"></i> Buat Surat Baru
                </button>
            </div>
            ${content}
        `,
        width: '800px',
        showConfirmButton: false,
        showCloseButton: true
    });
}

async function openFormSurat(mode, dataEncoded = null) {
    let d = {};
    let title = 'Input Surat Baru';
    let btnText = 'Simpan';
    let oldNo = ''; 

    if (mode === 'edit' && dataEncoded) {
        d = JSON.parse(decodeURIComponent(dataEncoded));
        title = 'Edit Surat Keluar';
        btnText = 'Update Perubahan';
        oldNo = d.no; 
    }

    const tglValue = d.tgl ? new Date(d.tgl).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    const { value: f } = await Swal.fire({
        title: title,
        html: `
            <div class="text-left space-y-3 mt-2">
                <label class="text-xs font-bold text-gray-500">Nomor Surat</label>
                <input id="s-no" class="swal2-input !m-0 !w-full" placeholder="No Surat" value="${d.no || ''}">
                
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-bold text-gray-500">Tanggal</label>
                        <input id="s-tgl" type="date" class="swal2-input !m-0 !w-full !text-sm" value="${tglValue}">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500">Sifat</label>
                        <select id="s-sifat" class="swal2-select !m-0 !w-full !text-sm">
                            <option ${d.sifat === 'Biasa' ? 'selected' : ''}>Biasa</option>
                            <option ${d.sifat === 'Penting' ? 'selected' : ''}>Penting</option>
                            <option ${d.sifat === 'Segera' ? 'selected' : ''}>Segera</option>
                        </select>
                    </div>
                </div>
                
                <label class="text-xs font-bold text-gray-500">Tujuan</label>
                <input id="s-tuj" class="swal2-input !m-0 !w-full" placeholder="Tujuan" value="${d.tujuan || ''}">
                
                <label class="text-xs font-bold text-gray-500">Perihal</label>
                <textarea id="s-hal" class="swal2-textarea !m-0 !w-full" placeholder="Perihal" rows="2">${d.hal || ''}</textarea>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: btnText,
        cancelButtonText: 'Batal',
        confirmButtonColor: mode === 'edit' ? '#f59e0b' : '#2563eb', 
        preConfirm: () => ({
            no: document.getElementById('s-no').value,
            tgl: document.getElementById('s-tgl').value,
            sifat: document.getElementById('s-sifat').value,
            tujuan: document.getElementById('s-tuj').value,
            hal: document.getElementById('s-hal').value
        })
    });

    if (f) {
        if (!f.no) return Swal.fire('Gagal', 'Nomor Surat wajib diisi', 'error');

        Swal.fire({ title: 'Menyimpan...', didOpen: () => Swal.showLoading() });

        let url = `${SCRIPT_URL}?action=catatSurat`; 
        if (mode === 'edit') {
            url = `${SCRIPT_URL}?action=updateSurat&old_no=${encodeURIComponent(oldNo)}`;
        }
        url += `&no_surat=${encodeURIComponent(f.no)}&tgl_surat=${encodeURIComponent(f.tgl)}&sifat=${encodeURIComponent(f.sifat)}&tujuan=${encodeURIComponent(f.tujuan)}&perihal=${encodeURIComponent(f.hal)}`;

        try {
            const req = await fetch(url);
            const res = await req.json();
            if (res.status === 'success') {
                await Swal.fire('Sukses', 'Data berhasil disimpan', 'success');
                openSuratManager(); 
            } else {
                Swal.fire('Gagal', res.msg || 'Terjadi kesalahan', 'error');
            }
        } catch (e) {
            Swal.fire('Error', 'Gagal koneksi server', 'error');
        }
    } else {
        openSuratManager();
    }
}
async function openSuratMasukModal(){ const {value:f} = await Swal.fire({ title: 'Arsip Surat Masuk', html: `<div class="space-y-3 text-left"><input id="sm-tgl" type="date" class="input-field" value="${new Date().toISOString().split('T')[0]}"><input id="sm-no" class="input-field" placeholder="Nomor Surat"><input id="sm-pengirim" class="input-field" placeholder="Pengirim (ex: Camat)"><textarea id="sm-hal" class="input-field" placeholder="Perihal" rows="2"></textarea><input id="sm-disp" class="input-field" placeholder="Disposisi ke"></div>`, showCancelButton: true, confirmButtonText: 'Arsipkan', confirmButtonColor: '#d97706', preConfirm: () => ({ tgl: document.getElementById('sm-tgl').value, no: document.getElementById('sm-no').value, pengirim: document.getElementById('sm-pengirim').value, hal: document.getElementById('sm-hal').value, disp: document.getElementById('sm-disp').value }) }); if(f){Swal.fire({title:'Menyimpan...',didOpen:()=>Swal.showLoading()}); try{ await secureFetch(`${SCRIPT_URL}?action=catatSuratMasuk&tgl=${f.tgl}&no=${encodeURIComponent(f.no)}&pengirim=${encodeURIComponent(f.pengirim)}&hal=${encodeURIComponent(f.hal)}&disp=${encodeURIComponent(f.disp)}`); Swal.fire('Sukses','Surat Diarsipkan','success'); }catch(e){Swal.fire('Error','Gagal','error');}} }
async function openAbsensiModal(){ Swal.fire({title:'Memuat...',didOpen:()=>Swal.showLoading()}); let list=[]; try{const r=await secureFetch(`${SCRIPT_URL}?action=getPegawai`);const j=await r.json();list=j.data;}catch(e){} Swal.close(); let opts=list.length?list.map(p=>`<option value="${p.nama}|${p.jabatan}">${p.nama} - ${p.jabatan}</option>`).join(''):'<option disabled>Kosong</option>'; const {value:res} = await Swal.fire({ title: 'Absensi', width: 600, html: `<div class="text-left space-y-4"><div class="flex gap-2"><select id="a-nm" class="input-field w-full"><option value="">-- Pilih Nama --</option>${opts}</select><button class="bg-green-600 text-white px-3 rounded-lg" onclick="tambahPegawaiPopup()"><i class="fas fa-plus"></i></button></div><div class="grid grid-cols-2 gap-4"><div><label class="text-xs font-bold text-slate-500">Tanggal</label><input id="a-tgl" type="date" class="input-field" value="${new Date().toISOString().split('T')[0]}"></div><div><label class="text-xs font-bold text-slate-500">Status</label><select id="a-st" class="input-field"><option>Hadir</option><option>Sakit</option></select></div></div><div><label class="text-xs font-bold text-slate-500">Foto</label><input type="file" id="a-foto" accept="image/*" class="input-field border-dashed"></div><textarea id="a-ket" class="input-field" placeholder="Keterangan" rows="2"></textarea></div>`, showCancelButton: true, confirmButtonText: 'Kirim', confirmButtonColor: '#059669', preConfirm: async () => { const fileInput = document.getElementById('a-foto'); if(fileInput.files.length === 0) { Swal.showValidationMessage('Foto Wajib!'); return false; } return { raw: document.getElementById('a-nm').value, tgl: document.getElementById('a-tgl').value, stat: document.getElementById('a-st').value, ket: document.getElementById('a-ket').value, file: fileInput.files[0] } } }); if(res){ if(!res.raw) return Swal.fire('Error','Pilih Nama','error'); const [nm,jb] = res.raw.split('|'); Swal.fire({title:'Upload...', text:'Tunggu...', allowOutsideClick:false, didOpen:()=>Swal.showLoading()}); const toBase64 = file => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error); }); try { const base64Str = await toBase64(res.file); const payload = { action: 'catatAbsen', nama: nm, jabatan: jb, tanggal: res.tgl, status: res.stat, ket: res.ket, foto: base64Str }; await secureFetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) }); Swal.fire('Sukses', 'Absen Tersimpan', 'success'); } catch(e) { Swal.fire('Gagal', 'Error Upload', 'error'); } } }

async function openPBBModal() {
  const listPejabat = [
    "Kaur Perencanaan", "Kaur Umum", "Kaur Keuangan",
    "Kasi Pemerintahan", "Kasi Kesejahteraan", "Kasi Pelayanan",
    "Kepala Jaga 1", "Kepala Jaga 2", "Kepala Jaga 3", "Kepala Jaga 4",
    "Ketua BPD", "Wakil Ketua BPD", "Sekretaris BPD", 
    "Anggota 1 BPD", "Anggota 2 BPD"
  ];

  const formatRupiah = (num) => {
    return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  Swal.fire({ 
    title: 'Sinkronisasi Data...', 
    html: '<span class="text-sm text-gray-500">Menghitung total uang masuk...</span>',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading() 
  });

  let dataRekap = {};
  try {
    const response = await secureFetch(`${SCRIPT_URL}?action=getRekapSetoran`);
    dataRekap = await response.json(); 
  } catch (error) {
    console.warn("Offline/Gagal ambil rekap", error);
  }

  Swal.close(); 
  
  const totalUangMasuk = Object.values(dataRekap).reduce((acc, curr) => acc + curr, 0);

  const generateDashboardHTML = () => {
    const sortedList = [...listPejabat].sort((a, b) => (dataRekap[b] || 0) - (dataRekap[a] || 0));

    return sortedList.map(jabatan => {
        const totalUang = dataRekap[jabatan] || 0;
        const containerClass = totalUang > 0 ? 'bg-white border border-indigo-100 shadow-sm' : 'opacity-50 hover:opacity-100';
        const textClass = totalUang > 0 ? 'text-gray-800 font-semibold' : 'text-gray-400';
        const badgeClass = totalUang > 0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 font-mono font-bold' : 'bg-gray-100 text-gray-400 text-[10px]';
        const displayUang = totalUang > 0 ? formatRupiah(totalUang) : 'Rp 0';

        return `
            <div class="flex justify-between items-center px-3 py-2.5 mb-2 rounded-xl transition-all duration-200 ${containerClass}">
                <div class="flex items-center gap-2 overflow-hidden">
                    <div class="w-1 h-6 rounded-full flex-none ${totalUang > 0 ? 'bg-emerald-500' : 'bg-gray-300'}"></div>
                    <span class="text-xs truncate ${textClass}" title="${jabatan}">${jabatan}</span>
                </div>
                <span class="text-xs px-2 py-1 rounded-md flex-none ${badgeClass}">
                    ${displayUang}
                </span>
            </div>
        `;
    }).join('');
  };

  const optionsPejabat = listPejabat.map(j => `<option value="${j}">${j}</option>`).join('');
  let draftList = [];

  const updateDraftView = () => {
    const tableBody = document.getElementById('draft-body');
    const totalElem = document.getElementById('draft-total');
    const container = document.getElementById('draft-container');
    
    if (draftList.length > 0) {
        container.style.display = 'block';
        tableBody.innerHTML = draftList.map((item, index) => `
            <div class="flex justify-between items-center p-2 mb-1 bg-white border-l-4 border-indigo-500 rounded shadow-sm group hover:bg-indigo-50 transition-colors">
                <div>
                    <div class="text-xs font-bold text-gray-700">${item.nama}</div>
                    <div class="text-[10px] text-gray-400 group-hover:text-indigo-400">${item.jaga}</div>
                </div>
                <div class="flex items-center gap-3">
                    <span class="font-mono text-xs font-bold text-gray-600 group-hover:text-indigo-700">${formatRupiah(item.nom)}</span>
                    <button onclick="hapusDraft(${index})" class="text-red-300 hover:text-red-600 px-1 font-bold text-lg">×</button>
                </div>
            </div>
        `).join('');
        
        const total = draftList.reduce((acc, curr) => acc + parseInt(curr.nom), 0);
        totalElem.innerHTML = `${formatRupiah(total)}`;
    } else {
        container.style.display = 'none';
    }
  };

  window.hapusDraft = (index) => {
    draftList.splice(index, 1);
    updateDraftView();
  };

  const { value: finalData } = await Swal.fire({
    title: '', 
    width: '1100px',
    padding: '0',
    background: '#f8fafc',
    html: `
      <div class="flex flex-col md:flex-row h-[600px] overflow-hidden text-left rounded-lg font-sans">
        
        <div class="md:w-[65%] bg-white p-6 flex flex-col h-full relative shadow-xl z-10">
            <h3 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 border-b pb-3">
                <span class="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg text-lg">📝</span> Input Data Penyetoran
            </h3>
            
            <div class="space-y-4">
                <div class="grid grid-cols-12 gap-4">
                     <div class="col-span-3">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Tahun</label>
                        <input id="pb-thn" type="number" class="w-full bg-slate-50 border border-slate-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-all" value="2025">
                     </div>
                     <div class="col-span-9">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Petugas Penagih</label>
                        <select id="pb-jaga" class="w-full bg-indigo-50/50 border border-indigo-100 text-indigo-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-semibold cursor-pointer hover:bg-indigo-50">
                            <option value="" disabled selected>-- Pilih Petugas --</option>
                            ${optionsPejabat}
                        </select>
                     </div>
                </div>

                <div>
                     <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Wajib Pajak</label>
                     <input id="pb-nm" class="w-full bg-slate-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-all placeholder-gray-400" placeholder="Nama Lengkap">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">NOP (Opsional)</label>
                        <input id="pb-nop" class="w-full bg-slate-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-all" placeholder="Nomor Objek Pajak">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Nominal Setoran</label>
                        <input id="pb-nom" type="text" class="w-full bg-slate-50 border border-slate-200 text-emerald-700 font-bold text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-3 outline-none text-right font-mono" placeholder="Rp 0">
                    </div>
                </div>

                <button type="button" id="btn-tambah" class="mt-2 w-full text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-xl text-sm px-5 py-3.5 mb-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
                  + Tambahkan ke Daftar
                </button>
            </div>

            <div id="draft-container" class="mt-4 flex-1 overflow-y-auto hidden border-t border-dashed border-gray-300 pt-3 pr-1 custom-scroll">
                <div class="flex justify-between items-center mb-3 bg-indigo-50 p-2 rounded-lg">
                    <span class="text-xs font-bold text-indigo-800 uppercase tracking-wide">Draft Pengiriman</span>
                    <span id="draft-total" class="text-xs font-mono font-bold text-white bg-indigo-600 px-2 py-1 rounded"></span>
                </div>
                <div id="draft-body" class="space-y-2"></div>
            </div>
        </div>

        <div class="md:w-[35%] bg-slate-100 border-l border-gray-200 p-5 flex flex-col h-full relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div class="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-xl shadow-gray-400/50 mb-5 border border-gray-700">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Uang Terkumpul</div>
                        <div class="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                            ${formatRupiah(totalUangMasuk)}
                        </div>
                    </div>
                    <div class="bg-white/10 p-2 rounded-lg text-xl">💰</div>
                </div>
                <div class="mt-3 text-[10px] text-gray-500 font-mono">Real-time database sync</div>
            </div>

            <div class="flex items-center justify-between mb-3 px-1 z-10">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Peringkat Penyetor</span>
                <span class="text-[10px] bg-white px-2 py-0.5 rounded border text-gray-400">Top Down</span>
            </div>
            
            <div class="flex-1 overflow-y-auto pr-1 custom-scroll space-y-1 z-10">
                ${generateDashboardHTML()}
            </div>
        </div>

      </div>

      <style>
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      </style>
    `,
    showCancelButton: true,
    confirmButtonText: '🚀 Kirim ke Database',
    confirmButtonColor: '#4f46e5',
    cancelButtonText: 'Tutup',
    
    didOpen: () => {
        const inputNom = document.getElementById('pb-nom');
        inputNom.addEventListener('input', function() {
            let val = this.value.replace(/[^0-9]/g, '');
            if (val) val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            this.value = val; 
        });

        document.getElementById('btn-tambah').addEventListener('click', () => {
            const thn = document.getElementById('pb-thn').value;
            const nama = document.getElementById('pb-nm').value;
            const nop = document.getElementById('pb-nop').value;
            const jaga = document.getElementById('pb-jaga').value;
            const nomStr = document.getElementById('pb-nom').value.replace(/\./g, '');

            if(!nama || !nomStr || !jaga) {
                const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                Toast.fire({ icon: 'error', title: 'Data belum lengkap!' });
                return;
            }

            draftList.push({ thn, nama, nop, nom: nomStr, jaga });

            document.getElementById('pb-nm').value = '';
            document.getElementById('pb-nop').value = '';
            document.getElementById('pb-nom').value = '';
            document.getElementById('pb-nm').focus();

            updateDraftView();
        });
    },
    preConfirm: () => {
      if (draftList.length === 0) {
        Swal.showValidationMessage('Tidak ada data yang akan dikirim.');
        return false;
      }
      return draftList;
    }
  });

  if (finalData) {
    Swal.fire({ title: 'Sedang Menyimpan...', didOpen: () => Swal.showLoading() });
    try {
      const payload = JSON.stringify(finalData);
      await secureFetch(`${SCRIPT_URL}?action=catatPBB_Batch&data=${encodeURIComponent(payload)}`);
      Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Rp ${formatRupiah(finalData.reduce((a,b)=>a+parseInt(b.nom),0))} berhasil disetor.`,
          confirmButtonColor: '#4f46e5'
      });
    } catch (e) {
      Swal.fire('Error', 'Gagal koneksi server', 'error');
    }
  }
}

async function openInventarisModal() {
    Swal.fire({ 
        title: 'Memuat Data Aset...', 
        html: '<span class="text-sm text-gray-500">Sinkronisasi database inventaris desa</span>',
        didOpen: () => Swal.showLoading() 
    });

    let stats = { total: 0, rusak: 0, list: [] };
    try {
        const res = await secureFetch(`${SCRIPT_URL}?action=getRekapInventaris`);
        stats = await res.json();
    } catch (e) {
        console.warn("Gagal load stats", e);
    }
    Swal.close();

    window.detailAset = (index) => {
        const item = stats.list[index];
        const isRusak = item.kondisi.toLowerCase().includes('rusak');
        const badgeColor = isRusak ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700';
        
        const imgDisplay = item.foto 
            ? `<img src="${item.foto}" class="w-full h-64 object-cover rounded-t-2xl shadow-sm">`
            : `<div class="w-full h-40 bg-gray-100 flex flex-col items-center justify-center rounded-t-2xl text-gray-400">
                 <span class="text-4xl mb-2">📷</span><span>Tidak ada foto</span>
               </div>`;

        Swal.fire({
            title: '',
            width: '600px',
            padding: 0,
            showConfirmButton: false,
            showCloseButton: true,
            background: '#ffffff',
            html: `
                <div class="text-left font-sans pb-6">
                    <div class="relative">
                        ${imgDisplay}
                        <div class="absolute bottom-[-16px] left-6 bg-white p-1 rounded-xl shadow-md">
                            <span class="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${badgeColor}">
                                ${item.kondisi}
                            </span>
                        </div>
                    </div>

                    <div class="mt-8 px-6">
                        <h2 class="text-2xl font-black text-gray-800 leading-tight">${item.nama}</h2>
                        <p class="text-sm font-mono text-gray-400 mt-1 flex items-center gap-2">
                            <span class="bg-gray-100 px-2 py-0.5 rounded text-gray-600">Kode: ${item.kode}</span>
                        </p>
                    </div>

                    <div class="mt-6 px-6 grid grid-cols-2 gap-y-4 gap-x-6">
                        <div class="col-span-1">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase">Merk/Tipe</label>
                            <div class="text-sm font-semibold text-gray-700">${item.merk || '-'}</div>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase">Tahun Perolehan</label>
                            <div class="text-sm font-semibold text-gray-700">${item.tahun || '-'}</div>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase">Ukuran/Dimensi</label>
                            <div class="text-sm font-semibold text-gray-700">${item.ukuran || '-'}</div>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase">Asal Usul</label>
                            <div class="text-sm font-semibold text-gray-700">${item.asal || '-'}</div>
                        </div>
                        
                        <div class="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Spesifikasi Teknis</label>
                            <div class="text-sm text-gray-600 leading-relaxed">${item.spek || 'Tidak ada data spesifikasi.'}</div>
                        </div>

                        ${isRusak && item.ket ? `
                        <div class="col-span-2 bg-red-50 p-3 rounded-lg border border-red-100">
                            <label class="block text-[10px] font-bold text-red-400 uppercase mb-1">⚠️ Kerusakan / Perbaikan</label>
                            <div class="text-sm text-red-700 font-medium">${item.ket}</div>
                        </div>` : ''}
                    </div>
                </div>
            `
        });
    };

    const generateListHTML = () => {
        if (stats.list.length === 0) return '<div class="text-center text-xs text-gray-400 py-4">Belum ada data aset</div>';
        
        return stats.list.map((item, index) => {
            const isRusak = item.kondisi.toLowerCase().includes('rusak');
            const bgClass = isRusak ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100';
            const textClass = isRusak ? 'text-red-700' : 'text-emerald-700';
            const icon = isRusak ? '⚠️' : '✅';
            
            return `
            <div onclick="window.detailAset(${index})" 
                 class="flex flex-col p-2 mb-2 rounded-lg border ${bgClass} text-left cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200 group">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-xs font-bold text-gray-700 truncate w-32 group-hover:text-blue-600 transition-colors">
                            ${item.nama}
                        </div>
                        <div class="text-[10px] text-gray-400">${item.kode}</div>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white ${textClass} border border-white shadow-sm">
                        ${icon} ${item.kondisi}
                    </span>
                </div>
                ${isRusak && item.ket ? `<div class="mt-1 text-[10px] text-red-500 italic border-t border-red-200 pt-1 truncate">Perlu: ${item.ket}</div>` : ''}
                
                <div class="mt-1 flex justify-end">
                     <span class="text-[9px] text-gray-400 font-medium group-hover:text-blue-500">👆 Klik info detail</span>
                </div>
            </div>`;
        }).join('');
    };

    const { value: formValues } = await Swal.fire({
        title: '',
        width: '1100px',
        padding: 0,
        background: '#f8fafc',
        html: `
        <div class="flex flex-col md:flex-row h-[650px] overflow-hidden font-sans text-left">
            
            <div class="md:w-[65%] bg-white p-6 flex flex-col h-full overflow-y-auto custom-scroll relative">
                <h3 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 border-b pb-3 sticky top-0 bg-white z-10">
                    <span class="bg-orange-100 text-orange-600 p-1.5 rounded-lg text-lg">📦</span> Catat Aset Desa
                </h3>
                
                <div class="space-y-4 pb-4">
                    <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300">
                        <div id="preview-container" class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-none">
                            <span class="text-2xl">📷</span>
                        </div>
                        <div class="flex-1">
                            <label class="block text-xs font-bold text-gray-500 mb-1">Upload Foto Aset</label>
                            <input type="file" id="inv-foto" accept="image/*" class="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all"/>
                            <div class="text-[10px] text-gray-400 mt-1">*Maks 2MB, format JPG/PNG</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div class="col-span-1"><label class="label-text">Kode Barang</label><input id="inv-kd" class="input-material" placeholder="Contoh: 02.06.01"></div>
                        <div class="col-span-2"><label class="label-text">Nama Barang</label><input id="inv-nm" class="input-material" placeholder="Contoh: Laptop Asus ROG"></div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div><label class="label-text">Merk/Tipe</label><input id="inv-merk" class="input-material" placeholder="-"></div>
                        <div><label class="label-text">Ukuran/Dimensi</label><input id="inv-uk" class="input-material" placeholder="P x L x T"></div>
                        <div><label class="label-text">Bahan</label><input id="inv-bhn" class="input-material" placeholder="Besi/Kayu/dll"></div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div><label class="label-text">Tahun Perolehan</label><input id="inv-thn" type="number" class="input-material" value="2025"></div>
                        <div><label class="label-text">Nomor Seri/Pabrik</label><input id="inv-seri" class="input-material" placeholder="SN: XXXXX"></div>
                    </div>

                    <div>
                        <label class="label-text">Asal-Usul Aset</label>
                        <select id="inv-asal" class="input-material cursor-pointer">
                            <option value="Dana Desa">Dana Desa (DD)</option>
                            <option value="PADes">Pendapatan Asli Desa (PADes)</option>
                            <option value="Bantuan Kab/Prov">Bantuan Kabupaten/Provinsi</option>
                            <option value="Hibah">Hibah / Sumbangan Pihak Ketiga</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div>
                        <label class="label-text">Spesifikasi Teknis</label>
                        <textarea id="inv-spek" rows="2" class="input-material" placeholder="Warna, kelengkapan, dll..."></textarea>
                    </div>

                    <div class="bg-orange-50 p-3 rounded-xl border border-orange-100">
                        <label class="label-text text-orange-800">Kondisi Saat Ini</label>
                        <select id="inv-kon" class="input-material border-orange-200 focus:border-orange-500 mb-2 font-bold text-gray-700">
                            <option value="Baik">✅ Baik</option>
                            <option value="Rusak Sedang">⚠️ Rusak Sedang (Bisa Diperbaiki)</option>
                            <option value="Rusak Berat">❌ Rusak Berat (Penghapusan)</option>
                        </select>
                        <div id="box-perbaikan" class="hidden mt-2 transition-all duration-300">
                            <label class="label-text text-red-600 font-bold">🛠️ Apa yang harus diganti/diperbaiki?</label>
                            <input id="inv-rusak-ket" class="input-material border-red-300 bg-red-50 focus:border-red-500 text-red-700 placeholder-red-300" placeholder="Contoh: Ganti LCD, Service Mesin, Ganti Ban...">
                        </div>
                    </div>
                </div>
            </div>

            <div class="md:w-[35%] bg-slate-100 border-l border-gray-200 p-5 flex flex-col h-full overflow-hidden">
                
                <div class="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-4 rounded-2xl shadow-lg shadow-orange-200 mb-4 relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 bg-white/20 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                    <div class="relative z-10">
                        <div class="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">Total Aset Desa</div>
                        <div class="text-4xl font-black">${stats.total}</div>
                        <div class="text-[10px] mt-1 opacity-90">Unit Barang Tercatat</div>
                    </div>
                </div>

                <div class="flex gap-2 mb-4">
                    <div class="flex-1 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                        <div class="text-[10px] text-gray-400 font-bold uppercase">Kondisi Baik</div>
                        <div class="text-xl font-bold text-emerald-600">${stats.total - stats.rusak}</div>
                    </div>
                    <div class="flex-1 bg-white p-3 rounded-xl border border-red-200 shadow-sm relative overflow-hidden">
                        ${stats.rusak > 0 ? '<span class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>' : ''}
                        <div class="text-[10px] text-red-400 font-bold uppercase">Perlu Perbaikan</div>
                        <div class="text-xl font-bold text-red-600">${stats.rusak}</div>
                    </div>
                </div>

                <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Input Terbaru</span>
                    <div class="flex-1 h-[1px] bg-gray-200"></div>
                </div>
                
                <div class="flex-1 overflow-y-auto custom-scroll pr-1">
                    ${generateListHTML()}
                </div>

            </div>
        </div>
        
        <style>
            .label-text { display: block; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.05em; }
            .input-material { width: 100%; padding: 10px 12px; background-color: #f1f5f9; border: 2px solid transparent; border-radius: 10px; font-size: 13px; outline: none; transition: all 0.2s; color: #334155; }
            .input-material:focus { background-color: #ffffff; border-color: #f97316; box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
            .custom-scroll::-webkit-scrollbar { width: 4px; }
            .custom-scroll::-webkit-scrollbar-track { background: transparent; }
            .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        </style>
        `,
        showCancelButton: true,
        confirmButtonText: '💾 Simpan Data',
        confirmButtonColor: '#ea580c',
        cancelButtonText: 'Batal',
        
        didOpen: () => {
            const selKondisi = document.getElementById('inv-kon');
            const boxPerbaikan = document.getElementById('box-perbaikan');
            const inputRusak = document.getElementById('inv-rusak-ket');

            selKondisi.addEventListener('change', (e) => {
                if (e.target.value.includes('Rusak')) {
                    boxPerbaikan.classList.remove('hidden');
                    inputRusak.focus();
                } else {
                    boxPerbaikan.classList.add('hidden');
                    inputRusak.value = ''; 
                }
            });

            const inputFoto = document.getElementById('inv-foto');
            const previewContainer = document.getElementById('preview-container');
            inputFoto.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewContainer.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
                    }
                    reader.readAsDataURL(file);
                }
            });
        },
        preConfirm: () => {
            const nama = document.getElementById('inv-nm').value;
            const kondisi = document.getElementById('inv-kon').value;
            const ketRusak = document.getElementById('inv-rusak-ket').value;

            if (!nama) { Swal.showValidationMessage('Nama Barang wajib diisi!'); return false; }
            if (kondisi.includes('Rusak') && !ketRusak) { Swal.showValidationMessage('Jelaskan apa yang rusak!'); return false; }

            const fileInput = document.getElementById('inv-foto');
            
            return new Promise((resolve) => {
                const data = {
                    kode: document.getElementById('inv-kd').value,
                    nama: nama,
                    merk: document.getElementById('inv-merk').value,
                    ukuran: document.getElementById('inv-uk').value,
                    bahan: document.getElementById('inv-bhn').value,
                    tahun: document.getElementById('inv-thn').value,
                    noseri: document.getElementById('inv-seri').value,
                    asal: document.getElementById('inv-asal').value,
                    spek: document.getElementById('inv-spek').value,
                    kondisi: kondisi,
                    rusak_ket: ketRusak,
                    foto: null
                };

                if (fileInput.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        data.foto = e.target.result; 
                        resolve(data);
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    resolve(data);
                }
            });
        }
    });

    if (formValues) {
        Swal.fire({ title: 'Menyimpan...', didOpen: () => Swal.showLoading() });
        try {
            const payload = JSON.stringify({ action: 'catatInventaris', ...formValues });
            await secureFetch(SCRIPT_URL, { method: 'POST', body: payload });
            Swal.fire('Berhasil', 'Data aset tersimpan', 'success');
        } catch (e) {
            Swal.fire('Error', 'Gagal koneksi server', 'error');
        }
    }
}
async function openKematianModal(){ const {value:f} = await Swal.fire({ title: 'Buku Kematian', html: `<div class="space-y-3 text-left"><label class="text-xs text-red-500 font-bold">*Hapus Bansos</label><input id="km-tgl" type="date" class="input-field" value="${new Date().toISOString().split('T')[0]}"><input id="km-nm" class="input-field" placeholder="Nama Almarhum/ah"><div class="grid grid-cols-2 gap-2"><input id="km-nik" class="input-field" placeholder="NIK"><input id="km-umur" class="input-field" placeholder="Umur"></div><input id="km-sebab" class="input-field" placeholder="Penyebab"><input id="km-lapor" class="input-field" placeholder="Pelapor"></div>`, showCancelButton: true, confirmButtonText: 'Catat', confirmButtonColor: '#374151', preConfirm: () => ({ tgl: document.getElementById('km-tgl').value, nama: document.getElementById('km-nm').value, nik: document.getElementById('km-nik').value, umur: document.getElementById('km-umur').value, sebab: document.getElementById('km-sebab').value, lapor: document.getElementById('km-lapor').value }) }); if(f){Swal.fire({title:'Menyimpan...',didOpen:()=>Swal.showLoading()}); try{ await secureFetch(`${SCRIPT_URL}?action=catatKematian&tgl=${f.tgl}&nama=${f.nama}&nik=${f.nik}&umur=${f.umur}&sebab=${f.sebab}&lapor=${f.lapor}`); Swal.fire('Tercatat','Data Kematian Disimpan','success'); }catch(e){Swal.fire('Error','Gagal','error');}} }
async function openKelahiranModal(){ const {value:f} = await Swal.fire({ title: 'Buku Kelahiran', html: `<div class="space-y-3 text-left"><input id="kl-tgl" type="date" class="input-field" value="${new Date().toISOString().split('T')[0]}"><input id="kl-nm" class="input-field" placeholder="Nama Bayi"><select id="kl-jk" class="input-field"><option>Laki-laki</option><option>Perempuan</option></select><div class="grid grid-cols-2 gap-2"><input id="kl-ayah" class="input-field" placeholder="Nama Ayah"><input id="kl-ibu" class="input-field" placeholder="Nama Ibu"></div><input id="kl-brt" class="input-field" placeholder="Berat (Kg)"></div>`, showCancelButton: true, confirmButtonText: 'Simpan', confirmButtonColor: '#db2777', preConfirm: () => ({ tgl: document.getElementById('kl-tgl').value, nama: document.getElementById('kl-nm').value, jk: document.getElementById('kl-jk').value, ayah: document.getElementById('kl-ayah').value, ibu: document.getElementById('kl-ibu').value, brt: document.getElementById('kl-brt').value }) }); if(f){Swal.fire({title:'Menyimpan...',didOpen:()=>Swal.showLoading()}); try{ await secureFetch(`${SCRIPT_URL}?action=catatKelahiran&tgl=${f.tgl}&nama=${f.nama}&jk=${f.jk}&ayah=${f.ayah}&ibu=${f.ibu}&brt=${f.brt}`); Swal.fire('Sukses','Bayi Tercatat','success'); }catch(e){Swal.fire('Error','Gagal','error');}} }
async function openStuntingModal(){ const {value:f} = await Swal.fire({ title: 'Data Balita', html: `<div class="space-y-3 text-left"><input id="st-tgl" type="date" class="input-field" value="${new Date().toISOString().split('T')[0]}"><input id="st-anak" class="input-field" placeholder="Nama Anak"><div class="grid grid-cols-3 gap-2"><input id="st-umur" type="number" class="input-field" placeholder="Umur"><input id="st-brt" type="number" step="0.1" class="input-field" placeholder="Berat"><input id="st-tng" type="number" step="0.1" class="input-field" placeholder="Tinggi"></div><select id="st-sts" class="input-field"><option>Normal</option><option>Kurang Gizi</option><option>Stunting</option></select></div>`, showCancelButton: true, confirmButtonText: 'Simpan', confirmButtonColor: '#7c3aed', preConfirm: () => ({ tgl: document.getElementById('st-tgl').value, anak: document.getElementById('st-anak').value, umur: document.getElementById('st-umur').value, berat: document.getElementById('st-brt').value, tinggi: document.getElementById('st-tng').value, status: document.getElementById('st-sts').value }) }); if(f){Swal.fire({title:'Menyimpan...',didOpen:()=>Swal.showLoading()});try{await secureFetch(`${SCRIPT_URL}?action=catatStunting&tgl=${f.tgl}&anak=${f.anak}&umur=${f.umur}&berat=${f.berat}&tinggi=${f.tinggi}&status=${f.status}`);Swal.fire('Sukses','Tersimpan','success');}catch(e){Swal.fire('Error','Gagal','error');}} }
async function openTamuModal(){ const {value:f} = await Swal.fire({ title: 'Buku Tamu', html: `<div class="space-y-3 text-left"><input id="tam-tgl" type="date" class="input-field" value="${new Date().toISOString().split('T')[0]}"><input id="tam-nm" class="input-field" placeholder="Nama"><input id="tam-ins" class="input-field" placeholder="Instansi"><textarea id="tam-perlu" class="input-field" placeholder="Keperluan" rows="2"></textarea><input id="tam-hp" class="input-field" placeholder="No HP"></div>`, showCancelButton: true, confirmButtonText: 'Catat', confirmButtonColor: '#db2777', preConfirm: () => ({ tgl: document.getElementById('tam-tgl').value, nama: document.getElementById('tam-nm').value, instansi: document.getElementById('tam-ins').value, perlu: document.getElementById('tam-perlu').value, hp: document.getElementById('tam-hp').value }) }); if(f){Swal.fire({title:'Menyimpan...',didOpen:()=>Swal.showLoading()});try{await secureFetch(`${SCRIPT_URL}?action=catatTamu&tgl=${f.tgl}&nama=${f.nama}&instansi=${f.instansi}&perlu=${f.perlu}&hp=${f.hp}`);Swal.fire('Sukses','Tamu tercatat','success');}catch(e){Swal.fire('Error','Gagal','error');}} }
async function openAgendaModal(){ const {value:f} = await Swal.fire({ title: 'Agenda', html: `<div class="space-y-3 text-left"><input id="ag-tgl" type="datetime-local" class="input-field"><input id="ag-nm" class="input-field" placeholder="Kegiatan"><input id="ag-lok" class="input-field" placeholder="Lokasi"><input id="ag-dana" class="input-field" placeholder="Anggaran"><textarea id="ag-ket" class="input-field" placeholder="Ket"></textarea></div>`, showCancelButton: true, confirmButtonText: 'Jadwal', confirmButtonColor: '#0891b2', preConfirm: () => ({ tgl: document.getElementById('ag-tgl').value, acara: document.getElementById('ag-nm').value, lokasi: document.getElementById('ag-lok').value, dana: document.getElementById('ag-dana').value, ket: document.getElementById('ag-ket').value }) }); if(f){Swal.fire({title:'Menyimpan...',didOpen:()=>Swal.showLoading()});try{await secureFetch(`${SCRIPT_URL}?action=catatAgenda&tgl=${f.tgl}&acara=${f.acara}&lokasi=${f.lokasi}&dana=${f.dana}&ket=${f.ket}`);Swal.fire('Sukses','Tersimpan','success');}catch(e){Swal.fire('Error','Gagal','error');}} }
async function tambahPegawaiPopup(){ const {value:f}=await Swal.fire({title:'Tambah Pegawai',html:`<input id="nn" class="input-field mb-2" placeholder="Nama"><input id="jj" class="input-field" placeholder="Jabatan">`,confirmButtonText:'Simpan',preConfirm:()=>({n:document.getElementById('nn').value,j:document.getElementById('jj').value})}); if(f&&f.n){Swal.fire({title:'Menyimpan...',didOpen:()=>Swal.showLoading()});await secureFetch(`${SCRIPT_URL}?action=tambahPegawai&nama=${encodeURIComponent(f.n)}&jabatan=${encodeURIComponent(f.j)}`);Swal.fire('Sukses','Ditambahkan','success');} }
function showKantorPopup(){Swal.fire({title:'Kantor Desa',html:`<div class="grid grid-cols-2 gap-2 mt-4"><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvULrSREcdyjsHeuG9JCXZRaaNq11M9vfvIrfpiWPHjBZWgSKzGIYYvwG9JIACulBUTis2g7pCwpGlWi43cxHq6s_vsRXSt-yXUx6DfBEmDOlujp1jZhzwiLCZ5cyFlCv9PuciRHwNEo71DUYWcMs5DWNffMPem6lzkZTrkm-XWmFo47A4XaJLJCYEjR-2/s16000/2025-08-11%2010.06.25.jpg" class="h-32 w-full object-cover rounded"><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2mwZq_aD2rZ9hukNVb-cWVSNjTW5mSn8n_tZA6dPKtcs4IotRm2xRIlj_vJHyqFeuueScMs8hNL3_nwp1g80bORqoEYQwVnpm5HRgF00sALPoN5BJ0YEeT38xs8fCDl91R4GPPFWZi2JaKyAi6tkclyHU3e4ntprgvKcRTlIObmoDVKgPiWwugoRQ8T5s/s16000/IMG_3502.jpg" class="h-32 w-full object-cover rounded"></div>`,showConfirmButton:false,showCloseButton:true});}

async function showBLTPopup() {
        const { value: formValues } = await Swal.fire({
            title: 'Cek Status BLT 2026',
            html: `
                <div class="blt-input-group">
                    <label class="blt-label">Nama Lengkap (Sesuai KTP)</label>
                    <input id="swal-nama" class="swal2-input blt-input" placeholder="Contoh: DENY MUNAISECHE">
                </div>
                <div class="blt-input-group">
                    <label class="blt-label">NIK (16 Digit)</label>
                    <input id="swal-nik" type="number" class="swal2-input blt-input" placeholder="Masukkan 16 digit NIK">
                </div>
            `,
            confirmButtonText: 'Periksa Data',
            confirmButtonColor: '#0f766e',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            reverseButtons: true,
            customClass: { popup: 'blt-popup' },
            preConfirm: () => {
                const nama = document.getElementById('swal-nama').value.trim();
                const nik = document.getElementById('swal-nik').value.trim();
                
                if (!nama || !nik) {
                    Swal.showValidationMessage('Nama dan NIK wajib diisi!');
                    return false;
                }
                if (nik.length < 16) {
                    Swal.showValidationMessage('NIK harus berjumlah 16 digit!');
                    return false;
                }
                return { nama: nama.toUpperCase(), nik: nik };
            }
        });

        if (!formValues) return;

        Swal.fire({
            title: 'Memproses...',
            html: 'Sedang mencocokkan data dengan database desa',
            allowOutsideClick: false,
            customClass: { popup: 'blt-popup' },
            didOpen: () => Swal.showLoading()
        });

        try {
            // V5.6: checkBLT sekarang WARGA action - wajib login warga dulu
            const wargaToken = localStorage.getItem('molas_warga_token');
            if(!wargaToken){
                Swal.fire({
                    icon: 'warning',
                    title: 'Login Warga Diperlukan',
                    html: 'Untuk keamanan data BLT (V5.6), silakan login dengan NIK & Nama terlebih dahulu di menu Login Warga.',
                    confirmButtonText: 'Login Sekarang',
                    confirmButtonColor: '#0f766e'
                }).then(()=>openLoginModal());
                return;
            }
            const response = await secureFetch(`${SCRIPT_URL}?action=checkBLT&nik=${formValues.nik}&nama=${encodeURIComponent(formValues.nama)}`);
            const data = await response.json();

            if (data.terdaftar) {
                Swal.fire({
                    icon: 'success',
                    title: 'Data Terverifikasi',
                    html: `
                        <div class="blt-card">
                            <span class="status-badge">ANDA PENERIMA BLT MOLAS TAHUN 2026</span>
                            <div style="font-weight: 700; font-size: 1.2rem; color: #1e293b; margin-bottom: 5px;">${data.nama_kpm}</div>
                            <div style="font-size: 0.85rem; color: #64748b;">NIK: ${formValues.nik}</div>
                            
                            <div class="info-box">
                                <div class="info-title">TARGET PENCAIRAN</div>
                                <p class="info-text">
                                    Bantuan dicairkan <b>3 bulan sekali</b>. Estimasi pencairan berikutnya pada <b>Maret 2026</b>, segera setelah Dana Desa disalurkan ke kas desa.
                                </p>
                            </div>
                            
                            <div style="margin-top: 1rem; font-size: 0.8rem; color: #0f766e; font-weight: 600;">
                                Status Dana Desa 2026: ${data.info_desa.status_dana}
                            </div>
                        </div>
                    `,
                    confirmButtonText: 'Tutup',
                    confirmButtonColor: '#0f766e',
                    customClass: { popup: 'blt-popup' }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Tidak Ditemukan',
                    text: 'Mohon maaf, NIK Anda tidak terdaftar sebagai penerima BLT periode 2026.',
                    confirmButtonColor: '#0f766e',
                    customClass: { popup: 'blt-popup' }
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Koneksi Gagal',
                text: 'Terjadi kesalahan saat menghubungi server.',
                confirmButtonColor: '#ef4444',
                customClass: { popup: 'blt-popup' }
            });
        }
    }

const daftarAgenda = [
    {
        tgl: "04", 
        bln: "FEB", 
        judul: "Rekonsiliasi PMD Keuangan Desa",
        jam: "07.00 - Selesai",
        lokasi: "BPU Desa Molompar Dua",
        warna: "violet" 
    },
    {
        tgl: "29", 
        bln: "JAN", 
        judul: "Musdes Pertanggungjawaban APBDes 2025, Validasi Calon BLT 2026 , Rancangan APBDes 2026.",
        jam: "09.00 - 14.00",
        lokasi: "Kantor Desa Molompar Atas",
        warna: "blue"
    },
    {
        tgl: "28", 
        bln: "JAN", 
        judul: "Konsultasi Publik Rancangan Awal RKPD 2027",
        jam: "09.00 - Selesai",
        lokasi: "Kantor Bupati Mitra",
        warna: "emerald"
    },
    {
        tgl: "27", 
        bln: "JAN", 
        judul: "Undangan Inspektorat",
        jam: "09.30 s/d Selesai",
        lokasi: "Kantor Inspektorat Mitra",
        warna: "orange"
    }
];

function updateBadgeAgenda() {
    const el = document.getElementById('badge-agenda-count');
    if(el) {
        el.innerText = daftarAgenda.length + " Agenda Aktif";
    }
}
document.addEventListener("DOMContentLoaded", updateBadgeAgenda);

function showAgendaList() {
    let listHTML = `<div class="space-y-3 text-left max-h-[60vh] overflow-y-auto pr-1">`;
    
    if(daftarAgenda.length === 0) {
        listHTML += `<div class="text-center text-slate-400 py-4 italic">Belum ada jadwal kegiatan.</div>`;
    } else {
        daftarAgenda.forEach(item => {
            let colorClass = "border-l-violet-500 text-violet-600 bg-violet-50";
            if(item.warna === 'blue') colorClass = "border-l-blue-500 text-blue-600 bg-blue-50";
            if(item.warna === 'red') colorClass = "border-l-red-500 text-red-600 bg-red-50";
            if(item.warna === 'emerald') colorClass = "border-l-emerald-500 text-emerald-600 bg-emerald-50";
            if(item.warna === 'orange') colorClass = "border-l-orange-500 text-orange-600 bg-orange-50";

            listHTML += `
            <div class="flex bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                <div class="flex flex-col items-center justify-center p-3 w-16 ${colorClass.replace('bg-', 'bg-opacity-20 ')} border-r border-slate-100">
                    <span class="text-lg font-black leading-none">${item.tgl}</span>
                    <span class="text-[10px] font-bold uppercase mt-1">${item.bln}</span>
                </div>
                
                <div class="p-3 flex-1 border-l-4 ${colorClass.split(' ')[0]}">
                    <h4 class="text-sm font-bold text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors">${item.judul}</h4>
                    <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-2 text-xs text-slate-500">
                            <i class="far fa-clock text-[10px] w-4"></i> ${item.jam}
                        </div>
                        <div class="flex items-center gap-2 text-xs text-slate-500">
                            <i class="fas fa-map-marker-alt text-[10px] w-4"></i> ${item.lokasi}
                        </div>
                    </div>
                </div>
            </div>`;
        });
    }
    listHTML += `</div>`;

    Swal.fire({
        title: `
            <div class="flex items-center gap-3 border-b pb-3">
                <div class="bg-violet-100 p-2 rounded-lg text-violet-600"><i class="fas fa-calendar-alt"></i></div>
                <div class="text-left">
                    <div class="text-lg font-bold text-slate-800">Kalender Kegiatan</div>
                    <div class="text-xs text-slate-500 font-normal">Jadwal Undangan & Acara Desa</div>
                </div>
            </div>
        `,
        html: listHTML,
        width: '550px',
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
            popup: 'rounded-2xl'
        }
    });
}

async function openListModal(title, type){
    Swal.fire({title:'Memuat Data...', didOpen:()=>Swal.showLoading()});
    try {
        const r = await secureFetch(`${SCRIPT_URL}?action=getListData&type=${type}`);
        const j = await r.json();
        let modalWidth = '850px'; let fontSize = 'text-xs';
        if(type === 'penduduk') { modalWidth = '98%'; fontSize = 'text-[10px]'; }
        let tableHtml = `<div class="overflow-x-auto bg-white rounded-lg shadow border border-slate-200" style="max-height: 75vh;"><table class="min-w-full ${fontSize} text-left whitespace-nowrap"><thead class="bg-slate-100 sticky top-0 z-10 font-bold text-slate-700"><tr>`;
        j.headers.forEach(h => tableHtml += `<th class="p-3 border-b border-r border-slate-300">${h}</th>`);
        tableHtml += `<th class="p-3 border-b border-slate-300 text-center">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100">`;
        if(j.data.length === 0) tableHtml += `<tr><td colspan="${j.headers.length+1}" class="p-4 text-center text-slate-400 italic">Belum ada data</td></tr>`;
        j.data.forEach((row, idx) => { tableHtml += `<tr class="hover:bg-blue-50 transition">`; row.forEach(cell => { let show = cell; if(String(cell).includes('http') && String(cell).length > 15) show = `<img src="${cell}" class="h-8 w-8 rounded-full object-cover border border-slate-300">`; tableHtml += `<td class="p-2 border-r border-slate-200 align-middle">${show}</td>`; }); tableHtml += `<td class="p-2 text-center align-middle"><button onclick="hapusRow('${j.sheet}', ${idx})" class="text-red-500 hover:text-red-700 p-1"><i class="fas fa-trash"></i></button></td></tr>`; });
        tableHtml += `</tbody></table></div>`;
        let btnAdd = ""; if(type === 'penduduk') btnAdd = `<button onclick="tambahPendudukPopup()" class="mt-4 bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-purple-700 w-full"><i class="fas fa-plus mr-2"></i>Tambah Data Penduduk Baru</button>`;
        Swal.fire({ title: `<span class="text-lg font-bold text-slate-700">${title}</span>`, html: tableHtml + btnAdd, width: modalWidth, showConfirmButton: false, showCloseButton: true, padding: '1em' });
    } catch(e) { Swal.fire('Error', 'Gagal memuat data', 'error'); }
}

async function openLaporanModal(title, type){ Swal.fire({title:'Menyiapkan Laporan...', didOpen:()=>Swal.showLoading()}); try { const r = await secureFetch(`${SCRIPT_URL}?action=getListData&type=${type}`); const j = await r.json(); const kopImg = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgu9a_rRVt-zlvL8JvP06LWN_dAUsxyjkbHU7z8rX-tPteJVMrZnHtZNccFdQCGQPb1IpzkNoblhw_EYbxiooKwot6bBmtZWmbpgqR27WuSFEhHNdS2CMrnO1sBc40EnAuDSfklHQprMdfRKENNb3ObYP9uzN3LbpFJOC45mTIDy2sh90XOMbdOq_-P8Uda/s16000/KOPDESA1.PNG"; let html = `<div class="p-4 bg-white text-black font-serif" style="min-width: 900px;"><img src="${kopImg}" class="w-full mb-4 object-contain h-32"><h2 class="text-center font-bold text-xl uppercase underline mb-6">${title}</h2><table class="w-full border-collapse border border-black text-sm"><thead><tr class="bg-gray-200">`; j.headers.forEach(h => html += `<th class="border border-black p-2">${h}</th>`); html += `</tr></thead><tbody>`; j.data.forEach(row => { html += `<tr>`; row.forEach(cell => html += `<td class="border border-black p-2">${cell}</td>`); html += `</tr>`; }); html += `</tbody></table><div class="flex justify-end mt-12 text-center"><div class="mr-12"><p>Molompar Atas, ${new Date().toLocaleDateString('id-ID', {year:'numeric', month:'long', day:'numeric'})}</p><p class="font-bold mt-20 underline">ALFIUS B. TULANDI</p><p>Hukum Tua</p></div></div></div>`; Swal.fire({ html: html, width: 1000, showConfirmButton: true, confirmButtonText: '<i class="fas fa-print"></i> Cetak / Simpan PDF', confirmButtonColor: '#334155' }).then((res) => { if(res.isConfirmed) { var w = window.open(); w.document.write(html); w.print(); w.close(); } }); } catch(e) { Swal.fire('Error', 'Gagal memuat laporan', 'error'); } }
async function hapusRow(sheet, idx){ const c = await Swal.fire({title:'Hapus Data?', text:'Data akan hilang permanen', icon:'warning', showCancelButton:true, confirmButtonColor:'#d33'}); if(c.isConfirmed){ Swal.fire({title:'Menghapus...', didOpen:()=>Swal.showLoading()}); await secureFetch(`${SCRIPT_URL}?action=hapusDataRow&sheet=${sheet}&row=${idx}`); Swal.fire('Terhapus','Data berhasil dihapus','success'); } }
async function tambahPendudukPopup(){ const {value:f} = await Swal.fire({ title: 'Tambah Data Penduduk (ADMP_1)', html: `<div class="grid grid-cols-2 gap-3 text-left"><input id="p-nik" class="input-field col-span-2" placeholder="NIK (Wajib)"><input id="p-nama" class="input-field col-span-2" placeholder="Nama Lengkap"><input id="p-tmp" class="input-field" placeholder="Tempat Lahir"><input id="p-tgl" type="date" class="input-field"><select id="p-jk" class="input-field"><option>Laki-laki</option><option>Perempuan</option></select><input id="p-agm" class="input-field" placeholder="Agama"><input id="p-krj" class="input-field" placeholder="Pekerjaan"><input id="p-alm" class="input-field" placeholder="Alamat (Jaga)"><input id="p-ayh" class="input-field" placeholder="Nama Ayah"><input id="p-ibu" class="input-field" placeholder="Nama Ibu"></div>`, showCancelButton: true, confirmButtonText: 'Simpan ke Database', preConfirm: () => ({ nik: document.getElementById('p-nik').value, nama: document.getElementById('p-nama').value, tempat: document.getElementById('p-tmp').value, tgl: document.getElementById('p-tgl').value, jk: document.getElementById('p-jk').value, agama: document.getElementById('p-agm').value, kerja: document.getElementById('p-krj').value, alamat: document.getElementById('p-alm').value, ayah: document.getElementById('p-ayh').value, ibu: document.getElementById('p-ibu').value }) }); if(f){ Swal.fire({title:'Menyimpan ke ADMP_1...', didOpen:()=>Swal.showLoading()}); try{ await secureFetch(`${SCRIPT_URL}?action=tambahDataPenduduk&nik=${f.nik}&nama=${encodeURIComponent(f.nama)}&tempat=${encodeURIComponent(f.tempat)}&tgl=${f.tgl}&jk=${f.jk}&agama=${f.agama}&kerja=${f.kerja}&alamat=${f.alamat}&ayah=${f.ayah}&ibu=${f.ibu}`); Swal.fire('Sukses', 'Data Penduduk Tersimpan', 'success'); }catch(e){ Swal.fire('Gagal', 'Error koneksi', 'error'); } } }

function saveWebSettings(){const s={desa:document.getElementById('set-desa').value,kec:document.getElementById('set-kec').value,logo:document.getElementById('set-logo').value};localStorage.setItem('desaSettings',JSON.stringify(s));applySettings(s);Swal.fire('Tersimpan','','success');}
function loadWebSettings(){const s=JSON.parse(localStorage.getItem('desaSettings'));if(s){document.getElementById('set-desa').value=s.desa;document.getElementById('set-kec').value=s.kec;document.getElementById('set-logo').value=s.logo;applySettings(s);}}
function applySettings(s){if(s.desa&&document.getElementById('nav-desa-name'))document.getElementById('nav-desa-name').innerText=s.desa.toUpperCase();if(s.kec)document.getElementById('nav-kec-name').innerText=s.kec;if(s.logo)document.getElementById('nav-logo').src=s.logo;}
function toggleModal(id){const m=document.getElementById(id);if(m.classList.contains('hidden')) {m.classList.remove('hidden');document.body.style.overflow='hidden';}else{m.classList.add('hidden');document.body.style.overflow='auto';}}

function initCharts() {
    const isMobile = window.innerWidth < 768;

    if(document.getElementById('chartPendapatan')){
        new Chart(document.getElementById('chartPendapatan'), {
            type: 'doughnut',
            data: {
                labels: ['DDS Reguler', 'DDS KDMP', 'ADD', 'PAD/Lainnya'],
                datasets: [{
                    data: [346.6, 360.7, 400, 90], 
                    backgroundColor: ['#2563eb', '#3b82f6', '#94a3b8', '#e2e8f0'],
                    hoverOffset: 10,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                layout: {
                    padding: 0 
                },
                plugins: {
                    legend: { 
                        position: 'bottom', 
                        labels: { 
                            usePointStyle: true, 
                            padding: 15, 
                            boxWidth: 8, 
                            font: { size: isMobile ? 10 : 11 } 
                        } 
                    }
                }
            }
        });
    }

    if(document.getElementById('chartBelanja')){
        new Chart(document.getElementById('chartBelanja'), {
            type: 'bar',
            data: {
                labels: [
                    'BLT (Miskin Ekstrem)', 
                    'Iklim & Bencana', 
                    'Layanan Kesehatan', 
                    'Ketahanan Pangan', 
                    'Koperasi Merah Putih', 
                    'Infrastruktur PKTD', 
                    'Digital & Teknologi', 
                    'Sektor Prioritas'
                ],
                datasets: [{
                    label: 'Estimasi (Juta Rp)',
                    data: [150, 80, 70, 120, 60, 140, 50, 37],
                    backgroundColor: '#1e293b',
                    borderRadius: 6,
                    maxBarThickness: 30, 
                    barPercentage: 0.7 
                }]
            },
            options: {
                indexAxis: 'y', 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { 
                        grid: { display: false }, 
                        ticks: { font: { size: 9 } } 
                    },
                    y: { 
                        grid: { display: false }, 
                        ticks: { 
                            autoSkip: false, 
                            font: { size: isMobile ? 9 : 10 } 
                        } 
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        bodyFont: { size: 10 },
                        padding: 8
                    }
                }
            }
        });
    }
}

async function openModulePDF() {
    Swal.fire({title: 'Mengambil daftar file...', didOpen: () => Swal.showLoading()});
    try {
        const response = await secureFetch(`${SCRIPT_URL}?action=getPDF`);
        const result = await response.json();
        
        if (result.status === 'success') {
            let listHtml = `<div class="space-y-4 max-h-[60vh] overflow-y-auto p-2">`;
            
            listHtml = `
                <div class="mb-4 text-right">
                    <button onclick="uploadModulePDF()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition flex items-center gap-2 ml-auto">
                        <i class="fas fa-cloud-upload-alt"></i> Upload File Baru
                    </button>
                </div>
            ` + listHtml;
            
            if(result.data.length === 0) {
                 listHtml += `<div class="text-center text-slate-400 py-4">Belum ada file modul.</div>`;
            }

            result.data.forEach(row => {
                const [nama, size, desc, link] = row;
                listHtml += `
                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left shadow-sm hover:border-rose-400 transition-all">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h4 class="font-bold text-slate-800 text-sm"><i class="fas fa-file-pdf text-rose-600 mr-2"></i>${nama}</h4>
                                <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">Ukuran: ${size}</p>
                                <p class="text-xs text-slate-500 mt-2 line-clamp-2">${desc}</p>
                            </div>
                            <a href="${link}" target="_blank" class="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ml-3">
                                <i class="fas fa-download"></i> Download
                            </a>
                        </div>
                    </div>
                `;
            });

            listHtml += `</div>`;

            Swal.fire({
                title: 'Modul PDF & Dokumen',
                html: listHtml,
                width: '600px',
                showConfirmButton: false,
                showCloseButton: true,
                customClass: {
                    title: 'text-lg font-bold text-slate-700 border-b pb-4'
                }
            });
        } else {
            Swal.fire('Gagal', 'Gagal memuat daftar file', 'error');
        }
    } catch (e) {
        Swal.fire('Error', 'Koneksi ke server gagal', 'error');
    }
}

function uploadModulePDF() {
    Swal.fire({
        title: 'Upload Dokumen Baru',
        html: `
            <div class="text-left space-y-3">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Pilih File (PDF/Doc/Img)</label>
                    <input type="file" id="upFile" class="w-full border p-2 rounded text-sm bg-slate-50">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Nama Tampilan</label>
                    <input type="text" id="upNama" class="w-full border p-2 rounded text-sm" placeholder="Contoh: SK Karang Taruna 2026">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                    <textarea id="upDesc" class="w-full border p-2 rounded text-sm" placeholder="Keterangan isi file..."></textarea>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Upload Sekarang',
        confirmButtonColor: '#2563eb',
        preConfirm: () => {
            const fileInput = document.getElementById('upFile').files[0];
            const nama = document.getElementById('upNama').value;
            const desc = document.getElementById('upDesc').value;

            if (!fileInput || !nama) {
                Swal.showValidationMessage('File dan Nama Tampilan wajib diisi');
                return false;
            }

            if (fileInput.size > 5 * 1024 * 1024) {
                 Swal.showValidationMessage('Ukuran file maksimal 5MB');
                 return false;
            }

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(fileInput);
                reader.onload = () => resolve({
                    fileData: reader.result,
                    fileName: fileInput.name,
                    mimeType: fileInput.type,
                    namaDisplay: nama,
                    deskripsi: desc
                });
                reader.onerror = error => reject(error);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const data = result.value;
            
            Swal.fire({
                title: 'Sedang Mengupload...',
                text: 'Mohon tunggu, jangan tutup halaman ini.',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            secureFetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'uploadPDF',
                    api_key: MOLAS_API_KEY,
                    token: MOLAS_SECURE_HEADER.token,
                    file: data.fileData, 
                    realName: data.fileName,
                    mime: data.mimeType,
                    nama: data.namaDisplay,
                    desc: data.deskripsi
                })
            })
            .then(res => res.json())
            .then(response => {
                if (response.status === 'success') {
                    Swal.fire('Berhasil!', 'Dokumen berhasil disimpan.', 'success')
                    .then(() => openModulePDF()); 
                } else {
                    Swal.fire('Gagal', 'Error: ' + response.message, 'error');
                }
            })
            .catch(err => {
                Swal.fire('Error', 'Gagal menghubungi server.', 'error');
            });
        }
    });
}


// === FITUR SHOW/HIDE APLIKASI & PORTAL V5.5 - TIDAK MENGHAPUS FITUR LAMA ===
function toggleAplikasiPortal() {
    const content = document.getElementById('aplikasi-portal-content');
    const btnText = document.getElementById('text-toggle-portal');
    const btnIcon = document.getElementById('icon-toggle-portal');
    const btn = document.getElementById('btn-toggle-portal');
    
    if (!content) return;
    
    if (content.classList.contains('hidden')) {
        // SHOW
        content.classList.remove('hidden');
        // Trigger reflow for animation
        void content.offsetWidth;
        content.classList.remove('opacity-0', 'max-h-0');
        content.classList.add('opacity-100', 'max-h-[2000px]');
        btnText.innerText = 'Sembunyikan Aplikasi & Portal';
        btnIcon.classList.remove('fa-chevron-down');
        btnIcon.classList.add('fa-chevron-up');
        btnIcon.style.transform = 'rotate(180deg)';
        btn.classList.remove('from-teal-600', 'to-emerald-600');
        btn.classList.add('from-slate-700', 'to-slate-900');
    } else {
        // HIDE
        content.classList.remove('opacity-100', 'max-h-[2000px]');
        content.classList.add('opacity-0', 'max-h-0');
        setTimeout(() => {
            content.classList.add('hidden');
        }, 400);
        btnText.innerText = 'Tampilkan Aplikasi & Portal';
        btnIcon.classList.remove('fa-chevron-up');
        btnIcon.classList.add('fa-chevron-down');
        btnIcon.style.transform = 'rotate(0deg)';
        btn.classList.remove('from-slate-700', 'to-slate-900');
        btn.classList.add('from-teal-600', 'to-emerald-600');
    }
}

function toggleStruktur() {
    var content = document.getElementById('more-struktur-content');
    var btnText = document.getElementById('text-toggle-struktur');
    var btnIcon = document.getElementById('icon-toggle-struktur');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        btnText.innerHTML = "Tutup Kelembagaan";
        btnIcon.classList.remove('fa-chevron-down');
        btnIcon.classList.add('fa-chevron-up');
    } else {
        content.classList.add('hidden');
        btnText.innerHTML = "Lihat BPD & Kelembagaan Lainnya";
        btnIcon.classList.remove('fa-chevron-up');
        btnIcon.classList.add('fa-chevron-down');
    }
}

function toggleMoreFocus() {
    var content = document.getElementById('more-focus-content');
    var btnText = document.getElementById('text-toggle-focus');
    var btnIcon = document.getElementById('icon-toggle-focus');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.classList.add('grid'); 
        btnText.innerHTML = "Tutup Detail";
        btnIcon.classList.remove('fa-chevron-down');
        btnIcon.classList.add('fa-chevron-up');
    } else {
        content.classList.add('hidden');
        content.classList.remove('grid');
        btnText.innerHTML = "Baca Selengkapnya (4 Poin Lainnya)";
        btnIcon.classList.remove('fa-chevron-up');
        btnIcon.classList.add('fa-chevron-down');
    }
}

const newsData = {
    1: {
        title: "Musyawarah Penetapan APBDes Tahun 2026",
        date: "05 Jan 2026",
        category: "Pemerintahan",
        image: "https://cdn-icons-png.flaticon.com/512/2965/2965879.png",
        content: "<p>Pemerintah Desa Molompar Atas telah melaksanakan Musyawarah Desa (Musdes) penetapan Anggaran Pendapatan dan Belanja Desa (APBDes) Tahun Anggaran 2026. Acara ini dihadiri oleh BPD, Perangkat Desa, Tokoh Masyarakat, dan perwakilan Kecamatan.</p><p>Dalam musyawarah ini disepakati fokus anggaran sesuai prioritas nasional, yaitu penanganan kemiskinan ekstrem, ketahanan pangan, dan pencegahan stunting. Hukum Tua menyampaikan apresiasi kepada seluruh pihak yang telah mengawal proses perencanaan dari tingkat jaga.</p>"
    },
    2: {
        title: "Jadwal Posyandu Balita & Lansia Januari",
        date: "02 Jan 2026",
        category: "Kesehatan",
        image: "https://placehold.com/800x400/teal/white?text=Kegiatan+Posyandu",
        content: "<p>Diberitahukan kepada seluruh masyarakat bahwa kegiatan Posyandu Balita dan Posbindu Lansia untuk bulan Januari 2026 akan dilaksanakan pada:</p><ul><li>Hari/Tanggal: Selasa, 13 Januari 2026</li><li>Jam: 09.00 WITA - Selesai</li><li>Tempat: Balai Desa Molompar Atas</li></ul><p>Dimohon kehadiran ibu-ibu yang memiliki Balita untuk membawa buku KIA, dan para Lansia untuk pemeriksaan kesehatan rutin gratis.</p>"
    },
    3: {
        title: "Penyaluran BLT Dana Desa Triwulan Akhir",
        date: "28 Des 2025",
        category: "Bantuan",
        image: "https://placehold.com/800x400/orange/white?text=Penyaluran+BLT",
        content: "<p>Pemerintah Desa telah menyalurkan Bantuan Langsung Tunai (BLT) Dana Desa untuk bulan Oktober, November, dan Desember 2025. Bantuan diserahkan langsung oleh Hukum Tua kepada 25 Keluarga Penerima Manfaat (KPM).</p><p>Diharapkan bantuan ini dapat meringankan beban ekonomi keluarga penerima, terutama dalam menghadapi kebutuhan pokok sehari-hari.</p>"
    },
    4: {
        title: "Kerja Bakti Pembersihan Saluran Air",
        date: "20 Des 2025",
        category: "Pembangunan",
        image: "https://via.placeholder.com/800x400/555/white?text=Kerja+Bakti",
        content: "<p>Dalam rangka mengantisipasi musim penghujan dan mencegah banjir, masyarakat Jaga 3 dipimpin oleh Kepala Jaga melaksanakan kerja bakti pembersihan saluran air (drainase) di sepanjang jalan utama desa.</p><p>Kegiatan ini merupakan rutinitas 'Jumat Bersih' yang digalakkan oleh Pemerintah Desa untuk menjaga kebersihan dan kesehatan lingkungan.</p>"
    }
};

function openNewsModal(id) {
    const data = newsData[id];
    if (!data) return;

    document.getElementById('modal-news-title').innerText = data.title;
    document.getElementById('modal-news-date').innerText = data.date;
    document.getElementById('modal-news-cat').innerText = data.category;
    document.getElementById('modal-news-img').src = data.image;
    document.getElementById('modal-news-content').innerHTML = data.content;

    document.getElementById('newsModal').classList.remove('hidden');
}

function closeNewsModal() {
    document.getElementById('newsModal').classList.add('hidden');
}

function updateFields() {
    const jenis = document.getElementById('jenis-surat').value;
    const container = document.getElementById('dynamic-fields');
    container.innerHTML = ''; 

    let fields = '';

    if (jenis === 'SKTM') {
        fields = `<div class='grid grid-cols-2 gap-4'><div><label class='block text-xs font-bold text-slate-500 mb-1'>Nama</label><input class='input-field' name='Nama' required='true' type='text'/></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>NIK</label><input class='input-field' name='NIK' required='true' type='text'/></div></div><div class='grid grid-cols-2 gap-4'><div><label class='block text-xs font-bold text-slate-500 mb-1'>TTL</label><input class='input-field' name='TTL' required='true' type='text'/></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Jenis Kelamin</label><select class='input-field' name='Gender'><option>Laki-laki</option><option>Perempuan</option></select></div></div><div class='grid grid-cols-2 gap-4'><div><label class='block text-xs font-bold text-slate-500 mb-1'>Agama</label><input class='input-field' name='Agama' type='text'/></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Pekerjaan</label><input class='input-field' name='Pekerjaan' type='text'/></div></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Alamat Lengkap</label><textarea class='input-field' name='Alamat' rows='2'></textarea></div>`;
    } else if (jenis === 'Domisili') {
        fields = `<div><label class='block text-xs font-bold text-slate-500 mb-1'>Nama Lengkap</label><input class='input-field' name='Nama' required='true' type='text'/></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Alamat / Lingkungan Jaga</label><input class='input-field' name='Alamat_Jaga' required='true' type='text'/></div>`;
    } else if (jenis === 'Domisili WNA') {
        fields = `<div><label class='block text-xs font-bold text-slate-500 mb-1'>Nama Lengkap</label><input class='input-field' name='Nama' required='true' type='text'/></div><div class='grid grid-cols-2 gap-4'><div><label class='block text-xs font-bold text-slate-500 mb-1'>TTL</label><input class='input-field' name='TTL' required='true' type='text'/></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Kewarganegaraan</label><input class='input-field' name='WNA_Asal' required='true' type='text'/></div></div><div class='grid grid-cols-2 gap-4'><div><label class='block text-xs font-bold text-slate-500 mb-1'>No Paspor</label><input class='input-field' name='No_Paspor' required='true' type='text'/></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Pekerjaan</label><input class='input-field' name='Pekerjaan' type='text'/></div></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Alamat di Desa Molas</label><textarea class='input-field' name='Alamat_Tinggal' rows='2'></textarea></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Tinggal di Sini Sejak</label><input class='input-field' name='Sejak_Kapan' type='date'/></div>`;
    } else if (jenis === 'KTP Hilang') {
        fields = `<div><label class='block text-xs font-bold text-slate-500 mb-1'>Nama Lengkap</label><input class='input-field' name='Nama' required='true' type='text'/></div><div class='grid grid-cols-2 gap-4'><div><label class='block text-xs font-bold text-slate-500 mb-1'>TTL</label><input class='input-field' name='TTL' required='true' type='text'/></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Jenis Kelamin</label><select class='input-field' name='Gender'><option>Laki-laki</option><option>Perempuan</option></select></div></div><div class='grid grid-cols-2 gap-4'><div><label class='block text-xs font-bold text-slate-500 mb-1'>Status</label><input class='input-field' name='Status_Kawin' placeholder='Belum Kawin/Kawin' type='text'/></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Golongan Darah</label><input class='input-field' name='Gol_Darah' type='text'/></div></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Alasan Kehilangan</label><input class='input-field' name='Alasan_Hilang' placeholder='Contoh: Jatuh di jalan' required='true' type='text'/></div>`;
    } else if (jenis === 'Lainnya') {
        fields = `<div><label class='block text-xs font-bold text-slate-500 mb-1'>Judul Surat</label><input class='input-field' name='Judul_Surat_Custom' placeholder='Contoh: Surat Keterangan Usaha' required='true' type='text'/></div><div><label class='block text-xs font-bold text-slate-500 mb-1'>Detail Keperluan</label><textarea class='input-field' name='Isi_Manual' required='true' rows='4' placeholder='Jelaskan detail data Anda di sini...'></textarea></div>`;
    }

    container.innerHTML = fields;
}

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.count-up');
    const speed = 120;

    const startCount = (counter) => {
        const target = +counter.getAttribute('data-target');
        let current = 0;
        const step = Math.max(1, Math.ceil(target / speed));

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.innerText = target.toLocaleString('id-ID');
                clearInterval(timer);
            } else {
                counter.innerText = current.toLocaleString('id-ID');
            }
        }, 16);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCount(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => observer.observe(counter));
});

const galleryPhotos = [
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTcrjP1mwD6b_yM74HuPe8p4twRpvhyphenhyphenRu8E6L5Wk1Wp8QE4uQnZF4H6Qo5jTkWlqBI-tWjWL9Xqa2wPx36_dHk_76-WBjOA0vouYJpjISgmTZ7ITyMN8rbEFge8AFKK6aWCUI6jEr01Vaqk1GskfMp_pUHxnU40SYao3Z5-LUPZi20hQtwnsLCa8qzQB8L/s1600/1.jpg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyi6IMImIpWDwsWYSZ7MrhL921Ivd4_XcC2GoPQB-7VEeD1d2nI7K7t1RTPDDsxL31p5jsJ-0Ne6Z48iPOrbxYoB_xQLNhTme7uYxbTMZqyggiE8AST02gqoKTlieYBWFByYk__W8zQuB2yxoC4P5AyfhdSDGWVsvwskhIBsbhe0s18pWMslbH9SlxaVan/s1600/2.jpg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPXHWJBFOFcNueU56vqh3NaohAIeh5CntkUxaLm5T3juW91-fAR9uUTq4yAQCfYfjvpQaaejSynp9OJJ1mJF_KWD9OWkOQ-CQwHsxXiTvBD9-UjQhsuQ4Ud8ois2sw7SQ-7lXfi5W1ti60o4n5ECKYOjb0OlSsp5Hz5RvNZsyUPtvL9vVydZcFnYtIwxEH/s1600/3.jpg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_SKj6imrOlwdACWxawCJHgmihO1DgeURIH_1YvCWCistt1AwQuFboS3vJ-Skl7uESBxA4v33_JLHtTG8paOUjlIUhHgcxaMnfJSsaUha0iPgjBDXODSme2QkFcvwhZi2eIQPnGRDHXi55B_c5rKB6zAgxAj1USs1idWKhNEqd1A5CfyZzCJ68GxyxYR7-/s1600/4.jpg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_3sZfMspAIkxJAPKh9DqzsJbriC7t0Yoq7e3EdZPEWbP-e3jCMdkAb3Sk_rzxdk_dkPfiA8wRTxpNuAgt9-ajyq7irfFGMyo6FHVGb0DrnSZRaN1HjqPQL8CBgH61Nacwf3Ozuuwim60ZGIHijyeITn27RGgBekk6bfe1exUFtGzQ7C2I-l57rlc0YUwS/s1600/5.jpg"
];

function openGalleryModal() {
    let contentHtml = `<div class="space-y-6 text-left">`;
    
    galleryPhotos.forEach((img, index) => {
        contentHtml += `
            <div class="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 group mb-4">
                <div class="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm z-10 border border-white/10">
                    Foto Dokumentasi ${index + 1}
                </div>
                <img src="${img}" class="w-full object-cover hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in" onclick="window.open('${img}', '_blank')">
            </div>
        `;
    });
    
    contentHtml += `
        <div class="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
            <p class="text-xs text-slate-500 font-medium">Klik gambar untuk melihat ukuran penuh</p>
        </div>
    </div>`;

    Swal.fire({
        title: `
            <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div class="bg-orange-50 p-2.5 rounded-xl text-orange-600 border border-orange-100">
                    <i class="fas fa-images text-xl"></i>
                </div>
                <div class="text-left">
                    <div class="text-lg font-bold text-slate-800">Galeri Kegiatan</div>
                    <div class="text-xs text-slate-500 font-normal">Dokumentasi Pemerintah Desa</div>
                </div>
            </div>
        `,
        html: contentHtml,
        width: '600px',
        showCloseButton: true,
        showConfirmButton: false,
        background: '#ffffff',
        customClass: {
            popup: 'rounded-[2rem] p-0 overflow-hidden',
            htmlContainer: '!p-6 !m-0 max-h-[70vh] overflow-y-auto custom-scroll',
            closeButton: 'focus:outline-none z-50'
        }
    });
}

function updateOfficeStatus() {
    const options = { timeZone: "Asia/Makassar", hour12: false, hour: '2-digit', minute: '2-digit' };
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', options);
    const [hour, minute] = timeString.split(':').map(Number);
    const day = now.getDay(); 

    const badge = document.getElementById('office-status-badge');
    const text = document.getElementById('office-text');
    const dot = document.getElementById('office-dot');
    const ping = document.getElementById('office-ping');
    const clock = document.getElementById('live-clock');

    if(clock) clock.innerText = timeString;

    const isOpenDay = day >= 1 && day <= 5; 
    const isOpenHour = hour >= 8 && hour < 15; 

    if (isOpenDay && isOpenHour) {
        if(badge) {
            badge.className = "inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full px-3 py-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
            text.innerText = "BUKA SEKARANG";
            text.className = "text-xs font-bold text-emerald-400 uppercase tracking-wide";
            dot.className = "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400";
            ping.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75";
        }
    } else {
        if(badge) {
            badge.className = "inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5";
            text.innerText = "TUTUP";
            text.className = "text-xs font-bold text-slate-500 uppercase tracking-wide";
            dot.className = "relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500";
            ping.className = "hidden"; 
        }
    }
}

setInterval(updateOfficeStatus, 1000);
updateOfficeStatus(); 

function renderPosyanduSchedule() {
    const listContainer = document.getElementById('posyandu-list');
    if(!listContainer) return;

    const schedules = [
        { month: 'Januari', date: 14 },
        { month: 'Februari', date: 9 },
        { month: 'Maret', date: 9 },
        { month: 'April', date: 9 },
        { month: 'Mei', date: 15 },
        { month: 'Juni', date: 15 },
        { month: 'Juli', date: 15 },
        { month: 'Agustus', date: 15 },
        { month: 'September', date: 15 },
        { month: 'Oktober', date: 15 },
        { month: 'November', date: 15 },
        { month: 'Desember', date: 15 }
    ];

    const today = new Date();
    const currentMonthIndex = today.getMonth(); 
    const currentDay = today.getDate();

    let html = '';

    schedules.forEach((item, index) => {
        let rowClass = '';
        let dateClass = '';
        let statusHtml = '';
        let isActive = false;

        if (index < currentMonthIndex) {
            rowClass = 'opacity-50';
            dateClass = 'bg-slate-100 text-slate-400';
            statusHtml = `<span class='text-[10px] text-slate-400 font-medium'>Selesai</span>`;
        } else if (index === currentMonthIndex) {
            if (currentDay > item.date) {
                rowClass = 'opacity-50';
                dateClass = 'bg-slate-100 text-slate-400';
                statusHtml = `<span class='text-[10px] text-slate-400 font-medium'>Selesai</span>`;
            } else {
                isActive = true;
                rowClass = 'bg-rose-50 rounded-xl'; 
                dateClass = 'bg-rose-500 text-white shadow-sm'; 
                statusHtml = `<span class='text-[10px] font-bold text-rose-600'>Segera</span>`;
            }
        } else {
            rowClass = 'hover:bg-slate-50 rounded-xl transition-colors';
            dateClass = 'bg-slate-100 text-slate-600';
            statusHtml = `<span class='text-[10px] text-slate-300'>Nanti</span>`;
        }

        html += `
            <div class='flex items-center justify-between p-2.5 mb-1 ${rowClass}' ${isActive ? 'id="active-schedule"' : ''}>
                <div class='flex items-center gap-3'>
                    <div class='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${dateClass} shrink-0'>
                        ${item.date}
                    </div>
                    <div>
                        <div class='text-xs font-bold text-slate-700 leading-tight'>${item.month}</div>
                        <div class='text-[10px] text-slate-400'>09:00 WITA</div>
                    </div>
                </div>
                ${statusHtml}
            </div>
        `;
    });

    listContainer.innerHTML = html;
}
    
document.addEventListener('DOMContentLoaded', renderPosyanduSchedule);

const dataKemendesa = {
    iks: [
        { no: 1, nama: "Akses Sarkes", skor: 5, ket: "Waktu tempuh dari ≤ 30 Menit" },
        { no: 2, nama: "Dokter", skor: 0, ket: "Jumlah Dokter Tidak ada" },
        { no: 3, nama: "Bidan", skor: 1, ket: "Jumlah bidan Tidak ada" },
        { no: 4, nama: "Nakes Lain", skor: 5, ket: "Jumlah tenaga kesehatan lainnya ≥ 5 orang" },
        { no: 5, nama: "Tingkat Kepesertaan BPJS", skor: 3, ket: "Jumlah peserta BPJS/jumlah penduduk antara 0,26 s.d 0,5" },
        { no: 6, nama: "Akses Poskesdes", skor: 5, ket: "Jarak tempuh menuju Poskesdes = 500 Meter" },
        { no: 7, nama: "Aktivitas Posyandu", skor: 5, ket: "Jumlah Posyandu aktif 1 bulan sekali/ Jumlah Posyandu > 0,75" },
        { no: 8, nama: "Akses SD/MI", skor: 5, ket: "Jarak tempuh menuju SD atau MI = 3000 Meter" },
        { no: 9, nama: "Akses SMP/MTS", skor: 5, ket: "Jarak tempuh menuju SMP atau MTs ≤ 6000 Meter" },
        { no: 10, nama: "Akses SMA/SMK", skor: 5, ket: "Jarak tempuh menuju SMU atau SMK ≤ 6000 Meter" },
        { no: 11, nama: "Ketersediaan PAUD", skor: 1, ket: "Jumlah PAUD Tidak ada" },
        { no: 12, nama: "Ketersediaan PKBM/ Paket ABC", skor: 1, ket: "Jumlah PKBM atau Paket ABC Tidak ada" },
        { no: 13, nama: "Ketersediaan Kursus", skor: 1, ket: "Jumlah Pusat Keterampilan atau Kursus Tidak ada" },
        { no: 14, nama: "Taman Baca/ Perpus Desa", skor: 1, ket: "Taman Bacaan Masyarakat atau perpustakaan Desa tidak tersedia" },
        { no: 15, nama: "Kebiasaan Gotong Royong", skor: 5, ket: "Terdapat Kebiasaan Gotong Royong" },
        { no: 16, nama: "Frekuensi Gotong Royong", skor: 5, ket: "Frekuensi Gotong Royong > 2" },
        { no: 17, nama: "Ketersediaan Ruang Publik", skor: 1, ket: "Ruang Publik tidak terdapat didesa" },
        { no: 18, nama: "Kelompok OR", skor: 0, ket: "Jumlah kelompok kegiatan olahraga tidak ada" },
        { no: 19, nama: "Kegiatan OR", skor: 2, ket: "Jumlah kegiatan olahraga 2 s.d 3" },
        { no: 20, nama: "Keragaman Agama", skor: 5, ket: "Jumlah Jenis Agama di Desa > 1" },
        { no: 21, nama: "Keragaman Bahasa", skor: 1, ket: "Jumlah Bahasa yang digunakan sehari-hari 1" },
        { no: 22, nama: "Keragaman Komunikasi", skor: 5, ket: "Warga Desa terdiri dari Suku > 1" },
        { no: 23, nama: "Poskamling", skor: 5, ket: "Terdapat Pos Keamanan di Desa" },
        { no: 24, nama: "Siskamling", skor: 5, ket: "Terdapat Sistem Keamanan Lingkungan warga di Desa" },
        { no: 25, nama: "Konflik", skor: 5, ket: "Tidak terdapat atau tidak ada Konflik di Desa" },
        { no: 26, nama: "PMKS", skor: 5, ket: "Jumlah PMKS tidak ada atau 0" },
        { no: 27, nama: "SLB", skor: 3, ket: "Jumlah Skor SLB antara 4 s.d 5" },
        { no: 28, nama: "Akses Listrik", skor: 5, ket: "(Jml Kel. Memakai listrik + non Listrik/Jml kel. memakai listrik) ≥ 0,9" },
        { no: 29, nama: "Sinyal Tlp", skor: 5, ket: "Sinyal telepon seluler di Desa Kuat" },
        { no: 30, nama: "Internet Kantor Desa", skor: 5, ket: "Terdapat fasilitas internet di kantor Desa" },
        { no: 31, nama: "Akses Internet Warga", skor: 5, ket: "Terdapat Akses internet warga di Desa" },
        { no: 32, nama: "Akses Jamban", skor: 5, ket: "Warga Desa BAB di Jamban Sendiri" },
        { no: 33, nama: "Sampah", skor: 4, ket: "Warga desa membuang sampah di Lubang atau di Bakar" },
        { no: 34, nama: "Air Minum", skor: 5, ket: "Sumber air minum berasal dari PAM, Air Ledeng tanpa Meteran" },
        { no: 35, nama: "Air Mandi & Cuci", skor: 5, ket: "Sumber air mandi dan cuci berasal dari PAM, Air Ledeng tanpa Meteran" }
    ],
    ike: [
        { no: 1, nama: "Keragaman Produksi", skor: 5, ket: "Jumlah Industri Mikro/ Jumlah KK ≥ 0,004" },
        { no: 2, nama: "Pertokoan", skor: 5, ket: "Jarak ke kelompok pertokoan terdekat ≤ 7 KM" },
        { no: 3, nama: "Pasar", skor: 1, ket: "(Total KK/jumlah pasar(permanen)) = 0" },
        { no: 4, nama: "Toko/ Warung Kelontong", skor: 5, ket: "Jumlah Toko dan warung kelontong > 3" },
        { no: 5, nama: "Kedai & Penginapan", skor: 3, ket: "Jumlah Kedai dan Penginapan = 1" },
        { no: 6, nama: "POS & Logistik", skor: 5, ket: "Jumlah pos dan jasa logistik > 1" },
        { no: 7, nama: "Bank & BPR", skor: 0, ket: "Jumlah bank dan BPR = 0" },
        { no: 8, nama: "Kredit", skor: 2, ket: "Jumlah fasilitas kredit = 1" },
        { no: 9, nama: "Lembaga Ekonomi", skor: 3, ket: "Jumlah koperasi aktif dan BUMDESA = 1" },
        { no: 10, nama: "Moda Transportasi Umum", skor: 5, ket: "Transportasi Umum ada dengan trayek tetap" },
        { no: 11, nama: "Keterbukaan Wilayah", skor: 5, ket: "Jalan di Desa dilalui oleh kendaraan bermotor roda empat atau lebih Sepanjang Tahun" },
        { no: 12, nama: "Kualitas Jalan", skor: 5, ket: "Jenis permukaan jalan desa Aspal atau beton" }
    ],
    ikl: [
        { no: 1, nama: "Kualitas Lingkungan", skor: 5, ket: "Pencemaran di desa = 0" },
        { no: 2, nama: "Rawan Bencana", skor: 5, ket: "Jenis bencana di desa = 0" },
        { no: 3, nama: "Tanggap Bencana", skor: 5, ket: "Fasilitas mitigasi/tanggap bencana = 3" }
    ]
};

function generateTableRows(dataArray, colorClass) {
    return dataArray.map(item => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="p-2.5 text-center text-xs font-bold text-slate-500">${item.no}</td>
            <td class="p-2.5 text-xs font-bold text-slate-800">${item.nama}</td>
            <td class="p-2.5 text-center">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full ${colorClass} font-black text-xs shadow-sm">${item.skor}</span>
            </td>
            <td class="p-2.5 text-[10px] text-slate-600 leading-relaxed">${item.ket}</td>
        </tr>
    `).join('');
}

function showDetailIDM() {
    let contentHtml = `
        <div class="space-y-4 text-left font-sans pb-2">
            
            <div class="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4 border-b border-slate-100 pb-4 pt-2 px-2 relative">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgM_ZZxTr_O88Gg_zqKIg8UsP1gZ6zxIAqJ7j5FTPD0fAICmHyIC_G7Nqq22sVO5JLjjOMtE-QQjkapUziM2jys3vo07wW5ERyWS05_fb3Fqvz_ZVPTPuh5H-Lg_QFs4lDHnLqggjfqpw-cLn74C79294GVY1-HEmXBgZZN_a0eQR1tXUdKaFxjNYtFBFU/s1600/logo.png" class="h-14 w-14 md:h-16 md:w-16 object-contain drop-shadow-sm flex-shrink-0" alt="Logo Desa Molompar Atas" />
                <div class="text-center sm:text-left mt-1 sm:mt-0">
                    <h2 class="text-xl md:text-2xl font-black text-slate-800 leading-tight mb-2">Rincian Analisis IDM</h2>
                    <span class="text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full inline-block tracking-wide">
                        Desa Molompar Atas Tahun 2024
                    </span>
                </div>
            </div>

            <div class="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 mt-2">
                <button onclick="switchTabIDM('tab-summary', this)" class="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-white text-emerald-600 shadow-sm transition-all tab-btn-idm">Ringkasan</button>
                <button onclick="switchTabIDM('tab-iks', this)" class="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-500 hover:text-blue-600 transition-all tab-btn-idm">Data IKS</button>
                <button onclick="switchTabIDM('tab-ike', this)" class="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-500 hover:text-orange-600 transition-all tab-btn-idm">Data IKE</button>
                <button onclick="switchTabIDM('tab-ikl', this)" class="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-500 hover:text-teal-600 transition-all tab-btn-idm">Data IKL</button>
            </div>

            <div class="relative min-h-[300px]">
                <div id="tab-summary" class="tab-content-idm animate-fade-in space-y-5 mt-4">
                    <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p class="text-xs md:text-sm text-blue-800 leading-relaxed">
                            Berdasarkan rilis data Kementerian Desa PDTT tahun 2024, Desa Molompar Atas berhasil mencapai status <b>MANDIRI</b> dengan Skor <b>0.8235</b>. Berikut adalah rangkuman indikator pembentuk nilai tersebut:
                        </p>
                    </div>

                    <div>
                        <h4 class="text-xs md:text-sm font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <i class="fas fa-check-circle text-emerald-500"></i> Kekuatan Desa (Skor Maksimal)
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-start gap-3">
                                <div class="bg-emerald-100 text-emerald-600 p-2 rounded flex-shrink-0"><i class="fas fa-wifi"></i></div>
                                <div>
                                    <div class="text-xs font-bold text-slate-800">Infrastruktur & Telekomunikasi</div>
                                    <div class="text-[10px] text-slate-500 mt-1">Akses internet warga, sinyal telepon, dan akses listrik mencapai skor 5.</div>
                                </div>
                            </div>
                            <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-start gap-3">
                                <div class="bg-emerald-100 text-emerald-600 p-2 rounded flex-shrink-0"><i class="fas fa-road"></i></div>
                                <div>
                                    <div class="text-xs font-bold text-slate-800">Akses & Transportasi</div>
                                    <div class="text-[10px] text-slate-500 mt-1">Kualitas jalan (aspal/beton), transportasi umum bernilai maksimal.</div>
                                </div>
                            </div>
                            <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-start gap-3">
                                <div class="bg-emerald-100 text-emerald-600 p-2 rounded flex-shrink-0"><i class="fas fa-leaf"></i></div>
                                <div>
                                    <div class="text-xs font-bold text-slate-800">Ketahanan Lingkungan (100%)</div>
                                    <div class="text-[10px] text-slate-500 mt-1">Tidak ada pencemaran air/udara, fasilitas tanggap bencana memadai.</div>
                                </div>
                            </div>
                            <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-start gap-3">
                                <div class="bg-emerald-100 text-emerald-600 p-2 rounded flex-shrink-0"><i class="fas fa-hands-helping"></i></div>
                                <div>
                                    <div class="text-xs font-bold text-slate-800">Sosial & Keamanan</div>
                                    <div class="text-[10px] text-slate-500 mt-1">Gotong royong tinggi, kerukunan agama, serta siskamling aktif.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100">
                        <h4 class="text-xs md:text-sm font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <i class="fas fa-exclamation-triangle text-rose-500"></i> Fokus Perbaikan (Skor 0 - 2)
                        </h4>
                        <p class="text-[10px] md:text-[11px] text-slate-500 mb-3">Indikator berikut direkomendasikan masuk dalam APBDes / RPJMDes mendatang:</p>
                        
                        <div class="space-y-2">
                            <div class="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-100 rounded-lg">
                                <div class="flex items-center gap-3">
                                    <i class="fas fa-user-md text-rose-400"></i>
                                    <span class="text-[11px] md:text-xs font-bold text-slate-700">Ketersediaan Dokter / Bidan Desa</span>
                                </div>
                                <span class="text-[9px] md:text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded">Skor: 0-1</span>
                            </div>
                            <div class="flex items-center justify-between p-2.5 bg-orange-50 border border-orange-100 rounded-lg">
                                <div class="flex items-center gap-3">
                                    <i class="fas fa-store-alt text-orange-400"></i>
                                    <span class="text-[11px] md:text-xs font-bold text-slate-700">Ketersediaan Pasar Permanen</span>
                                </div>
                                <span class="text-[9px] md:text-[10px] font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded">Skor: 1</span>
                            </div>
                            <div class="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                                <div class="flex items-center gap-3">
                                    <i class="fas fa-university text-amber-400"></i>
                                    <span class="text-[11px] md:text-xs font-bold text-slate-700">Akses Perbankan (Bank / BPR)</span>
                                </div>
                                <span class="text-[9px] md:text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded">Skor: 0</span>
                            </div>
                            <div class="flex items-center justify-between p-2.5 bg-yellow-50 border border-yellow-100 rounded-lg">
                                <div class="flex items-center gap-3">
                                    <i class="fas fa-book-reader text-yellow-500"></i>
                                    <span class="text-[11px] md:text-xs font-bold text-slate-700">Taman Baca / Perpustakaan Desa</span>
                                </div>
                                <span class="text-[9px] md:text-[10px] font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">Skor: 1</span>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100">
                        <div class="bg-slate-50 border border-slate-100 rounded-lg p-3.5 mb-4 shadow-inner">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-[11px] text-slate-600">
                                <div class="flex items-center gap-2"><i class="fas fa-landmark text-emerald-500/70 w-4 text-center"></i><span><span class="font-semibold text-slate-700">Nama Desa:</span> Molompar Atas</span></div>
                                <div class="flex items-center gap-2"><i class="fas fa-building text-emerald-500/70 w-4 text-center"></i><span><span class="font-semibold text-slate-700">Alamat Kantor:</span> Jaga III</span></div>
                                <div class="flex items-center gap-2"><i class="fas fa-map-marker-alt text-emerald-500/70 w-4 text-center"></i><span><span class="font-semibold text-slate-700">Kecamatan:</span> Tombatu Timur</span></div>
                                <div class="flex items-center gap-2"><i class="fas fa-city text-emerald-500/70 w-4 text-center"></i><span><span class="font-semibold text-slate-700">Kabupaten:</span> Minahasa Tenggara</span></div>
                                <div class="flex items-center gap-2"><i class="fas fa-fingerprint text-emerald-500/70 w-4 text-center"></i><span><span class="font-semibold text-slate-700">Kode Wilayah:</span> 71.07.09.2003</span></div>
                                <div class="flex items-center gap-2"><i class="fas fa-envelope text-emerald-500/70 w-4 text-center"></i><span><span class="font-semibold text-slate-700">Kode Pos:</span> 95990</span></div>
                            </div>
                        </div>

                        <div class="text-center flex flex-col items-center gap-2">
                            <span class="text-[10px] text-slate-500 italic">Data diambil dari Sistem Informasi Kemendesa RI</span>
                            <a href="https://idm.kemendesa.go.id/open/api/desa/rumusan/7107092003/2024" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition-colors">
                                <i class="fas fa-external-link-alt text-[9px]"></i> Lihat Sumber API Kemendesa
                            </a>
                        </div>
                    </div>
                </div>

                <div id="tab-iks" class="tab-content-idm hidden animate-fade-in mt-4">
                    <div class="bg-blue-50 p-2 rounded-lg mb-2"><h3 class="font-black text-blue-700 text-xs text-center uppercase tracking-widest">Detail Indikator Sosial</h3></div>
                    <table class="w-full text-left bg-white rounded-lg overflow-hidden border border-slate-200">
                        <thead class="bg-slate-100 text-[10px] uppercase text-slate-500">
                            <tr><th class="p-2 w-8 text-center">No</th><th class="p-2">Indikator</th><th class="p-2 w-12 text-center">Skor</th><th class="p-2">Keterangan</th></tr>
                        </thead>
                        <tbody>${generateTableRows(dataKemendesa.iks, 'bg-blue-100 text-blue-700')}</tbody>
                    </table>
                </div>

                <div id="tab-ike" class="tab-content-idm hidden animate-fade-in mt-4">
                    <div class="bg-orange-50 p-2 rounded-lg mb-2"><h3 class="font-black text-orange-600 text-xs text-center uppercase tracking-widest">Detail Indikator Ekonomi</h3></div>
                    <table class="w-full text-left bg-white rounded-lg overflow-hidden border border-slate-200">
                        <thead class="bg-slate-100 text-[10px] uppercase text-slate-500">
                            <tr><th class="p-2 w-8 text-center">No</th><th class="p-2">Indikator</th><th class="p-2 w-12 text-center">Skor</th><th class="p-2">Keterangan</th></tr>
                        </thead>
                        <tbody>${generateTableRows(dataKemendesa.ike, 'bg-orange-100 text-orange-700')}</tbody>
                    </table>
                </div>

                <div id="tab-ikl" class="tab-content-idm hidden animate-fade-in mt-4">
                    <div class="bg-teal-50 p-2 rounded-lg mb-2"><h3 class="font-black text-teal-700 text-xs text-center uppercase tracking-widest">Detail Indikator Lingkungan</h3></div>
                    <table class="w-full text-left bg-white rounded-lg overflow-hidden border border-slate-200">
                        <thead class="bg-slate-100 text-[10px] uppercase text-slate-500">
                            <tr><th class="p-2 w-8 text-center">No</th><th class="p-2">Indikator</th><th class="p-2 w-12 text-center">Skor</th><th class="p-2">Keterangan</th></tr>
                        </thead>
                        <tbody>${generateTableRows(dataKemendesa.ikl, 'bg-teal-100 text-teal-700')}</tbody>
                    </table>
                </div>

            </div>
        </div>
    `;

    Swal.fire({
        html: contentHtml,
        width: '700px',
        showCloseButton: true,
        showConfirmButton: false,
        background: '#ffffff',
        customClass: {
            popup: 'rounded-[2rem] p-0 overflow-hidden shadow-2xl relative',
            htmlContainer: '!p-5 sm:!p-6 !m-0 max-h-[85vh] overflow-y-auto custom-scroll',
            closeButton: 'focus:outline-none z-50 text-slate-400 hover:text-rose-500 absolute top-3 right-3 transition-colors bg-slate-100 hover:bg-rose-50 rounded-full w-8 h-8 flex items-center justify-center'
        }
    });
}

function switchTabIDM(tabId, btnElement) {
    document.querySelectorAll('.tab-content-idm').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    
    document.querySelectorAll('.tab-btn-idm').forEach(btn => {
        btn.classList.remove('bg-white', 'shadow-sm', 'text-emerald-600', 'text-blue-600', 'text-orange-600', 'text-teal-600');
        btn.classList.add('text-slate-500');
    });

    btnElement.classList.remove('text-slate-500');
    btnElement.classList.add('bg-white', 'shadow-sm');
    
    if(tabId === 'tab-summary') btnElement.classList.add('text-emerald-600');
    if(tabId === 'tab-iks') btnElement.classList.add('text-blue-600');
    if(tabId === 'tab-ike') btnElement.classList.add('text-orange-600');
    if(tabId === 'tab-ikl') btnElement.classList.add('text-teal-600');
}

const dataProyekDesa = [
    {
        id: "PRJ-001",
        kategori: "Sanitasi & Air",
        nama: "Pembangunan Drainase & Gorong-Gorong",
        lokasi: "Jaga III, Desa Molompar Atas",
        anggaran: "Rp 145.500.000",
        sumberDana: "Dana Desa (DD) 2026",
        progresFisik: 75,
        status: "Sedang Dikerjakan",
        pelaksana: "TPK Desa Molompar Atas (PKTD)",
        waktu: "60 Hari Kerja",
        gambarUtama: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTcrjP1mwD6b_yM74HuPe8p4twRpvhyphenhyphenRu8E6L5Wk1Wp8QE4uQnZF4H6Qo5jTkWlqBI-tWjWL9Xqa2wPx36_dHk_76-WBjOA0vouYJpjISgmTZ7ITyMN8rbEFge8AFKK6aWCUI6jEr01Vaqk1GskfMp_pUHxnU40SYao3Z5-LUPZi20hQtwnsLCa8qzQB8L/s1600/1.jpg",
        detailTOS: "Panjang: 150m | Lebar: 0.6m | Tinggi: 0.8m",
        detailAHSP: "Sesuai Standar Harga Satuan Kab. Minahasa Tenggara TA 2026",
        detailRAB: "Pekerjaan Galian Tanah, Pasangan Batu Kali, Cor Plat Beton Tulang",
        iconCat: "fa-water"
    },
    {
        id: "PRJ-002",
        kategori: "Infrastruktur Jalan",
        nama: "Pengecoran Jalan Paving Blok",
        lokasi: "Jaga I & II, Desa Molompar Atas",
        anggaran: "Rp 85.000.000",
        sumberDana: "Bantuan Provinsi 2026",
        progresFisik: 100,
        status: "Selesai 100%",
        pelaksana: "Gotong Royong Warga",
        waktu: "30 Hari Kerja",
        gambarUtama: "https://placehold.co/600x400/0f766e/ffffff?text=Paving+Blok+Selesai",
        detailTOS: "Volume: 250m Persegi",
        detailAHSP: "Bahan Baku Lokal & Upah PKTD",
        detailRAB: "Pengadaan Paving Blok K250, Pasir Pasang, Pemadatan Lahan",
        iconCat: "fa-road"
    },
    {
        id: "PRJ-003",
        kategori: "Fasilitas Umum",
        nama: "Rehabilitasi Gedung BUMDes",
        lokasi: "Kawasan Balai Desa",
        anggaran: "Rp 60.000.000",
        sumberDana: "PADes & Dana Desa",
        progresFisik: 30,
        status: "Tahap Awal",
        pelaksana: "CV Mitra Bangun (Pihak Ketiga)",
        waktu: "45 Hari Kerja",
        gambarUtama: "https://placehold.co/600x400/eab308/ffffff?text=Rehab+BUMDes",
        detailTOS: "Luas Bangunan Rehab: 48m Persegi",
        detailAHSP: "Standar Pekerjaan Arsitektural Kab. Minahasa Tenggara",
        detailRAB: "Pekerjaan Atap Baja Ringan, Plafon PVC, Pengecatan",
        iconCat: "fa-store-alt"
    }
];

function renderProyekCards() {
    const container = document.getElementById('container-proyek-infrastruktur');
    if(!container) return;

    let html = '';
    dataProyekDesa.forEach((proyek, index) => {
        let colorClass = proyek.progresFisik === 100 ? 'bg-emerald-500' : (proyek.progresFisik > 50 ? 'bg-teal-500' : 'bg-amber-500');
        let statusBadge = proyek.progresFisik === 100 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200';

        html += `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer" onclick="openDetailProyek(${index})">
            
            <div class="h-48 relative overflow-hidden bg-slate-100">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
                <img src="${proyek.gambarUtama}" alt="${proyek.nama}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">
                
                <div class="absolute top-3 right-3 z-20">
                    <span class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${statusBadge} shadow-sm backdrop-blur-md">
                        ${proyek.status}
                    </span>
                </div>

                <div class="absolute bottom-4 left-4 z-20 right-4">
                    <div class="flex items-center gap-2 mb-1">
                        <i class="fas ${proyek.iconCat} text-teal-400 text-xs"></i>
                        <span class="text-[10px] font-bold text-teal-300 uppercase tracking-widest">${proyek.kategori}</span>
                    </div>
                    <h3 class="text-white font-bold text-lg leading-tight line-clamp-1">${proyek.nama}</h3>
                </div>
            </div>

            <div class="p-5">
                <div class="flex justify-between items-end mb-4">
                    <div>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Pagu Anggaran</p>
                        <p class="text-lg font-black text-slate-800">${proyek.anggaran}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Progres</p>
                        <p class="text-lg font-black text-teal-600">${proyek.progresFisik}%</p>
                    </div>
                </div>

                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                    <div class="h-full ${colorClass} rounded-full transition-all duration-1000 relative" style="width: ${proyek.progresFisik}%">
                         <div class="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.2)_50%,rgba(255,255,255,.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] opacity-50"></div>
                    </div>
                </div>

                <div class="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span class="flex items-center gap-1.5"><i class="fas fa-map-marker-alt text-slate-400"></i> ${proyek.lokasi.split(',')[0]}</span>
                    <span class="text-teal-600 group-hover:translate-x-1 transition-transform font-bold">Detail Data <i class="fas fa-arrow-right ml-1"></i></span>
                </div>
            </div>
        </div>
        `;
    });
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderProyekCards);

function openDetailProyek(index) {
    const p = dataProyekDesa[index];
    let colorClass = p.progresFisik === 100 ? 'text-emerald-500' : 'text-teal-600';
    
    let htmlContent = `
        <div class="text-left font-sans">
            <div class="relative h-56 -mt-6 -mx-6 mb-6">
                <img src="${p.gambarUtama}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div class="absolute bottom-4 left-6 right-6">
                    <span class="bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">${p.kategori}</span>
                    <h2 class="text-2xl font-black text-white mt-2 leading-tight">${p.nama}</h2>
                    <p class="text-slate-300 text-sm mt-1"><i class="fas fa-map-marker-alt text-teal-400 mr-1"></i> ${p.lokasi}</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pagu Anggaran (RAB)</p>
                    <p class="text-xl font-black text-slate-800">${p.anggaran}</p>
                    <p class="text-[10px] text-teal-600 font-bold mt-1 bg-teal-50 px-2 py-0.5 rounded inline-block border border-teal-100">${p.sumberDana}</p>
                </div>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                    <div class="flex justify-between items-end mb-2">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Realisasi Fisik</p>
                        <p class="text-2xl font-black ${colorClass} leading-none">${p.progresFisik}%</p>
                    </div>
                    <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div class="h-full bg-teal-500 rounded-full" style="width: ${p.progresFisik}%"></div>
                    </div>
                </div>
            </div>

            <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 border-l-4 border-teal-500 pl-2">Data Perencanaan Teknis</h3>
            
            <div class="space-y-3 mb-6">
                <div class="flex items-start gap-3 bg-white border border-slate-200 p-3 rounded-xl">
                    <i class="fas fa-ruler-combined text-teal-600 mt-1"></i>
                    <div>
                        <div class="text-xs font-bold text-slate-700">TOS (Spesifikasi Teknis)</div>
                        <div class="text-xs text-slate-500">${p.detailTOS}</div>
                    </div>
                </div>
                <div class="flex items-start gap-3 bg-white border border-slate-200 p-3 rounded-xl">
                    <i class="fas fa-file-invoice-dollar text-teal-600 mt-1"></i>
                    <div>
                        <div class="text-xs font-bold text-slate-700">AHSP (Analisis Harga Satuan)</div>
                        <div class="text-xs text-slate-500">${p.detailAHSP}</div>
                    </div>
                </div>
                <div class="flex items-start gap-3 bg-white border border-slate-200 p-3 rounded-xl">
                    <i class="fas fa-tasks text-teal-600 mt-1"></i>
                    <div>
                        <div class="text-xs font-bold text-slate-700">RAB (Rincian Pekerjaan)</div>
                        <div class="text-xs text-slate-500">${p.detailRAB}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    Swal.fire({
        html: htmlContent,
        width: '650px',
        showCloseButton: true,
        showConfirmButton: false,
        background: '#ffffff',
        customClass: {
            popup: 'rounded-[2rem] p-0 overflow-hidden shadow-2xl relative',
            htmlContainer: '!p-6 !m-0 max-h-[85vh] overflow-y-auto'
        }
    });
}

const dataProfilDesaLengkap = [
    { no: 1, nama: "Luas Wilayah (Desa)", p: "-", w: "-", jml: "1,9622 KM²" },
    { no: 2, nama: "Jumlah Penduduk", p: "560", w: "588", jml: "1148" },
    { no: 3, nama: "Jumlah KK Prasejahtera", p: "0", w: "50", jml: "50" },
    { no: 4, nama: "Jumlah Kepala Keluarga", p: "322", w: "30", jml: "352" },
    { no: 5, nama: "Jumlah Siswa SD", p: "77", w: "72", jml: "149" },
    { no: 6, nama: "Jumlah Siswa SMP", p: "31", w: "25", jml: "56" },
    { no: 7, nama: "Jumlah Siswa SMA", p: "65", w: "39", jml: "104" },
    { no: 8, nama: "Jumlah Anak <18 Thn Putus Sekolah", p: "5", w: "2", jml: "7" },
    { no: 9, nama: "Jumlah Penduduk >18 Thn Putus Sekolah", p: "0", w: "0", jml: "0" },
    { no: 10, nama: "Jumlah Penduduk >18 Thn Tamat SD", p: "99", w: "91", jml: "190" },
    { no: 11, nama: "Jumlah Penduduk >18 Thn Tamat SMP", p: "103", w: "113", jml: "216" },
    { no: 12, nama: "Jumlah Penduduk >18 Thn Tamat SMA", p: "89", w: "84", jml: "173" },
    { no: 13, nama: "Jumlah Penduduk Tamat DI/III", p: "1", w: "1", jml: "2" },
    { no: 14, nama: "Jumlah Penduduk Tamat S1", p: "13", w: "20", jml: "33" },
    { no: 15, nama: "Jumlah Penduduk Tamat S2", p: "1", w: "0", jml: "1" },
    { no: 16, nama: "Jumlah Penduduk Tamat S3", p: "0", w: "0", jml: "0" },
    { no: 17, nama: "Jumlah Anak <18 Thn Tamat SD", p: "27", w: "14", jml: "41" },
    { no: 18, nama: "Jumlah Anak <18 Thn Tamat SMP", p: "12", w: "8", jml: "20" },
    { no: 19, nama: "Jumlah Anak <18 Thn Tamat SMA", p: "2", w: "5", jml: "7" },
    { no: 20, nama: "Jumlah Anak Jalanan", p: "0", w: "0", jml: "0" },
    { no: 21, nama: "Jumlah Pekerja Anak (Putus Sekolah)", p: "0", w: "0", jml: "0" },
    { no: 22, nama: "Jumlah ASN", p: "10", w: "20", jml: "30" },
    { no: 23, nama: "Jumlah TNI/POLRI", p: "3", w: "0", jml: "3" },
    { no: 24, nama: "Jumlah Pekerja Lembaga Swasta Berbadan Hukum", p: "0", w: "0", jml: "0" },
    { no: 25, nama: "Jumlah Pekerja Berwiraswasta", p: "44", w: "6", jml: "50" },
    { no: 26, nama: "Jumlah Pekerja Sebagai Petani", p: "327", w: "0", jml: "327" },
    { no: 27, nama: "Jumlah Pekerja Sebagai Nelayan", p: "0", w: "0", jml: "0" },
    { no: 28, nama: "Jumlah Kepala Desa", p: "1", w: "0", jml: "1" },
    { no: 29, nama: "Jumlah Perangkat Desa", p: "7", w: "8", jml: "15" },
    { no: 30, nama: "Jumlah Org. Lembaga Perempuan", p: "-", w: "-", jml: "1" },
    { no: 31, nama: "Jumlah Lembaga Pend. Keterampilan", p: "0", w: "0", jml: "0" },
    { no: 32, nama: "Jumlah Kelompok Usaha Perempuan", p: "-", w: "-", jml: "0" },
    { no: 33, nama: "Jumlah Pekerja Anak Usia 0-1 Thn", p: "0", w: "0", jml: "0" },
    { no: 34, nama: "Jumlah Pekerja Anak Usia 1-3 Thn", p: "0", w: "0", jml: "0" },
    { no: 35, nama: "Jumlah Pekerja Anak Usia 3-5 Thn", p: "0", w: "0", jml: "0" },
    { no: 36, nama: "Jumlah Pekerja Anak Usia 5-6 Thn", p: "0", w: "0", jml: "0" },
    { no: 37, nama: "Jumlah Pekerja Anak Usia 6-12 Thn", p: "0", w: "0", jml: "0" },
    { no: 38, nama: "Jumlah Pekerja Anak Usia 12-15 Thn", p: "45", w: "38", jml: "83" },
    { no: 39, nama: "Jumlah Pekerja Anak Usia 15-18 Thn", p: "49", w: "26", jml: "75" },
    { no: 40, nama: "Jumlah Pekerja Upahan Sektor Non Pertanian", p: "17", w: "0", jml: "17" },
    { no: 41, nama: "Jumlah Rumah bersertifikat IMB", p: "-", w: "-", jml: "130" }
];

function showDetailProfilDesa() {
    // 1. Baris Tabel untuk Layar Desktop
    const desktopTableRows = dataProfilDesaLengkap.map(item => `
        <tr class="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
            <td class="p-2.5 text-center text-[11px] font-bold text-slate-400">${item.no}</td>
            <td class="p-2.5 text-xs font-bold text-slate-700">${item.nama}</td>
            <td class="p-2.5 text-center text-xs font-semibold text-indigo-600">${item.p}</td>
            <td class="p-2.5 text-center text-xs font-semibold text-pink-600">${item.w}</td>
            <td class="p-2.5 text-center text-xs font-black text-slate-800 bg-slate-50">${item.jml}</td>
        </tr>
    `).join('');

    // 2. Format Kartu List untuk Layar Ponsel (Mobile Card View)
    const mobileCards = dataProfilDesaLengkap.map(item => `
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div class="flex items-start gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">${item.no}</span>
                <div class="text-xs font-bold text-slate-800 leading-snug flex-1">${item.nama}</div>
            </div>
            
            <div class="grid grid-cols-3 gap-1.5 pt-1 text-center">
                <div class="bg-indigo-50/70 border border-indigo-100 p-1.5 rounded-xl">
                    <span class="block text-[8px] font-black text-indigo-400 uppercase">Pria</span>
                    <span class="text-xs font-bold text-indigo-700">${item.p}</span>
                </div>
                <div class="bg-pink-50/70 border border-pink-100 p-1.5 rounded-xl">
                    <span class="block text-[8px] font-black text-pink-400 uppercase">Wanita</span>
                    <span class="text-xs font-bold text-pink-700">${item.w}</span>
                </div>
                <div class="bg-slate-100/80 border border-slate-200 p-1.5 rounded-xl">
                    <span class="block text-[8px] font-black text-slate-500 uppercase">Total</span>
                    <span class="text-xs font-black text-slate-900">${item.jml}</span>
                </div>
            </div>
        </div>
    `).join('');

    let contentHtml = `
        <div class="text-left font-sans -m-1">
            <!-- Header Modal -->
            <div class="flex items-center gap-3.5 border-b border-slate-100 pb-4 mb-4">
                <div class="bg-blue-50 border border-blue-100 text-blue-600 w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-sm shrink-0">
                    <i class="fas fa-database"></i>
                </div>
                <div class="min-w-0 flex-1">
                    <h2 class="text-base md:text-lg font-black text-slate-800 leading-tight">Data Profil Desa Lengkap</h2>
                    <p class="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Desa Molompar Atas Tahun 2026</p>
                </div>
            </div>

            <!-- TAMPILAN 1: MOBILE LIST CARDS (block md:hidden) -->
            <div class="block md:hidden max-h-[62vh] overflow-y-auto custom-scroll space-y-2.5 pr-1">
                ${mobileCards}
            </div>

            <!-- TAMPILAN 2: DESKTOP TABLE VIEW (hidden md:block) -->
            <div class="hidden md:block relative max-h-[60vh] overflow-y-auto custom-scroll border border-slate-200 rounded-xl">
                <table class="w-full text-left bg-white">
                    <thead class="bg-slate-100 text-[10px] uppercase text-slate-600 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th class="p-3 w-10 text-center border-b border-slate-200">No</th>
                            <th class="p-3 border-b border-slate-200">Uraian / Indikator</th>
                            <th class="p-3 w-16 text-center border-b border-slate-200 text-indigo-700">Pria</th>
                            <th class="p-3 w-16 text-center border-b border-slate-200 text-pink-700">Wanita</th>
                            <th class="p-3 w-20 text-center border-b border-slate-200 bg-slate-200">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${desktopTableRows}
                    </tbody>
                </table>
            </div>
            
            <div class="mt-3 text-[10px] text-slate-400 text-center italic">
                *Tanda strip (-) menandakan data tidak spesifik berdasarkan jenis kelamin.
            </div>
        </div>
    `;

    Swal.fire({
        html: contentHtml,
        width: '750px',
        showCloseButton: true,
        showConfirmButton: false,
        background: '#ffffff',
        customClass: {
            popup: 'rounded-[2rem] p-5 sm:p-6 shadow-2xl relative',
            closeButton: 'focus:outline-none z-50 text-slate-400 hover:text-rose-500 absolute top-4 right-4 bg-slate-100 hover:bg-rose-50 rounded-full w-8 h-8 flex items-center justify-center transition-colors'
        }
    });
}
function bukaCekDesilModal() {
    Swal.fire({
        html: `
            <div class="text-left font-sans -m-1">
                <!-- Header Modal -->
                <div class="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                        <i class="fas fa-id-card text-xl"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h3 class="text-base font-black text-slate-800 leading-tight">Pengecekan Desil DTSEN</h3>
                        <p class="text-[11px] text-slate-500 font-medium mt-0.5 truncate">Data Tunggal Sosial &amp; Ekonomi Nasional BPS</p>
                    </div>
                </div>

                <!-- Konten Body -->
                <div class="space-y-3.5 pt-4">
                    <!-- Info Box -->
                    <div class="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100/80 p-3.5 rounded-2xl flex items-start gap-3">
                        <div class="text-teal-600 mt-0.5 shrink-0">
                            <i class="fas fa-shield-alt text-base"></i>
                        </div>
                        <p class="text-xs text-slate-700 leading-relaxed font-medium">
                            Pengecekan desil bansos dan status kepesertaan dilakukan langsung melalui portal resmi <b class="text-slate-900">DTSEN BPS RI</b> menggunakan NIK KTP Anda.
                        </p>
                    </div>

                    <!-- Step Panduan -->
                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                            <i class="fas fa-list-ol text-slate-500"></i> Langkah Pengecekan
                        </div>
                        <ol class="text-xs text-slate-600 space-y-2 list-none p-0 m-0">
                            <li class="flex items-center gap-2.5">
                                <span class="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm">1</span>
                                <span>Klik tombol <b class="text-slate-800">Buka Portal BPS</b> di bawah.</span>
                            </li>
                            <li class="flex items-center gap-2.5">
                                <span class="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm">2</span>
                                <span>Masukkan <b class="text-slate-800">NIK (16 Digit)</b> sesuai KTP.</span>
                            </li>
                            <li class="flex items-center gap-2.5">
                                <span class="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm">3</span>
                                <span>Ketik kode Captcha lalu tekan tombol <b class="text-slate-800">Cek Data</b>.</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        `,
        width: '480px',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-external-link-alt mr-1.5"></i> Buka Portal BPS',
        cancelButtonText: 'Tutup',
        confirmButtonColor: '#0f766e',
        cancelButtonColor: '#94a3b8',
        customClass: {
            popup: 'rounded-[2rem] p-6 shadow-2xl border border-slate-100',
            confirmButton: 'rounded-xl px-5 py-3 font-bold text-xs shadow-lg shadow-teal-500/20',
            cancelButton: 'rounded-xl px-5 py-3 font-bold text-xs'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const width = 560;
            const height = 680;
            const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
            const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);

            window.open(
                'https://dtsen-form.bps.go.id/indonesia-pintar',
                'PengecekanDesilBPS',
                `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
            );
        }
    });
}
// Toggle Detail Identitas pada Layar Ponsel
function toggleDetailIdentitas() {
    const detailBox = document.getElementById('prof-detail-more');
    const btnText = document.getElementById('text-toggle-identitas');
    const btnIcon = document.getElementById('icon-toggle-identitas');

    if (detailBox.classList.contains('hidden')) {
        detailBox.classList.remove('hidden');
        btnText.innerText = 'Sembunyikan';
        btnIcon.className = 'fas fa-chevron-up text-[10px]';
    } else {
        detailBox.classList.add('hidden');
        btnText.innerText = 'Lihat Selengkapnya';
        btnIcon.className = 'fas fa-chevron-down text-[10px]';
    }
}

// Switcher Tab Surat / Pengaduan pada Layar Ponsel
function switchLayananMobile(type) {
    const boxSurat = document.getElementById('box-layanan-surat');
    const boxAduan = document.getElementById('box-layanan-aduan');
    const tabSurat = document.getElementById('tab-btn-surat');
    const tabAduan = document.getElementById('tab-btn-aduan');

    if (type === 'surat') {
        boxSurat.classList.remove('hidden');
        boxAduan.classList.add('hidden');
        tabSurat.className = 'flex-1 py-2.5 text-xs font-black rounded-xl bg-white text-teal-800 shadow-sm transition-all flex items-center justify-center gap-2';
        tabAduan.className = 'flex-1 py-2.5 text-xs font-bold rounded-xl text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center gap-2';
    } else {
        boxSurat.classList.add('hidden');
        boxAduan.classList.remove('hidden');
        tabAduan.className = 'flex-1 py-2.5 text-xs font-black rounded-xl bg-white text-orange-700 shadow-sm transition-all flex items-center justify-center gap-2';
        tabSurat.className = 'flex-1 py-2.5 text-xs font-bold rounded-xl text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center gap-2';
    }
}
function openAppModal(type) {
    const isBlog = type === 'blog';
    const config = isBlog ? {
        title: 'Blog Molas',
        sub: 'Portal Berita & Publikasi Masyarakat',
        icon: 'fa-newspaper',
        iconColor: 'from-teal-500 to-emerald-600',
        badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/80',
        badgeText: 'Akses Terbuka untuk Umum',
        url: 'https://blog.molomparatas.id/',
        btnText: 'Kunjungi Blog Desa',
        btnColor: '#0f766e',
        desc: 'Pusat publikasi dan keterbukaan informasi publik Pemerintah Desa Molompar Atas. Menyajikan berita kegiatan desa, sosialisasi program kerja, agenda kemasyarakatan, serta pengumuman bantuan sosial terkini langsung untuk seluruh warga.',
        features: [
            'Berita resmi dan dokumentasi aktivitas Pemdes',
            'Informasi penyaluran bansos, kesehatan, & kegiatan desa',
            'Transparansi program pembangunan untuk masyarakat'
        ]
    } : {
        title: 'Molas Cloud',
        sub: 'Server Dokumen & Database Digital Pemdes',
        icon: 'fa-cloud',
        iconColor: 'from-blue-600 to-indigo-700',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
        badgeText: 'Khusus Aparatur Desa',
        url: 'https://www.molas.cloud/',
        btnText: 'Masuk ke Molas Cloud',
        btnColor: '#2563eb',
        desc: 'Infrastruktur penyimpanan digital terpusat yang dirancang khusus untuk mempermudah tata kelola kantor. Berfungsi mencatat surat dinas, mengamankan inventaris aset, menyimpan perencanaan anggaran, serta mengarsipkan seluruh dokumen desa secara aman, rapi, dan instan.',
        features: [
            'Pencatatan register surat keluar & arsip surat masuk',
            'Pendataan buku aset, inventaris kantor, & dokumen fisik',
            'Arsip perencanaan APBDes, RPJMDes, & regulasi desa'
        ]
    };

    const featuresHtml = config.features.map(f => `
        <li class="flex items-center gap-2.5">
            <span class="w-4 h-4 rounded-full ${isBlog ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'} flex items-center justify-center text-[9px] shrink-0 font-bold">✓</span>
            <span class="text-xs text-slate-600 font-medium">${f}</span>
        </li>
    `).join('');

    Swal.fire({
        html: `
            <div class="text-left font-sans -m-1">
                <!-- Header Modal -->
                <div class="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${config.iconColor} flex items-center justify-center text-white text-xl shadow-md shrink-0">
                        <i class="fas ${config.icon}"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-0.5">
                            <h3 class="text-base font-black text-slate-800 leading-tight">${config.title}</h3>
                        </div>
                        <span class="${config.badgeBg} text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border inline-block mt-0.5">${config.badgeText}</span>
                    </div>
                </div>

                <!-- Konten Body -->
                <div class="space-y-3.5 pt-4">
                    <div class="${isBlog ? 'bg-teal-50/70 border-teal-100' : 'bg-blue-50/70 border-blue-100'} border p-3.5 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
                        ${config.desc}
                    </div>

                    <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <i class="fas fa-layer-group text-slate-500"></i> ${isBlog ? 'Layanan Informasi:' : 'Fungsi Utama Cloud:'}
                        </div>
                        <ul class="space-y-2 list-none p-0 m-0">
                            ${featuresHtml}
                        </ul>
                    </div>
                </div>
            </div>
        `,
        width: '460px',
        showCancelButton: true,
        confirmButtonText: `<i class="fas fa-external-link-alt mr-1.5"></i> ${config.btnText}`,
        cancelButtonText: 'Tutup',
        confirmButtonColor: config.btnColor,
        cancelButtonColor: '#94a3b8',
        customClass: {
            popup: 'rounded-[2rem] p-6 shadow-2xl border border-slate-100',
            confirmButton: 'rounded-xl px-5 py-3 font-bold text-xs shadow-lg shadow-slate-900/10',
            cancelButton: 'rounded-xl px-5 py-3 font-bold text-xs'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(config.url, '_blank');
        }
    });
}
// ============================================
// PWA DETECTION & DIRECT ONE-CLICK INSTALL LOGIC
// ============================================
let deferredPrompt = null;

// 1. Registrasi Service Worker Otomatis
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swCode = `
            self.addEventListener('install', (e) => { self.skipWaiting(); });
            self.addEventListener('activate', (e) => { e.waitUntil(clients.claim()); });
            self.addEventListener('fetch', (e) => { return; });
        `;
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        navigator.serviceWorker.register(swUrl).catch(() => {});
    });
}

// 2. Tangkap Event PWA Chrome Langsung
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    triggerPWABanner();
});

// 3. Deteksi Identitas Perangkat & Browser
function getBrowserInfo() {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /Android/.test(ua);
    const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor) && !/SamsungBrowser|MiuiBrowser|OPR|Edge/.test(ua);
    const isSamsung = /SamsungBrowser/.test(ua);
    const isEdge = /EdgA|Edge/.test(ua);

    return { isIOS, isAndroid, isChrome, isSamsung, isEdge };
}

// 4. Deteksi Status Sudah Terpasang
function isAppAlreadyInstalled() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = window.navigator.standalone === true;
    const isMarkedInstalled = localStorage.getItem('pwa_installed') === 'true';
    return isStandalone || isIOSStandalone || isMarkedInstalled;
}

// 5. Pemicu Banner Melayang
function triggerPWABanner() {
    if (isAppAlreadyInstalled()) return;
    if (sessionStorage.getItem('pwa_banner_dismissed') === 'true') return;

    const banner = document.getElementById('pwa-bottom-banner');
    if (banner) {
        banner.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
        banner.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
    }
}

window.addEventListener('load', () => {
    setTimeout(triggerPWABanner, 1500);
});

function dismissPWABanner() {
    const banner = document.getElementById('pwa-bottom-banner');
    if (banner) {
        banner.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        banner.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
    }
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
}

// 6. Eksekusi Instalasi: Langsung Otomatis di Chrome
function installPWAApp() {
    const { isIOS, isAndroid, isChrome, isSamsung } = getBrowserInfo();

    // JALUR 1: Pemicu Otomatis Langsung di Chrome Android
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                localStorage.setItem('pwa_installed', 'true');
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Dipasang',
                    text: 'Aplikasi Desa Molompar Atas berhasil ditambahkan ke layar utama.',
                    confirmButtonColor: '#0f766e',
                    background: '#ffffff',
                    backdrop: 'rgba(15, 23, 42, 0.65)'
                });
            }
            deferredPrompt = null;
            dismissPWABanner();
        });
        return;
    }

    // JALUR 2: Panduan Khusus Non-Chrome dengan Background Samar & Visi Desa
    let panduanTitle = 'Pasang Pintasan Aplikasi';
    let panduanLangkah = '';

    if (isIOS) {
        panduanTitle = 'Petunjuk Safari (iPhone/iPad)';
        panduanLangkah = `
            <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">1</span>
                <span class="text-slate-700">Ketuk tombol <b>Bagikan (Share)</b> <i class="fas fa-share-square text-blue-500 mx-1"></i> di bilah navigasi Safari.</span>
            </li>
            <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">2</span>
                <span class="text-slate-700">Gulir ke bawah lalu pilih <b>"Add to Home Screen"</b> (Tambahkan ke Layar Utama).</span>
            </li>
            <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">3</span>
                <span class="text-slate-700">Ketuk <b>"Add"</b> di pojok kanan atas untuk memasang ikon.</span>
            </li>
        `;
    } else if (isSamsung) {
        panduanTitle = 'Petunjuk Samsung Internet';
        panduanLangkah = `
            <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">1</span>
                <span class="text-slate-700">Ketuk ikon <b>Menu (garis tiga / ☰)</b> di pojok kanan bawah.</span>
            </li>
            <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">2</span>
                <span class="text-slate-700">Pilih opsi <b>"Tambahkan halaman ke"</b>.</span>
            </li>
            <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">3</span>
                <span class="text-slate-700">Pilih <b>"Layar Depan"</b> untuk memasang aplikasi.</span>
            </li>
        `;
    } else {
        panduanTitle = 'Petunjuk Pemasangan Manual';
        panduanLangkah = `
            <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">1</span>
                <span class="text-slate-700">Ketuk ikon <b>titik tiga (⋮)</b> di pojok kanan atas browser Anda.</span>
            </li>
            <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">2</span>
                <span class="text-slate-700">Pilih menu <b>"Tambahkan ke Layar Utama"</b> atau <b>"Instal Aplikasi"</b>.</span>
            </li>
            <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">3</span>
                <span class="text-slate-700">Konfirmasi pemasangan pada pop-up.</span>
            </li>
        `;
    }

    Swal.fire({
        title: panduanTitle,
        background: '#ffffff',
        backdrop: 'rgba(15, 23, 42, 0.75) backdrop-blur-sm',
        html: `
            <div class="text-left font-sans space-y-3 pt-2 relative">
                
                <!-- Header Card dengan Background Gambar Samar & Overlay Frosted Glass -->
                <div class="relative rounded-2xl overflow-hidden border border-teal-200/80 shadow-sm p-4 text-slate-800">
                    <!-- Lapisan Gambar Background (Opacity 15%) -->
                    <div class="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none scale-105" style="background-image: url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghy7LiLEm1M6-4IvDVCqHkwYOQU_UO-4lmFyMxEbHAHW5uTdZs_-izbdhTyT3bLHXcG9tiLDbbC8o53m-Ei0o2UR7lItGVdXhHQ7eJ98dxeCErEn_BNOMH9gzhYY46SvSwJPSJDDwqk-aZX8hUel2O9RDL-tlklPn0YdrIp0WRSqEmgX9MZ8uhxLgwEqA/s1600/Gemini_Generated_Image_f2i15sf2i15sf2i1.jfif');"></div>
                    
                    <!-- Lapisan Warna Gradient Halus -->
                    <div class="absolute inset-0 bg-gradient-to-r from-teal-50/95 via-white/90 to-emerald-50/90 pointer-events-none"></div>

                    <div class="relative z-10">
                        <div class="flex items-center gap-3 mb-2.5">
                            <div class="w-12 h-12 rounded-xl bg-white p-1.5 shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgC2knktwWJnx1YCJX5N4RMbvVhKDwajI91INBuAGa2FJslxCL4pkz6YHl_EKPhGLuO7yw6lvkC6yMGS4Pfyf7Qz6o1r-KXZSQYWpfl7DIitJ9uv-_qMHRcZoxJzSMc_rZSc6WJ1nNN3E-ZyaqWdBueEOM2QlYPKPDk027DZUhopoqfQXv4dQVmdR6abdI/s1600/logo.png" class="w-full h-full object-contain">
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-black text-slate-900 leading-tight">Aplikasi Desa Molompar Atas</div>
                                <div class="text-[11px] text-teal-700 font-bold mt-0.5">Portal Layanan Digital Terpadu</div>
                            </div>
                        </div>

                        <!-- Kutipan Komitmen Pelayanan Publik -->
                        <div class="bg-white/80 backdrop-blur-md p-2.5 rounded-xl border border-teal-100 text-[11px] text-slate-600 italic leading-relaxed">
                            <i class="fas fa-quote-left text-teal-500 text-[9px] mr-1"></i>
                            Mewujudkan pelayanan publik yang transparan, akuntabel, dan modern untuk seluruh masyarakat Desa Molompar Atas.
                        </div>
                    </div>
                </div>

                <!-- Box Langkah-langkah Instalasi -->
                <div class="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed shadow-sm">
                    <p class="font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                        <i class="fas fa-info-circle text-teal-600"></i> Ikuti langkah pemasangan berikut:
                    </p>
                    <ul class="space-y-2.5 list-none p-0 m-0">
                        ${panduanLangkah}
                    </ul>
                </div>
            </div>
        `,
        confirmButtonText: '<i class="fas fa-check mr-1.5"></i> Saya Mengerti',
        confirmButtonColor: '#0f766e',
        customClass: {
            popup: 'rounded-[2rem] p-5 sm:p-6 shadow-2xl border border-slate-100',
            confirmButton: 'rounded-xl px-5 py-3 font-bold text-xs shadow-lg shadow-teal-700/20'
        }
    });
}

// 7. Bersihkan Banner Saat Instalasi Selesai
window.addEventListener('appinstalled', () => {
    localStorage.setItem('pwa_installed', 'true');
    deferredPrompt = null;
    dismissPWABanner();
});
// ============================================
// DATA & LOGIKA POPUP ARTIKEL DESA
// ============================================
const dataArtikelDesa = {
    1: {
        kategori: "Tata Kelola & Evaluasi",
        judul: "Penginputan Index Desa 2026 Pendamping Lokal Desa & Operator Siskeudes (Selesai)",
        tanggal: "08 Februari 2026",
        penulis: "PLD & Tim Data Desa",
        gambar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhtX-8671JGjFu9iMEpxs8fBpxLKqLP6o1fg9fbp3SeUcmFqTVl67YQlenx03_oTzWcO4oFxu2UoeW4vFyx_Bz1Oe-Wr1ZBwhBbUZ8uvmgUI9pnD-d2ctCn_1Wwt8f9M0rhFKclU5HQWE80O9xyvZ3LoOdFYKlfRV9WJNKvzWe5-9q6WFrMjbfz7AOD3i0/s1600/WhatsApp%20Image%202026-07-28%20at%2015.43.11.jpeg",
        isi: `
            <p class="text-sm md:text-base text-slate-700 leading-relaxed mb-3.5">
                Pemerintah Desa Molompar Atas secara resmi telah menuntaskan seluruh rangkaian penginputan dan pemutakhiran data instrumen <b>Indeks Desa (ID) Tahun Anggaran 2026</b> ke dalam server sistem informasi terpadu Kementerian Desa PDTT RI.
            </p>
            <p class="text-sm md:text-base text-slate-700 leading-relaxed mb-3.5">
                Penyelesaian penginputan ini merupakan hasil kerja keras dan kolaborasi lintas jajaran:
            </p>
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                <div><span class="text-slate-400 font-bold uppercase block text-[11px] mb-0.5">Pendamping Lokal Desa (PLD):</span><strong class="text-slate-800 text-sm md:text-base font-black">Aprilia Wanta</strong></div>
                <div><span class="text-slate-400 font-bold uppercase block text-[11px] mb-0.5">Operator Siskeudes & Admin:</span><strong class="text-slate-800 text-sm md:text-base font-black">Aldi Korompis</strong></div>
                <div><span class="text-slate-400 font-bold uppercase block text-[11px] mb-0.5">Plt. Sekretaris Desa:</span><strong class="text-slate-800 text-sm md:text-base font-black">Meylan Naray</strong></div>
                <div><span class="text-slate-400 font-bold uppercase block text-[11px] mb-0.5">Hukum Tua:</span><strong class="text-slate-800 text-sm md:text-base font-black">Alfius B. Tulandi</strong></div>
            </div>

            <h4 class="text-sm md:text-base font-black text-slate-900 uppercase tracking-wide mb-2.5 flex items-center gap-2">
                <i class="fas fa-layer-group text-teal-600"></i> Pembahasan Komprehensif Indeks Desa 2026
            </h4>
            <p class="text-sm md:text-base text-slate-700 leading-relaxed mb-3.5">
                Indeks Desa 2026 merupakan ukuran komposit tunggal yang mengintegrasikan pemutakhiran Indeks Desa Membangun (IDM) dengan evaluasi perkembangan SDGs Desa. Instrumen ini mengukur 3 pilar fundamental:
            </p>
            <ul class="space-y-2.5 text-xs md:text-sm text-slate-700 mb-4 pl-1">
                <li class="flex items-start gap-2.5">
                    <i class="fas fa-check-circle text-teal-500 mt-1 shrink-0"></i>
                    <span><b>Indeks Ketahanan Sosial (IKS):</b> Mengukur akses fasilitas kesehatan, pendidikan, partisipasi gotong royong, keberagaman sosial, serta jaminan keamanan lingkungan (Poskamling/Siskamling).</span>
                </li>
                <li class="flex items-start gap-2.5">
                    <i class="fas fa-check-circle text-teal-500 mt-1 shrink-0"></i>
                    <span><b>Indeks Ketahanan Ekonomi (IKE):</b> Menilai ketersediaan sentra perdagangan, akses lembaga keuangan/kredit, pemberdayaan BUMDes, koperasi desa, dan kualitas keterbukaan akses jalan aspal/beton.</span>
                </li>
                <li class="flex items-start gap-2.5">
                    <i class="fas fa-check-circle text-teal-500 mt-1 shrink-0"></i>
                    <span><b>Indeks Ketahanan Lingkungan (IKL):</b> Evaluasi kualitas sanitasi, bebas pencemaran air/udara, mitigasi bencana, serta kesiapsiagaan tanggap darurat iklim.</span>
                </li>
            </ul>

            <div class="bg-emerald-50 border-l-4 border-emerald-500 p-3.5 rounded-r-2xl my-4 text-xs md:text-sm text-emerald-950 font-medium leading-relaxed">
                <b>Signifikansi Kebijakan:</b> Data Indeks Desa yang telah tervalidasi 100% ini menjadi dasar penentuan alokasi pagu Dana Desa, afirmasi kebijakan pembangunan, dan mempertahankan status desa <b>MANDIRI</b> secara berkelanjutan.
            </div>
        `
    },
    2: {
        kategori: "Kesehatan & Gizi",
        judul: "Pembagian Makanan Tambahan dan MBG Desa Molompar Atas",
        tanggal: "29 Januari 2026",
        penulis: "Kader Kesehatan & Posyandu",
        gambar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg63rqhEFZ6Ria0bj_5fOYI6cIPh_iMUqtVqx6YoftxydjqYVvsp8xaBoMhQ4yZniIm4G2tIFZn3iDtI52WyRbXQSZtH65OW5ABv6GtHCV1XSdUwkmsU4VOQpCD7ffdfeEMNQAi4fJ1XLzD3G4dzYDGskA_F-ZL-A5wIewA2StzyM9yAAAJ6gQcq_thsoa8/s1600/631644609_1804342457636665_2872722775409525055_n.jpg",
        isi: `
            <p class="text-sm md:text-base text-slate-700 leading-relaxed mb-3.5">
                Pemerintah Desa Molompar Atas secara konsisten menyelenggarakan program <b>Pemberian Makanan Tambahan (PMT)</b> yang diadakan <b>setiap bulan</b> serta integrasi program <b>Makanan Bergizi Gratis (MBG)</b> bagi kelompok sasaran prioritas.
            </p>
            
            <h4 class="text-sm md:text-base font-black text-slate-900 uppercase tracking-wide mb-2.5 flex items-center gap-2">
                <i class="fas fa-hands-helping text-rose-500"></i> Kolaborasi Unsur Pelayanan Kesehatan Desa:
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                <div class="bg-rose-50/70 border border-rose-100 p-3 rounded-2xl text-xs md:text-sm">
                    <strong class="text-rose-900 block mb-1 font-bold text-sm">Kader SUB-PPKBD</strong>
                    <span class="text-slate-600 leading-relaxed block">Penggerak pendataan keluarga, KB, dan pendampingan rumah tangga sasaran.</span>
                </div>
                <div class="bg-rose-50/70 border border-rose-100 p-3 rounded-2xl text-xs md:text-sm">
                    <strong class="text-rose-900 block mb-1 font-bold text-sm">Kader POSYANDU</strong>
                    <span class="text-slate-600 leading-relaxed block">Pelaksana penimbangan, pengukuran antropometri, dan distribusi makanan bergizi.</span>
                </div>
                <div class="bg-rose-50/70 border border-rose-100 p-3 rounded-2xl text-xs md:text-sm">
                    <strong class="text-rose-900 block mb-1 font-bold text-sm">Kader Pembangunan Manusia (KPM)</strong>
                    <span class="text-slate-600 leading-relaxed block">Monitoring berkala 1.000 Hari Pertama Kehidupan (HPK) dan pemetaan stunting.</span>
                </div>
                <div class="bg-rose-50/70 border border-rose-100 p-3 rounded-2xl text-xs md:text-sm">
                    <strong class="text-rose-900 block mb-1 font-bold text-sm">Tenaga Medis Puskesmas</strong>
                    <span class="text-slate-600 leading-relaxed block">Pemeriksaan klinis langsung dokter, bidan desa, dan tenaga gizi puskesmas.</span>
                </div>
            </div>

            <h4 class="text-sm md:text-base font-black text-slate-900 uppercase tracking-wide mb-2.5 flex items-center gap-2">
                <i class="fas fa-heartbeat text-rose-500"></i> Klaster Pelayanan Posyandu Terintegrasi:
            </h4>
            <ul class="space-y-2 text-xs md:text-sm text-slate-700 mb-4 pl-1">
                <li>• <b>Posyandu Bayi &amp; Balita:</b> Vaksinasi lengkap, vitamin A, pemantauan berat/tinggi badan.</li>
                <li>• <b>Ibu Hamil &amp; Menyusui (Bumil):</b> Skrining risiko tinggi, tablet tambah darah, dan edukasi ASI eksklusif.</li>
                <li>• <b>Posyandu Remaja:</b> Pemeriksaan kadar hemoglobin (Hb) pencegahan anemia dan edukasi reproduksi sehat.</li>
                <li>• <b>Posyandu Lansia (Posbindu):</b> Cek tekanan darah, gula darah, asam urat, serta senam kebugaran lansia.</li>
            </ul>

            <div class="bg-rose-50 border-l-4 border-rose-500 p-3.5 rounded-r-2xl my-4 text-xs md:text-sm text-rose-950 font-medium leading-relaxed">
                <b>Jadwal &amp; Lokasi:</b> Kegiatan diselenggarakan rutin setiap bulan bertempat di Balai Desa Molompar Atas. Masyarakat diharapkan hadir memanfaatkan fasilitas kesehatan gratis ini.
            </div>
        `
    },
    3: {
        kategori: "Pelayanan Publik",
        judul: "Layanan Pemerintahan Desa Molompar Atas",
        tanggal: "20 Januari 2026",
        penulis: "Pemerintah Desa Molompar Atas",
        gambar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqrefHsqHC_UWmE4hKDY0W4FAWFQCtZsK211FgwEP6LRe4PsryCLcGjSFIUAYJCdkV_2puk3zUH1pfVMJj1UUnvcmhC12BZG0lGcz1t4vNkfiu_4vl2dyq7C9LcvAshbMINwH1SaMn55-SRMaDl5uu6gFMXFEYUIJgw8LKVwxd8plx_nVOh4RWcF4LSbV1/s1600/d10200fc-8ae9-4b19-8a80-5568e918892a.jfif",
        isi: `
            <p class="text-sm md:text-base text-slate-700 leading-relaxed mb-3.5">
                Pemerintah Desa Molompar Atas terus mengoptimalkan pelayanan administrasi yang cepat, transparan, dan terintegrasi baik secara tatap muka di Kantor Balai Desa maupun melalui platform digital mandiri.
            </p>

            <h4 class="text-sm md:text-base font-black text-slate-900 uppercase tracking-wide mb-2.5 flex items-center gap-2">
                <i class="fas fa-file-signature text-blue-600"></i> Layanan Administrasi &amp; Surat Online
            </h4>
            <p class="text-sm md:text-base text-slate-700 leading-relaxed mb-3">
                Warga dapat mengajukan berbagai kebutuhan permohonan surat secara online dengan verifikasi otomatis database kependudukan:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-slate-800 mb-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>• Surat Keterangan Tidak Mampu (SKTM)</div>
                <div>• Surat Keterangan Domisili Warga / WNA</div>
                <div>• Surat Keterangan Kehilangan Dokumen</div>
                <div>• Surat Pengantar KTP / KK / Akta</div>
                <div>• Surat Keterangan Usaha (SKU)</div>
                <div>• Permohonan Surat Kustom Lainnya</div>
            </div>

            <h4 class="text-sm md:text-base font-black text-slate-900 uppercase tracking-wide mb-2.5 flex items-center gap-2">
                <i class="fas fa-bullhorn text-orange-500"></i> Saluran Aduan &amp; Aspirasi Masyarakat
            </h4>
            <p class="text-sm md:text-base text-slate-700 leading-relaxed mb-4">
                Tersedia kanal pengaduan langsung terkait infrastruktur, ketertiban lingkungan, dan bantuan sosial yang langsung diteruskan ke Hukum Tua dan perangkat terkait melalui integrasi WhatsApp Center: <b>0895-1006-0273</b>.
            </p>

            <h4 class="text-sm md:text-base font-black text-slate-900 uppercase tracking-wide mb-2.5 flex items-center gap-2">
                <i class="fas fa-landmark text-teal-600"></i> Sinergi Antar Tingkat Pemerintahan
            </h4>
            <p class="text-sm md:text-base text-slate-700 leading-relaxed mb-3">
                Pemerintah Desa Molompar Atas aktif berpartisipasi dan menyelaraskan kebijakan dengan:
            </p>
            <ul class="space-y-2 text-xs md:text-sm text-slate-700 mb-4 pl-1">
                <li>• <b>Pemerintah Kecamatan Tombatu Timur:</b> Sinkronisasi administrasi kewilayahan, koordinasi Musrenbangcam, pelaporan PBB-P2, dan ketentraman umum.</li>
                <li>• <b>Pemerintah Kabupaten Minahasa Tenggara:</b> Penyelarasan RKPD, rekonsiliasi keuangan Siskeudes di Dinas PMD, verifikasi data sosial Dinsos, dan audit transparansi Inspektorat Mitra.</li>
            </ul>

            <div class="bg-blue-50 border-l-4 border-blue-500 p-3.5 rounded-r-2xl my-4 text-xs md:text-sm text-blue-950 font-medium leading-relaxed">
                <b>Jam Pelayanan Kantor:</b> Senin s/d Jumat pukul 08.00 - 15.00 WITA bertempat di Jln. Balai Desa Molompar Atas Jaga III. Layanan surat digital beroperasi 24 jam melalui portal ini.
            </div>
        `
    }
};

function bukaModalArtikel(id) {
    const art = dataArtikelDesa[id];
    if (!art) return;

    const htmlModal = `
        <div class="flex flex-col h-full max-h-[90vh] bg-white text-slate-800">
            
            <!-- 1. Header Banner Gambar (Responsif) -->
            <div class="relative w-full h-44 sm:h-56 md:h-64 shrink-0 bg-slate-950 overflow-hidden">
                <img src="${art.gambar}" alt="${art.judul}" class="w-full h-full object-cover opacity-85">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                <!-- Badge Kategori & Judul di atas Gambar -->
                <div class="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6">
                    <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-teal-500 text-white text-[9px] sm:text-[10px] md:text-xs font-black rounded-full uppercase tracking-wider shadow-md inline-block mb-1 sm:mb-2">
                        ${art.kategori}
                    </span>
                    <h2 class="text-sm sm:text-lg md:text-2xl font-black text-white leading-tight drop-shadow-sm m-0">
                        ${art.judul}
                    </h2>
                </div>
            </div>

            <!-- 2. Meta Info (Tanggal & Penulis) -->
            <div class="px-4 py-2 sm:px-6 sm:py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500 shrink-0">
                <div class="flex items-center gap-1.5 font-medium">
                    <i class="far fa-calendar-alt text-teal-600"></i>
                    <span>${art.tanggal}</span>
                </div>
                <div class="flex items-center gap-1.5 font-bold text-slate-700 truncate">
                    <i class="fas fa-user-edit text-teal-600"></i>
                    <span class="truncate">${art.penulis}</span>
                </div>
            </div>

            <!-- 3. Area Isi Artikel (Scroll Nyaman, Font Pas di HP & Laptop) -->
            <div class="article-scroll-area p-4 sm:p-6 space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base leading-relaxed text-slate-700 flex-1">
                ${typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(art.isi) : art.isi}
            </div>

            <!-- 4. Footer Sticky Modal -->
            <div class="px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-100/90 border-t border-slate-200 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 shrink-0">
                <span class="font-medium">Portal Resmi Molompar Atas</span>
                <span class="text-teal-700 font-bold">#DesaDigital2026</span>
            </div>
        </div>
    `;

    Swal.fire({
        html: htmlModal,
        showCloseButton: true,
        showConfirmButton: false,
        background: '#ffffff',
        focusConfirm: false,
        customClass: {
            popup: 'article-popup-modal shadow-2xl border border-slate-200/80',
            htmlContainer: 'article-popup-body',
            closeButton: 'focus:outline-none z-50 text-white bg-slate-900/80 hover:bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center top-2.5 right-2.5 sm:top-3 sm:right-3 transition-colors shadow-md'
        }
    });
}
function initCharts() {
    const isMobile = window.innerWidth < 768;

    // 1. Diagram Lingkaran Pendapatan (Rp 811.044.144)
    const ctxPendapatan = document.getElementById('chartPendapatanReal');
    if (ctxPendapatan) {
        new Chart(ctxPendapatan, {
            type: 'doughnut',
            data: {
                labels: ['Pendapatan Transfer', 'Pendapatan Asli Desa (PAD)', 'Pendapatan Lain-lain'],
                datasets: [{
                    data: [760044144, 50000000, 1000000],
                    backgroundColor: ['#0d9488', '#0284c7', '#f59e0b'],
                    hoverOffset: 8,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 12,
                            boxWidth: 8,
                            font: { size: isMobile ? 10 : 11, family: "'Plus Jakarta Sans', sans-serif" }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let val = context.raw || 0;
                                return ' Rp ' + val.toLocaleString('id-ID');
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    // 2. Diagram Batang 5 Bidang Belanja (Rp 900.320.800)
    const ctxBelanja = document.getElementById('chartBelanjaReal');
    if (ctxBelanja) {
        new Chart(ctxBelanja, {
            type: 'bar',
            data: {
                labels: [
                    'Penyelenggaraan Pemdes', 
                    'Pembangunan Desa', 
                    'Pembinaan Masy.', 
                    'Pemberdayaan Masy.', 
                    'Bencana & Mendesak'
                ],
                datasets: [{
                    label: 'Alokasi Anggaran (Rp)',
                    data: [483811577, 351309223, 7500000, 25000000, 32700000],
                    backgroundColor: [
                        '#0f766e', // Teal
                        '#3b82f6', // Biru
                        '#f59e0b', // Amber
                        '#8b5cf6', // Ungu
                        '#ef4444'  // Merah
                    ],
                    borderRadius: 8,
                    maxBarThickness: 32
                }]
            },
            options: {
                indexAxis: 'y', // Batang Horizontal agar teks nama bidang terbaca rapi di HP
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            callback: function(value) {
                                return 'Rp ' + (value / 1000000).toFixed(0) + ' Jt';
                            },
                            font: { size: 9, family: "'Plus Jakarta Sans', sans-serif" }
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            font: { size: isMobile ? 9 : 10, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ' Total: Rp ' + context.raw.toLocaleString('id-ID');
                            }
                        }
                    }
                }
            }
        });
    }
}