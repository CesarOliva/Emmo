import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    dates: defineTable({
        userId: v.string(),
        date: v.string(),
        mood: v.string(),
    })
    .index("by_user_date", ["userId", "date"]),
});