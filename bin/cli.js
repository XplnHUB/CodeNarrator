
import { Command } from 'commander';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeCodebase } from '../src/analyzer.js';

// Configure dotenv to load from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');

dotenv.config({ path: envPath });

const program = new Command();

function loadLocalConfig() {
  const configPath = path.resolve('.codenarratorrc.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      console.log('🛠️  Loaded config from .codenarratorrc.json');
      return config;
    } catch (err) {
      console.error('⚠️ Failed to parse .codenarratorrc.json:', err.message);
    }
  }
  return null;
}

// Add version from package.json
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../package.json');

async function main() {
  program
    .name('codenarrator')
    .version(version)
    .description('A tool that automatically generates documentation for JavaScript codebases using AI')
    .argument('[path]', 'path to code/project folder (or configure in .codenarratorrc.json)')
    .option('-o, --output <folder>', 'output folder for documentation')
    .option('--model <name>', 'AI model to use (currently only gemini is supported)')
    .option('--verbose', 'show detailed output')
    .action(async (pathArg, options) => {
      const config = loadLocalConfig() || {};
      try {
        console.log(`🚀 Starting CodeNarrator v${version}`);
        
        // Get values from CLI options, then config, then defaults
        const inputPath = pathArg || config?.input;
        const outputPath = options.output || config?.output || './docs';
        const model = options.model || config?.model || 'gemini';
        const verbose = options.verbose ?? config?.verbose ?? false;
        
        if (!inputPath) {
          console.error('❌ No input path provided. Use an argument or define `input` in .codenarratorrc.json');
          process.exit(1);
        }
        
        // Resolve to absolute paths
        const absolutePath = path.resolve(process.cwd(), inputPath);
        const absoluteOutput = path.resolve(process.cwd(), outputPath);
        
        if (verbose) {
          process.env.VERBOSE = 'true';
          console.log('🛠️  Loaded config from .codenarratorrc.json');
        }

        console.log(`📁 Input directory: ${absolutePath}`);
        console.log(`📄 Output directory: ${absoluteOutput}`);
        console.log(`🤖 Using model: ${model}`);
        console.log(verbose ? '🔍 Verbose mode: ON' : '🔇 Verbose mode: OFF');
        
        // Add a blank line before processing starts
        if (verbose) {
          console.log('\n🚀 Starting documentation generation...\n');
        }

        // Validate model
        if (model !== 'gemini') {
          console.warn('⚠️  Only the Gemini model is currently supported');
        }

        // Start analysis
        await analyzeCodebase(absolutePath, {
          output: absoluteOutput,
          model,
          verbose
        });

        console.log('✨ Documentation generation completed successfully!');
      } catch (error) {
        console.error('❌ Error:', error.message);
        if (options.verbose) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });

  // Handle unknown commands
  program.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
  });

  // Show help if no arguments provided
  if (process.argv.length <= 2) {
    program.help();
  }

  program.parse(process.argv);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the CLI
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
