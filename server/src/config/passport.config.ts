import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userService } from "../modules/user/user.service.js";
import { Role, AuthProvider } from "../../prisma/generated/prisma/index.js";
import prisma from "../../prisma/index.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found from Google profile"), undefined);
        }

        // Check if user exists
        let user = await userService.getUserByEmail(email);

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              firstName: profile.name?.givenName || profile.displayName || "GoogleUser",
              lastName: profile.name?.familyName || "",
              provider: AuthProvider.GOOGLE,
              providerId: profile.id,
              isEmailVerified: true,
              role: Role.USER,
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

export default passport;