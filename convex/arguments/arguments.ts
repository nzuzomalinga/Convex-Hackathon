import { v } from "convex/values";

export const needsArgs = {
    userId: v.union(v.id("users")),
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
}

export const assistsArgs = {
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
    assist_used: v.boolean(),
    lat: v.number(),
    long: v.number(),
  }