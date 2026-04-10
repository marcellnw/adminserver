import crypto from "crypto";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { username, password } = req.body;

        const ADMIN_USER = process.env.ADMIN_USER;
        const ADMIN_PASS = process.env.ADMIN_PASS;
        const SECRET = process.env.AUTH_SECRET;

        const hashedInput = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

        if (username !== ADMIN_USER || hashedInput !== ADMIN_PASS) {
            return res.status(401).json({ success: false });
        }

        const token = crypto
            .createHmac("sha256", SECRET)
            .update(username + Date.now())
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
        return res.status(500).json({ error: "Server error" });
    }
}
