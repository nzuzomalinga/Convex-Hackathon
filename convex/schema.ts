import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.


export default defineSchema({
  ...authTables,
  messages: defineTable({
    userId: v.id("users"),
    body: v.string(),
  }),
  needs: defineTable({
    userId: v.id("users"),
    need: v.union(
      v.literal("food"),
      v.literal("shelter"),
      v.literal("water"),
      v.literal("security"),
    ),
    need_met: v.boolean(),
    email: v.string(),
    phone: v.string(),
    name: v.string(),
    lat: v.number(),
    long: v.number(),
  }),
  assists: defineTable({
    userId: v.id("users"),
    email: v.string(),
    phone: v.string(),
    name: v.string(),
    need: v.union(
      v.literal("food"),
      v.literal("shelter"),
      v.literal("water"),
      v.literal("security"),
    ),
    lat: v.number(),
    long: v.number(),
    assist_used: v.boolean()
  })
});
