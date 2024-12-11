//*  This is a convex action (they call 3rd party services)

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// voncex imports 
import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateAudioAction = action({
    args: { input: v.string(), voice: v.string() },
    handler: async (_, { voice, input }) => {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: voice as SpeechCreateParams['voice'],
            input,
          });

          const buffer = await mp3.arrayBuffer();
          return buffer
    }
});