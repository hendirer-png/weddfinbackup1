import React from 'react';
import Modal from '@/shared/ui/Modal';
import RupiahInput from '@/shared/form/RupiahInput';
import { TransactionType, CardType, PocketType, Profile, Project, Card, FinancialPocket } from '@/types';
import { formatCurrency } from '@/features/finance/utils/finance.utils';

interface FinanceModalsProps {
    modalState: { type: any; mode: 'add' | 'edit'; data?: any };
    onClose: () => void;
    form: any;
    setForm: React.Dispatch<React.SetStateAction<any>>;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    cards: Card[];
    pockets: FinancialPocket[];
    projects: Project[];
    profile: Profile;
}

export const FinanceModals: React.FC<FinanceModalsProps> = ({
    modalState,
    onClose,
    form,
    setForm,
    onFormChange,
    onSubmit,
    cards,
    pockets,
    projects,
    profile
}) => {
    if (!modalState.type) return null;

    const renderTitle = () => {
        const { mode, type, data } = modalState;
        const prefix = mode === 'add' ? 'Tambah' : 'Edit';
        switch (type) {
            case 'transaction': return `${prefix} Transaksi`;
            case 'pocket': return `${prefix} Kantong`;
            case 'card': return `${prefix} Kartu/Akun`;
            case 'topup-cash': return 'Top-up Tunai';
            case 'transfer':
                if (form.type === 'withdraw') return `Tarik Dana dari "${data?.name}"`;
                if (form.type === 'deposit') return `Setor Dana ke "${data?.name}"`;
                return 'Transfer';
            default: return 'Modal Keuangan';
        }
    };

    return (
        <Modal isOpen={!!modalState.type} onClose={onClose} title={renderTitle()}>
            <form onSubmit={onSubmit} className="space-y-4">
                {modalState.type === 'transaction' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <select name="type" value={form.type} onChange={onFormChange} className="input-field">
                                    <option value={TransactionType.EXPENSE}>Pengeluaran</option>
                                    <option value={TransactionType.INCOME}>Pemasukan</option>
                                </select>
                                <label className="input-label">Jenis</label>
                            </div>
                            <div className="input-group">
                                <input type="date" name="date" value={form.date} onChange={onFormChange} className="input-field" required />
                                <label className="input-label">Tanggal</label>
                            </div>
                        </div>
                        <div className="input-group">
                            <input type="text" name="description" value={form.description} onChange={onFormChange} className="input-field" placeholder=" " required />
                            <label className="input-label">Deskripsi</label>
                        </div>
                        <div className="input-group">
                            <RupiahInput
                                value={String(form.amount ?? '')}
                                onChange={(raw) => setForm((prev: any) => ({ ...prev, amount: raw }))}
                                className="input-field"
                                placeholder=" "
                                required
                            />
                            <label className="input-label">Jumlah (IDR)</label>
                        </div>
                        <div className="input-group">
                            <select name="category" value={form.category} onChange={onFormChange} className="input-field" required>
                                <option value="">Pilih Kategori...</option>
                                {(form.type === TransactionType.INCOME ? profile.incomeCategories : profile.expenseCategories).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <label className="input-label">Kategori</label>
                        </div>
                        {form.type === TransactionType.INCOME ? (
                            <div className="input-group">
                                <select name="cardId" value={form.cardId || ''} onChange={onFormChange} className="input-field" required>
                                    <option value="">Pilih Tujuan...</option>
                                    {cards.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.cardHolderName} {c.cardType !== CardType.TUNAI ? `(${c.bankName} **** ${c.lastFourDigits})` : '(Tunai)'}
                                        </option>
                                    ))}
                                </select>
                                <label className="input-label">Setor Ke</label>
                            </div>
                        ) : (
                            <div className="input-group">
                                <select name="sourceId" value={form.sourceId || ''} onChange={onFormChange} className="input-field" required>
                                    <option value="">Pilih Sumber...</option>
                                    {cards.map(c => (
                                        <option key={c.id} value={`card-${c.id}`}>{c.cardHolderName} ({c.bankName || 'Tunai'})</option>
                                    ))}
                                    {pockets.filter(p => p.type === PocketType.EXPENSE).map(p => (
                                        <option key={p.id} value={`pocket-${p.id}`}>{p.name} (Sisa: {formatCurrency(p.amount)})</option>
                                    ))}
                                </select>
                                <label className="input-label">Sumber Dana</label>
                            </div>
                        )}
                        <div className="input-group">
                            <select name="projectId" value={form.projectId || ''} onChange={onFormChange} className="input-field">
                                <option value="">Tidak Terkait Proyek</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.projectName} ({p.clientName})</option>)}
                            </select>
                            <label className="input-label">Terkait Proyek (Opsional)</label>
                        </div>
                    </>
                )}

                {modalState.type === 'card' && (
                    <>
                        <div className="input-group">
                            <select name="cardType" value={form.cardType} onChange={onFormChange} className="input-field">
                                {Object.values(CardType).map(ct => <option key={ct} value={ct}>{ct}</option>)}
                            </select>
                            <label className="input-label">Jenis Akun</label>
                        </div>
                        <div className="input-group">
                            <input type="text" name="cardHolderName" value={form.cardHolderName} onChange={onFormChange} className="input-field" required />
                            <label className="input-label">{form.cardType === CardType.TUNAI ? 'Nama Akun Kas' : 'Nama Pemegang Kartu'}</label>
                        </div>
                        {modalState.mode === 'add' && (
                            <div className="input-group">
                                <RupiahInput value={String(form.initialBalance ?? '')} onChange={(raw) => setForm((p: any) => ({ ...p, initialBalance: raw }))} className="input-field" />
                                <label className="input-label">Saldo Awal</label>
                            </div>
                        )}
                        {form.cardType !== CardType.TUNAI && (
                            <>
                                <div className="input-group">
                                    <input type="text" name="bankName" value={form.bankName} onChange={onFormChange} className="input-field" required />
                                    <label className="input-label">Nama Bank</label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="input-group">
                                        <input type="text" name="lastFourDigits" value={form.lastFourDigits} onChange={onFormChange} className="input-field" maxLength={4} required />
                                        <label className="input-label">4 Digit Terakhir</label>
                                    </div>
                                    <div className="input-group">
                                        <input type="text" name="expiryDate" value={form.expiryDate} onChange={onFormChange} className="input-field" placeholder="MM/YY" />
                                        <label className="input-label">Kadaluwarsa</label>
                                    </div>
                                </div>
                            </>
                        )}
                        {modalState.mode === 'edit' && (
                            <div className="p-4 bg-brand-bg rounded-lg mt-4 border border-brand-border/30">
                                <h4 className="text-xs font-bold uppercase text-brand-text-secondary mb-3">Penyesuaian Saldo</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="input-group !mt-0">
                                        <RupiahInput allowNegative value={String(form.adjustmentAmount ?? '')} onChange={(raw) => setForm((p: any) => ({ ...p, adjustmentAmount: raw }))} className="input-field" />
                                        <label className="input-label">Jumlah</label>
                                    </div>
                                    <div className="input-group !mt-0">
                                        <input type="text" name="adjustmentReason" value={form.adjustmentReason || ''} onChange={onFormChange} className="input-field" />
                                        <label className="input-label">Alasan</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {modalState.type === 'pocket' && (
                    <>
                        <div className="input-group"><input type="text" name="name" value={form.name} onChange={onFormChange} className="input-field" required /><label className="input-label">Nama Kantong</label></div>
                        <div className="input-group"><textarea name="description" value={form.description} onChange={onFormChange} className="input-field" rows={2} /><label className="input-label">Deskripsi</label></div>
                        <div className="input-group">
                            <select name="sourceCardId" value={form.sourceCardId} onChange={onFormChange} className="input-field" required>
                                <option value="">Pilih Kartu...</option>
                                {cards.map(c => <option key={c.id} value={c.id}>{c.bankName || 'Tunai'} {c.lastFourDigits !== 'CASH' && `**** ${c.lastFourDigits}`}</option>)}
                            </select>
                            <label className="input-label">Sumber Dana</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <select name="type" value={form.type} onChange={onFormChange} className="input-field">
                                    {Object.values(PocketType).map(pt => <option key={pt} value={pt}>{pt}</option>)}
                                </select>
                                <label className="input-label">Tipe</label>
                            </div>
                            <div className="input-group">
                                <RupiahInput value={String(form.goalAmount ?? '')} onChange={(raw) => setForm((p: any) => ({ ...p, goalAmount: raw }))} className="input-field" />
                                <label className="input-label">Target (Opsional)</label>
                            </div>
                        </div>
                    </>
                )}

                {(modalState.type === 'transfer' || modalState.type === 'topup-cash') && (
                    <>
                        <div className="input-group">
                            <select name="fromCardId" value={form.fromCardId} onChange={onFormChange} className="input-field" required>
                                <option value="">Pilih Kartu Sumber...</option>
                                {cards.filter(c => c.cardType !== CardType.TUNAI).map(c => <option key={c.id} value={c.id}>{c.bankName} **** {c.lastFourDigits} (Saldo: {formatCurrency(c.balance)})</option>)}
                            </select>
                            <label className="input-label">Ambil dari Kartu</label>
                        </div>
                        <div className="input-group">
                            <RupiahInput
                                value={String(form.amount ?? '')}
                                onChange={(raw) => setForm((prev: any) => ({ ...prev, amount: raw }))}
                                className="input-field"
                                required
                            />
                            <label className="input-label">Jumlah (IDR)</label>
                        </div>
                    </>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-brand-border">
                    <button type="button" onClick={onClose} className="button-secondary">Batal</button>
                    <button type="submit" className="button-primary">{modalState.mode === 'add' ? 'Simpan' : 'Update'}</button>
                </div>
            </form>
        </Modal>
    );
};
