import React from 'react';
import Modal from '@/shared/ui/Modal';
import RupiahInput from '@/shared/form/RupiahInput';
import { Trash2Icon, ChevronDownIcon } from '@/constants';
import { Profile, REGIONS } from '@/types';

interface PackageFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    editMode: string | null;
    formData: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onPriceChange: (raw: string) => void;
    onCoverImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDurationOptionChange: (index: number, field: string, value: any) => void;
    addDurationOption: () => void;
    removeDurationOption: (index: number) => void;
    expandedDurationIndex: number | null;
    setExpandedDurationIndex: (index: number | null) => void;
    onDurationDetailChange: (optIndex: number, type: 'digital' | 'physical', itemIndex: number, field: string, value: any) => void;
    addDurationDetail: (optIndex: number, type: 'digital' | 'physical') => void;
    removeDurationDetail: (optIndex: number, type: 'digital' | 'physical', itemIndex: number) => void;
    onListChange: (type: 'digital' | 'physical', index: number, field: string, value: any) => void;
    addListItem: (type: 'digital' | 'physical') => void;
    removeListItem: (type: 'digital' | 'physical', index: number) => void;
    profile: Profile;
    existingRegions: string[];
    unionRegions: { value: string; label: string }[];
}

const PackageFormModal: React.FC<PackageFormModalProps> = ({
    isOpen, onClose, onSubmit, editMode, formData,
    onInputChange, onPriceChange, onCoverImageChange,
    onDurationOptionChange, addDurationOption, removeDurationOption,
    expandedDurationIndex, setExpandedDurationIndex,
    onDurationDetailChange, addDurationDetail, removeDurationDetail,
    onListChange, addListItem, removeListItem,
    profile, existingRegions, unionRegions
}) => {
    const hasValidOptions = Array.isArray(formData.durationOptions) && formData.durationOptions.some((o: any) => String(o.label || '').trim() !== '' && String(o.price || '') !== '');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editMode === 'new' ? 'Tambah Package Baru' : 'Edit Package'} size="3xl">
            <form onSubmit={onSubmit} className="space-y-5 md:space-y-6 max-h-[70vh] overflow-y-auto pr-2 pb-4 form-compact form-compact--ios-scale">
                {/* Section 1: Informasi Dasar */}
                <section className="bg-white/40 md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border md:border-0 border-brand-border/40">
                    <h4 className="text-sm md:text-base font-semibold text-gradient border-b border-brand-border/40 pb-2 mb-4">Informasi Dasar Package</h4>
                    <p className="text-xs text-brand-text-secondary mb-4">Masukkan nama dan harga Package layanan Anda.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group">
                            <input type="text" name="name" value={formData.name} onChange={onInputChange} className="input-field" placeholder=" " required />
                            <label className="input-label">Nama Package</label>
                        </div>
                        {hasValidOptions ? (
                            <div className="input-group">
                                <input type="text" className="input-field" value="Mengikuti opsi durasi default" disabled placeholder=" " />
                                <label className="input-label">Harga (mengikuti opsi default)</label>
                            </div>
                        ) : (
                            <div className="input-group">
                                <RupiahInput value={formData.price.toString()} onChange={onPriceChange} className="input-field" placeholder=" " required />
                                <label className="input-label">Harga (IDR)</label>
                            </div>
                        )}
                    </div>
                </section>

                {/* Section 2: Opsi Durasi */}
                <section className="bg-white/40 md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border md:border-0 border-brand-border/40">
                    <h4 className="text-sm md:text-base font-semibold text-gradient border-b border-brand-border/40 pb-2 mb-4">Opsi Durasi & Harga (Opsional)</h4>
                    <p className="text-xs text-brand-text-secondary mb-3">Tambahkan variasi durasi dengan harga berbeda.</p>
                    {formData.durationOptions?.map((opt: any, index: number) => (
                        <div key={index} className="mt-2 border border-brand-border/40 bg-white/40 rounded-xl overflow-hidden shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-3 border-b border-brand-border/30 bg-brand-surface/40">
                                <input type="text" value={opt.label} onChange={e => onDurationOptionChange(index, 'label', e.target.value)} className="input-field md:col-span-2 bg-white/80" placeholder="Label (cth: 8 Jam)" />
                                <RupiahInput value={opt.price.toString()} onChange={(raw) => onDurationOptionChange(index, 'price', raw)} className="input-field md:col-span-2 bg-white/80" placeholder="Harga" />
                                <div className="flex items-center justify-end gap-1 md:gap-2">
                                    <label className="flex items-center gap-1 text-sm text-brand-text-secondary"><input type="radio" name="durationDefault" checked={!!opt.default} onChange={() => onDurationOptionChange(index, 'default', true)} /> Default</label>
                                    <button type="button" onClick={() => setExpandedDurationIndex(expandedDurationIndex === index ? null : index)} className="p-1.5 rounded hover:bg-brand-input text-brand-accent">
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${expandedDurationIndex === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    <button type="button" onClick={() => removeDurationOption(index)} className="p-2 text-brand-danger"><Trash2Icon className="w-4 h-4" /></button>
                                </div>
                            </div>
                            {expandedDurationIndex === index && (
                                <div className="p-3 border-t border-brand-border bg-brand-surface space-y-3">
                                    <div className="input-group">
                                        <input type="text" value={opt.photographers || ''} onChange={e => onDurationOptionChange(index, 'photographers', e.target.value)} className="input-field" placeholder=" " />
                                        <label className="input-label">Jumlah Tim</label>
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-text-secondary mb-1">Deskripsi Package</p>
                                        {(opt.digitalItems || ['']).map((item: string, i: number) => (
                                            <div key={i} className="flex gap-2 mt-1">
                                                <input type="text" value={item} onChange={e => onDurationDetailChange(index, 'digital', i, '', e.target.value)} className="input-field flex-grow text-sm" placeholder="Deskripsi item..." />
                                                <button type="button" onClick={() => removeDurationDetail(index, 'digital', i)} className="p-2 text-brand-danger"><Trash2Icon className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addDurationDetail(index, 'digital')} className="text-xs font-semibold text-brand-accent mt-1">+ Tambah Deskripsi</button>
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-text-secondary mb-1">Vendor (Allpackage)</p>
                                        {(opt.physicalItems || [{ name: '', price: 0 }]).map((item: any, i: number) => (
                                            <div key={i} className="flex gap-2 mt-1">
                                                <input type="text" value={item.name || ''} onChange={e => onDurationDetailChange(index, 'physical', i, 'name', e.target.value)} className="input-field flex-grow text-sm" placeholder="Nama vendor/item" />
                                                <button type="button" onClick={() => removeDurationDetail(index, 'physical', i)} className="p-2 text-brand-danger"><Trash2Icon className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addDurationDetail(index, 'physical')} className="text-xs font-semibold text-brand-accent mt-1">+ Tambah Vendor</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addDurationOption} className="text-sm font-semibold text-brand-accent mt-3">+ Tambah Opsi Durasi</button>
                </section>

                {/* Section 3: Kategori & Wilayah */}
                <section className="bg-white/40 md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border md:border-0 border-brand-border/40">
                    <h4 className="text-sm md:text-base font-semibold text-gradient border-b border-brand-border/40 pb-2 mb-4">Kategori & Wilayah</h4>
                    <div className="input-group">
                        <select name="category" value={formData.category} onChange={onInputChange} className="input-field" required>
                            <option value="">Pilih kategori...</option>
                            {(profile?.packageCategories || []).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <label className="input-label">Kategori</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="input-group">
                            <input type="text" name="region" list="region-suggestions-pkg" value={formData.region} onChange={onInputChange} className="input-field" placeholder=" " />
                            <label className="input-label">Wilayah (opsional)</label>
                            <datalist id="region-suggestions-pkg">
                                {unionRegions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </datalist>
                        </div>
                    </div>
                </section>

                {/* Section 4: Detail Tim */}
                <section className="bg-white/40 md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border md:border-0 border-brand-border/40">
                    <h4 className="text-sm md:text-base font-semibold text-gradient border-b border-brand-border/40 pb-2 mb-4">Detail Tim</h4>
                    <div className="input-group">
                        <input type="text" name="photographers" value={formData.photographers} onChange={onInputChange} className="input-field" placeholder=" " />
                        <label className="input-label">Jumlah Tim</label>
                    </div>
                </section>

                {/* Section 5: Cover Image */}
                <section className="bg-white/40 md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border md:border-0 border-brand-border/40">
                    <h4 className="text-sm md:text-base font-semibold text-gradient border-b border-brand-border/40 pb-2 mb-4">Gambar Sampul</h4>
                    <div className="input-group">
                        <label className="input-label !static !-top-4 !text-brand-accent">Cover Image</label>
                        <input type="file" onChange={onCoverImageChange} className="input-field" accept="image/*" />
                    </div>
                </section>

                {/* Section 6: Deskripsi Package */}
                <section className="bg-white/40 md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border md:border-0 border-brand-border/40">
                    <h4 className="text-sm md:text-base font-semibold text-gradient border-b border-brand-border/40 pb-2 mb-4">Deskripsi Package</h4>
                    {formData.digitalItems.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                            <input type="text" value={item} onChange={e => onListChange('digital', index, '', e.target.value)} className="input-field flex-grow" placeholder="Deskripsi..." />
                            <button type="button" onClick={() => removeListItem('digital', index)} className="p-2 text-brand-danger"><Trash2Icon className="w-4 h-4" /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addListItem('digital')} className="text-sm font-semibold text-brand-accent mt-3">+ Tambah Item Deskripsi</button>
                </section>

                {/* Section 7: Vendor */}
                <section className="bg-white/40 md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border md:border-0 border-brand-border/40">
                    <h4 className="text-sm md:text-base font-semibold text-gradient border-b border-brand-border/40 pb-2 mb-4">Vendor (Allpackage)</h4>
                    {formData.physicalItems.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                            <input type="text" value={item.name} onChange={e => onListChange('physical', index, 'name', e.target.value)} className="input-field flex-grow" placeholder="Nama Vendor/Item" />
                            <button type="button" onClick={() => removeListItem('physical', index)} className="p-2 text-brand-danger"><Trash2Icon className="w-4 h-4" /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addListItem('physical')} className="text-sm font-semibold text-brand-accent mt-3">+ Tambah Vendor</button>
                </section>

                <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-brand-border/40 sticky -bottom-4 bg-white/90 backdrop-blur-xl p-4">
                    <button type="button" onClick={onClose} className="button-secondary">Batal</button>
                    <button type="submit" className="button-primary">{editMode === 'new' ? 'Simpan Package' : 'Update Package'}</button>
                </div>
            </form>
        </Modal>
    );
};

export default PackageFormModal;
