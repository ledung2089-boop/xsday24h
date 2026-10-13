import {
  CheckTicketResult,
  LotteryResultMB,
  StationResultMNMT,
  Region,
} from '../types/lottery';

export function checkTicketMB(
  ticket: string,
  resultMB: LotteryResultMB
): CheckTicketResult {
  const cleanTicket = ticket.trim().replace(/\D/g, '');
  const winnings: CheckTicketResult['winningPrizes'] = [];

  const prizes = resultMB.prizes;

  // 1. Giải Đặc Biệt (5 chữ số)
  prizes.special.forEach((val) => {
    if (cleanTicket === val || cleanTicket.slice(-5) === val) {
      winnings.push({
        prizeName: 'Giải Đặc Biệt',
        prizeAmount: 1000000000,
        matchedNumbers: val,
        description: 'Trúng trọn bộ 5 chữ số Giải Đặc Biệt',
      });
    }
  });

  // 2. Giải Nhất (5 chữ số)
  prizes.first.forEach((val) => {
    if (cleanTicket.slice(-5) === val) {
      winnings.push({
        prizeName: 'Giải Nhất',
        prizeAmount: 10000000,
        matchedNumbers: val,
        description: 'Trúng 5 chữ số Giải Nhất',
      });
    }
  });

  // 3. Giải Nhì (5 chữ số)
  prizes.second.forEach((val) => {
    if (cleanTicket.slice(-5) === val) {
      winnings.push({
        prizeName: 'Giải Nhì',
        prizeAmount: 5000000,
        matchedNumbers: val,
        description: 'Trúng 5 chữ số Giải Nhì',
      });
    }
  });

  // 4. Giải Ba (5 chữ số)
  prizes.third.forEach((val) => {
    if (cleanTicket.slice(-5) === val) {
      winnings.push({
        prizeName: 'Giải Ba',
        prizeAmount: 1000000,
        matchedNumbers: val,
        description: 'Trúng 5 chữ số Giải Ba',
      });
    }
  });

  // 5. Giải Tư (4 chữ số cuối)
  prizes.fourth.forEach((val) => {
    if (cleanTicket.slice(-4) === val) {
      winnings.push({
        prizeName: 'Giải Tư',
        prizeAmount: 400000,
        matchedNumbers: val,
        description: 'Trúng 4 chữ số cuối Giải Tư',
      });
    }
  });

  // 6. Giải Năm (4 chữ số cuối)
  prizes.fifth.forEach((val) => {
    if (cleanTicket.slice(-4) === val) {
      winnings.push({
        prizeName: 'Giải Năm',
        prizeAmount: 200000,
        matchedNumbers: val,
        description: 'Trúng 4 chữ số cuối Giải Năm',
      });
    }
  });

  // 7. Giải Sáu (3 chữ số cuối)
  prizes.sixth.forEach((val) => {
    if (cleanTicket.slice(-3) === val) {
      winnings.push({
        prizeName: 'Giải Sáu',
        prizeAmount: 100000,
        matchedNumbers: val,
        description: 'Trúng 3 chữ số cuối Giải Sáu',
      });
    }
  });

  // 8. Giải Bảy (2 chữ số cuối)
  prizes.seventh.forEach((val) => {
    if (cleanTicket.slice(-2) === val) {
      winnings.push({
        prizeName: 'Giải Bảy',
        prizeAmount: 40000,
        matchedNumbers: val,
        description: 'Trúng 2 chữ số cuối Giải Bảy',
      });
    }
  });

  const totalPrize = winnings.reduce((acc, curr) => acc + curr.prizeAmount, 0);

  return {
    isWinner: winnings.length > 0,
    ticketNumber: cleanTicket,
    stationName: resultMB.stationName,
    date: resultMB.date,
    region: 'MB',
    winningPrizes: winnings,
    totalPrize,
  };
}

