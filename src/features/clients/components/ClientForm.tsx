import React, { useState, useMemo } from 'react';
import RupiahInput from '@/shared/form/RupiahInput';
import { ClientType, Package, AddOn, Profile, Card, PromoCode } from '@/types';
import { formatCurrency } from '@/features/clients/utils/clients.utils';

import { ClientFormProps } from '@/features/clients/types';

const ClientForm: React.FC<ClientFormProps> = ({ 
    isOpen,
    formData, 
    setFormData, 
    onChange, 
    onSubmit, 
    onClose, 
    packages, 
    addOns, 
    mode, 
    cards, 
    promoCodes,
    userProfile
}) => {
    if (!isOpen) return null;
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    // Get unique regions from packages
    const availableRegions = useMemo(() => {
        const regions = packages
            .map(p => p.region)
            .filter((r): r is string => !!r);
        return Array.from(new Set(regions));
    }, [packages]);

    // Filter packages by selected region
    const visiblePackages = useMemo(() => {
        if (!selectedRegion) return packages;
        return packages.filter(p => p.region === selectedRegion);
    }, [packages, selectedRegion]);

    // Filter add-ons by selected region
    const visibleAddOns = useMemo(() => {
        if (!selectedRegion) return addOns;
        return addOns.filter(a => !a.region || a.region === selectedRegion);
    }, [addOns, selectedRegion]);

    const priceCalculations = useMemo(() => {
        const selectedPackage = packages.find(p => p.id === formData.packageId);
        // Prefer explicit unitPrice stored in form (selected duration), fallback to package.price
        const packagePrice = (formData.unitPrice && Number(formData.unitPrice) > 0) ? Number(formData.unitPrice) : (selectedPackage?.price || 0);

        const addOnsPrice = addOns
            .filter(addon => formData.selectedAddOnIds.includes(addon.id))
            .reduce((sum, addon) => sum + addon.price, 0);

        let totalProjectBeforeDiscount = packagePrice + addOnsPrice;
        let discountAmount = 0;
        let discountApplied = 'N/A';
        const promoCode = promoCodes.find(p => p.id === formData.promoCodeId);

        if (promoCode) {
            if (promoCode.discountType === 'percentage') {
                discountAmount = (totalProjectBeforeDiscount * promoCode.discountValue) / 100;
                discountApplied = `${promoCode.discountValue}%`;
            } else { // fixed
                discountAmount = promoCode.discountValue;
                discountApplied = formatCurrency(promoCode.discountValue);
            }
        }

        const totalProject = totalProjectBeforeDiscount - discountAmount;
        const remainingPayment = totalProject - Number(formData.dp);

        return { packagePrice, addOnsPrice, totalProject, remainingPayment, discountAmount, discountApplied };
    }, [formData.packageId, formData.selectedAddOnIds, formData.dp, formData.promoCodeId, packages, addOns, promoCodes, formData.unitPrice]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-brand-border flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gradient">
                        {mode === 'add' ? 'Tambah Pengantin Baru' : 'Edit Data Pengantin'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-brand-bg rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
                            {/* Left Column: Client & Project Info */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                    Informasi Pengantin
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">Nama Pengantin</label>
                                        <input type="text" name="clientName" value={formData.clientName} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nama Lengkap" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">Jenis Pengantin</label>
                                        <select name="clientType" value={formData.clientType} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required>
                                            {Object.values(ClientType).map(ct => <option key={ct} value={ct}>{ct}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">Nomor Telepon</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="08xxxxxxxx" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">No. WhatsApp</label>
                                        <input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nama Kontak WA" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="email@contoh.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">Instagram</label>
                                        <input type="text" name="instagram" value={formData.instagram || ''} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="@username" />
                                    </div>
                                </div>

                                <h4 className="text-lg font-bold text-brand-text-primary flex items-center gap-2 pt-4">
                                    <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                                    Informasi Acara Pernikahan
                                </h4>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-text-secondary">Nama Acara Pernikahan</label>
                                    <input type="text" name="projectName" value={formData.projectName} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Contoh: Wedding Budi & Siti" required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">Jenis Acara</label>
                                        <select name="projectType" value={formData.projectType || ''} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required>
                                            <option value="" disabled>Pilih Jenis...</option>
                                            {userProfile.projectTypes?.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                                            {formData.projectType && !userProfile.projectTypes?.includes(formData.projectType) && (
                                                <option value={formData.projectType}>{formData.projectType}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">Tanggal Acara</label>
                                        <input type="date" name="date" value={formData.date} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-text-secondary">Lokasi / Venue</label>
                                    <input type="text" name="location" value={formData.location} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nama Gedung / Kota" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-text-secondary">Alamat Lengkap</label>
                                    <textarea name="address" value={formData.address || ''} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]" placeholder="Alamat lengkap lokasi acara"></textarea>
                                </div>
                            </div>

                            {/* Right Column: Financial & Other Info */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold text-brand-text-primary flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                                    Detail Package & Pembayaran
                                </h4>
                                
                                {availableRegions.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">Wilayah Layanan</label>
                                        <select 
                                            value={selectedRegion || ''} 
                                            onChange={(e) => {
                                                setSelectedRegion(e.target.value || null);
                                                setFormData({ ...formData, packageId: '', selectedAddOnIds: [] });
                                            }} 
                                            className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        >
                                            <option value="">Semua Wilayah</option>
                                            {availableRegions.map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-4 p-5 bg-brand-bg rounded-2xl border border-brand-border">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-text-secondary">Pilih Package</label>
                                        <select name="packageId" value={formData.packageId} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" required>
                                            <option value="">Pilih Package...</option>
                                            {visiblePackages.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}{p.region ? ` (${p.region})` : ''} - {formatCurrency(p.price)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Duration selector when package has durationOptions */}
                                    {(() => {
                                        const pkg = packages.find(p => p.id === formData.packageId);
                                        if (pkg && pkg.durationOptions && pkg.durationOptions.length > 0) {
                                            return (
                                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                                    <label className="text-sm font-medium text-brand-text-secondary">Pilih Durasi</label>
                                                    <select name="durationSelection" value={formData.durationSelection || ''} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                                                        <option value="">Pilih Durasi...</option>
                                                        {pkg.durationOptions.map((opt, idx) => <option key={idx} value={opt.label}>{opt.label} — {formatCurrency(opt.price)}</option>)}
                                                    </select>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-brand-text-secondary flex items-center justify-between">
                                            Tambah Add-On
                                            <span className="text-xs font-normal text-brand-text-secondary">Pilih sesuai kebutuhan</span>
                                        </label>
                                        <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                            {visibleAddOns.map(addon => (
                                                <label key={addon.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${formData.selectedAddOnIds.includes(addon.id) ? 'border-blue-500 bg-blue-50/50' : 'border-brand-border hover:bg-white'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <input type="checkbox" checked={formData.selectedAddOnIds.includes(addon.id)} onChange={onChange} name="addOns" id={addon.id} className="w-4 h-4 rounded text-blue-600" />
                                                        <span className="text-sm font-medium">{addon.name}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-brand-text-secondary">{formatCurrency(addon.price)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-text-secondary">Kode Promo</label>
                                    <select name="promoCodeId" value={formData.promoCodeId || ''} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                        <option value="">Tidak ada promo</option>
                                        {promoCodes.filter(p => p.isActive).map(p => (
                                            <option key={p.id} value={p.id}>{p.code} ({p.discountType === 'percentage' ? `${p.discountValue}%` : formatCurrency(p.discountValue)})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-brand-border space-y-4 shadow-inner">
                                    <div className="flex justify-between items-center text-sm text-brand-text-secondary">
                                        <span>Total Biaya</span>
                                        <span className="font-semibold">{formatCurrency(priceCalculations.totalProject + priceCalculations.discountAmount)}</span>
                                    </div>
                                    {priceCalculations.discountAmount > 0 && (
                                        <div className="flex justify-between items-center text-sm text-emerald-600 font-medium">
                                            <span>Diskon Promo</span>
                                            <span>-{formatCurrency(priceCalculations.discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-lg font-bold text-brand-text-primary">
                                        <span>Total Akhir</span>
                                        <span>{formatCurrency(priceCalculations.totalProject)}</span>
                                    </div>

                                    <div className="pt-4 grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-brand-text-secondary">Uang DP</label>
                                            <RupiahInput
                                                id="dp"
                                                name="dp"
                                                value={String(formData.dp ?? '')}
                                                onChange={(raw) => setFormData((prev: any) => ({ ...prev, dp: raw }))}
                                                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white font-bold text-blue-600 text-right"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-brand-text-secondary">Kartu Tujuan</label>
                                            <select name="dpDestinationCardId" value={formData.dpDestinationCardId || ''} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white" required={Number(formData.dp) > 0}>
                                                <option value="">Pilih Kartu...</option>
                                                {cards.map(c => <option key={c.id} value={c.id}>{c.bankName} - {c.lastFourDigits}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-2 text-sm">
                                        <span className="text-brand-text-secondary">Sisa Tagihan</span>
                                        <span className="font-bold text-red-500">{formatCurrency(priceCalculations.remainingPayment)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-text-secondary">Catatan Tambahan</label>
                                    <textarea name="notes" value={formData.notes || ''} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px]" placeholder="Catatan khusus..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end items-center gap-4 pt-6 border-t border-brand-border">
                            <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl font-semibold text-brand-text-secondary hover:bg-brand-bg transition-colors">
                                Batal
                            </button>
                            <button type="submit" className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                                {mode === 'add' ? 'Simpan Data Pengantin' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { ClientForm };
