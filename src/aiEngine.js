// @ts-check
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv to load from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Get the project root by going up one level from src directory
const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env');

console.log('🔍 Looking for .env file at:', envPath);

// Debug: Check if .env file exists
const fs = await import('fs');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env file not found at:', envPath);
  console.log('💡 Please create a .env file in your project root with:');
  console.log('GEMINI_API_KEY=your_actual_api_key_here');
  process.exit(1);
}

// Load environment variables
try {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded .env file from:', envPath);
} catch (error) {
  console.error('❌ Error loading .env file:', error.message);
  process.exit(1);
}

// Get and validate API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY is not set in .env file');
  console.log('💡 Please add this line to your .env file:');
  console.log('GEMINI_API_KEY=your_actual_api_key_here');
  process.exit(1);
}

console.log('🔑 Found GEMINI_API_KEY in .env file');

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Model configuration - using the latest stable model
const MODEL_NAME = "gemini-1.5-flash";

// Log configuration for debugging
console.log('🔧 Gemini AI Configuration:');
console.log(`- Model: ${MODEL_NAME}`);
console.log(`- API Key: ${apiKey ? '✅ Present' : '❌ Missing'}`);

/**
 * Generates content using the Gemini Pro model
 * @param {string} prompt - The prompt to send to the model
 * @returns {Promise<string>} The generated content
 * @throws {Error} If the API key is missing or the request fails
 */
export async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Prompt must be a non-empty string');
  }

  try {
    console.log(`🤖 Using model: ${MODEL_NAME}`);
    
    // Get the Gemini Pro model with generation config
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // Generate content
    if (process.env.VERBOSE) {
      console.log('📤 Sending request to Gemini API...');
      console.log(`📝 Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);
    }
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No content generated - empty response');
    }
    
    if (process.env.VERBOSE) {
      console.log(`✅ Received response (${text.length} characters)`);
    }
    
    return text;
  } catch (error) {
    console.error('❌ Error calling Gemini API:');
    
    // Provide more detailed error information
    let errorMessage = 'Failed to generate content';
    if (error.response) {
      errorMessage += `: ${JSON.stringify(error.response.data, null, 2)}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Lists all available models for the API key
 * @returns {Promise<Array>} List of available models
 */
export async function listAvailableModels() {
  try {
    console.log('Fetching available models...');
    
    // In the latest SDK, we don't have direct access to listModels
    // So we'll test with the default model
    console.log(`Testing with model: ${MODEL_NAME}`);
    
    // Test if we can use the model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    });
    
    console.log(`✅ Successfully connected to model: ${MODEL_NAME}`);
    return [{ name: MODEL_NAME }];
  } catch (error) {
    console.error('❌ Error testing model access:', error.message);
    throw new Error(`Failed to access model: ${error.message}`);
  }
}
