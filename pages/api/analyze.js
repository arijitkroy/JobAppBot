import { compressPrompt } from "../../lib/scaledown";
import { generateText } from "../../lib/ollama";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { job_description, resume_text, task } = req.body;

    // Validate based on task
    if (task === "resume_tips" || task === "review") {
        if (!resume_text || resume_text.length < 50) {
             return res.status(400).json({ error: "Resume text must be at least 50 characters for this task." });
        }
    } else {
        // Default tasks (summarize, keywords, cover_letter) need job description
        if (!job_description || job_description.length < 50) {
             return res.status(400).json({ error: "Job description must be at least 50 characters." });
        }
    }

    const parts = [];
    if (job_description) parts.push(`Job Description:\n${job_description}`);
    if (resume_text) parts.push(`Resume:\n${resume_text}`);
    
    const basePrompt = parts.join("\n\n").trim();
    
    if (!basePrompt) {
        return res.status(400).json({ error: "No input provided for analysis." });
    }

    const taskPrompt = `Task: ${task || "Summarize this job description"}`;

    // Step 1: Compress the prompt
    console.log("Compressing prompt...");
    const result = await compressPrompt(basePrompt, taskPrompt);
    const compressedPrompt = result.compressed_prompt;

    // Step 2: Generate text using Ollama
    console.log("Generating text with compressed prompt...");
    const generatedText = await generateText(compressedPrompt);

    const originalChars = basePrompt.length;
    const compressedChars = compressedPrompt.length;
    const compressionPercent = (
      ((originalChars - compressedChars) / originalChars) * 100
    ).toFixed(2);

    res.status(200).json({
      generatedText,
      compressedPrompt, // Keeping it for debug/metrics
      originalChars,
      compressedChars,
      originalTokens: result.original_prompt_tokens,
      compressedTokens: result.compressed_prompt_tokens,
      compressionPercent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}