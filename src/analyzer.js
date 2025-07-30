import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { callGemini } from './aiEngine.js';
import { writeMarkdown } from './writer.js';

/**
 * Supported file extensions for multi-language documentation generation
 * Includes JavaScript, TypeScript, Python, Go, C/C++, Java, Kotlin, Ruby, Rust,
 * Swift, C#, PHP, Scala, Dart, Vue, HTML/CSS, and config/documentation formats.
 */
const supportedExtensions = [
  'js', 'ts', 'tsx', 'jsx',          // JavaScript / TypeScript
  'py',                              // Python
  'go',                              // Go
  'c', 'cpp', 'cc',                  // C / C++
  'java',                            // Java
  'kt', 'kts',                       // Kotlin
  'rb', 'erb',                       // Ruby / Rails
  'rs',                              // Rust
  'swift',                           // Swift
  'cs',                              // C#
  'php',                             // PHP
  'scala',                           // Scala
  'dart',                            // Dart
  'vue',                             // Vue.js
  'html', 'htm',                     // HTML
  'css', 'scss', 'sass',             // CSS / Sass
  'ejs', 'hbs', 'mustache',          // Template engines
  'json', 'yaml', 'yml',             // Config formats
  'md', 'toml', 'ini'                // Docs / config files
];

// Common directories to ignore (improve performance and avoid useless files)
const excludeFolders = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/out/**',
  '**/venv/**',
  '**/__pycache__/**'
];

/**
 * Analyzes a codebase and generates markdown documentation using AI
 * @param {string} folderPath - Path to the source code directory
 * @param {Object} options - Configuration options
 * @param {string} options.output - Output directory for documentation files
 * @param {string} [options.model='gemini'] - AI model to use (default: Gemini)
 * @param {boolean} [options.verbose=false] - Enable detailed logs
 */
export async function analyzeCodebase(folderPath, options = {}) {
  if (!folderPath || typeof folderPath !== 'string') {
    throw new Error('Invalid folder path');
  }

  if (!options.output) {
    throw new Error('Output directory must be specified');
  }

  try {
    // Ensure input directory exists
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder does not exist: ${folderPath}`);
    }

    // Build glob pattern to match multiple file types
    const pattern = `${folderPath}/**/*.+(${supportedExtensions.join('|')})`;

    if (options.verbose) {
      console.log(`🔍 Searching for supported files: ${pattern}`);
    }

    // Get all matching files (ignoring specified folders)
    const files = await glob(pattern, { nodir: true, ignore: excludeFolders });

    if (files.length === 0) {
      console.warn('⚠️  No supported files found in the specified directory');
      if (options.verbose) {
        console.log('  - Make sure the path contains source files');
        console.log(`  - Current working directory: ${process.cwd()}`);
      }
      return;
    }

    console.log(`📂 Found ${files.length} source files to process...`);

    if (options.verbose) {
      console.log('  Previewing first few files:');
      files.slice(0, 5).forEach((file, i) => console.log(`  ${i + 1}. ${file}`));
      if (files.length > 5) {
        console.log(`  ...and ${files.length - 5} more`);
      }
    }

    // Counters for summary
    let successCount = 0;
    let errorCount = 0;

    // Process each file one-by-one
    for (const [index, file] of files.entries()) {
      const relativePath = path.relative(folderPath, file);
      const progress = `[${index + 1}/${files.length}]`;

      try {
        // Log file being processed
        if (options.verbose) {
          console.log(`\n${progress} 📄 Processing: ${relativePath}`);
          console.log(`   📍 Full path: ${path.resolve(file)}`);
        } else {
          process.stdout.write(`\r${progress} Processing: ${relativePath}...`);
        }

        // Read file content
        const fileContent = fs.readFileSync(file, 'utf8');
        const fileExt = path.extname(file).slice(1).toUpperCase();

        // Prompt for AI model
        const prompt = `Generate comprehensive documentation for the following ${fileExt} file.
Include:
1. File purpose and role in the project
2. Key functions, classes, or modules and their responsibilities
3. Inputs, outputs, and side-effects
4. External libraries or dependencies used
5. Potential issues, improvements, or best practices

File: ${relativePath}

${fileContent}`;

        // Call AI model and write the result
        const documentation = await callGemini(prompt);
        const outputPath = await writeMarkdown(file, documentation, options.output);

        if (options.verbose) {
          console.log(`   ✅ Documentation saved at: ${path.relative(process.cwd(), outputPath)}`);
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

      // Delay between requests to avoid hitting rate limits
      if (index < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Final summary
    console.log(`\n📊 Documentation generation complete!`);
    console.log(`✅ ${successCount} files successfully documented`);
    if (errorCount > 0) {
      console.warn(`⚠️  ${errorCount} files failed (see above for details)`);
    }
    console.log(`📂 Output directory: ${path.resolve(options.output)}`);
  } catch (error) {
    // Catch and rethrow unexpected errors
    console.error('\n❌ Analysis failed:', error.message);
    if (options.verbose) {
      console.error('Stack:', error.stack);
    }
    throw error;
  }
}
