import { v } from "convex/values";
import { action } from "./_generated/server";
import fetch from "node-fetch"; // Assuming you're using node-fetch or equivalent

export const generateImageAction = action({
  args: {
    prompt: v.string(),
    steps: v.optional(v.number()), // Optional steps parameter
  },
  handler: async (_, { prompt, steps = 4 }) => {
    try {
      // Define your API endpoint and account ID
      const ACCOUNT_ID = "your_account_id"; // Replace with your Cloudflare account ID
      const API_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

      // Set up the request options
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`, // Use an environment variable for security
        },
        body: JSON.stringify({
          prompt,
          steps,
        }),
      };

      // Make the API request
      const response = await fetch(API_ENDPOINT, options);

      // Parse the response
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Cloudflare AI Error: ${response.statusText} - ${errorDetails}`);
      }

      const data = await response.json();

      // Extract and return the generated image data
      const { result } = data;
      if (!result || !result.image) {
        throw new Error("No image data found in the response");
      }

      return result.image; // This should be the URL or image data
    } catch (error) {
      console.error("❌ [ERROR] Error generating image:", error);
      throw new Error("Failed to generate image");
    }
  },
});