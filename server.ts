import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI API Route
  app.post("/api/ai", async (req, res) => {
    const { message, model, systemPrompt } = req.body;

    try {
      if (model === "gemini") {
        if (!process.env.GEMINI_API_KEY) {
          return res.status(500).json({ error: "Gemini API Key not configured" });
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = systemPrompt ? `${systemPrompt}\n\nUser: ${message}` : message;
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return res.json({ response: response.text() });
      } 
      
      if (model === "chatgpt") {
        if (!process.env.OPENAI_API_KEY) {
          return res.status(500).json({ error: "OpenAI API Key not configured" });
        }
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt || "You are a helpful assistant." },
            { role: "user", content: message }
          ],
        });
        return res.json({ response: completion.choices[0].message.content });
      }

      res.status(400).json({ error: "Invalid model selected" });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || "Failed to process AI request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
