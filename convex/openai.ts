//*  This is a convex action (they call 3rd party services)

// voncex imports 
import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateAudioAction = action({
    args: { input: v.string(), voice: v.string() },
    handler: async (_, args) => {
        
    }
});