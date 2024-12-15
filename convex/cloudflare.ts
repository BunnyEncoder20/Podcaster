import { v } from "convex/values";
import { action } from "./_generated/server";

export const generateImageAction = action({
  args: {
    prompt: v.string(),
    steps: v.optional(v.number()),
  },
  handler: async (_, { prompt, steps=4 }) => {
    try {
      // Define your API endpoint with account ID
      const API_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_USER_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

      // Set up the request options
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLOUDFLARE_WORKERS_AI_API_TOKEN}`,
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
      // console.log(data)
      // Extract and return the generated image data
      const { result } = data;
      if (!result || !result.image) {
        throw new Error("No image data found in the response");
      }

      // Extract the base64 string and convert to buffer
      // Decode base64 to binary
      const base64Image = result.image;
      const binaryString = atob(base64Image); // Decode base64
      const buffer = new ArrayBuffer(binaryString.length);
      const view = new Uint8Array(buffer);

      for (let i = 0; i < binaryString.length; i++) {
        view[i] = binaryString.charCodeAt(i);
      }

      return buffer 

    } catch (error) {
      console.error("❌ [ERROR] Error generating image:", error);
      throw new Error("Failed to generate image");
    }
  },
});