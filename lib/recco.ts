import { FeatureVector, normalizeReccoFeatures } from "./taste";

const RECCO_API_URL = "https://api.reccobeats.com/v1/audio-features";

interface ReccoApiItem {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
  [key: string]: unknown;
}

interface RawReccoFeatures {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
}

export async function fetchReccoFeatures(
  trackIds: string[]
): Promise<Map<string, FeatureVector>> {
  const result = new Map<string, FeatureVector>();

  // batch in chunks of 40 due to API limits
  for (let i = 0; i < trackIds.length; i += 40) {
    const chunk = trackIds.slice(i, i + 40);
    const query = new URLSearchParams();
    query.append("ids", chunk.join(","));

    const url = `${RECCO_API_URL}?${query.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("[Recco] error:", response.status, await response.text());
      continue;
    }

    const data = await response.json();

    console.log("Recco response for chunk:", data);

    const items = data.content ?? [];

    (items as ReccoApiItem[]).forEach((item: ReccoApiItem, idx: number) => {
      const spotifyId: string = chunk[idx];

      const raw: RawReccoFeatures = {
        acousticness: item.acousticness,
        danceability: item.danceability,
        energy: item.energy,
        instrumentalness: item.instrumentalness,
        liveness: item.liveness,
        loudness: item.loudness,
        speechiness: item.speechiness,
        tempo: item.tempo,
        valence: item.valence,
      };

      const vec: FeatureVector = normalizeReccoFeatures(raw);
      result.set(spotifyId, vec);
    });

    // small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 100));
  }

  return result;
}
