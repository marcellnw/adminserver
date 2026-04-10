// ================= LOGIN =================
async function login() {
    const username = document.getElementById("login_user").value;
    const password = document.getElementById("login_pass").value;

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem("auth_token", data.token);

            alert("Login berhasil");

            // 🔥 SEMBUNYIKAN LOGIN PAGE (JANGAN HAPUS STRUKTUR)
            document.getElementById("loginPage").style.display = "none";

            showPage("page1");
        } else {
            alert("Login gagal");
        }

    } catch (err) {
        alert("Server error");
    }
}

// ================= CONFIG =================
let currentCategory = 'announcement';

// ================= PARTICLE =================
tsParticles.load("tsparticles", {
    particles: {
        number: { value: 80 },
        color: { value: "#DDA0DD" },
        shape: { type: "circle" },
        opacity: { value: 0.5, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
        size: { value: 3, random: true },
        move: { enable: true, speed: 1 }
    }
});

// ================= NAVIGATION =================
function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// 🔥 FIX UTAMA ADA DI SINI
function showPage(pageId) {
    const token = localStorage.getItem("auth_token");

    // 🔐 PROTEKSI LOGIN
    if (!token) {
        document.getElementById("loginPage").style.display = "flex";

        document.querySelectorAll('.page').forEach(p => {
            if (p.id !== "loginPage") p.classList.remove('active');
        });

        document.getElementById("loginPage").classList.add("active");
        return;
    }

    // 🔓 SUDAH LOGIN → SEMBUNYIKAN LOGIN PAGE
    document.getElementById("loginPage").style.display = "none";

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    const nav = document.getElementById('navMenu');
    if (nav) nav.classList.remove('active');

    if (pageId === 'page2') switchForm('announcement');
}

// ================= FORM CONFIG =================
const formConfig = {
    announcement: ['Judul', 'Kategori', 'Status', 'Description', 'Catatan'],
    quest: ['Nama', 'Type', 'Tier', 'Description', 'Progress', 'Reward'],
    event: ['Nama Event', 'Waktu', 'Lokasi', 'Description', 'Syarat'],
    update: ['Versi', 'Tanggal', 'Log Perubahan', 'New Update', 'Buff', 'Fix'],
    info: ['Topik', 'Link Gambar', 'Description']
};

// ================= SWITCH FORM =================
function switchForm(category, btn) {
    currentCategory = category;

    if (btn) {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    const fields = formConfig[category];
    let html = '';

    fields.forEach(field => {
        const id = field.toLowerCase().replace(/ /g, '_');

        if (['Description', 'Log Perubahan', 'Reward'].includes(field)) {
            html += `<textarea id="${id}" placeholder="${field}" rows="3"></textarea>`;
        } else {
            html += `<input type="text" id="${id}" placeholder="${field}">`;
        }
    });

    document.getElementById('formFields').innerHTML = html;
}

// ================= TOAST =================
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ================= SEND WEBHOOK =================
async function sendToDiscord() {
    const btn = document.querySelector('.btn-send');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    const token = localStorage.getItem("auth_token");

    if (!token) {
        showToast("❌ Harus login dulu", "error");
        document.getElementById("loginPage").style.display = "flex";
        return;
    }

    const fields = formConfig[currentCategory];

    let embedData = {
        title: currentCategory.toUpperCase(),
        color: parseInt("B22222", 16),
        fields: [],
        timestamp: new Date().toISOString(),
        thumbnail: {
            url: "https://github.com/marcellnw/paneleternalsmp/blob/main/1775664361126.png?raw=true"
        }
    };

    fields.forEach(f => {
        const id = f.toLowerCase().replace(/ /g, '_');
        const val = document.getElementById(id)?.value || "-";

        if (f === 'Link Gambar' && val !== "-") {
            embedData.image = { url: val };
        } else if (f === 'Description') {
            embedData.description = val;
        } else {
            embedData.fields.push({
                name: f,
                value: val,
                inline: true
            });
        }
    });

    try {
        const response = await fetch('/api/webhook', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category: currentCategory,
                embed: embedData
            })
        });

        const result = await response.json();

        if (response.ok) {
            showToast("✅ Berhasil dikirim");
            document.getElementById('webhookForm').reset();
        } else {
            showToast(result.error || "❌ Gagal", "error");
        }

    } catch (err) {
        showToast("❌ Server error", "error");
    }

    btn.innerText = "KIRIM KE DISCORD";
    btn.disabled = false;
}

// ================= INIT =================
switchForm('announcement');

window.onload = () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
        // 🔒 TAMPILKAN LOGIN FULL
        document.getElementById("loginPage").style.display = "flex";

        document.querySelectorAll(".page").forEach(p => {
            if (p.id !== "loginPage") p.classList.remove("active");
        });

        document.getElementById("loginPage").classList.add("active");
    } else {
        // 🔓 MASUK NORMAL
        document.getElementById("loginPage").style.display = "none";

        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById("page1").classList.add("active");
    }
};
