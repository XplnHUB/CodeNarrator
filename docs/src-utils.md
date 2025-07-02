```javascript
/**
 * @file utils.js
 * @description This file contains a collection of utility functions for common tasks.  These functions are designed to be reusable across different parts of the application.
 */

/**
 * Checks if a given value is a number.
 * 
 * @param {*} value - The value to check.
 * @returns {boolean} - True if the value is a number, false otherwise.
 */
function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}


/**
 * Clamps a number within a given range.
 *
 * @param {number} num - The number to clamp.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - The clamped number.  Returns NaN if input is invalid.
 * @throws {Error} If min is greater than max.
 */
function clamp(num, min, max) {
  if (min > max) {
    throw new Error("Minimum value cannot be greater than maximum value.");
  }
  if (!isNumber(num) || !isNumber(min) || !isNumber(max)) {
    return NaN; //Handle invalid input gracefully
  }
  return Math.min(Math.max(num, min), max);
}


/**
 * Generates a random integer within a specified range (inclusive).
 *
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} - A random integer between min and max. Returns NaN if input is invalid.
 * @throws {Error} if min is greater than max, or if either min or max are not numbers.
 */
function getRandomInt(min, max) {
  if (min > max) {
    throw new Error("Minimum value cannot be greater than maximum value.");
  }
  if (!isNumber(min) || !isNumber(max)) {
    return NaN;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Formats a number to a specified number of decimal places.
 *
 * @param {number} num - The number to format.
 * @param {number} decimals - The number of decimal places. Defaults to 2.
 * @returns {string} - The formatted number as a string. Returns "NaN" if input is invalid.
 */
function formatNumber(num, decimals = 2) {
  if (!isNumber(num) || !isNumber(decimals)) {
      return "NaN";
  }
  return num.toFixed(decimals);
}


// Export the functions
module.exports = {
  isNumber,
  clamp,
  getRandomInt,
  formatNumber
};
```


## utils.js Documentation

**1. File Purpose and Functionality:**

This file (`utils.js`) provides a collection of reusable utility functions for common tasks such as number validation, range clamping, random number generation, and number formatting.  These functions aim to improve code readability and maintainability by centralizing common operations.

**2. Key Functions/Classes:**

* **`isNumber(value)`:** Checks if a given value is a number (including handling of `Infinity` and `NaN`).  Returns `true` if it's a number, `false` otherwise.

* **`clamp(num, min, max)`:** Clamps a number within a specified range (`min` to `max`, inclusive). Returns the clamped number.  Throws an error if `min > max`, and returns `NaN` if any input is not a number.

* **`getRandomInt(min, max)`:** Generates a random integer between `min` and `max` (inclusive). Returns the random integer. Throws an error if `min > max`, and returns `NaN` if input is invalid.

* **`formatNumber(num, decimals = 2)`:** Formats a number to a specified number of decimal places.  Defaults to 2 decimal places. Returns the formatted number as a string; returns "NaN" if input is invalid.


**3. Inputs/Outputs:**

The input and output types for each function are described in the JSDoc comments within the code.  Generally, inputs are numbers, and outputs are either numbers, booleans, or strings depending on the function.  Error handling is implemented to return `NaN` or throw errors for invalid inputs where appropriate.


**4. Dependencies:**

This file has no external dependencies.  It relies only on built-in JavaScript functions like `typeof`, `isFinite`, `Math.min`, `Math.max`, `Math.random`, `Math.ceil`, `Math.floor`, and `toFixed`.

**5. Important Notes or Warnings:**

* Error handling is implemented to return `NaN` for invalid number inputs in `clamp`, `getRandomInt`, and `formatNumber` functions.  This allows calling functions to handle invalid input gracefully instead of crashing.
* The `getRandomInt` function uses `Math.random()`, which is a pseudo-random number generator.  For cryptographically secure random numbers, a different library should be used.
*  The `clamp` function throws an error if `min` is greater than `max` to prevent unexpected behavior.  This enforces correct usage.
* The `formatNumber` function returns a string, not a number.  If you need to perform further numerical operations, you should parse the string back into a number using `parseFloat`.

