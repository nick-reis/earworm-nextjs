import type { NextAuthConfig } from "next-auth";
import Spotify from "next-auth/providers/spotify";

export default {
  session: { strategy: "jwt" },
  providers: [
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope:
            "user-read-email user-read-private playlist-read-private user-top-read",
        },
      },
    }),
  ],
} satisfies NextAuthConfig;
