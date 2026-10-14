import React, { useState } from 'react';
import {
  X,
  Key,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Info,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import {
  DEFAULT_XOSO_API_KEY,
  getStoredApiKey,
  setStoredApiKey,
  testApiKeyConnection,
  clearApiCache,
} from '../services/xosoApi';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeyChanged: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onApiKeyChanged,
}) => {
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      setMessage('Vui lòng nhập API Key để kiểm tra');
      setStatus('error');
      setIsQuotaExceeded(false);
      return;
    }

    setStatus('testing');
    setMessage('Đang gửi yêu cầu kiểm tra tới máy chủ XoSoAPI...');
    setIsQuotaExceeded(false);

    const res = await testApiKeyConnection(cleanKey);
    if (res.ok) {
      setStatus('success');
      setMessage(res.message);
    } else {
      setStatus('error');
      setMessage(res.message);
      setIsQuotaExceeded(Boolean(res.quotaExceeded));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      setMessage('Vui lòng nhập API Key');
      setStatus('error');
      return;
    }

    setStatus('testing');
    setMessage('Đang xác thực và lưu cấu hình...');

    const res = await testApiKeyConnection(cleanKey);
    // Allow saving even if quota exceeded or offline, but inform user
    setStoredApiKey(cleanKey);
    clearApiCache();

    if (res.ok) {
      setStatus('success');
      setMessage('Lưu thành công! Đang tải lại kết quả từ API...');
      setTimeout(() => {
        onApiKeyChanged();
        onClose();
      }, 700);
    } else {
      setStatus('error');
      setMessage(res.message);
      setIsQuotaExceeded(Boolean(res.quotaExceeded));
      // Save key anyway so user can retry when quota resets
      setTimeout(() => {
        onApiKeyChanged();
      }, 500);
    }
  };

  const handleResetDefault = () => {
    setApiKey(DEFAULT_XOSO_API_KEY);
    setStoredApiKey(DEFAULT_XOSO_API_KEY);
    clearApiCache();
    setStatus('idle');
    setMessage('');
    setIsQuotaExceeded(false);
    onApiKeyChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cấu Hình Kết Nối API Xổ Số</h3>
            <p className="text-xs text-slate-500">
              Kiểm tra & đồng bộ dữ liệu thời gian thực từ XoSoAPI (xosoapi.online)
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mb-4 space-y-1.5">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Cơ chế cập nhật dữ liệu tự động 2 lớp:</p>
              <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                1. <strong>Trực tiếp qua API:</strong> Nếu có API Key hợp lệ và còn hạn mức, kết quả mở thưởng sẽ được nạp tức thời từ xosoapi.online.
                <br />
                2. <strong>Hệ thống dự phòng thông minh:</strong> Nếu API hết lượt gọi hoặc mất mạng, hệ thống tự động duy trì kết quả chuẩn xác, không làm gián đoạn việc tra cứu và dò vé.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                API Key (Header: X-API-Key)
              </label>
              <a
                href="https://xosoapi.online/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Nhận API Key Miễn Phí (100 lượt/ngày)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setStatus('idle');
                setMessage('');
                setIsQuotaExceeded(false);
              }}
              placeholder="sk_live_..."
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {status === 'error' && (
            <div className="p-3.5 bg-red-50 text-red-800 rounded-xl text-xs space-y-1.5 border border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  {message}
                </div>
              </div>
              {isQuotaExceeded && (
                <div className="pl-6 text-[11px] text-red-700 leading-relaxed bg-red-100/50 p-2 rounded-lg border border-red-200">
                  💡 <strong>Gợi ý:</strong> Key dùng chung mẫu đã chạm trần 100 cuộc gọi/ngày của nhà cung cấp. Bạn có thể đăng ký tài khoản miễn phí tại{' '}
                  <a
                    href="https://xosoapi.online/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold hover:text-red-900"
                  >
                    xosoapi.online
                  </a>{' '}
                  để nhận Key riêng, hoặc ứng dụng sẽ tự động kích hoạt bộ dữ liệu dự phòng chuẩn xác cho bạn.
                </div>
              )}
            </div>
          )}

          {status === 'success' && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={status === 'testing'}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>Kiểm Tra Kết Nối</span>
            </button>

            <button
              type="submit"
              disabled={status === 'testing'}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {status === 'testing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang Xử Lý...</span>
                </>
              ) : (
                <span>Lưu & Kích Hoạt</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetDefault}
              className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
              title="Khôi phục lại API Key mẫu mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc Định</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
