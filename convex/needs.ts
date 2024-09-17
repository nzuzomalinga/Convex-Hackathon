import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { needsArgs } from "./arguments/arguments";

export const listNeeds = query({
    args: {},
    handler: async (ctx) => {
        // Grab the most recent needs.
        const needs = await ctx.db.query("needs").order("desc").take(100);
        return needs
    },
});

export const sendNeeds = mutation({
    args: needsArgs,
    handler: async (ctx, { ...args }) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new Error("Not signed in");
        }
        // Send a new message.
        await ctx.db.insert("needs", args);
    },
});
