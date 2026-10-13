import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { XoSoDayLogo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="mb-3">
              <XoSoDayLogo size="sm" showText={true} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Xổ số đây</strong> - Cổng thông tin kết quả xổ số kiến thiết 3 miền Bắc - Trung - Nam và Vietlott cập nhật trực tiếp nhanh nhất, chính xác và minh bạch.
            </p>
          </div>

          {/* Draw times */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Khung Giờ Mở Thưởng
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Miền Nam: 16h15 hàng ngày</li>
              <li>• Miền Trung: 17h15 hàng ngày</li>
              <li>• Miền Bắc: 18h15 hàng ngày</li>
              <li>• Vietlott: 18h00 các ngày quy định</li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Tiện Ích Xổ Số
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Dò vé số tự động 3 miền</li>
              <li>• Quay thử Thần Tài lấy may</li>
              <li>• Lịch mở thưởng toàn quốc</li>
              <li>• Kết quả trực tiếp hàng ngày</li>
            </ul>
          </div>

          {/* Responsible gaming */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Chơi Có Trách Nhiệm</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-2">
              Xổ số kiến thiết là hình thức vui chơi hợp pháp "Ích nước - Lợi nhà". Vui lòng chỉ tham gia khi đủ 18 tuổi và giải trí có chừng mực.
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">
              <span>Độ tuổi quy định: 18+</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Xổ số đây (xosoday.vn). Tất cả quyền được bảo lưu. Dữ liệu công khai từ các Công ty XSKT.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-800 transition-colors">Điều khoản dịch vụ</span>
            <span>·</span>
            <span className="hover:text-slate-800 transition-colors">Chính sách bảo mật</span>
            <span>·</span>
            <span className="hover:text-slate-800 transition-colors">Hướng dẫn nhận giải</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
