import axios from "axios";

// Вибираємо найкраще відео: офіційний Trailer → будь-який Trailer → офіційний Teaser → будь-який YouTube
function pickBestVideo(videos = []) {
  if (!Array.isArray(videos)) return null;
  const yt = videos.filter((v) => v.site === "YouTube");
  const byType = (type) => yt.filter((v) => (v.type || "").toLowerCase() === type);
  const first = (arr, officialOnly = false) =>
    officialOnly ? arr.find((v) => v.official) || null : arr[0] || null;

  const trailers = byType("trailer");
  const teasers = byType("teaser");

  return (
    first(trailers, true) ||
    first(trailers, false) ||
    first(teasers, true) ||
    first(teasers, false) ||
    yt[0] ||
    null
  );
}

export async function fetchTrailerOfTheDay({
  language = "uk-UA",
  region = "UA",
  maxProbe = 8, // скільки перших фільмів перевіряти на наявність трейлера
  cacheHours = 6,
} = {}) {
  const cacheKey = `trailer-of-the-day:v1:${language}:${region}:${maxProbe}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      const ageH = (Date.now() - ts) / 36e5;
      if (ageH < cacheHours) return data;
    }
  } catch {
    // ignore
  }

  // 1) Спроба: тренди за сьогодні
  let candidates = [];
  try {
    const { data } = await axios.get("/trending/movie/day", {
      params: { language },
    });
    candidates = Array.isArray(data?.results) ? data.results : [];
  } catch (e) {
    // ignore — підемо у fallback
  }

  // 2) Якщо тренди порожні — now_playing у регіоні
  if (candidates.length === 0) {
    try {
      const { data } = await axios.get("/movie/now_playing", {
        params: { language, region, page: 1 },
      });
      candidates = Array.isArray(data?.results) ? data.results : [];
    } catch (e) {
      // ignore
    }
  }

  // 3) Абсолютний fallback — популярні
  if (candidates.length === 0) {
    const { data } = await axios.get("/movie/popular", {
      params: { language, region, page: 1 },
    });
    candidates = Array.isArray(data?.results) ? data.results : [];
  }

  // Перебираємо перші N, шукаємо нормальний трейлер
  const probe = candidates.slice(0, maxProbe);

  // Спробуємо дістати одразу декілька мов для відео (щоб збільшити шанс знайти трейлер)
  const includeVideoLanguage = "uk,en,null";

  for (const m of probe) {
    try {
      const { data: details } = await axios.get(`/movie/${m.id}`, {
        params: {
          language,
          append_to_response: "videos",
          include_video_language: includeVideoLanguage,
        },
      });

      const videos = details?.videos?.results || [];
      const best = pickBestVideo(videos);
      if (best?.key) {
        const packed = {
          id: details.id,
          title: details.title || m.title,
          videoKey: best.key,
          videoName: best.name,
          videoSite: best.site,
          poster_path: details.poster_path ?? m.poster_path ?? null,
          backdrop_path: details.backdrop_path ?? m.backdrop_path ?? null,
          popularity: details.popularity ?? m.popularity ?? null,
          vote_average: details.vote_average ?? m.vote_average ?? null,
        };

        try {
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: packed }));
        } catch {
          // ignore cache errors
        }
        return packed;
      }
    } catch (e) {
      // move on to next candidate
    }
  }

  // Якщо так і не знайшли трейлер — віддамо null (компонент покаже заглушку)
  return null;
}