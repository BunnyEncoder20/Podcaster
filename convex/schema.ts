import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    podcasts: defineTable({
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        audioURL: v.optional(v.string()),
        audioStorageId: v.optional(v.id('_storage')),
        imageURL: v.optional(v.string()),
        imageStorageId: v.optional(v.id('_storage')),
        voicePrompt: v.string(),
        imagePrompt: v.string(),
        voiceType: v.string(),
        audioDuration: v.number(),
        views: v.number(),

        user: v.id('users'),
        author: v.optional(v.string()),
        authorId: v.string(),
        authorImageURL: v.string(),
    })
    .searchIndex('search_author', { searchField: 'author'})
    .searchIndex('search_title', { searchField: 'podcastTitle'})
    .searchIndex('search_body', { searchField: 'podcastDescription'}), // don't forget this comma here

    users: defineTable({
        email: v.string(),
        imageURL: v.string(),
        clerkId: v.string(),
        name: v.string()
    })
})