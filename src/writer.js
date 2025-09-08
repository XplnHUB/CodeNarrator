import fs from 'fs-extra';
import path from 'path';

/**
 * Writes markdown content to a file
 * @param {string} filePath - Path to the source file
 * @param {string} content - Markdown content to write
 * @param {string} outputDir - Directory to save the markdown file
 * @returns {Promise<string>} Path to the generated markdown file
 */
export async function writeMarkdown(filePath, content, outputDir) {
  if (!filePath || !content || !outputDir) {
    throw new Error('Missing required parameters');
  }

  try {
    // Create a safe filename using the relative path from project root
    const relativePath = path.relative(process.cwd(), filePath);
    const safeName = path.normalize( // Normalize path seperators according to OS
      relativePath
      .replace(/^[\\/]/, '') // Remove leading slashes
      .replace(/[\\/:*?"<>|]/g, '-') // Replace invalid filename characters with dashes
      .replace(/\.[^/.]+$/, '') // Remove extension
      ).toLowerCase();
    
    const outputPath = path.join(outputDir, `${safeName}.md`);
    
    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputPath));
    
    // Write content to file
    await fs.writeFile(outputPath, content, 'utf-8');
    
    if (process.env.VERBOSE) {
      console.log(`📄 Wrote documentation to: ${outputPath}`);
    }
    
    return outputPath;
  } catch (error) {
    console.error(`Failed to write markdown for ${filePath}:`, error.message);
    throw error; // Re-throw to allow caller to handle the error
  }
}
