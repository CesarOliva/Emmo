import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    dates: defineTable({
        userId: v.string(),
        date: v.string(),
        mood: v.string(),
        song: v.optional(
            v.object({
                name: v.string(),
                artist: v.string(),
                coverUrl: v.string(),
                durationMs: v.number(),
            })
        ),
        note: v.optional(v.string()),
        activities: v.optional(v.array(v.id("activities"))),
    })
    .index("by_user_date", ["userId", "date"]),

    activities: defineTable({
        userId: v.string(),
        name: v.string(),
        color: v.string()
    })
    .index("by_user", ["userId"])
    .index("by_user_name", ["userId", "name"]),
});