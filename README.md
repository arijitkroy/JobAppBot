# Job Application Assistant (Generative AI)

A Next.js application designed to streamline the job application process by **compressing** tasks using [Scaledown API](https://scaledown.ai) and **generating** high-quality responses (Summaries, Cover Letters, etc.) using [Ollama](https://ollama.com).

## Features

- **Generative AI Responses**: Automatically generates summaries, cover letters, and resume tips using advanced LLMs via Ollama.
- **Smart Compression**: Uses Scaledown to compress prompts before generation, significantly reducing token usage and costs without losing context.
- **Task-Based Analysis**:
  - **Summarize Job**: Quick, concise summaries of long JDs.
  - **Resume Tips**: Actionable advice based on your specific resume and the job description.
  - **Extract Keywords**: Identifies ATS-friendly keywords.
  - **Draft Cover Letter**: Generates a tailored cover letter.
- **Dynamic UI**: Interface adapts to the selected task, showing only relevant inputs.
- **Markdown Support**: Beautifully rendered output with headers, lists, and tables.
- **PDF Resume Upload**: Automatically extracts text from uploaded PDF resumes.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Access to an [Ollama](https://ollama.com) instance (Local or Cloud)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd job-app-bot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your API keys:

    ```env
    # Scaledown API for prompt optimization/compression
    SCALEDOWN_API_KEY=your_scaledown_api_key

    # Ollama API for text generation (defaults to https://ollama.com)
    OLLAMA_API_KEY=your_ollama_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the application:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Compression**: Scaledown API
- **Generation**: Ollama (LLM)
- **Rendering**: `react-markdown` + `@tailwindcss/typography`
- **PDF Processing**: `pdfjs-dist`

## Usage

1.  Select a **Task** (e.g., "Draft Cover Letter").
2.  Paste the **Job Description**.
3.  Upload your **Resume** (PDF) or paste the text (required for some tasks like Cover Letter).
4.  Click **Draft Cover Letter** (or the respective action button).
5.  View the **Optimized Prompt** stats and the **Generated Result** formatted in Markdown.