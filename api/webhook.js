export default async function handler(req, res) {
    // Hanya izinkan POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { category, embed } = req.body;

        // Ambil dari ENV (AMAN)
        const WEBHOOK_ANNOUNCEMENT = process.env.WEBHOOK_ANNOUNCEMENT;
        const WEBHOOK_DEFAULT = process.env.WEBHOOK_DEFAULT;
        const ROLE_ID = process.env.ROLE_ID;

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

        if (!response.ok) {
            return res.status(500).json({
                error: 'Discord webhook gagal'
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
}
