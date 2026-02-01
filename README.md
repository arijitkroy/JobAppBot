# Job Application Assistant (Compression Demo)

A Next.js application designed to streamline the job application process by compressing long job descriptions and resumes using the [Scaledown API](https://scaledown.ai).

## Features

- **Prompt Compression**: Significantly reduces the token count of job descriptions and resumes while preserving key information.
- **Task-Based Analysis**: Supports various tasks such as:
  - Summarizing Jobs
  - Getting Resume Tips
  - Extracting Keywords
  - Drafting Cover Letters
- **PDF Resume Upload**: Automatically extracts text from uploaded PDF resumes.
- **Real-time Statistics**: Displays original length, compressed length, and compression percentage.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd job-app-bot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your Scaledown API key:

    ```env
    SCALEDOWN_API_KEY=your_api_key_here
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
- **API Integration**: Scaledown API (for text compression)
- **PDF Processing**: `pdfjs-dist` (Server-side parsing)

## Usage

1.  Select a **Task** (e.g., "Summarize Job").
2.  Paste the **Job Description**.
3.  (Optional) Provide your **Resume**:
    - Paste text directly.
    - Click **Upload PDF** to auto-fill (supports `.pdf` files).
    - Use **🗑️ Clear** to remove the uploaded file and text.
4.  Click **Compress**.
5.  View the compressed result and efficiency statistics.