import { useState } from "react";

export default function Home() {
  const [task, setTask] = useState("summarize");
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          job_description: job,
          resume_text: resume,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Compression failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Job Application Assistant (Compression Demo)
        </h1>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Task</label>
          <select
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          >
            <option value="summarize">Summarize Job</option>
            <option value="resume_tips">Resume Tips</option>
            <option value="keywords">Extract Keywords</option>
            <option value="cover_letter">Draft Cover Letter</option>
          </select>
        </div>

        <textarea
          rows={8}
          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded"
          placeholder="Paste job description..."
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />

        <textarea
          rows={6}
          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded"
          placeholder="Paste resume (optional)..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <button
          onClick={analyze}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded font-semibold"
        >
          {loading ? "Compressing..." : "Compress"}
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <p><b>Original Length:</b> {result.originalChars} chars</p>
              <p><b>Compressed Length:</b> {result.compressedChars} chars</p>
              <p className="text-green-400">
                <b>Compression:</b> {result.compressionPercent}%
              </p>
            </div>

            <div className="bg-gray-900 p-4 rounded border border-gray-700 whitespace-pre-wrap">
              {result.compressedPrompt}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}