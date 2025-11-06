"use server";

import { prisma } from "../prisma";
import { fetchReccoFeatures } from "../recco";
import { FeatureVector, weightedMean } from "../taste";
import { requireSession } from "./auth";

export async function createTasteProfile() {
  const session = await requireSession();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  const accessToken = (session as any).accessToken;

  if (!accessToken) {
    throw new Error("Missing Spotify token");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { TasteProfile: true },
  });
  if (!user) throw new Error("Unauthorized");

  if (user.hasTasteProfile) {
    return user.TasteProfile;
  }

  const spotifyGet = async (url: string) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const [topShort, topMedium, topLong] = await Promise.all([
    spotifyGet(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50"
    ),
    spotifyGet(
      "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50"
    ),
    spotifyGet(
      "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50"
    ),
  ]);

  const liked = await spotifyGet(
    "https://api.spotify.com/v1/me/tracks?limit=50"
  );
  const recent = await spotifyGet(
    "https://api.spotify.com/v1/me/player/recently-played?limit=50"
  );

  const idsFrom = (items: any[], mode: "self" | "track") =>
    mode === "self"
      ? items.map((t: any) => t.id)
      : items.map((i: any) => i.track.id);

  const shortIds = idsFrom(topShort.items ?? [], "self");
  const medIds = idsFrom(topMedium.items ?? [], "self");
  const longIds = idsFrom(topLong.items ?? [], "self");
  const likedIds = idsFrom(liked.items ?? [], "track");
  const recentIds = idsFrom(recent.items ?? [], "track");

  const allIds = Array.from(
    new Set([...shortIds, ...medIds, ...longIds, ...likedIds, ...recentIds])
  );
  if (!allIds.length) {
    return;
  }

  const featureMap = await fetchReccoFeatures(allIds);

  type Row = { f: FeatureVector; w: number };
  const rows: Row[] = [];

  const add = (ids: string[], weight: number) => {
    for (const id of ids) {
      const f = featureMap.get(id);
      if (!f) continue;
      rows.push({ f, w: weight });
    }
  };

  add(likedIds, 4);
  add(shortIds, 3);
  add(medIds, 2);
  add(longIds, 1);
  add(recentIds, 0.75);

  if (!rows.length) return;

  const vector = weightedMean(rows);

  await prisma.tasteProfile.upsert({
    where: { userId: user.id },
    update: { vectorJson: vector },
    create: { userId: user.id, vectorJson: vector },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { hasTasteProfile: true },
  });
}
