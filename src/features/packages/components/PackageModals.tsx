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

export const PackageShareModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    publicUrl: string; 
    bookingUrl: string;
    onCopyLink: () => void; 
    onCopyBookingLink: () => void;
    regionName?: string;
}> = ({ 
    isOpen, onClose, publicUrl, bookingUrl, onCopyLink, onCopyBookingLink, regionName 
}) => (
    <Modal isOpen={isOpen} onClose={onClose} title={`Bagikan Tautan ${regionName ? `(${regionName})` : ''}`}>
        <div className="space-y-6">
            <p className="text-sm text-brand-text-secondary">Pilih tautan yang ingin Anda bagikan kepada calon pengantin.</p>
            
            <div className="space-y-4">
                {/* Pricelist Link */}
                <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Tautan Pricelist (Katalog)</p>
                        <span className="bg-brand-accent/10 px-2 py-0.5 rounded text-[9px] font-bold text-brand-accent uppercase">Public</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-brand-border text-xs font-medium text-brand-text-primary truncate select-all">
                        {publicUrl}
                    </div>
                    <button onClick={onCopyLink} className="button-primary py-2 text-xs shadow-md">Salin Tautan Pricelist</button>
                </div>

                {/* Booking Link */}
                <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Tautan Formulir Booking</p>
                        <span className="bg-green-500/10 px-2 py-0.5 rounded text-[9px] font-bold text-green-600 uppercase">Direct</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-brand-border text-xs font-medium text-brand-text-primary truncate select-all">
                        {bookingUrl}
                    </div>
                    <button onClick={onCopyBookingLink} className="button-secondary py-2 text-xs shadow-md border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white">Salin Tautan Booking</button>
                    <p className="text-[9px] text-brand-text-secondary italic text-center">* Tautan ini langsung menuju formulir pemesanan{regionName ? ` yang sudah terfilter untuk wilayah ${regionName}` : ''}.</p>
                </div>
            </div>
        </div>
    </Modal>
);
