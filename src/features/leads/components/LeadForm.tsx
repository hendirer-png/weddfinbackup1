import React from 'react';
import { ContactChannel, LeadStatus } from '@/types';
import { LightbulbIcon } from '@/constants';

interface LeadFormProps {
    formData: any;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleCloseModal: () => void;
    modalMode: 'add' | 'edit';
}

export const LeadForm: React.FC<LeadFormProps> = ({ formData, handleFormChange, handleSubmit, handleCloseModal, modalMode }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4 form-compact form-compact--ios-scale">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <LightbulbIcon className="w-4 h-4" />
                    Informasi Calon Pengantin
                </h4>
                <p className="text-xs text-brand-text-secondary">
                    Catat informasi Calon Pengantin baru yang menghubungi Anda. Data ini akan membantu Anda melacak dan mengelola calon pengantin.
                </p>
            </div>

            <div>
                <h5 className="text-sm font-semibold text-brand-text-light mb-3">Data Calon Pengantin</h5>
                <div className="input-group">
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className="input-field" placeholder=" " required />
                    <label htmlFor="name" className="input-label">Nama Calon Pengantin</label>
                    <p className="text-xs text-brand-text-secondary mt-1">Nama Pengantin calon pengantin</p>
                </div>
            </div>

            <div>
                <h5 className="text-sm font-semibold text-brand-text-light mb-3">Sumber & Lokasi</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="input-group">
                        <select id="contactChannel" name="contactChannel" value={formData.contactChannel} onChange={handleFormChange} className="input-field">
                            {Object.values(ContactChannel).map(channel => <option key={channel} value={channel}>{channel}</option>)}
                        </select>
                        <label htmlFor="contactChannel" className="input-label">Sumber Calon Pengantin</label>
                        <p className="text-xs text-brand-text-secondary mt-1">Dari mana Calon Pengantin menghubungi?</p>
                    </div>
                    <div className="input-group">
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleFormChange} className="input-field" placeholder=" " />
                        <label htmlFor="location" className="input-label">Lokasi (Kota)</label>
                        <p className="text-xs text-brand-text-secondary mt-1">Kota domisili Calon Pengantin</p>
                    </div>
                </div>
            </div>

            <div>
                <h5 className="text-sm font-semibold text-brand-text-light mb-3">Alamat Lengkap</h5>
                <div className="input-group">
                    <textarea id="address" name="address" value={formData.address} onChange={handleFormChange} className="input-field" placeholder=" " rows={3}></textarea>
                    <label htmlFor="address" className="input-label">Alamat Lengkap / Gedung</label>
                    <p className="text-xs text-brand-text-secondary mt-1">Alamat spesifik untuk Acara Pernikahan</p>
                </div>
            </div>

            <div>
                <h5 className="text-sm font-semibold text-brand-text-light mb-3">Kontak</h5>
                <div className="input-group">
                    <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleFormChange} className="input-field" placeholder=" " />
                    <label htmlFor="whatsapp" className="input-label">No. WhatsApp</label>
                    <p className="text-xs text-brand-text-secondary mt-1">Nomor WhatsApp aktif untuk komunikasi</p>
                </div>
            </div>

            <div>
                <h5 className="text-sm font-semibold text-brand-text-light mb-3">Catatan Tambahan</h5>
                <div className="input-group">
                    <textarea id="notes" name="notes" value={formData.notes} onChange={handleFormChange} className="input-field" placeholder=" " rows={4}></textarea>
                    <label htmlFor="notes" className="input-label">Catatan</label>
                    <p className="text-xs text-brand-text-secondary mt-1">Catat kebutuhan, preferensi, atau informasi penting lainnya</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-brand-border sticky bottom-0 bg-brand-surface">
                <button type="button" onClick={handleCloseModal} className="button-secondary w-full sm:w-auto">Batal</button>
                <button type="submit" className="button-primary w-full sm:w-auto">
                    {modalMode === 'add' ? 'Simpan Calon Pengantin' : 'Update Calon Pengantin'}
                </button>
            </div>
        </form>
    );
};
