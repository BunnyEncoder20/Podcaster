import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    podcasts: defineTable({
        user: v.id('users'),
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        audioURL: v.optional(v.string()),
        audioStorageId: v.optional(v.id('_storage')),
        imgURL: v.optional(v.string()),
        imgStrorageId: v.optional(v.id('_storage')),

        author: v.optional(v.string()),
        authorId: v.string(),
        authorImageURL: v.string(),

        voicePrompt: v.string(),
        imagePrompt: v.string(),
        voiceType: v.string(),
        audioDuration: v.number(),
        views: v.number(),
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