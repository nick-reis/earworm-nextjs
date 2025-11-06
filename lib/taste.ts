export type FeatureVector = {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
};

const FIELDS: (keyof FeatureVector)[] = [
  "acousticness",
  "danceability",
  "energy",
  "instrumentalness",
  "liveness",
  "loudness",
  "speechiness",
  "tempo",
  "valence",
];

export function normalizeReccoFeatures(raw: {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
}): FeatureVector {
  return {
    acousticness: raw.acousticness,
    danceability: raw.danceability,
    energy: raw.energy,
    instrumentalness: raw.instrumentalness,
    liveness: raw.liveness,
    loudness: (raw.loudness + 60) / 60, //Normalize loudness from -60 -> 0 to 0 -> 1
    speechiness: raw.speechiness,
    tempo: raw.tempo / 250, //Normalize tempo from 0 -> 250 to 0 -> 1
    valence: raw.valence,
  };
}

export function unnormalizeReccoFeatures(vec: FeatureVector): FeatureVector {
  return {
    acousticness: vec.acousticness,
    danceability: vec.danceability,
    energy: vec.energy,
    instrumentalness: vec.instrumentalness,
    liveness: vec.liveness,
    loudness: vec.loudness * 60 - 60, //Denormalize loudness from 0 -> 1 to -60 -> 0
    speechiness: vec.speechiness,
    tempo: vec.tempo * 250, //Denormalize tempo from 0 -> 1 to 0 -> 250
    valence: vec.valence,
  };
}

export function weightedMean(
  rows: { f: FeatureVector; w: number }[]
): FeatureVector {
  const acc: any = {};
  FIELDS.forEach((k) => (acc[k] = 0));
  let denom = 0;

  for (const r of rows) {
    denom += r.w;
    for (const k of FIELDS) {
      acc[k] += r.f[k] * r.w;
    }
  }

  if (denom === 0) return acc as FeatureVector;
  for (const k of FIELDS) {
    acc[k] /= denom;
  }

  return acc as FeatureVector;
}
