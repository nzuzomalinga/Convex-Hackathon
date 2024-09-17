import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";

const googleClientOptions = { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Google(googleClientOptions), Resend]});