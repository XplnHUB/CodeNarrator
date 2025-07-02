# analyzer.js Documentation

## File Purpose and Functionality

This JavaScript file (`analyzer.js`) provides a function to analyze a JavaScript codebase and automatically generate documentation for each `.js` file. It uses an AI model (defaulting to Gemini) to generate the documentation and then writes the output to Markdown files in a specified output directory.  The process includes error handling and progress reporting.

## Key Functions/Classes

The primary function is `analyzeCodebase`.

### `analyzeCodebase(folderPath, options = {})`

This asynchronous function is the core of the module. It orchestrates the entire documentation generation process.

* **Inputs:**
    * `folderPath` (string): The absolute or relative path to the folder containing the JavaScript codebase.  **Required.**
    * `options` (object, optional): An object containing optional settings:
        * `output` (string): The directory where the generated Markdown documentation files will be saved.  **Required.**
        * `model` (string, optional): The name of the AI model to use. Defaults to `'gemini'`.
        * `verbose` (boolean, optional): Enables verbose logging, showing detailed progress and error messages. Defaults to `false`.

* **Outputs:**
    * `Promise<void>`: The function returns a Promise that resolves when the analysis is complete.  It doesn't return a specific value, but logs the results to the console.  It rejects the promise if a critical error occurs.

* **Functionality:**
    1. **Input Validation:** Checks if `folderPath` and `options.output` are valid.
    2. **File Discovery:** Uses `glob` to recursively find all `.js` files within the specified folder.
    3. **Sequential Processing:** Iterates through each JavaScript file, processing them one by one to avoid exceeding potential rate limits of the AI service.
    4. **AI Interaction:** For each file, it constructs a prompt containing the file's relative path and content, and sends it to the AI model using `callGemini` (from `aiEngine.js`).
    5. **Documentation Writing:** It receives the documentation from the AI, and uses `writeMarkdown` (from `writer.js`) to save it as a Markdown file.
    6. **Error Handling:** Includes comprehensive error handling for file system operations and AI interactions.
    7. **Progress Reporting:** Provides progress updates to the console, including success and error counts.


## Dependencies

* `fs`: Node.js built-in file system module.
* `path`: Node.js built-in path module.
* `glob`:  The `glob` package (needs to be installed: `npm install glob`) for finding files matching a pattern.
* `./aiEngine.js`:  A custom module (not included in this example) that handles communication with the AI model (e.g., Gemini).  It must export a function called `callGemini`.
* `./writer.js`: A custom module (not included in this example) that handles writing the generated documentation to Markdown files. It must export a function called `writeMarkdown`.


## Important Notes and Warnings

* **AI Model Dependency:** This script relies on an external AI service (`aiEngine.js`). Ensure that `aiEngine.js` is correctly configured and functioning.  You'll need an API key or other credentials to access the AI service.
* **Error Handling:** While the script includes error handling, unexpected issues with the AI service or file system could still occur.  Check the console output for error messages if the analysis fails.
* **Rate Limiting:** The script includes a small delay between processing files to help mitigate rate limits imposed by the AI service.  Adjust the delay (currently 500ms) if necessary.
* **Output Directory:** Make sure the specified output directory exists and is writable. The script does *not* create the output directory automatically.
* **Verbose Mode:** The `verbose` option provides detailed logging, which can be helpful for debugging but might produce a large amount of output.
* **File Size:** Very large files might cause issues with the AI service or consume excessive resources.  Consider adding checks for file size or splitting very large files before processing.
* **Dependencies Installation:** Remember to install the necessary packages using `npm install glob`.


This documentation provides a comprehensive overview of the `analyzer.js` file.  Remember to consult the documentation for the `aiEngine.js` and `writer.js` modules for more details on their functionality and requirements.
