import axios from "axios";

/**
 * Обирає найкращий трейлер з videos.results
 */
function pickBestTrailer(videos = []) {
  if (!Array.isArray(videos)) return null;
  const yt = videos.filter((v) => v.site === "YouTube");
  const officialTrailer = yt.find((v) => v.type === "Trailer" && v.official);
  if (officialTrailer) return officialTrailer;
  const anyTrailer = yt.find((v) => v.type === "Trailer");
  if (anyTrailer) return anyTrailer;
  return yt[0] || null;
}

/**
 * Повертає YYYY-MM-DD з будь-якого коректного формату дати або null
 */
function toDateOnly(dateTime) {
  if (!dateTime || typeof dateTime !== "string") return null;

  // Якщо вже YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateTime)) return dateTime;

  // Спробуємо взяти перші 10 символів як YYYY-MM-DD
  const s10 = dateTime.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s10)) return s10;

  // Спроба через Date і перетворення назад у ISO
  const dt = new Date(dateTime);
  if (!Number.isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);

  return null;
}

/**
 * Вибір релізної дати для регіону:
 * - region → US → перший доступний набір
 * - типи 1/3/2 (Premiere/Theatrical/Theatrical Limited)
 * - повертаємо найближчу МАЙБУТНЮ; якщо немає — найсвіжішу МИНУЛУ
 * - завжди YYYY-MM-DD або null
 */
function findRegionalReleaseDate(
  releaseDates,
  region = "UA",
  types = [1, 3, 2]
) {
  if (!releaseDates?.results) return null;

  const byRegion =
    releaseDates.results.find((r) => r.iso_3166_1 === region) ||
    releaseDates.results.find((r) => r.iso_3166_1 === "US") ||
    releaseDates.results[0];

  if (!byRegion?.release_dates?.length) return null;

  const normalized = byRegion.release_dates
    .filter((rd) => types.includes(rd.type))
    .map((rd) => {
      const d = toDateOnly(rd.release_date);
      if (!d) return null;
      const t = new Date(d);
      t.setHours(0, 0, 0, 0);
      return { dateOnly: d, time: t.getTime(), type: rd.type };
    })
    .filter(Boolean);

  if (normalized.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = today.getTime();

  const future = normalized
    .filter((x) => x.time >= now)
    .sort((a, b) => a.time - b.time);
  if (future.length > 0) return future[0].dateOnly;

  const past = normalized.sort((a, b) => b.time - a.time);
  return past[0].dateOnly;
}

/**
 * Найпопулярніша НОВА прем’єра у вибраному регіоні:
 * 1) Discover з ВІКНОМ ЗА РЕГІОНОМ: release_date.gte/lte + region + with_release_type=1|2|3
 * 2) Якщо немає — /movie/now_playing (регіон)
 * 3) Якщо немає — /movie/upcoming (регіон)
 * Потім тягнемо details з videos,release_dates і повертаємо нормалізовані дані.
 */
export async function fetchTopPremiere({
  region = "UA",
  days = 14,
  language = "uk-UA",
  cacheHours = 12,
} = {}) {
  // v3 — обходимо старі кеші
  const cacheKey = `top-premiere:v3:${region}:${days}:${language}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      const ageHours = (Date.now() - ts) / 36e5;
      if (ageHours < cacheHours) return data;
    }
  } catch {
    // ignore cache errors
  }

  const today = new Date();
  const to = new Date(today);
  to.setDate(today.getDate() + days);

  const fmt = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD

  // 1) Discover з регіональною датою релізу
  // ВАЖЛИВО: 'release_date' працює разом з 'region' — фільтрує саме за регіональною датою релізу.
  const discoverParams = {
    sort_by: "popularity.desc",
    include_adult: false,
    include_video: false,
    "release_date.gte": fmt(today),
    "release_date.lte": fmt(to),
    with_release_type: "1|2|3", // Premiere/Theatrical
    region,
    language,
    page: 1,
  };

  let top = null;

  try {
    const { data } = await axios.get("/discover/movie", {
      params: discoverParams,
    });
    if (Array.isArray(data?.results) && data.results.length > 0) {
      // Беремо ТОП-1 за популярністю у вікні нових релізів по регіону
      top = data.results[0];
    }
  } catch (e) {
    console.warn(
      "Discover (release_date.* + region) failed, fallback to now_playing:",
      e?.message
    );
  }

  // 2) Fallback: now_playing у регіоні (це точно нові/поточні релізи)
  if (!top) {
    try {
      const { data } = await axios.get("/movie/now_playing", {
        params: { region, language, page: 1 },
      });
      if (Array.isArray(data?.results) && data.results.length > 0) {
        top = [...data.results].sort(
          (a, b) => (b.popularity || 0) - (a.popularity || 0)
        )[0];
      }
    } catch (e) {
      console.warn("now_playing failed, fallback to upcoming:", e?.message);
    }
  }

  // 3) Останній fallback: upcoming
  if (!top) {
    try {
      const { data } = await axios.get("/movie/upcoming", {
        params: { region, language, page: 1 },
      });
      if (Array.isArray(data?.results) && data.results.length > 0) {
        top = [...data.results].sort(
          (a, b) => (b.popularity || 0) - (a.popularity || 0)
        )[0];
      }
    } catch (e) {
      console.error("Fallback /movie/upcoming failed:", e?.message);
      throw new Error("Неможливо завантажити прем’єри");
    }
  }

  // 4) Деталі з videos + release_dates
  try {
    const { data: details } = await axios.get(`/movie/${top.id}`, {
      params: {
        language,
        append_to_response: "videos,release_dates",
      },
    });

    const trailer = pickBestTrailer(details?.videos?.results || []);
    const regionalReleaseDate = findRegionalReleaseDate(
      details?.release_dates,
      region,
      [1, 3, 2]
    );

    // Якщо discover повернув регіональну дату в полі release_date — використаємо її в пріоритеті
    const windowReleaseDate = toDateOnly(top.release_date);
    const fallbackRelease = toDateOnly(details.release_date);

    const packed = {
      id: details.id,
      title: details.title,
      overview: details.overview,
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      popularity: details.popularity,
      vote_average: details.vote_average,
      // віддаємо релізну дату з вікна (регіон), якщо є; інакше з details
      release_date: windowReleaseDate || fallbackRelease, // YYYY-MM-DD або null
      regionalReleaseDate, // YYYY-MM-DD або null (з таблиці release_dates)
      trailer,
      details,
    };

    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ ts: Date.now(), data: packed })
      );
    } catch {
      // ignore cache errors
    }

    return packed;
  } catch (e) {
    console.error("Failed to get details/videos/release_dates:", e?.message);
    throw new Error("Не вдалося завантажити інформацію про прем’єру");
  }
}
