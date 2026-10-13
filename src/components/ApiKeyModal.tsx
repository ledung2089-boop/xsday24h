import React, { useState } from 'react';
import { X, Key, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import {
  DEFAULT_XOSO_API_KEY,
  getStoredApiKey,
  setStoredApiKey,
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
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      setErrorMessage('Vui lòng nhập API Key');
      setStatus('error');
      return;
    }

    setStatus('testing');
    setErrorMessage('');

    try {
      const res = await fetch(
        'https://xosoapi.online/api/v1/vietnam/draws?region=MB&limit=1',
        {
          headers: {
            'X-API-Key': cleanKey,
          },
        }
      );

      const json = await res.json();
      if (res.ok && json.success) {
        setStoredApiKey(cleanKey);
        setStatus('success');
        setTimeout(() => {
          onApiKeyChanged();
          onClose();
        }, 800);
      } else {
        setStatus('error');
        setErrorMessage(json.error || json.message || 'API Key không hợp lệ');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Không thể kết nối đến máy chủ xosoapi.online');
    }
  };

  const handleResetDefault = () => {
    setApiKey(DEFAULT_XOSO_API_KEY);
    setStoredApiKey(DEFAULT_XOSO_API_KEY);
    setStatus('idle');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cấu Hình XoSoAPI</h3>
            <p className="text-xs text-slate-500">Cập nhật trực tiếp từ xosoapi.online</p>
          </div>
        </div>

        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              API Key (Header: X-API-Key)
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setStatus('idle');
              }}
              placeholder="sk_live_..."
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              API Key được lưu an toàn trong trình duyệt của bạn để tự động tải kết quả mới nhất.
            </p>
          </div>

          {status === 'error' && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs flex items-center gap-2 border border-emerald-200">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Kết nối API thành công! Đang lưu và cập nhật...</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={status === 'testing'}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {status === 'testing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang Kiểm Tra...</span>
                </>
              ) : (
                <span>Lưu & Kết Nối API</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetDefault}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Mặc Định
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
