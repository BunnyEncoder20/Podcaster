'use node'

import * as PlayHT from 'playht';
import { action } from "./_generated/server";
import { v } from "convex/values";
import { VoiceEngineType } from "@/types";

PlayHT.init({
  userId: process.env.PLAYHT_USER_ID!,
  apiKey: process.env.PLAYHT_API_KEY!,
  defaultVoiceId: 's3://peregrine-voices/oliver_narrative2_parrot_saad/manifest.json',
  defaultVoiceEngine: 'PlayDialog',
});

export const streamAudioAction = action({
  args: { text: v.string(), voiceEngine: v.string() },
  handler: async (_, { text, voiceEngine }: { text: string; voiceEngine: VoiceEngineType }) => {
    try {
      const stream = await PlayHT.stream(text, { voiceEngine });

      // Accumulate audio chunks from the stream
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      // Wait for the stream to end and return the combined audio buffer
      return new Promise<Buffer>((resolve, reject) => {
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', (err) => reject(err));
      });
    } catch (error) {
      console.error("Error streaming audio from PlayHT:", error);
      throw new Error("Failed to generate audio.");
    }
  },
});