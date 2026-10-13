import {
  LotteryResultMB,
  LotteryResultMNMT,
  StationResultMNMT,
  PrizeMNMT,
} from '../types/lottery';
import {
  computeHeadTail,
  generateMBResult,
  generateMNMTResult,
} from '../data/lotteryData';

export const DEFAULT_XOSO_API_KEY =
  'sk_live_97250c373468a418bbf785ddb229a12174b0a4967e3a29be8fb9cac0e551661a';

const API_BASE_URL = 'https://xosoapi.online/api/v1/vietnam/draws';

export function getStoredApiKey(): string {
  if (typeof window !== 'undefined') {
    const fromStorage = localStorage.getItem('xoso_api_key');
    if (fromStorage && fromStorage.trim()) return fromStorage.trim();
  }
  const fromEnv = import.meta.env.VITE_XOSO_API_KEY;
  if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.trim();
  }
  return DEFAULT_XOSO_API_KEY;
}

export function setStoredApiKey(key: string) {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('xoso_api_key', key.trim());
    } else {
      localStorage.removeItem('xoso_api_key');
    }
  }
}

// In-memory cache to prevent repetitive requests
const cache = new Map<string, any>();

interface RawPrizes {
  db?: string[];
  g1?: string[];
  g2?: string[];
  g3?: string[];
  g4?: string[];
  g5?: string[];
  g6?: string[];
  g7?: string[];
  g8?: string[];
  ma_db?: string[];
  jackpot?: string[];
}

interface RawProvinceItem {
  id: string | number;
  date?: string;
  formatted_date?: string;
  province?: {
    id: number;
    code: string;
    name: string;
  };
  prizes?: RawPrizes;
}

/**
 * Fetch and parse XSMB results from xosoapi.online
 */
export async function fetchLiveMBResult(
  dateStr: string,
  apiKey: string = getStoredApiKey()
): Promise<{ result: LotteryResultMB; isLive: boolean }> {
  const cacheKey = `MB_${dateStr}_${apiKey}`;
  if (cache.has(cacheKey)) {
    return { result: cache.get(cacheKey), isLive: true };
  }

  try {
    const url = `${API_BASE_URL}?region=MB&date=${dateStr}`;
    const res = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      const item: RawProvinceItem = data.data[0];
      const prizes = item.prizes || {};

      const special = prizes.db || [];
      const first = prizes.g1 || [];
      const second = prizes.g2 || [];
      const third = prizes.g3 || [];
      const fourth = prizes.g4 || [];
      const fifth = prizes.g5 || [];
      const sixth = prizes.g6 || [];
      const seventh = prizes.g7 || [];
      const specialCodes = prizes.ma_db || [];

      // If at least DB is present
      if (special.length > 0) {
        const allNumbers = [
          ...special,
          ...first,
          ...second,
          ...third,
          ...fourth,
          ...fifth,
          ...sixth,
          ...seventh,
        ];

        const headTail = computeHeadTail(allNumbers);

        const mbResult: LotteryResultMB = {
          id: `mb_live_${item.id || dateStr}`,
          date: dateStr,
          region: 'MB',
          stationName: item.province?.name || 'Miền Bắc',
          specialCodes: specialCodes.length > 0 ? specialCodes : ['1K', '2D', '3M'],
          prizes: {
            special,
            first,
            second,
            third,
            fourth,
            fifth,
            sixth,
            seventh,
          },
          headTail,
        };

        cache.set(cacheKey, mbResult);
        return { result: mbResult, isLive: true };
      }
    }
  } catch (error) {
    console.warn(`[xosoapi] Fetch MB failed for ${dateStr}, falling back to generator:`, error);
  }

  // Graceful fallback
  return { result: generateMBResult(dateStr), isLive: false };
}

/**
 * Fetch and parse XSMN or XSMT multi-station results from xosoapi.online
 */
export async function fetchLiveMNMTResult(
  dateStr: string,
  region: 'MN' | 'MT',
  apiKey: string = getStoredApiKey()
): Promise<{ result: LotteryResultMNMT; isLive: boolean }> {
  const cacheKey = `${region}_${dateStr}_${apiKey}`;
  if (cache.has(cacheKey)) {
    return { result: cache.get(cacheKey), isLive: true };
  }

  try {
    const url = `${API_BASE_URL}?region=${region}&date=${dateStr}`;
    const res = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      // The API returns either an array of province objects directly, or objects with `provinces` array
      let rawList: RawProvinceItem[] = [];

      if (data.data[0].provinces && Array.isArray(data.data[0].provinces)) {
        rawList = data.data[0].provinces;
      } else {
        rawList = data.data;
      }

      const stations: StationResultMNMT[] = rawList
        .filter((item) => item.prizes && item.prizes.db && item.prizes.db.length > 0)
        .map((item) => {
          const prizes = item.prizes || {};
          const eighth = prizes.g8 || [];
          const seventh = prizes.g7 || [];
          const sixth = prizes.g6 || [];
          const fifth = prizes.g5 || [];
          const fourth = prizes.g4 || [];
          const third = prizes.g3 || [];
          const second = prizes.g2 || [];
          const first = prizes.g1 || [];
          const special = prizes.db || [];

          const allNumbers = [
            ...eighth,
            ...seventh,
            ...sixth,
            ...fifth,
            ...fourth,
            ...third,
            ...second,
            ...first,
            ...special,
          ];

          const headTail = computeHeadTail(allNumbers);

          const stationPrizes: PrizeMNMT = {
            special,
            first,
            second,
            third,
            fourth,
            fifth,
            sixth,
            seventh,
            eighth,
          };

          return {
            stationId: item.province?.code || String(item.id),
            stationName: item.province?.name || (region === 'MN' ? 'Miền Nam' : 'Miền Trung'),
            prizes: stationPrizes,
            headTail,
          };
        });

      if (stations.length > 0) {
        const mnmtResult: LotteryResultMNMT = {
          id: `${region.toLowerCase()}_live_${dateStr}`,
          date: dateStr,
          region,
          stations,
        };

        cache.set(cacheKey, mnmtResult);
        return { result: mnmtResult, isLive: true };
      }
    }
  } catch (error) {
    console.warn(`[xosoapi] Fetch ${region} failed for ${dateStr}, falling back to generator:`, error);
  }

  // Graceful fallback
  return { result: generateMNMTResult(dateStr, region), isLive: false };
}
