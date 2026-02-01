import { compressPrompt } from "../../lib/scaledown";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { job_description, resume_text, task } = req.body;

    if (!job_description || job_description.length < 100) {
      return res.status(400).json({
        error: "Job description must be at least 100 characters",
      });
    }

    const basePrompt = `${job_description} ${resume_text ? `Resume:\n${resume_text}` : ""}`.trim();
    const taskPrompt = `Task: ${task || "Summarize this job description"}`;

    const result = await compressPrompt(basePrompt, taskPrompt);
    const originalChars = basePrompt.length;
    const compressedChars = result.compressed_prompt.length;
    const compressionPercent = (
      ((originalChars - compressedChars) / originalChars) * 100
    ).toFixed(2);

    res.status(200).json({
      compressedPrompt: result.compressed_prompt,
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