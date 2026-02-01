export async function compressPrompt(context, prompt) {
  const res = await fetch("https://api.scaledown.xyz/compress/raw/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.SCALEDOWN_API_KEY,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      context: context,
      prompt: prompt,
      scaledown: { rate: "auto" },
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.successful || !data.results?.success) {
    throw new Error("ScaleDown compression failed");
  }

  return data.results;
}