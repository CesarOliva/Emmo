import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMoodsByMonth = query({
    args: {
        year: v.number(),
        month: v.number()
    }, handler: async (ctx, args) => {
       const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject;

        const start = `${args.year}-${String(args.month + 1).padStart(2, "0")}-01`;
        const end = `${args.year}-${String(args.month + 1).padStart(2, "0")}-31`;

        const moods =  await ctx.db.query("dates")
            .withIndex("by_user_date", (q)=>
                q.eq("userId", userId) //userId
                .gte("date", start)
                .lte("date", end)
            )
            .collect();

        return moods;
    }
})

export const registerMood = mutation({
    args: {
        year: v.number(),
        month: v.number(),
        day: v.number(),
        mood: v.string()
    }, handler: async(ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject;

        const mood = await ctx.db.insert("dates", {
            userId: userId,
            date: `${args.year}-${String(args.month).padStart(2, "0")}-${String(args.day).padStart(2, "0")}`,
            mood: args.mood,
        });

        return mood;
    }
})

export const deleteMood = mutation({
    args: {
        year: v.number(),
        month: v.number(),
        day: v.number(),
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject;

        const dateId = await ctx.db.query("dates")
            .withIndex("by_user_date", (q)=>
                q.eq("userId", userId)
                .eq("date", `${args.year}-${String(args.month).padStart(2, "0")}-${String(args.day).padStart(2, "0")}`)
            )
            .first();

        return await ctx.db.delete("dates", dateId!._id);
    }
})