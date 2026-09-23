import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Check, 
  X,
  FileText,
  DollarSign
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { formatVND } from '../../utils/helpers';
import { createBudgetProposal, updateBudgetStatus } from '../../firebase/services';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function BudgetManager({ budgets, currentDept, onNotify }) {
  const isBCN = currentDept.id === 'bcn';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reviewModalBudget, setReviewModalBudget] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  // Keyboard shortcut Esc to close modals
  useModalKeyboard(showCreateModal, () => setShowCreateModal(false));
  useModalKeyboard(!!reviewModalBudget, () => setReviewModalBudget(null));

  // Form State for creating budget
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([
    { id: '1', name: '', qty: 1, unitPrice: 0 }
  ]);

  const displayedBudgets = isBCN
    ? budgets
    : budgets.filter((b) => b.deptId === currentDept.id);

  const totalProposed = displayedBudgets.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const totalApproved = displayedBudgets.filter(b => b.status === 'approved').reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const pendingCount = displayedBudgets.filter(b => b.status === 'pending_approval').length;

  const handleAddItemRow = () => {
    setItems([
      ...items,
      { id: `item-${Date.now()}`, name: '', qty: 1, unitPrice: 0 }
    ]);
  };

  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = field === 'name' ? value : Number(value) || 0;
    setItems(updated);
  };

  const handleRemoveItem = (idx) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const calculateTotal = () => {
    return items.reduce((acc, it) => acc + (it.qty * it.unitPrice), 0);
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const total = calculateTotal();
    try {
      await createBudgetProposal({
        title: title.trim(),
        deptId: currentDept.id,
        deptName: currentDept.name,
        note: note.trim(),
        items: items.map(it => ({ ...it, total: it.qty * it.unitPrice })),
        totalAmount: total,
      });

      triggerConfetti();
      playChime('success');
      onNotify('Đã gửi đề xuất dự trù ngân sách lên Ban Chủ Nhiệm!');
      setShowCreateModal(false);
      setTitle('');
      setNote('');
      setItems([{ id: '1', name: '', qty: 1, unitPrice: 0 }]);
    } catch (err) {
      console.error('Error creating budget:', err);
      alert('Lỗi gửi dự trù: ' + err.message);
    }
  };

  const handleReviewAction = async (status) => {
    if (!reviewModalBudget) return;
    try {
      await updateBudgetStatus(reviewModalBudget.id, status, reviewNote);
      if (status === 'approved') {
        triggerConfetti();
        playChime('success');
        onNotify(`Đã phê duyệt dự trù kinh phí cho ${reviewModalBudget.deptName}!`);
      } else {
        playChime('click');
        onNotify(`Đã phản hồi yêu cầu điều chỉnh cho ${reviewModalBudget.deptName}.`);
      }
      setReviewModalBudget(null);
      setReviewNote('');
    } catch (err) {
      console.error('Error reviewing budget:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isBCN ? 'Ban Chủ Nhiệm • Phê Duyệt Ngân Sách' : `Quản Lý Dự Trù • ${currentDept.name}`}
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            {isBCN ? 'Thẩm Định & Duyệt Kinh Phí Các Ban' : 'Lập Dự Trù & Báo Cáo Ngân Sách'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isBCN 
              ? 'Xem xét các khoản chi do 7 phân ban đề xuất và phê duyệt giải ngân'
              : 'Lập danh mục chi tiết chi phí hoạt động gửi Ban Chủ Nhiệm phê duyệt'}
          </p>
        </div>

        {!isBCN && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 self-start sm:self-center active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Lập Dự Trù Ngân Sách</span>
          </button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-sporty p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase">Tổng Kinh Phí Đề Xuất</span>
          <p className="text-2xl font-black text-white mt-1">{formatVND(totalProposed)}</p>
          <span className="text-[11px] text-slate-500">{displayedBudgets.length} tờ trình</span>
        </div>

        <div className="card-sporty p-5 border-emerald-500/30">
          <span className="text-xs font-semibold text-emerald-400 uppercase">Đã Được BCN Duyệt</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{formatVND(totalApproved)}</p>
          <span className="text-[11px] text-emerald-400/80">Kinh phí an toàn</span>
        </div>

        <div className="card-sporty p-5 border-amber-500/30">
          <span className="text-xs font-semibold text-amber-400 uppercase">Chờ BCN Xem Xét</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-amber-300/80">Cần phê duyệt</span>
        </div>
      </div>

      {/* Budget Proposals List */}
      <div className="card-sporty overflow-hidden">
        {displayedBudgets.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Wallet className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-bold text-slate-300">Chưa có đề xuất dự trù ngân sách nào</p>
            <p className="text-xs text-slate-500 mt-1">
              {!isBCN ? 'Bấm nút "Lập Dự Trù Ngân Sách" ở góc trên để tạo bảng dự toán chi phí.' : 'Các ban chưa gửi bảng kê kinh phí lên.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {displayedBudgets.map((b) => {
              const isPending = b.status === 'pending_approval';
              const isApproved = b.status === 'approved';

              return (
                <div key={b.id} className="p-5 hover:bg-white/[0.02] transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                        {b.deptName}
                      </span>
                      {isPending && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Chờ BCN Duyệt
                        </span>
                      )}
                      {isApproved && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Đã Duyệt
                        </span>
                      )}
                      {b.status === 'rejected' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          Yêu Cầu Chỉnh Sửa
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-extrabold text-white leading-snug">
                      {b.title}
                    </h4>

                    {b.note && (
                      <p className="text-xs text-slate-400 mt-1">
                        Ghi chú: {b.note}
                      </p>
                    )}

                    {b.approvalNote && (
                      <p className="text-xs text-emerald-400 mt-1">
                        Phản hồi BCN: {b.approvalNote}
                      </p>
                    )}

                    <div className="mt-2 text-xs text-slate-400">
                      {b.items?.length || 0} khoản chi • Gửi lúc {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Tổng kinh phí:</span>
                      <span className="text-base font-black text-emerald-400">
                        {formatVND(b.totalAmount)}
                      </span>
                    </div>

                    {isBCN && isPending && (
                      <button
                        onClick={() => {
                          setReviewModalBudget(b);
                          setReviewNote('');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                      >
                        Thẩm Định & Duyệt
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Lập Dự Trù Mới (Dành cho Ban) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="w-full max-w-2xl bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">
                    Lập Đề Xuất Dự Trù Kinh Phí: {currentDept.name}
                  </h3>
                  <p className="text-xs text-slate-400">Gửi trực tiếp lên Ban Chủ Nhiệm phê duyệt</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Tên Sự Kiện / Mục Đích Dự Trù
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Dự trù mua cầu thi đấu và thuê sân tập quý 4..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Bảng Kê Hạng Mục Chi Tiết
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm dòng chi phí
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {items.map((it, idx) => (
                    <div key={it.id || idx} className="grid grid-cols-12 gap-2 items-center bg-[#141C1E] p-2 rounded-xl border border-white/5">
                      <div className="col-span-5">
                        <input
                          type="text"
                          required
                          placeholder="Tên hạng mục..."
                          value={it.name}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E1416] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="SL"
                          value={it.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E1416] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 text-center"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          placeholder="Đơn giá (VNĐ)"
                          value={it.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E1416] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 text-right font-mono"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-3 rounded-xl bg-[#141C1E] border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase">Tổng dự trù kinh phí:</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {formatVND(calculateTotal())}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Ghi Chú Giải Trình BCN
                </label>
                <textarea
                  rows={2}
                  placeholder="Lý do chi, thời gian cần giải ngân..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-xs font-semibold text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition shadow-lg shadow-emerald-500/25"
                >
                  Gửi Ban Chủ Nhiệm Duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: BCN Review & Phê duyệt */}
      {reviewModalBudget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-black text-white text-lg">
                Thẩm Định Dự Trù: {reviewModalBudget.title}
              </h3>
              <button onClick={() => setReviewModalBudget(null)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#141C1E] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Ban đề xuất:</p>
                  <p className="font-bold text-white text-sm">{reviewModalBudget.deptName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase">Tổng tiền xin duyệt:</p>
                  <p className="font-black text-emerald-400 text-base">{formatVND(reviewModalBudget.totalAmount)}</p>
                </div>
              </div>

              {/* Items detail list */}
              <div>
                <p className="text-[11px] font-bold text-slate-300 uppercase mb-1">Chi tiết các hạng mục:</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {reviewModalBudget.items?.map((it, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-[#141C1E] border border-white/5 flex items-center justify-between">
                      <span>{it.name} (x{it.qty})</span>
                      <span className="font-mono text-emerald-400">{formatVND(it.total || (it.qty * it.unitPrice))}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BCN Review Note */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Ý Kiến Phê Duyệt Của BCN
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú giải ngân, điều kiện hoặc lý do yêu cầu sửa..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleReviewAction('rejected')}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Yêu Cầu Sửa Đổi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('approved')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Phê Duyệt Dự Trù</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
