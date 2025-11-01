import fs from "fs-extra";
import path from "path";

/**
 * Writes markdown content to a file
 * @param {string} filePath - Path to the source file
 * @param {string} content - Markdown content to write
 * @param {string} outputDir - Directory to save the markdown file
 * @returns {Promise<string>} Path to the generated markdown file
 */
export async function writeMarkdown(filePath, content, outputDir) {
  if (!filePath || !content || !outputDir) {
    throw new Error("Missing required parameters");
  }

  try {
    // Create a safe filename using the relative path from project root
    let relativePath = path.relative(process.cwd(), filePath);
    relativePath = path.normalize(relativePath); // <-- Normalize for cross-platform

    const safeName = relativePath
      .replace(/^[\\/]/, "") // Remove leading slashes
      .replace(/[\\/:*?"<>|]/g, "-") // Replace invalid filename characters with dashes
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/\\/g, "/") // Normalize path separators
      .toLowerCase();

    const outputPath = path.join(outputDir, `${safeName}.md`);
    const normalizedOutputPath = path.normalize(outputPath); // <-- Normalize output path

    // Ensure output directory exists
    await fs.ensureDir(path.dirname(normalizedOutputPath));

    // Write content to file
    await fs.writeFile(normalizedOutputPath, content, "utf-8");

    if (process.env.VERBOSE) {
      console.log(`Wrote documentation to: ${normalizedOutputPath}`);
    }

    return normalizedOutputPath;
  } catch (error) {
    console.error(`Failed to write markdown for ${filePath}:`, error.message);
    throw error; // Re-throw to allow caller to handle the error
  }
}
