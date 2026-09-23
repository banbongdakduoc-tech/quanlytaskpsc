import React, { useState } from 'react';
import { Wallet, Plus, CheckCircle2, Clock, AlertCircle, ArrowUpRight, TrendingDown } from 'lucide-react';
import { formatVND } from '../../utils/helpers';

export default function BudgetBreakdown({ plan, onUpdateBudget }) {
  const [items, setItems] = useState(plan.budgetItems || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', estimated: '', actual: '', status: 'pending' });

  const totalEstimated = items.reduce((acc, item) => acc + (Number(item.estimated) || 0), 0);
  const totalActual = items.reduce((acc, item) => acc + (Number(item.actual) || 0), 0);
  const variance = totalEstimated - totalActual;

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.estimated) return;
    const item = {
      id: `b-${Date.now()}`,
      name: newItem.name,
      estimated: Number(newItem.estimated),
      actual: Number(newItem.actual) || 0,
      status: newItem.status,
    };
    const updated = [...items, item];
    setItems(updated);
    if (onUpdateBudget) {
      onUpdateBudget(plan.id, updated);
    }
    setNewItem({ name: '', estimated: '', actual: '', status: 'pending' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#12181A] border border-white/5">
          <span className="text-xs text-slate-400 font-semibold uppercase">Tổng Dự Trù</span>
          <p className="text-2xl font-black text-white mt-1">{formatVND(totalEstimated)}</p>
          <span className="text-[11px] text-slate-500">Kinh phí đã lập ban đầu</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12181A] border border-white/5">
          <span className="text-xs text-slate-400 font-semibold uppercase">Đã Giải Ngân / Thực Chi</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{formatVND(totalActual)}</p>
          <span className="text-[11px] text-emerald-400/80">
            {totalEstimated > 0 ? Math.round((totalActual / totalEstimated) * 100) : 0}% ngân sách
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12181A] border border-white/5">
          <span className="text-xs text-slate-400 font-semibold uppercase">Kinh Phí Còn Lại</span>
          <p className={`text-2xl font-black mt-1 ${variance >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
            {formatVND(variance)}
          </p>
          <span className="text-[11px] text-slate-500">
            {variance >= 0 ? 'Trong hạn mức an toàn' : 'Vượt định mức'}
          </span>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="rounded-2xl bg-[#12181A] border border-white/[0.08] overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Bảng Kê Chi Phí Chi Tiết</h4>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm khoản chi</span>
          </button>
        </div>

        {/* Add Form Dropdown */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="p-4 bg-[#162124] border-b border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-fadeIn">
            <input
              type="text"
              placeholder="Tên khoản chi (VD: Mua cờ giải)..."
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="px-3 py-2 rounded-xl bg-[#0E1416] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              required
            />
            <input
              type="number"
              placeholder="Dự trù (VNĐ)..."
              value={newItem.estimated}
              onChange={(e) => setNewItem({ ...newItem, estimated: e.target.value })}
              className="px-3 py-2 rounded-xl bg-[#0E1416] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              required
            />
            <input
              type="number"
              placeholder="Thực chi (nếu có)..."
              value={newItem.actual}
              onChange={(e) => setNewItem({ ...newItem, actual: e.target.value })}
              className="px-3 py-2 rounded-xl bg-[#0E1416] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition"
            >
              Lưu khoản chi
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F11] text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Hạng mục chi phí</th>
                <th className="py-3 px-4 text-right">Dự trù (VNĐ)</th>
                <th className="py-3 px-4 text-right">Thực chi (VNĐ)</th>
                <th className="py-3 px-4 text-right">Chênh lệch</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {items.map((it) => {
                const diff = (it.estimated || 0) - (it.actual || 0);
                return (
                  <tr key={it.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-medium text-white">{it.name}</td>
                    <td className="py-3.5 px-4 text-right text-slate-300 font-mono">
                      {formatVND(it.estimated)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      {formatVND(it.actual)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs">
                      <span className={diff >= 0 ? 'text-slate-400' : 'text-rose-400 font-bold'}>
                        {diff >= 0 ? `+${formatVND(diff)}` : formatVND(diff)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {it.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          Chờ BCN ký
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
