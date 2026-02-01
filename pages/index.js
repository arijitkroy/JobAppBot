import { useState } from "react";

export default function Home() {
  const [task, setTask] = useState("summarize");
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setResume(data.text);
    } catch (err) {
      alert("Failed to parse PDF");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function deleteFile() {
    try {
      await fetch("/api/delete-file", { method: "DELETE" });
      setResume("");
      // Reset file input value
      const fileInput = document.getElementById("resume-upload");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Failed to delete file", err);
    }
  }

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
      if (data.error) throw new Error(data.error);

      setResult(data);
    } catch (err) {
      alert(err.message || "Compression failed");
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
          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition"
          placeholder="Paste Job Description..."
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-400 font-medium">Resume</label>
            <div className="flex items-center gap-2">
              {uploading && <span className="text-sm text-yellow-500 animate-pulse">Parsing...</span>}
              <input
                type="file"
                accept=".pdf"
                id="resume-upload"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {resume && (
                <button
                  onClick={deleteFile}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs px-3 py-1 rounded border border-red-500/20 transition flex items-center gap-1"
                >
                  🗑️ Clear
                </button>
              )}

              <label
                htmlFor="resume-upload"
                className="cursor-pointer bg-green-800 hover:bg-green-700 text-white text-xs px-3 py-2 rounded border border-gray-700 transition flex items-center gap-1"
              >
                <span>Upload PDF</span>
              </label>
            </div>
          </div>
          
          <textarea
            rows={6}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Paste resume text or upload a PDF..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

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