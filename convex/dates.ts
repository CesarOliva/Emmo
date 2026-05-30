import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMoodsByMonth = query({
    args: {
        year: v.number(),
        month: v.number()
    }, handler: async (ctx, args) => {
       const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            return null;
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

export const getMoodByDate = query({
    args: {
        year: v.number(),
        month: v.number(),
        day: v.number(),
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            return null;
        }

        const userId = identity.subject;

        const date = `${args.year}-${String(args.month).padStart(2, "0")}-${String(args.day).padStart(2, "0")}`;

        const mood = await ctx.db.query("dates")
            .withIndex("by_user_date", (q)=>
                q.eq("userId", userId)
                .eq("date", date)
            )
            .first();

        return mood;
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
            return null;
        }

        const userId = identity.subject;

        const existing = await ctx.db.query("dates")
            .withIndex("by_user_date", (q)=>
                q.eq("userId", userId)
                .eq("date", `${args.year}-${String(args.month).padStart(2, "0")}-${String(args.day).padStart(2, "0")}`)
            )
            .first();

        if(existing){
            const updated = await ctx.db.patch("dates", existing._id, {
                mood: args.mood
            });

            return updated;
        }

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

export const addSong = mutation({
    args: {
        date: v.string(),
        song: v.object({
            name: v.string(),
            artist: v.string(),
            coverUrl: v.string(),
            durationMs: v.number()
        })
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            return null;
        }

        const userId = identity.subject;

        const existing = await ctx.db.query("dates")
            .withIndex("by_user_date", (q)=>
                q.eq("userId", userId)
                .eq("date", args.date)
            )
            .first();

        if(existing){
            const updated = await ctx.db.patch("dates", existing._id, {
                song: args.song
            });

            return updated;
        }

        return null;
    }
});

export const removeSong = mutation({
    args: {
        date: v.string(),
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            return null;
        }

        const userId = identity.subject;

        const existing = await ctx.db.query("dates")
            .withIndex("by_user_date", (q)=>
                q.eq("userId", userId)
                .eq("date", args.date)
            )
            .first();

        if(existing){
            const updated = await ctx.db.patch("dates", existing._id, {
                song: undefined
            });

            return updated;
        }

        return null;
    }
})

export const upsertNote = mutation({
    args: {
        date: v.string(),
        note: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const userId = identity.subject;

        const existing = await ctx.db.query("dates")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", userId)
                    .eq("date", args.date)
            )
            .first();

        if (existing) {
            return await ctx.db.patch("dates", existing._id, {
                note: args.note,
            });
        }

        return await ctx.db.insert("dates", {
            userId,
            date: args.date,
            mood: "",
            note: args.note,
        });
    },
});

export const getOrCreateActivity = mutation({
    args: {
        date: v.string(),
        name: v.string(),
        color: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject;

        let activity = await ctx.db.query("activities")
            .withIndex("by_user_name", q =>
                q.eq("userId", userId).eq("name", args.name)
            )
            .unique();

        if (!activity) {
            const activityId = await ctx.db.insert("activities", {
                userId,
                name: args.name,
                color: args.color,
            });

            activity = await ctx.db.get(activityId);
        }

        const day = await ctx.db.query("dates")
            .withIndex("by_user_date", q =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .unique();

        if (!day) throw new Error("Date not found");

        const activities = new Set(day.activities ?? []);
        activities.add(activity!._id);

        await ctx.db.patch(day._id, {
            activities: [...(day.activities ?? []), activity!._id],
        });

        return activity;
    },
});

export const getActivities = query({
    args: {
        date: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject;

        const date = await ctx.db.query("dates")
            .withIndex("by_user_date", q =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .first();

        const activities = date?.activities ?? [];

        const activityDetails = await Promise.all(
            activities.map(activityId => ctx.db.get(activityId))
        );

        activityDetails.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
        );

        return activityDetails
    }
})