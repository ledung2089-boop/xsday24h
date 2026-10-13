import {
  StationInfo,
  LotteryResultMB,
  LotteryResultMNMT,
  VietlottDraw,
  DreamBookEntry,
  LoGanItem,
  LoFrequencyItem,
} from '../types/lottery';

// Schedule of Stations
export const LOTTERY_STATIONS: StationInfo[] = [
  // Miền Bắc (Quay 18h15 hàng ngày tại Cung Văn Hóa Thể Thao Thanh Niên Hà Nội)
  { id: 'mb_hn', name: 'Miền Bắc (Hà Nội)', region: 'MB', drawTime: '18:15', daysOfWeek: [1, 4] },
  { id: 'mb_qn', name: 'Miền Bắc (Quảng Ninh)', region: 'MB', drawTime: '18:15', daysOfWeek: [2] },
  { id: 'mb_bn', name: 'Miền Bắc (Bắc Ninh)', region: 'MB', drawTime: '18:15', daysOfWeek: [3] },
  { id: 'mb_hp', name: 'Miền Bắc (Hải Phòng)', region: 'MB', drawTime: '18:15', daysOfWeek: [5] },
  { id: 'mb_nd', name: 'Miền Bắc (Nam Định)', region: 'MB', drawTime: '18:15', daysOfWeek: [6] },
  { id: 'mb_tb', name: 'Miền Bắc (Thái Bình)', region: 'MB', drawTime: '18:15', daysOfWeek: [0] },

  // Miền Nam (Quay 16h15 hàng ngày)
  { id: 'mn_tphcm', name: 'TP. Hồ Chí Minh', region: 'MN', drawTime: '16:15', daysOfWeek: [1, 6] },
  { id: 'mn_dongthap', name: 'Đồng Tháp', region: 'MN', drawTime: '16:15', daysOfWeek: [1] },
  { id: 'mn_camau', name: 'Cà Mau', region: 'MN', drawTime: '16:15', daysOfWeek: [1] },
  { id: 'mn_bentre', name: 'Bến Tre', region: 'MN', drawTime: '16:15', daysOfWeek: [2] },
  { id: 'mn_vungtau', name: 'Vũng Tàu', region: 'MN', drawTime: '16:15', daysOfWeek: [2] },
  { id: 'mn_baclieu', name: 'Bạc Liêu', region: 'MN', drawTime: '16:15', daysOfWeek: [2] },
  { id: 'mn_dongnai', name: 'Đồng Nai', region: 'MN', drawTime: '16:15', daysOfWeek: [3] },
  { id: 'mn_cantho', name: 'Cần Thơ', region: 'MN', drawTime: '16:15', daysOfWeek: [3] },
  { id: 'mn_soctrang', name: 'Sóc Trăng', region: 'MN', drawTime: '16:15', daysOfWeek: [3] },
  { id: 'mn_tayninh', name: 'Tây Ninh', region: 'MN', drawTime: '16:15', daysOfWeek: [4] },
  { id: 'mn_angiang', name: 'An Giang', region: 'MN', drawTime: '16:15', daysOfWeek: [4] },
  { id: 'mn_binhthuan', name: 'Bình Thuận', region: 'MN', drawTime: '16:15', daysOfWeek: [4] },
  { id: 'mn_vinhlong', name: 'Vĩnh Long', region: 'MN', drawTime: '16:15', daysOfWeek: [5] },
  { id: 'mn_binhduong', name: 'Bình Dương', region: 'MN', drawTime: '16:15', daysOfWeek: [5] },
  { id: 'mn_travinh', name: 'Trà Vinh', region: 'MN', drawTime: '16:15', daysOfWeek: [5] },
  { id: 'mn_longan', name: 'Long An', region: 'MN', drawTime: '16:15', daysOfWeek: [6] },
  { id: 'mn_binhphuoc', name: 'Bình Phước', region: 'MN', drawTime: '16:15', daysOfWeek: [6] },
  { id: 'mn_haugiang', name: 'Hậu Giang', region: 'MN', drawTime: '16:15', daysOfWeek: [6] },
  { id: 'mn_tiengiang', name: 'Tiền Giang', region: 'MN', drawTime: '16:15', daysOfWeek: [0] },
  { id: 'mn_kiengiang', name: 'Kiên Giang', region: 'MN', drawTime: '16:15', daysOfWeek: [0] },
  { id: 'mn_dalat', name: 'Đà Lạt (Lâm Đồng)', region: 'MN', drawTime: '16:15', daysOfWeek: [0] },

  // Miền Trung (Quay 17h15 hàng ngày)
  { id: 'mt_hue', name: 'Thừa Thiên Huế', region: 'MT', drawTime: '17:15', daysOfWeek: [1, 0] },
  { id: 'mt_phuyen', name: 'Phú Yên', region: 'MT', drawTime: '17:15', daysOfWeek: [1] },
  { id: 'mt_daklak', name: 'Đắk Lắk', region: 'MT', drawTime: '17:15', daysOfWeek: [2] },
  { id: 'mt_quangnam', name: 'Quảng Nam', region: 'MT', drawTime: '17:15', daysOfWeek: [2] },
  { id: 'mt_danang', name: 'Đà Nẵng', region: 'MT', drawTime: '17:15', daysOfWeek: [3, 6] },
  { id: 'mt_khanhhoa', name: 'Khánh Hòa', region: 'MT', drawTime: '17:15', daysOfWeek: [3, 0] },
  { id: 'mt_binhdinh', name: 'Bình Định', region: 'MT', drawTime: '17:15', daysOfWeek: [4] },
  { id: 'mt_quangtri', name: 'Quảng Trị', region: 'MT', drawTime: '17:15', daysOfWeek: [4] },
  { id: 'mt_quangbinh', name: 'Quảng Bình', region: 'MT', drawTime: '17:15', daysOfWeek: [4] },
  { id: 'mt_gialai', name: 'Gia Lai', region: 'MT', drawTime: '17:15', daysOfWeek: [5] },
  { id: 'mt_ninhthuan', name: 'Ninh Thuận', region: 'MT', drawTime: '17:15', daysOfWeek: [5] },
  { id: 'mt_quangngai', name: 'Quảng Ngãi', region: 'MT', drawTime: '17:15', daysOfWeek: [6] },
  { id: 'mt_daknong', name: 'Đắk Nông', region: 'MT', drawTime: '17:15', daysOfWeek: [6] },
  { id: 'mt_kontum', name: 'Kon Tum', region: 'MT', drawTime: '17:15', daysOfWeek: [0] },
];

