// @ts-check
import { GoogleGenerativeAI } from "@google/generative-ai";

// Model configuration - using the latest stable model
const MODEL_NAME = "gemini-2.5-flash";

// Cache for the initialized client and model
/** @type {GoogleGenerativeAI|null} */
let genAI = null;
/** @type {import('@google/generative-ai').GenerativeModel|null} */
let model = null;

/**
 * Gets or initializes the Gemini client
 * @returns {GoogleGenerativeAI} The initialized client
 * @throws {Error} If the API key is missing
 */
function getClient() {
  if (genAI) return genAI;
  
  // Read API key from environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Provide it via environment or a .env loaded by the CLI."
    );
  }

  // Initialize the Google Generative AI client
  genAI = new GoogleGenerativeAI(apiKey);
  
  // Log configuration in verbose mode only
  if (process.env.VERBOSE) {
    console.log("Gemini AI Configuration:");
    console.log(`- Model: ${MODEL_NAME}`);
    console.log(`- API Key: ${apiKey ? "Present" : "Missing"}`);
  }
  
  return genAI;
}

/**
 * Gets or initializes the Gemini model with configuration
 * @returns {import('@google/generative-ai').GenerativeModel} The configured model
 */
function getModel() {
  if (model) return model;
  
  // Get the Gemini client
  const client = getClient();
  
  // Get the Gemini Pro model with generation config
  model = client.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });
  
  return model;
}

/**
 * Generates content using the Gemini Pro model
 * @param {string} prompt - The prompt to send to the model
 * @returns {Promise<string>} The generated content
 * @throws {Error} If the API key is missing or the request fails
 */
export async function callGemini(prompt) {

  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Prompt must be a non-empty string");
  }

  try {
    if (process.env.VERBOSE) {
      console.log(`Using model: ${MODEL_NAME}`);
    }

    // Get the model (initializes if needed)
    const modelInstance = getModel();

    // Generate content
    if (process.env.VERBOSE) {
      console.log("Sending request to Gemini API...");
      console.log(
        `Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? "..." : ""}`
      );
    }

    const result = await modelInstance.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("No content generated - empty response");
    }

    if (process.env.VERBOSE) {
      console.log(`Received response (${text.length} characters)`);
    }

    return text;
  } catch (error) {
    console.error("Error calling Gemini API:");

    // Provide more detailed error information (handle unknown error type safely)
    let errorMessage = "Failed to generate content";
    /** @type {any} */
    const e = /** @type {any} */ (error);

    if (
      e &&
      typeof e === "object" &&
      "response" in e &&
      e.response &&
      typeof e.response === "object" &&
      "data" in e.response
    ) {
      errorMessage += `: ${JSON.stringify(e.response.data, null, 2)}`;
    } else if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
      errorMessage += `: ${e.message}`;
    } else {
      errorMessage += `: ${String(error)}`;
    }

    if (e && typeof e === "object" && "stack" in e && typeof e.stack === "string") {
      console.error("Stack trace:", e.stack);
    }

    throw new Error(errorMessage);
  }
}


export async function listAvailableModels() {
  try {
    console.log("Fetching available models...");

    // In the latest SDK, we don't have direct access to listModels
    // So we'll test with the default model
    console.log(`Testing with model: ${MODEL_NAME}`);

    // Test if we can use the model
    const modelInstance = getModel();
    await modelInstance.generateContent({
      contents: [{ role: "user", parts: [{ text: "Hello" }] }],
    });

    console.log(`Successfully connected to model: ${MODEL_NAME}`);
    return [{ name: MODEL_NAME }];
  } catch (error) {
    /** @type {any} */
    const e = /** @type {any} */ (error);
    const msg = e && typeof e === "object" && "message" in e && typeof e.message === "string" ? e.message : String(error);
    console.error("Error testing model access:", msg);
    throw new Error(`Failed to access model: ${msg}`);
  }
}
