import formidable from "formidable";
import fs from "fs";
// Target the mjs file directly for ESM support
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
    uploadDir: process.cwd(),
    filename: (name, ext, part, form) => {
      return "temp.pdf";
    },
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "File upload failed" });
    }

    const filePath = files.file?.[0]?.filepath || files.file?.filepath;

    if (!filePath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const dataBuffer = fs.readFileSync(filePath);
      
      // Load the PDF document
      // Convert buffer to Uint8Array for pdfjs-dist
      const uint8Array = new Uint8Array(dataBuffer);
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdfDocument = await loadingTask.promise;
      
      let fullText = "";
      
      // Iterate through all pages
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n\n";
      }

      // Cleanup (Optional, but good practice if not overwriting)
      // fs.unlinkSync(filePath);

      // Check if text was actually extracted
      if (!fullText.trim()) {
        console.warn("Warning: No text extracted from PDF");
        // Sometimes PDF text is in form data or images (OCR needed), this lib only does text layers.
      }

      res.status(200).json({ text: fullText });
    } catch (parseError) {
      console.error("PDF Parse Error:", parseError);
      res.status(500).json({ error: "Failed to parse PDF", details: parseError.message });
    }
  });
}
