'use node'

import * as PlayHT from 'playht';
import { action } from "./_generated/server";
import { v } from "convex/values";
import { VoiceEngineType } from "@/types";

// Initialize PlayHT client
PlayHT.init({
  userId: process.env.PLAYHT_USER_ID!,
  apiKey: process.env.PLAYHT_API_KEY!,
  defaultVoiceId: 's3://peregrine-voices/oliver_narrative2_parrot_saad/manifest.json',
  defaultVoiceEngine: 'PlayDialog',
});


export const generateAudioAction = action({
  args: { 
    text: v.string(), 
    voice: v.optional(v.string()) 
  },
  handler: async (_, { text, voice }) => {
    try {
      // Use PlayHT's generate method
      const generated = await PlayHT.generate(text,{
        voiceEngine: 'PlayHT2.0',
        voiceId: 's3://peregrine-voices/oliver_narrative2_parrot_saad/manifest.json',
        // outputFormat: 'mp3',
        // temperature: 1.5,
        // quality: 'high',
        // speed: 0.8,
      });

      // Extract and return the audio URL
      const { audioUrl } = generated;
      if (!audioUrl) throw new Error('❌ [ERROR] no audio URL in response');

      return audioUrl;
    } catch (error) {
      console.error('❌ [ERROR] Error generating audio:', error);
      throw new Error('❌ [ERROR] Failed to generate audio');
    }
  },
});