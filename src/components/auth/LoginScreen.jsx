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
  Sparkles,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { authenticateUser } from '../../firebase/services';
import { DEPARTMENTS } from '../../data/departments';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuickDept, setSelectedQuickDept] = useState(null);

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

  // Quick select department for instant testing & login
  const handleQuickSelectDept = (dept) => {
    setSelectedQuickDept(dept.id);
    setError('');

    let u = '';
    if (dept.id === 'bcn') u = 'bcnpsc';
    else if (dept.id === 'cau-long') u = 'caulongpsc';
    else if (dept.id === 'bong-da') u = 'bongdapsc';
    else if (dept.id === 'bong-chuyen') u = 'bongchuyenpsc';
    else if (dept.id === 'cheerleading') u = 'cheerleadingpsc';
    else if (dept.id === 'tap-su') u = 'tapsupsc';
    else if (dept.id === 'pickleball') u = 'pickleballpsc';
    else if (dept.id === 'truyen-thong') u = 'truyenthongpsc';

    setUsername(u);
    setPassword('123123');
  };

  return (
    <div className="min-h-screen bg-[#080B0C] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/6 -left-28 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/6 -right-28 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10 my-8">
        {/* Logo & Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-xl shadow-emerald-500/25 border border-emerald-400/40 mb-3 animate-bounce">
            <Trophy className="w-8 h-8 text-black stroke-[2.5]" />
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight">
            PharmacySportCLB
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
            Cổng Điều Hành Hoạt Động & Quản Lý 8 Phân Ban
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Hệ Thống Phân Cấp 2 Cấp • Firebase Realtime</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="card-sporty p-6 sm:p-8 shadow-2xl backdrop-blur-xl border-white/10">
          <div className="pb-4 mb-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Đăng Nhập Ban Hoạt Động</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhập tài khoản Ban Chủ Nhiệm hoặc Ban Thành Phần
              </p>
            </div>
            <span className="p-2 rounded-xl bg-white/5 text-slate-400">
              <KeyRound className="w-4 h-4 text-emerald-400" />
            </span>
          </div>

          {/* Quick Select Chips of 8 Departments */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Chọn nhanh tài khoản phân ban (Mật khẩu mặc định: 123123)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {DEPARTMENTS.map((d) => {
                const isSelected = selectedQuickDept === d.id;
                const isBCN = d.id === 'bcn';

                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleQuickSelectDept(d)}
                    className={`p-2 rounded-xl border transition text-left flex items-center gap-2 ${
                      isSelected
                        ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-md shadow-emerald-500/20'
                        : isBCN
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                        : 'bg-[#12181A] border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <img src={d.avatar} alt={d.name} className="w-6 h-6 rounded-lg object-cover shrink-0" />
                    <span className="text-[11px] font-bold truncate leading-tight">
                      {d.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
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
                  placeholder="VD: bcnpsc hoặc bongdapsc..."
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
                <span>Ghi nhớ phiên đăng nhập này</span>
              </label>
              <span className="text-slate-500">Bảo mật Firebase RTDB</span>
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

          {/* Credentials Guide Info */}
          <div className="mt-5 pt-4 border-t border-white/5 text-center text-xs text-slate-400">
            <p>
              Tài khoản Ban Chủ Nhiệm mặc định: <strong className="text-emerald-400 font-mono">bcnpsc</strong> / <strong className="text-white font-mono">123123</strong>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Ban Chủ Nhiệm có quyền tạo tài khoản và phân quyền cho các ban khác
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
