const crypto = require("crypto");

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { username, password } = req.body;

        const ADMIN_USER = process.env.ADMIN_USER;
        const ADMIN_PASS = process.env.ADMIN_PASS;
        const SECRET = process.env.AUTH_SECRET;

        // 🔐 VALIDASI INPUT
        if (!username || !password) {
            return res.status(400).json({ error: "Username dan password wajib diisi" });
        }

        // 🔐 HASH PASSWORD INPUT
        const hashedInput = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

        // 🔐 SAFE COMPARE (anti timing attack)
        const isValidUser = username === ADMIN_USER;
        const isValidPass = crypto.timingSafeEqual(
            Buffer.from(hashedInput),
            Buffer.from(ADMIN_PASS)
        );

        if (!isValidUser || !isValidPass) {
            return res.status(401).json({ success: false });
        }

        // 🔐 TOKEN GENERATION (lebih kuat)
        const token = crypto
            .createHmac("sha256", SECRET)
            .update(username + Date.now() + crypto.randomBytes(16).toString("hex"))
            .digest("hex");

        return res.status(200).json({
            success: true,
            token,
            user: {
                username: ADMIN_USER,
                role: "owner"
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
}
