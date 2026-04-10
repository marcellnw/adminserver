export default async function handler(req, res) {
    // Hanya izinkan POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { category, embed } = req.body;

        // 🔐 AUTH CHECK (WAJIB LOGIN)
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // 🔐 VALIDASI INPUT
        if (!category || !embed) {
            return res.status(400).json({ error: "Data tidak lengkap" });
        }

        // Ambil dari ENV (AMAN)
        const WEBHOOK_ANNOUNCEMENT = process.env.WEBHOOK_ANNOUNCEMENT;
        const WEBHOOK_DEFAULT = process.env.WEBHOOK_DEFAULT;
        const ROLE_ID = process.env.ROLE_ID;

        // 🔐 VALIDASI ENV
        if (!WEBHOOK_ANNOUNCEMENT || !WEBHOOK_DEFAULT || !ROLE_ID) {
            return res.status(500).json({
                error: "ENV belum lengkap"
            });
        }

        // Pilih webhook berdasarkan kategori
        const targetWebhook =
            category === 'announcement'
                ? WEBHOOK_ANNOUNCEMENT
                : WEBHOOK_DEFAULT;

        // Payload ke Discord
        const payload = {
            content: `<@&${ROLE_ID}>`,
            embeds: [embed]
        };

        const response = await fetch(targetWebhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // 🔍 HANDLE ERROR DISCORD
        if (!response.ok) {
            const errorText = await response.text();

            return res.status(500).json({
                error: 'Discord webhook gagal',
                detail: errorText
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (err) {
        console.error("WEBHOOK ERROR:", err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
}
