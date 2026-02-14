import { Ollama } from "ollama";

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

// Initialize Ollama client with Cloud configuration
const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + OLLAMA_API_KEY,
  },
});

export async function generateText(prompt) {
  if (!OLLAMA_API_KEY) {
    throw new Error("OLLAMA_API_KEY is not defined");
  }

  try {
    const response = await ollama.chat({
      model: "gpt-oss:120b", // Using the model user suggested, or could be configurable
      messages: [{ role: "user", content: prompt }],
      stream: false, // We'll wait for the full response for now to keep it simple
    });

    return response.message.content;
  } catch (error) {
    console.error("Ollama Generation Error:", error);
    throw error;
  }
}
