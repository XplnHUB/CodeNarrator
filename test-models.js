import { callGemini, listAvailableModels } from './src/aiEngine.js';

console.log('Starting CodeNarrator Test Suite');
console.log('----------------------------------');

// Check if API key is available before running tests
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not found in environment. Skipping tests.');
  console.log('To run tests, set the API key using one of these methods:');
  console.log('  - Export in shell: export GEMINI_API_KEY=your_key');
  console.log('  - Run with inline env: GEMINI_API_KEY=your_key npm test');
  console.log('  - Create a .env file and run: node -r dotenv/config test-models.js');
  process.exit(0); // Exit gracefully
}

async function test() {
  try {
    console.log('Testing Gemini API connection...');
    
    // Test model connection
    console.log('\nChecking model access...');
    const models = await listAvailableModels();
    console.log('Successfully connected to model:', models[0]?.name || 'Unknown');
    
    // Test a simple prompt
    console.log('\nTesting with a simple prompt...');
    const prompt = 'Explain what this code does in one sentence: `function add(a, b) { return a + b; }`';
    console.log(`Prompt: "${prompt}"`);
    
    const response = await callGemini(prompt);
    console.log('\nResponse:');
    console.log('---');
    console.log(response);
    console.log('---');
    
    console.log('\nTests passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    return false; // Return failure without exiting
  }
  return true; // Return success
}

// Run the test
test().then(success => {
  if (!success) {
    console.error('Tests failed');
    process.exit(1);
  }
  console.log('All tests completed successfully!');
}).catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});
