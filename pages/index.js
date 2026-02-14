import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [task, setTask] = useState("summarize");
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Task configuration to define required inputs and labels
  const TASK_CONFIG = {
    summarize: {
      label: "Summarize Job",
      showJob: true,
      showResume: false, // Resume optional/hidden for summary
      jobPlaceholder: "Paste Job Description to summarize...",
      btnText: "Summarize Job",
    },
    resume_tips: {
      label: "Resume Tips",
      showJob: true, // Context is helpful but maybe optional? Let's keep it but make it look optional if we can, or just standard.
      showResume: true,
      jobPlaceholder: "Paste Job Description (Optional for context)...",
      resumePlaceholder: "Paste your resume text or upload a PDF...",
      btnText: "Get Resume Tips",
    },
    keywords: {
      label: "Extract Keywords",
      showJob: true,
      showResume: false,
      jobPlaceholder: "Paste Job Description to extract keywords...",
      btnText: "Extract Keywords",
    },
    cover_letter: {
      label: "Draft Cover Letter",
      showJob: true,
      showResume: true,
      jobPlaceholder: "Paste Job Description...",
      resumePlaceholder: "Paste your resume to tailor the cover letter...",
      btnText: "Draft Cover Letter",
    },
  };

  const currentTaskConfig = TASK_CONFIG[task] || TASK_CONFIG.summarize;

  function handleTaskSwitch(newTask) {
    setTask(newTask);
    setResult(null);
    setJobs([]);
    // Clear inputs as requested by user to avoid confusion or redundant data
    setJob("");
    setResume("");
    
    // Also reset the file input if it exists
    const fileInput = document.getElementById("resume-upload");
    if (fileInput) fileInput.value = "";
  }

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

    // Validation checks
    if (currentTaskConfig.showJob && (!job || job.length < 50) && task !== 'resume_tips') {
       alert("Please enter a valid Job Description (at least 50 chars).");
       setLoading(false);
       return;
    }
    
    if (currentTaskConfig.showResume && (!resume || resume.length < 50)) {
       alert("Please enter a valid Resume or upload a PDF (at least 50 chars).");
       setLoading(false);
       return;
    }

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
      setJobs([]); // Clear previous jobs
    } catch (err) {
      alert(err.message || "Compression failed");
    } finally {
      setLoading(false);
    }
  }

  // Job search functionality replaced by direct LLM generation


  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Job Application Assistant
        </h1>

        <div className="mb-6">
          <label className="block text-gray-400 mb-2 font-medium">Select a Task</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.keys(TASK_CONFIG).map((taskKey) => (
              <button
                key={taskKey}
                onClick={() => handleTaskSwitch(taskKey)}
                className={`p-3 rounded border transition text-sm font-semibold ${
                  task === taskKey
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {TASK_CONFIG[taskKey].label}
              </button>
            ))}
          </div>
        </div>

        {currentTaskConfig.showJob && (
            <div className={`mb-4 transition-all duration-300 ${currentTaskConfig.showJob ? 'opacity-100' : 'opacity-0'}`}>
              <label className="block text-gray-400 mb-2 font-medium">Job Description</label>
              <textarea
                rows={8}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder={currentTaskConfig.jobPlaceholder}
                value={job}
                onChange={(e) => setJob(e.target.value)}
              />
            </div>
        )}

        {currentTaskConfig.showResume && (
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
                placeholder={currentTaskConfig.resumePlaceholder || "Paste resume text..."}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
            </div>
        )}

        <button
          onClick={analyze}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded font-semibold text-lg shadow-lg shadow-indigo-500/20"
        >
          {loading ? "Processing..." : currentTaskConfig.btnText}
        </button>

        {result && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-green-400">✓</span> Analysis Complete
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-500">Original Chars</p>
                <p className="text-xl font-mono">{result.originalChars}</p>
              </div>
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-500">Compressed Chars</p>
                <p className="text-xl font-mono text-green-400">{result.compressedChars}</p>
              </div>
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-500">Reduction</p>
                <p className="text-xl font-mono text-indigo-400">{result.compressionPercent}%</p>
              </div>
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-500">Tokens Saved</p>
                <p className="text-xl font-mono text-yellow-400">
                  {result.originalTokens - result.compressedTokens}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-indigo-300">Generated Result</h3>
              <div className="bg-gray-900 p-4 rounded text-gray-300 text-sm border border-gray-700 overflow-auto max-h-[60vh]">
                 <ReactMarkdown 
                    className="prose prose-invert prose-sm max-w-none"
                    components={{
                        // Override/Customize specific elements if needed
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 text-indigo-300" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 text-indigo-200" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-md font-bold mb-2 text-indigo-100" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                        table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className="min-w-full text-left border-collapse" {...props} /></div>,
                        th: ({node, ...props}) => <th className="border-b border-gray-700 p-2 font-semibold text-indigo-300" {...props} />,
                        td: ({node, ...props}) => <td className="border-b border-gray-800 p-2" {...props} />,
                        code: ({node, inline, className, children, ...props}) => {
                            return inline ? 
                                <code className="bg-gray-800 px-1 py-0.5 rounded text-indigo-200 font-mono text-xs" {...props}>{children}</code> :
                                <pre className="bg-gray-800 p-3 rounded overflow-x-auto mb-4 border border-gray-700"><code className="text-xs font-mono text-gray-300" {...props}>{children}</code></pre>
                        }
                    }}
                 >
                    {result.generatedText || "No text generated."}
                 </ReactMarkdown>
              </div>
            </div>

            <div className="mb-6 opacity-75">
              <h3 className="text-sm font-semibold mb-2 text-gray-500">Compressed Prompt (Context)</h3>
              <div className="bg-gray-900 p-2 rounded text-gray-500 font-mono text-xs break-all max-h-32 overflow-y-auto">
                {result.compressedPrompt}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}