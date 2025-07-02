import { callGemini, listAvailableModels } from './src/aiEngine.js';

console.log('🚀 Starting CodeNarrator Test Suite');
console.log('----------------------------------');

async function test() {
  try {
    console.log('🚀 Testing Gemini API connection...');
    
    // Test model connection
    console.log('\n🔍 Checking model access...');
    const models = await listAvailableModels();
    console.log('✅ Successfully connected to model:', models[0]?.name || 'Unknown');
    
    // Test a simple prompt
    console.log('\n🧪 Testing with a simple prompt...');
    const prompt = 'Explain what this code does in one sentence: `function add(a, b) { return a + b; }`';
    console.log(`📝 Prompt: "${prompt}"`);
    
    const response = await callGemini(prompt);
    console.log('\n🤖 Response:');
    console.log('---');
    console.log(response);
    console.log('---');
    
    console.log('\n✨ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the test
test().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});