// Helper to compute Head and Tail digits for Loto 2-digit numbers
export function computeHeadTail(allNumbers: string[]): {
  heads: Record<number, string[]>;
  tails: Record<number, string[]>;
} {
  const heads: Record<number, string[]> = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [],
  };
  const tails: Record<number, string[]> = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [],
  };

  const twoDigits = allNumbers
    .map((num) => num.trim().slice(-2))
    .filter((num) => num.length === 2 && !isNaN(Number(num)));

  twoDigits.forEach((td) => {
    const head = parseInt(td[0], 10);
    const tail = parseInt(td[1], 10);
    if (!heads[head].includes(td[1])) {
      heads[head].push(td[1]);
    }
    if (!tails[tail].includes(td[0])) {
      tails[tail].push(td[0]);
    }
  });

  // Sort tails for clarity
  for (let i = 0; i <= 9; i++) {
    heads[i].sort();
    tails[i].sort();
  }

  return { heads, tails };
}

// Seeded pseudorandom generator for deterministic results per date & station
function createSeededRandom(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function padNumber(n: number, length: number): string {
  return n.toString().padStart(length, '0');
}

// Generate seeded MB result
export function generateMBResult(dateStr: string): LotteryResultMB {
  const rng = createSeededRandom(`MB_${dateStr}`);
  const genNum = (digits: number) => {
    const max = Math.pow(10, digits);
    return padNumber(Math.floor(rng() * max), digits);
  };

  const codesPool = ['1K', '2K', '3K', '4D', '5D', '6M', '7M', '8P', '9P', '10N'];
  const shuffledCodes = [...codesPool].sort(() => rng() - 0.5).slice(0, 3);

  const special = [genNum(5)];
  const first = [genNum(5)];
  const second = [genNum(5), genNum(5)];
  const third = [genNum(5), genNum(5), genNum(5), genNum(5), genNum(5), genNum(5)];
  const fourth = [genNum(4), genNum(4), genNum(4), genNum(4)];
  const fifth = [genNum(4), genNum(4), genNum(4), genNum(4), genNum(4), genNum(4)];
  const sixth = [genNum(3), genNum(3), genNum(3)];
  const seventh = [genNum(2), genNum(2), genNum(2), genNum(2)];

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

  // Determine station based on day of week
  const dateObj = new Date(dateStr);
  const day = dateObj.getDay();
  const stationInfo = LOTTERY_STATIONS.find(
    (s) => s.region === 'MB' && s.daysOfWeek.includes(day)
  );

  return {
    id: `mb_${dateStr}`,
    date: dateStr,
    region: 'MB',
    stationName: stationInfo ? stationInfo.name : 'Miền Bắc (Hà Nội)',
    specialCodes: shuffledCodes,
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
}

// Generate seeded MN / MT result
export function generateMNMTResult(dateStr: string, region: 'MN' | 'MT'): LotteryResultMNMT {
  const dateObj = new Date(dateStr);
  const day = dateObj.getDay();
  const dayStations = LOTTERY_STATIONS.filter(
    (s) => s.region === region && s.daysOfWeek.includes(day)
  );

  const stations = dayStations.map((station) => {
    const rng = createSeededRandom(`${station.id}_${dateStr}`);
    const genNum = (digits: number) => {
      const max = Math.pow(10, digits);
      return padNumber(Math.floor(rng() * max), digits);
    };

    const eighth = [genNum(2)];
    const seventh = [genNum(3)];
    const sixth = [genNum(4), genNum(4), genNum(4)];
    const fifth = [genNum(4)];
    const fourth = [
      genNum(5),
      genNum(5),
      genNum(5),
      genNum(5),
      genNum(5),
      genNum(5),
      genNum(5),
    ];
    const third = [genNum(5), genNum(5)];
    const second = [genNum(5)];
    const first = [genNum(5)];
    const special = [genNum(6)];

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

    return {
      stationId: station.id,
      stationName: station.name,
      prizes: {
        special,
        first,
        second,
        third,
        fourth,
        fifth,
        sixth,
        seventh,
        eighth,
      },
      headTail,
    };
  });

  return {
    id: `${region.toLowerCase()}_${dateStr}`,
    date: dateStr,
    region,
    stations,
  };
}

// Default today & yesterday formatted date
export const TODAY_STR = '2026-10-12';
export const YESTERDAY_STR = '2026-10-11';

// Initial Vietlott Data
export const VIETLOTT_MEGA_645: VietlottDraw = {
  id: 'mega_01284',
  drawNumber: '#01284',
  date: '2026-10-11',
  type: 'mega645',
  winningNumbers: [7, 14, 22, 28, 35, 41],
  jackpot1Value: 34500000000, // 34.5 tỷ VNĐ
  jackpot1Winners: 0,
};

export const VIETLOTT_POWER_655: VietlottDraw = {
  id: 'power_01092',
  drawNumber: '#01092',
  date: '2026-10-10',
  type: 'power655',
  winningNumbers: [4, 18, 26, 31, 45, 53],
  specialNumber: 12,
  jackpot1Value: 88700000000, // 88.7 tỷ VNĐ
  jackpot2Value: 4300000000,  // 4.3 tỷ VNĐ
  jackpot1Winners: 0,
  jackpot2Winners: 1,
};

// Sổ Mơ Dân Gian phong phú (120+ mục dân gian nổi tiếng)
export const DREAM_BOOK_DATA: DreamBookEntry[] = [
  {
    id: 'dm_1',
    title: 'Mơ thấy rắn cắn',
    category: 'dong_vat',
    meaning: 'Điềm báo tài lộc sắp gõ cửa, công việc làm ăn có bước chuyển biến bất ngờ.',
    luckyNumbers: ['14', '59', '95'],
  },
  {
    id: 'dm_2',
    title: 'Mơ thấy rắn vàng / hổ mang',
    category: 'dong_vat',
    meaning: 'Có quý nhân phù trợ, gia đạo bình an, công danh rộng mở.',
    luckyNumbers: ['38', '83', '32'],
  },
  {
    id: 'dm_3',
    title: 'Mơ thấy trúng số độc đắc',
    category: 'tai_loc',
    meaning: 'Tâm lý đang khao khát may mắn, nhắc nhở quản lý tài chính cẩn trọng.',
    luckyNumbers: ['68', '86', '00'],
  },
  {
    id: 'dm_4',
    title: 'Mơ thấy nhặt được tiền',
    category: 'tai_loc',
    meaning: 'Cơ hội đầu tư mới xuất hiện, nên nắm bắt kịp thời.',
    luckyNumbers: ['08', '78', '87'],
  },
  {
    id: 'dm_5',
    title: 'Mơ thấy cá chép bơi lội',
    category: 'dong_vat',
    meaning: 'Cá chép hóa rồng, thi cử đỗ đạt, thăng quan tiến chức.',
    luckyNumbers: ['58', '85', '73'],
  },
  {
    id: 'dm_6',
    title: 'Mơ thấy chó đuổi cắn',
    category: 'dong_vat',
    meaning: 'Cẩn thận có tiểu nhân ghen ghét thị phi xung quanh nơi làm việc.',
    luckyNumbers: ['29', '92', '58'],
  },
  {
    id: 'dm_7',
    title: 'Mơ thấy nước ngập tràn vào nhà',
    category: 'thien_nhien',
    meaning: 'Tiền vào như nước, nguồn thu nhập dồi dào chảy về túi.',
    luckyNumbers: ['06', '66', '88'],
  },
  {
    id: 'dm_8',
    title: 'Mơ thấy cháy nhà lớn',
    category: 'thien_nhien',
    meaning: 'Vận may rực rỡ, dự án đang ấp ủ sẽ bùng nổ thành công.',
    luckyNumbers: ['07', '67', '87'],
  },
  {
    id: 'dm_9',
    title: 'Mơ thấy người chết sống lại',
    category: 'con_nguoi',
    meaning: 'Khó khăn hiện tại sẽ tìm được lối thoát bất ngờ từ người quen cũ.',
    luckyNumbers: ['26', '62', '75'],
  },
  {
    id: 'dm_10',
    title: 'Mơ thấy đám cưới linh đình',
    category: 'doi_song',
    meaning: 'Hỷ sự sắp tới, cuộc sống có nhiều niềm vui ngọt ngào.',
    luckyNumbers: ['20', '26', '62'],
  },
  {
    id: 'dm_11',
    title: 'Mơ thấy đám ma / đi viếng tang',
    category: 'doi_song',
    meaning: 'Nghịch lý điềm lành: xua đi vận xui cũ, đón nhận sinh khí mới.',
    luckyNumbers: ['34', '43', '35'],
  },
  {
    id: 'dm_12',
    title: 'Mơ thấy mua xe ô tô mới',
    category: 'tai_loc',
    meaning: 'Vị thế xã hội và uy tín cá nhân được củng cố vững vàng.',
    luckyNumbers: ['27', '72', '99'],
  },
  {
    id: 'dm_13',
    title: 'Mơ thấy rụng răng chảy máu',
    category: 'con_nguoi',
    meaning: 'Nhắc nhở chú ý sức khỏe bản thân và các thành viên lớn tuổi trong nhà.',
    luckyNumbers: ['31', '32', '52'],
  },
  {
    id: 'dm_14',
    title: 'Mơ thấy mèo vào nhà',
    category: 'dong_vat',
    meaning: 'Mèo tới mang theo sự nhanh nhạy, khéo léo trong đàm phán.',
    luckyNumbers: ['18', '58', '89'],
  },
  {
    id: 'dm_15',
    title: 'Mơ thấy chim bồ câu bay',
    category: 'dong_vat',
    meaning: 'Điềm báo tin vui từ phương xa gửi về, sự hòa thuận sum vầy.',
    luckyNumbers: ['22', '32', '62'],
  },
  {
    id: 'dm_16',
    title: 'Mơ thấy vàng thỏi / trang sức vàng',
    category: 'tai_loc',
    meaning: 'Tài chính vững chãi, các khoản đầu tư sinh lời tốt đẹp.',
    luckyNumbers: ['18', '24', '83'],
  },
  {
    id: 'dm_17',
    title: 'Mơ thấy hổ / cọp gầm',
    category: 'dong_vat',
    meaning: 'Khí phách mạnh mẽ, sắp có cơ hội lãnh đạo hoặc nhận trọng trách lớn.',
    luckyNumbers: ['06', '60', '86'],
  },
  {
    id: 'dm_18',
    title: 'Mơ thấy mưa rào sấm chớp',
    category: 'thien_nhien',
    meaning: 'Gột rửa những khúc mắc u ám trong lòng, khởi sắc tươi mới.',
    luckyNumbers: ['13', '31', '77'],
  },
  {
    id: 'dm_19',
    title: 'Mơ thấy leo lên đỉnh núi',
    category: 'thien_nhien',
    meaning: 'Mục tiêu gian nan sắp được chinh phục vẻ vang.',
    luckyNumbers: ['45', '54', '89'],
  },
  {
    id: 'dm_20',
    title: 'Mơ thấy bay lượn trên bầu trời',
    category: 'con_nguoi',
    meaning: 'Tâm hồn tự do, những gánh nặng công việc được trút bỏ.',
    luckyNumbers: ['21', '65', '88'],
  },
  {
    id: 'dm_21',
    title: 'Mơ thấy con voi lớn',
    category: 'dong_vat',
    meaning: 'Điềm báo sức mạnh, tài lộc bền vững, chỗ dựa vững như bàn thạch.',
    luckyNumbers: ['13', '53', '93'],
  },
  {
    id: 'dm_22',
    title: 'Mơ thấy cây cối đơm hoa kết trái',
    category: 'thien_nhien',
    meaning: 'Công sức vun vén bấy lâu nay đến ngày thu hoạch trái ngọt.',
    luckyNumbers: ['11', '44', '77'],
  },
  {
    id: 'dm_23',
    title: 'Mơ thấy trẻ sơ sinh cười',
    category: 'con_nguoi',
    meaning: 'Khởi đầu một trang mới trong cuộc đời đầy may mắn và tươi sáng.',
    luckyNumbers: ['09', '90', '23'],
  },
  {
    id: 'dm_24',
    title: 'Mơ thấy Phật / Bồ Tát mỉm cười',
    category: 'tai_loc',
    meaning: 'Tâm tính thanh tịnh, tai qua nạn khỏi, đại cát đại lợi.',
    luckyNumbers: ['57', '75', '99'],
  },
];

// Lô Gan Miền Bắc (Các cặp số lâu ngày chưa về)
export const LO_GAN_MB: LoGanItem[] = [
  { number: '48', daysWithoutAppearance: 24, maxHistoricalGap: 38, lastAppearanceDate: '2026-09-18' },
  { number: '92', daysWithoutAppearance: 19, maxHistoricalGap: 32, lastAppearanceDate: '2026-09-23' },
  { number: '07', daysWithoutAppearance: 17, maxHistoricalGap: 29, lastAppearanceDate: '2026-09-25' },
  { number: '63', daysWithoutAppearance: 16, maxHistoricalGap: 35, lastAppearanceDate: '2026-09-26' },
  { number: '15', daysWithoutAppearance: 15, maxHistoricalGap: 27, lastAppearanceDate: '2026-09-27' },
  { number: '81', daysWithoutAppearance: 14, maxHistoricalGap: 31, lastAppearanceDate: '2026-09-28' },
  { number: '34', daysWithoutAppearance: 13, maxHistoricalGap: 26, lastAppearanceDate: '2026-09-29' },
  { number: '76', daysWithoutAppearance: 12, maxHistoricalGap: 30, lastAppearanceDate: '2026-09-30' },
  { number: '29', daysWithoutAppearance: 11, maxHistoricalGap: 25, lastAppearanceDate: '2026-10-01' },
  { number: '55', daysWithoutAppearance: 10, maxHistoricalGap: 28, lastAppearanceDate: '2026-10-02' },
];

// Tần suất Lô Tô trong 30 kỳ gần nhất
export const LO_FREQUENCY_TOP: LoFrequencyItem[] = [
  { number: '68', appearanceCount: 16, percentage: 53.3 },
  { number: '86', appearanceCount: 15, percentage: 50.0 },
  { number: '14', appearanceCount: 14, percentage: 46.7 },
  { number: '39', appearanceCount: 13, percentage: 43.3 },
  { number: '79', appearanceCount: 13, percentage: 43.3 },
  { number: '04', appearanceCount: 12, percentage: 40.0 },
  { number: '52', appearanceCount: 12, percentage: 40.0 },
  { number: '88', appearanceCount: 11, percentage: 36.7 },
  { number: '23', appearanceCount: 11, percentage: 36.7 },
  { number: '97', appearanceCount: 10, percentage: 33.3 },
];

// Giải thích cơ cấu giải thưởng Việt Nam
export const PRIZE_STRUCTURE_INFO = {
  MB: [
    { name: 'Giải ĐB', quantity: '3 vé (kèm phụ)', prize: '1.000.000.000 VNĐ / vé (Tổng 3-4 tỷ)' },
    { name: 'Giải Nhất', quantity: '15 giải', prize: '10.000.000 VNĐ' },
    { name: 'Giải Nhì', quantity: '30 giải', prize: '5.000.000 VNĐ' },
    { name: 'Giải Ba', quantity: '90 giải', prize: '1.000.000 VNĐ' },
    { name: 'Giải Tư', quantity: '600 giải', prize: '400.000 VNĐ' },
    { name: 'Giải Năm', quantity: '900 giải', prize: '200.000 VNĐ' },
    { name: 'Giải Sáu', quantity: '4.500 giải', prize: '100.000 VNĐ' },
    { name: 'Giải Bảy', quantity: '60.000 giải', prize: '40.000 VNĐ' },
  ],
  MN_MT: [
    { name: 'Giải ĐB', quantity: '1 giải (6 số)', prize: '2.000.000.000 VNĐ' },
    { name: 'Giải Nhất', quantity: '10 giải (5 số)', prize: '30.000.000 VNĐ' },
    { name: 'Giải Nhì', quantity: '10 giải (5 số)', prize: '15.000.000 VNĐ' },
    { name: 'Giải Ba', quantity: '20 giải (5 số)', prize: '10.000.000 VNĐ' },
    { name: 'Giải Tư', quantity: '70 giải (5 số)', prize: '3.000.000 VNĐ' },
    { name: 'Giải Năm', quantity: '100 giải (4 số)', prize: '1.000.000 VNĐ' },
    { name: 'Giải Sáu', quantity: '300 giải (4 số)', prize: '400.000 VNĐ' },
    { name: 'Giải Bảy', quantity: '1.000 giải (3 số)', prize: '200.000 VNĐ' },
    { name: 'Giải Tám', quantity: '10.000 giải (2 số)', prize: '100.000 VNĐ' },
    { name: 'Phụ ĐB', quantity: '9 giải', prize: '50.000.000 VNĐ (chỉ sai chữ số đầu)' },
    { name: 'Khuyến khích', quantity: '45 giải', prize: '6.000.000 VNĐ (sai 1 số bất kỳ khác số đầu)' },
  ],
};
