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
        move: { enable: true, speed: 1, direction: "none", out_mode: "out" }
    }
});

// ================= NAVIGATION =================
function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.getElementById('navMenu').classList.remove('active');

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

// ================= SEND WEBHOOK (SECURE) =================
async function sendToDiscord() {
    const btn = document.querySelector('.btn-send');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: currentCategory,
                embed: embedData
            })
        });

        const result = await response.json();

        if (response.ok) {
            showToast(`✅ ${currentCategory.toUpperCase()} berhasil dikirim`);
            document.getElementById('webhookForm').reset();
        } else {
            showToast(result.error || "❌ Gagal mengirim", "error");
        }

    } catch (err) {
        console.error(err);
        showToast("❌ Server error", "error");
    }

    btn.innerText = "KIRIM KE DISCORD";
    btn.disabled = false;
}

// ================= INIT =================
switchForm('announcement');
