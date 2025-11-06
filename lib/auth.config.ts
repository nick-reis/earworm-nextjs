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
          scope: [
            "user-read-email", // get user email for identification
            "user-read-private", // get user profile info
            "user-top-read", // access top artists and tracks
            "user-library-read", // read liked/saved tracks
            "user-read-recently-played", // read recently played tracks
            "playlist-read-private", // read private playlists
            "playlist-read-collaborative", // read collaborative playlists
            "playlist-modify-private", // create/edit private playlists
            "playlist-modify-public", // create/edit public playlists
            "ugc-image-upload", // upload playlist cover images
          ].join(" "),
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
} satisfies NextAuthConfig;