export function checkTicketMNMT(
  ticket: string,
  stationResult: StationResultMNMT,
  date: string,
  region: Region
): CheckTicketResult {
  const cleanTicket = ticket.trim().replace(/\D/g, '');
  const winnings: CheckTicketResult['winningPrizes'] = [];
  const prizes = stationResult.prizes;

  const specialNumber = prizes.special[0]; // 6 chữ số

  // 1. Giải Đặc Biệt (Trùng cả 6 chữ số)
  if (cleanTicket.length === 6 && cleanTicket === specialNumber) {
    winnings.push({
      prizeName: 'Giải Đặc Biệt',
      prizeAmount: 2000000000,
      matchedNumbers: specialNumber,
      description: 'Trúng trọn bộ 6 chữ số Đặc Biệt (2 Tỷ Đồng)',
    });
  } else if (cleanTicket.length === 6 && specialNumber && specialNumber.length === 6) {
    // 2. Giải Phụ Đặc Biệt (Trúng 5 số cuối liên tiếp, chỉ sai chữ số đầu tiên)
    if (cleanTicket.slice(1) === specialNumber.slice(1)) {
      winnings.push({
        prizeName: 'Giải Phụ Đặc Biệt',
        prizeAmount: 50000000,
        matchedNumbers: `x${cleanTicket.slice(1)}`,
        description: 'Chỉ sai chữ số đầu tiên hàng trăm ngàn so với Giải ĐB',
      });
    } else {
      // 3. Giải Khuyến Khích: Trúng số đầu tiên và chỉ sai đúng 1 chữ số trong 5 vị trí còn lại
      if (cleanTicket[0] === specialNumber[0]) {
        let diffCount = 0;
        for (let i = 1; i < 6; i++) {
          if (cleanTicket[i] !== specialNumber[i]) {
            diffCount++;
          }
        }
        if (diffCount === 1) {
          winnings.push({
            prizeName: 'Giải Khuyến Khích',
            prizeAmount: 6000000,
            matchedNumbers: cleanTicket,
            description: 'Trùng số đầu và chỉ sai đúng 1 chữ số so với Giải ĐB',
          });
        }
      }
    }
  }

  // 4. Giải Nhất (5 chữ số cuối)
  prizes.first.forEach((val) => {
    if (cleanTicket.slice(-5) === val) {
      winnings.push({
        prizeName: 'Giải Nhất',
        prizeAmount: 30000000,
        matchedNumbers: val,
        description: 'Trúng 5 chữ số Giải Nhất',
      });
    }
  });

  // 5. Giải Nhì (5 chữ số cuối)
  prizes.second.forEach((val) => {
    if (cleanTicket.slice(-5) === val) {
      winnings.push({
        prizeName: 'Giải Nhì',
        prizeAmount: 15000000,
        matchedNumbers: val,
        description: 'Trúng 5 chữ số Giải Nhì',
      });
    }
  });

  // 6. Giải Ba (5 chữ số cuối)
  prizes.third.forEach((val) => {
    if (cleanTicket.slice(-5) === val) {
      winnings.push({
        prizeName: 'Giải Ba',
        prizeAmount: 10000000,
        matchedNumbers: val,
        description: 'Trúng 5 chữ số Giải Ba',
      });
    }
  });

  // 7. Giải Tư (5 chữ số cuối)
  prizes.fourth.forEach((val) => {
    if (cleanTicket.slice(-5) === val) {
      winnings.push({
        prizeName: 'Giải Tư',
        prizeAmount: 3000000,
        matchedNumbers: val,
        description: 'Trúng 5 chữ số Giải Tư',
      });
    }
  });

  // 8. Giải Năm (4 chữ số cuối)
  prizes.fifth.forEach((val) => {
    if (cleanTicket.slice(-4) === val) {
      winnings.push({
        prizeName: 'Giải Năm',
        prizeAmount: 1000000,
        matchedNumbers: val,
        description: 'Trúng 4 chữ số cuối Giải Năm',
      });
    }
  });

  // 9. Giải Sáu (4 chữ số cuối)
  prizes.sixth.forEach((val) => {
    if (cleanTicket.slice(-4) === val) {
      winnings.push({
        prizeName: 'Giải Sáu',
        prizeAmount: 400000,
        matchedNumbers: val,
        description: 'Trúng 4 chữ số cuối Giải Sáu',
      });
    }
  });

  // 10. Giải Bảy (3 chữ số cuối)
  prizes.seventh.forEach((val) => {
    if (cleanTicket.slice(-3) === val) {
      winnings.push({
        prizeName: 'Giải Bảy',
        prizeAmount: 200000,
        matchedNumbers: val,
        description: 'Trúng 3 chữ số cuối Giải Bảy',
      });
    }
  });

  // 11. Giải Tám (2 chữ số cuối)
  prizes.eighth.forEach((val) => {
    if (cleanTicket.slice(-2) === val) {
      winnings.push({
        prizeName: 'Giải Tám',
        prizeAmount: 100000,
        matchedNumbers: val,
        description: 'Trúng 2 chữ số cuối Giải Tám',
      });
    }
  });

  const totalPrize = winnings.reduce((acc, curr) => acc + curr.prizeAmount, 0);

  return {
    isWinner: winnings.length > 0,
    ticketNumber: cleanTicket,
    stationName: stationResult.stationName,
    date,
    region,
    winningPrizes: winnings,
    totalPrize,
  };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
