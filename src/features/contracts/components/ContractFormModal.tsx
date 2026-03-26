import React from 'react';
import Modal from '@/shared/ui/Modal';
import { Contract, Client, Project } from '@/types';
import { FileTextIcon, CalendarIcon, UserCheckIcon, UsersIcon, BriefcaseIcon, DollarSignIcon } from '@/constants';

interface ContractFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    clients: Client[];
    availableProjects: Project[];
    selectedClientId: string;
    setSelectedClientId: (id: string) => void;
    selectedProjectId: string;
    setSelectedProjectId: (id: string) => void;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export const ContractFormModal: React.FC<ContractFormModalProps> = ({
    isOpen,
    onClose,
    mode,
    formData,
    setFormData,
    clients,
    availableProjects,
    selectedClientId,
    setSelectedClientId,
    selectedProjectId,
    setSelectedProjectId,
    handleFormChange,
    handleSubmit
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Buat Kontrak Baru' : 'Edit Kontrak'} size="4xl">
            <form onSubmit={handleSubmit} className="space-y-4 form-compact form-compact--ios-scale">
                <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-2xl p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                            <FileTextIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-base font-black text-brand-text-light tracking-tight">Pilih Klien & Proyek</h4>
                            <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Langkah pertama untuk membuat kontrak</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="input-group">
                            <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="input-field" required>
                                <option value="">Pilih Klien...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <label className="input-label">Klien</label>
                        </div>
                        <div className="input-group">
                            <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="input-field" required disabled={!selectedClientId}>
                                <option value="">{selectedClientId ? 'Pilih Proyek...' : 'Pilih Klien Dahulu'}</option>
                                {availableProjects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                            </select>
                            <label className="input-label">Proyek</label>
                        </div>
                    </div>
                </div>
                
                <div className="max-h-[55vh] overflow-y-auto pr-4 space-y-8 custom-scrollbar">
                    {/* Section: Penandatanganan */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-brand-border/50 pb-3">
                            <CalendarIcon className="w-5 h-5 text-indigo-500" />
                            <h4 className="text-sm font-black text-brand-text-light uppercase tracking-tight">Detail Penandatanganan</h4>
                        </div>
                        <p className="text-[10px] font-medium text-brand-text-secondary leading-relaxed">Tentukan kapan dan di mana kontrak ini akan ditandatangani.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="input-group"><input type="date" name="signingDate" value={formData.signingDate} onChange={handleFormChange} className="input-field" /><label className="input-label">Tanggal TTD</label></div>
                            <div className="input-group"><input type="text" name="signingLocation" value={formData.signingLocation} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Lokasi TTD</label></div>
                        </div>
                        <div className="input-group mt-4">
                            <input type="text" name="serviceTitle" value={formData.serviceTitle} onChange={handleFormChange} className="input-field" placeholder=" "/>
                            <label className="input-label">Judul Layanan (Contoh: JASA CORPORATE / EVENT)</label>
                        </div>
                    </div>

                    {/* Section: Pihak Klien 1 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-brand-border/50 pb-3">
                            <UserCheckIcon className="w-5 h-5 text-blue-500" />
                            <h4 className="text-sm font-black text-brand-text-light uppercase tracking-tight">Pihak Klien 1</h4>
                        </div>
                        <p className="text-[10px] font-medium text-brand-text-secondary leading-relaxed">Informasi lengkap klien pertama untuk kontrak resmi.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="input-group"><input type="text" name="clientName1" value={formData.clientName1} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Nama Klien 1</label></div>
                             <div className="input-group"><input type="text" name="clientPhone1" value={formData.clientPhone1} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Telepon Klien 1</label></div>
                        </div>
                        <div className="input-group"><input type="text" name="clientAddress1" value={formData.clientAddress1} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Alamat Klien 1</label></div>
                    </div>
                    
                    {/* Section: Pihak Klien 2 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-brand-border/50 pb-3">
                            <UsersIcon className="w-5 h-5 text-purple-500" />
                            <h4 className="text-sm font-black text-brand-text-light uppercase tracking-tight">Pihak Klien 2 (Opsional)</h4>
                        </div>
                        <p className="text-[10px] font-medium text-brand-text-secondary leading-relaxed">Isi jika ada klien kedua (misal: pasangan pengantin).</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="input-group"><input type="text" name="clientName2" value={formData.clientName2} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Nama Klien 2</label></div>
                             <div className="input-group"><input type="text" name="clientPhone2" value={formData.clientPhone2} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Telepon Klien 2</label></div>
                        </div>
                        <div className="input-group"><input type="text" name="clientAddress2" value={formData.clientAddress2} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Alamat Klien 2</label></div>
                    </div>

                    {/* Section: Ruang Lingkup */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-brand-border/50 pb-3">
                            <BriefcaseIcon className="w-5 h-5 text-amber-500" />
                            <h4 className="text-sm font-black text-brand-text-light uppercase tracking-tight">Ruang Lingkup Pekerjaan</h4>
                        </div>
                        <p className="text-[10px] font-medium text-brand-text-secondary leading-relaxed">Detail layanan, durasi, jumlah foto, dan rincian teknis lainnya.</p>
                        <div className="flex items-center gap-3 bg-brand-bg border border-brand-border/50 rounded-xl p-3">
                            <input
                                id="includeMeterai"
                                type="checkbox"
                                checked={!!formData.includeMeterai}
                                onChange={(e) => setFormData((prev: any) => ({ ...prev, includeMeterai: e.target.checked }))}
                                className="w-4 h-4 text-brand-accent rounded focus:ring-brand-accent"
                            />
                            <label htmlFor="includeMeterai" className="text-xs font-semibold text-brand-text-primary hover:text-brand-accent transition-colors cursor-pointer">
                                Tambahkan Meterai (10.000)
                            </label>
                        </div>

                        {!!formData.includeMeterai && (
                            <div className="bg-brand-bg/50 border border-brand-border/50 rounded-xl p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-3">Penempatan Meterai</div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-brand-text-primary cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="meteraiPlacement"
                                            value="client"
                                            checked={(formData.meteraiPlacement || 'client') === 'client'}
                                            onChange={() => setFormData((prev: any) => ({ ...prev, meteraiPlacement: 'client' }))}
                                            className="w-4 h-4 text-brand-accent focus:ring-brand-accent"
                                        />
                                        <span className="group-hover:text-brand-accent transition-colors">Hanya TTD Klien</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-brand-text-primary cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="meteraiPlacement"
                                            value="both"
                                            checked={formData.meteraiPlacement === 'both'}
                                            onChange={() => setFormData((prev: any) => ({ ...prev, meteraiPlacement: 'both' }))}
                                            className="w-4 h-4 text-brand-accent focus:ring-brand-accent"
                                        />
                                        <span className="group-hover:text-brand-accent transition-colors">Dua sisi (Vendor + Klien)</span>
                                    </label>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="input-group"><input type="text" name="shootingDuration" value={formData.shootingDuration} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Durasi Pemotretan</label></div>
                            <div className="input-group"><input type="text" name="guaranteedPhotos" value={formData.guaranteedPhotos} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Jumlah Foto Dijamin</label></div>
                            <div className="input-group"><input type="text" name="albumDetails" value={formData.albumDetails} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Detail Album</label></div>
                            <div className="input-group"><input type="text" name="otherItems" value={formData.otherItems} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Item Lainnya</label></div>
                            <div className="input-group"><input type="text" name="personnelCount" value={formData.personnelCount} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Jumlah Personel</label></div>
                            <div className="input-group"><input type="text" name="deliveryTimeframe" value={formData.deliveryTimeframe} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Waktu Pengerjaan</label></div>
                        </div>
                    </div>
                    
                    {/* Section: Isi Kontrak (Pasal-Pasal) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-brand-border/50 pb-3">
                            <FileTextIcon className="w-5 h-5 text-brand-accent" />
                            <h4 className="text-sm font-black text-brand-text-light uppercase tracking-tight">Isi & Pasal Kontrak (Custome Text)</h4>
                        </div>
                        <p className="text-[10px] font-medium text-brand-text-secondary leading-relaxed">Sesuaikan kata-kata pada setiap pasal kontrak di bawah ini. Jangan hapus jika tidak diperlukan.</p>
                        
                        <div className="space-y-6">
                            <div className="input-group">
                                <textarea name="pasal1Content" value={formData.pasal1Content} onChange={handleFormChange} className="input-field min-h-[150px] text-xs font-mono" placeholder=" "></textarea>
                                <label className="input-label">PASAL 1 — RUANG LINGKUP PEKERJAAN</label>
                            </div>
                            <div className="input-group">
                                <textarea name="pasal2Content" value={formData.pasal2Content} onChange={handleFormChange} className="input-field min-h-[150px] text-xs font-mono" placeholder=" "></textarea>
                                <label className="input-label">PASAL 2 — BIAYA DAN SISTEM PEMBAYARAN</label>
                            </div>
                            <div className="input-group">
                                <textarea name="pasal3Content" value={formData.pasal3Content} onChange={handleFormChange} className="input-field min-h-[120px] text-xs font-mono" placeholder=" "></textarea>
                                <label className="input-label">PASAL 3 — KETENTUAN PEMBATALAN</label>
                            </div>
                            <div className="input-group">
                                <textarea name="pasal4Content" value={formData.pasal4Content} onChange={handleFormChange} className="input-field min-h-[120px] text-xs font-mono" placeholder=" "></textarea>
                                <label className="input-label">PASAL 4 — KETENTUAN PELAKSANAAN PEKERJAAN</label>
                            </div>
                            <div className="input-group">
                                <textarea name="pasal5Content" value={formData.pasal5Content} onChange={handleFormChange} className="input-field min-h-[120px] text-xs font-mono" placeholder=" "></textarea>
                                <label className="input-label">PASAL 5 — KETENTUAN UMUM</label>
                            </div>
                            <div className="input-group">
                                <textarea name="closingText" value={formData.closingText} onChange={handleFormChange} className="input-field min-h-[80px] text-xs font-mono" placeholder=" "></textarea>
                                <label className="input-label">KALIMAT PENUTUP</label>
                            </div>
                        </div>
                    </div>

                    {/* Section: Pembayaran & Hukum */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-brand-border/50 pb-3">
                            <DollarSignIcon className="w-5 h-5 text-emerald-500" />
                            <h4 className="text-sm font-black text-brand-text-light uppercase tracking-tight">Data Teknis Pembayaran</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="input-group"><input type="date" name="dpDate" value={formData.dpDate} onChange={handleFormChange} className="input-field" /><label className="input-label">Tanggal DP</label></div>
                            <div className="input-group"><input type="date" name="finalPaymentDate" value={formData.finalPaymentDate} onChange={handleFormChange} className="input-field" /><label className="input-label">Tanggal Pelunasan</label></div>
                        </div>
                        <div className="input-group">
                            <textarea name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleFormChange} className="input-field min-h-[100px]" placeholder=" "></textarea>
                            <label className="input-label">Kebijakan Pembatalan</label>
                        </div>
                        <div className="input-group"><input type="text" name="jurisdiction" value={formData.jurisdiction} onChange={handleFormChange} className="input-field" placeholder=" "/><label className="input-label">Wilayah Hukum</label></div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-brand-border">
                    <button type="button" onClick={onClose} className="button-secondary">Batal</button>
                    <button type="submit" className="button-primary">{mode === 'add' ? 'Simpan Kontrak' : 'Update Kontrak'}</button>
                </div>
            </form>
        </Modal>
    );
};
