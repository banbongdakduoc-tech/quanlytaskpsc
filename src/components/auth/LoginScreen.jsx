import React, { useState } from 'react';
import { 
  Trophy, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { authenticateUser } from '../../firebase/services';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const account = await authenticateUser(username, password);
      triggerConfetti();
      playChime('success');
      onLoginSuccess(account);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Sai tên đăng nhập hoặc mật khẩu');
      playChime('click');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B0C] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/6 -left-28 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/6 -right-28 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Logo & Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-xl shadow-emerald-500/25 border border-emerald-400/40 mb-3 animate-bounce">
            <Trophy className="w-8 h-8 text-black stroke-[2.5]" />
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight">
            PharmacySportCLB
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Hệ thống quản lý công việc và hoạt động CLB
          </p>
        </div>

        {/* Login Card */}
        <div className="card-sporty p-6 sm:p-8 shadow-2xl backdrop-blur-xl border-white/10">
          <div className="pb-4 mb-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Đăng Nhập Hệ Thống</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Vui lòng nhập tài khoản được cấp để tiếp tục
              </p>
            </div>
            <span className="p-2 rounded-xl bg-white/5 text-slate-400">
              <KeyRound className="w-4 h-4 text-emerald-400" />
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Tên Đăng Nhập (Username)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Nhập tên đăng nhập..."
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E1416] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Mật Khẩu (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-[#0E1416] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-[#0E1416]"
                />
                <span>Ghi nhớ phiên đăng nhập</span>
              </label>
              <div className="flex items-center gap-1 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
                <span>Bảo mật</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 disabled:opacity-50 text-black font-black text-sm tracking-wide transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoading ? (
                <span>Đang xác thực thông tin...</span>
              ) : (
                <>
                  <span>Đăng Nhập Vào Hệ Thống</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Secure Footer Note */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center text-[11px] text-slate-500">
            PharmacySportCLB • Dành riêng cho thành viên CLB
          </div>
        </div>
      </div>
    </div>
  );
}
