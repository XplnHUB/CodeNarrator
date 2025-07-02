import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { callGemini } from './aiEngine.js';
import { writeMarkdown } from './writer.js';

/**
 * Analyzes a codebase and generates documentation
 * @param {string} folderPath - Path to the codebase folder
 * @param {Object} options - Options for analysis
 * @param {string} options.output - Output directory for documentation
 * @param {string} [options.model='gemini'] - AI model to use
 * @returns {Promise<void>}
 */
export async function analyzeCodebase(folderPath, options = {}) {
  if (!folderPath || typeof folderPath !== 'string') {
    throw new Error('Invalid folder path');
  }

  if (!options.output) {
    throw new Error('Output directory must be specified');
  }

  try {
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder does not exist: ${folderPath}`);
    }

    // Get all JavaScript files recursively using glob's promise API
    const pattern = `${folderPath}/**/*.js`;
    if (options.verbose) {
      console.log(`🔍 Searching for JavaScript files matching: ${pattern}`);
    }
    
    const files = await glob(pattern, { nodir: true });
    
    if (files.length === 0) {
      const warning = '⚠️  No JavaScript files found in the specified directory';
      if (options.verbose) {
        console.warn(warning);
        console.log('  - Make sure the path is correct and contains .js files');
        console.log(`  - Current working directory: ${process.cwd()}`);
      } else {
        console.warn(warning);
      }
      return;
    }

    console.log(`📂 Found ${files.length} JavaScript files to process...`);
    if (options.verbose) {
      console.log('  First few files:');
      files.slice(0, 5).forEach((file, i) => console.log(`  ${i + 1}. ${file}`));
      console.log(`  ...and ${files.length - 5} more`);
    }
    
    // Process files in sequence to avoid rate limiting
    let successCount = 0;
    let errorCount = 0;
    
    for (const [index, file] of files.entries()) {
      const relativePath = path.relative(folderPath, file);
      const progress = `[${index + 1}/${files.length}]`;
      
      try {
        if (options.verbose) {
          console.log(`\n${progress} 📄 Processing: ${relativePath}`);
          console.log(`   📍 Full path: ${path.resolve(file)}`);
        } else {
          process.stdout.write(`\r${progress} Processing: ${relativePath}...`);
        }
        
        const fileContent = fs.readFileSync(file, 'utf8');
        
        if (options.verbose) {
          console.log(`   📊 File size: ${(fileContent.length / 1024).toFixed(2)} KB`);
          console.log('   🤖 Sending to AI for documentation...');
        }
        
        const prompt = `Generate comprehensive documentation for the following JavaScript file.
Include:
1. File purpose and functionality
2. Key functions/classes with descriptions
3. Inputs/outputs
4. Dependencies
5. Any important notes or warnings

File: ${relativePath}

${fileContent}`;
        
        const documentation = await callGemini(prompt);
        const outputPath = await writeMarkdown(file, documentation, options.output);
        
        if (options.verbose) {
          console.log(`   ✅ Successfully documented: ${path.relative(process.cwd(), outputPath)}`);
        }
        successCount++;
        
      } catch (error) {
        errorCount++;
        const errorMsg = `❌ Error processing ${relativePath}: ${error.message}`;
        if (options.verbose) {
          console.error(`\n${' '.repeat(progress.length + 1)}${errorMsg}`);
          console.error('   Stack:', error.stack?.split('\n')[1]?.trim() || 'No stack trace');
        } else {
          console.error(`\n${progress} ${errorMsg}`);
        }
      }
      
      // Add a small delay to avoid rate limiting
      if (index < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Print final summary
    console.log(`\n📊 Documentation generation complete!`);
    console.log(`✅ ${successCount} files successfully documented`);
    if (errorCount > 0) {
      console.warn(`⚠️  ${errorCount} files had errors (see above for details)`);
    }
    console.log(`📂 Output directory: ${path.resolve(options.output)}`);
    
  } catch (error) {
    console.error('\n❌ Analysis failed:', error.message);
    if (options.verbose) {
      console.error('Stack:', error.stack);
    }
    throw error; // Re-throw to allow CLI to handle the error
  }
}
