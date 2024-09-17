import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { assistsArgs } from "./arguments/arguments";

export const listAssists = query({
    args: {},
    handler: async (ctx) => {
        const assists = await ctx.db.query("assists").order("desc").take(100);
        return assists
    },
});

export const sendAssists = mutation({
    args: assistsArgs,
    handler: async (ctx, { ...args }) => {

        const userId = await getAuthUserId(ctx); 
        
        if (userId === null) {

            throw new Error("Not signed in");
        }

        await ctx.db.insert("assists", args);
    },
});