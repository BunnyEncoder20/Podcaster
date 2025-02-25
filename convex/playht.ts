"use node";

import * as PlayHT from "playht";
import { action } from "./_generated/server";
import { v } from "convex/values";

// import engine types
import { VoiceEngineType } from "@/types";

// Initialize PlayHT client
PlayHT.init({
  userId: process.env.PLAYHT_USER_ID!,
  apiKey: process.env.PLAYHT_API_KEY!,
  defaultVoiceId:
    "s3://peregrine-voices/oliver_narrative2_parrot_saad/manifest.json",
  defaultVoiceEngine: "PlayHT2.0",
});

export const fetchVoicesAction = action({
  args: {},
  handler: async () => {
    const url = "https://api.play.ht/api/v2/voices";

    // Validate environment variables
    const apiKey = process.env.PLAYHT_API_KEY;
    const userId = process.env.PLAYHT_USER_ID;
    if (!apiKey || !userId) {
      throw new Error(
        "PlayHT API credentials are missing. Check your environment variables."
      );
    }

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        AUTHORIZATION: apiKey,
        "X-USER-ID": userId,
      },
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        // Log the exact error details for debugging
        const errorBody = await response.text();
        console.error(
          `Error fetching voices: ${response.status} ${response.statusText} - ${errorBody}`
        );
        throw new Error(
          `Failed to fetch voices: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Return voices array
      // console.log(data)ff
      return data || [];
    } catch (error) {
      console.error("Error fetching PlayHT voices:", error);
      throw new Error("Failed to fetch voices. Please try again later.");
    }
  },
});

export const generateAudioAction = action({
  args: {
    text: v.string(),
    voice: v.optional(v.string()),
    engine: v.string(),
  },
  handler: async (_, { text, voice, engine }) => {
    try {
      // Use PlayHT's generate method
      const generated = await PlayHT.generate(text, {
        voiceEngine: engine as VoiceEngineType,
        voiceId: voice,
      });

      // Extract and return the audio URL
      const { audioUrl } = generated;
      if (!audioUrl) throw new Error("❌ [ERROR] no audio URL in response");

      return audioUrl;
    } catch (error) {
      console.error("❌ [ERROR] Error generating audio:", error);
      throw new Error("❌ [ERROR] Failed to generate audio");
    }
  },
});
