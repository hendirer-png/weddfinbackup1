import React from 'react';
import Modal from '@/shared/ui/Modal';
import { Share2Icon } from '@/constants';

interface PackageModalsProps {
    isInfoOpen: boolean;
    onInfoClose: () => void;
    isShareOpen: boolean;
    onShareClose: () => void;
    publicUrl: string;
    onCopyLink: () => void;
}

export const PackageInfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Panduan Package Vendor">
        <div className="space-y-4 text-sm text-brand-text-primary text-justify leading-relaxed">
            <p>Halaman ini adalah pusat pengelolaan layanan Anda. Di sini Anda bisa mengatur Package utama dan layanan tambahan (add-ons).</p>
            <div className="space-y-3">
                <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/40">
                    <h5 className="font-bold text-brand-accent mb-1">1. Package Utama</h5>
                    <p className="text-xs">Kelompokkan layanan Anda berdasarkan kategori. Anda bisa menambahkan opsi durasi dengan harga yang berbeda-beda untuk satu Package yang sama.</p>
                </div>
                <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/40">
                    <h5 className="font-bold text-brand-accent mb-1">2. Opsi Durasi (Advanced)</h5>
                    <p className="text-xs">Saat mengedit Package, gunakan "Tambah Opsi Durasi" untuk membuat variasi (cth: 2 Jam, 4 Jam). Klik ikon detail pada opsi tersebut untuk mengatur tim dan item khusus untuk durasi tersebut.</p>
                </div>
                <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/40">
                    <h5 className="font-bold text-brand-accent mb-1">3. Bagikan Portofolio</h5>
                    <p className="text-xs">Klik tombol "Bagikan" untuk mendapatkan tautan halaman publik Anda. Tautan ini bisa dikirimkan ke calon pengantin agar mereka bisa melihat rincian Package dan langsung melakukan booking.</p>
                </div>
            </div>
        </div>
    </Modal>
);

export const PackageShareModal: React.FC<{ isOpen: boolean; onClose: () => void; publicUrl: string; onCopyLink: () => void }> = ({ 
    isOpen, onClose, publicUrl, onCopyLink 
}) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Bagikan Portofolio Package">
        <div className="space-y-4">
            <p className="text-sm text-brand-text-secondary">Gunakan tautan ini untuk membagikan daftar Package Anda kepada calon pengantin.</p>
            <div className="p-4 bg-brand-bg rounded-2xl border-2 border-dashed border-brand-border flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center">
                    <Share2Icon className="w-8 h-8 text-brand-accent" />
                </div>
                <div className="w-full">
                    <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest text-center mb-2">Tautan Publik Anda</p>
                    <div className="bg-white p-3 rounded-xl border border-brand-border text-center break-all text-xs font-medium text-brand-text-primary select-all">
                        {publicUrl}
                    </div>
                </div>
                <button onClick={onCopyLink} className="button-primary w-full py-3 shadow-lg">Salin Tautan</button>
            </div>
        </div>
    </Modal>
);
