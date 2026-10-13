export type Region = 'MB' | 'MN' | 'MT' | 'VIETLOTT';

export interface StationInfo {
  id: string;
  name: string;
  region: 'MB' | 'MN' | 'MT';
  drawTime: string;
  daysOfWeek: number[]; // 0: Sunday, 1: Monday, ..., 6: Saturday
}

export interface LotteryResultMB {
  id: string;
  date: string; // YYYY-MM-DD
  region: 'MB';
  stationName: string;
  specialCodes: string[]; // Ký hiệu vé đặc biệt ví dụ ['8K', '4D', '2P']
  prizes: {
    special: string[]; // 1 giải 5 số
    first: string[];   // 1 giải 5 số
    second: string[];  // 2 giải 5 số
    third: string[];   // 6 giải 5 số
    fourth: string[];  // 4 giải 4 số
    fifth: string[];   // 6 giải 4 số
    sixth: string[];   // 3 giải 3 số
    seventh: string[]; // 4 giải 2 số
  };
  headTail: {
    heads: Record<number, string[]>;
    tails: Record<number, string[]>;
  };
}

export interface PrizeMNMT {
  special: string[]; // 1 giải 6 số
  first: string[];   // 1 giải 5 số
  second: string[];  // 1 giải 5 số
  third: string[];   // 2 giải 5 số
  fourth: string[];  // 7 giải 5 số
  fifth: string[];   // 1 giải 4 số
  sixth: string[];   // 3 giải 4 số
  seventh: string[]; // 1 giải 3 số
  eighth: string[];  // 1 giải 2 số
}

export interface StationResultMNMT {
  stationId: string;
  stationName: string;
  prizes: PrizeMNMT;
  headTail: {
    heads: Record<number, string[]>;
    tails: Record<number, string[]>;
  };
}

export interface LotteryResultMNMT {
  id: string;
  date: string;
  region: 'MN' | 'MT';
  stations: StationResultMNMT[];
}

export interface VietlottDraw {
  id: string;
  drawNumber: string;
  date: string;
  type: 'mega645' | 'power655';
  winningNumbers: number[];
  specialNumber?: number; // Cho Power 6/55
  jackpot1Value: number;
  jackpot2Value?: number;
  jackpot1Winners: number;
  jackpot2Winners?: number;
}

export interface DreamBookEntry {
  id: string;
  title: string;
  category: 'dong_vat' | 'tai_loc' | 'doi_song' | 'thien_nhien' | 'con_nguoi';
  meaning: string;
  luckyNumbers: string[];
}

export interface LoGanItem {
  number: string;
  daysWithoutAppearance: number;
  maxHistoricalGap: number;
  lastAppearanceDate: string;
}

export interface LoFrequencyItem {
  number: string;
  appearanceCount: number;
  percentage: number;
}

export interface CheckTicketResult {
  isWinner: boolean;
  ticketNumber: string;
  stationName: string;
  date: string;
  region: Region;
  winningPrizes: {
    prizeName: string;
    prizeAmount: number;
    matchedNumbers: string;
    description: string;
  }[];
  totalPrize: number;
}
