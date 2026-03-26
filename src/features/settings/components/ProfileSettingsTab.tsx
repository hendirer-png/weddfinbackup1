import React from 'react';
import { Profile } from '@/types';
import { toBase64 } from '@/features/settings/utils/settings.utils';
import { HomeIcon, PhoneIcon, MapPinIcon, LinkIcon, MailIcon, ImageIcon, CheckCircleIcon, PencilIcon } from '@/constants';

interface ProfileSettingsTabProps {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
    handleProfileSubmit: (e: React.FormEvent) => void;
    isSaving: boolean;
    showSuccess: boolean;
    saveError: string;
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ profile, setProfile, handleProfileSubmit, isSaving, showSuccess, saveError }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoBase64' | 'signatureBase64') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { alert("Maksimal 2MB"); return; }
            const b64 = await toBase64(file);
            setProfile(prev => ({ ...prev, [field]: b64 }));
        }
    };

    return (
        <form onSubmit={handleProfileSubmit} className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-brand-bg/40 border border-brand-border rounded-3xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-brand-text-light mb-6 flex items-center gap-2"><HomeIcon className="w-5 h-5 text-brand-accent" /> Informasi Vendor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="input-group"><HomeIcon className="w-5 h-5 input-icon" /><input name="companyName" value={profile.companyName} onChange={handleInputChange} className="input-field-with-icon" placeholder=" " required /><label className="input-label-with-icon">Nama Perusahaan / Vendor</label></div>
                    <div className="input-group"><PhoneIcon className="w-5 h-5 input-icon" /><input name="phone" value={profile.phone} onChange={handleInputChange} className="input-field-with-icon" placeholder=" " /><label className="input-label-with-icon">No. WhatsApp Bisnis</label></div>
                    <div className="input-group"><MailIcon className="w-5 h-5 input-icon" /><input name="email" value={profile.email} onChange={handleInputChange} className="input-field-with-icon" placeholder=" " /><label className="input-label-with-icon">Email Bisnis</label></div>
                    <div className="input-group"><LinkIcon className="w-5 h-5 input-icon" /><input name="website" value={profile.website} onChange={handleInputChange} className="input-field-with-icon" placeholder=" " /><label className="input-label-with-icon">Website</label></div>
                    <div className="input-group md:col-span-2"><MapPinIcon className="w-5 h-5 input-icon" /><textarea name="address" value={profile.address} onChange={handleInputChange} className="input-field-with-icon h-24" placeholder=" " /><label className="input-label-with-icon">Alamat Kantor</label></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-bg/40 border border-brand-border rounded-3xl p-6">
                    <h4 className="text-base font-bold text-brand-text-light mb-4">Logo Studio</h4>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-2xl bg-brand-surface border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden">
                            {profile.logoBase64 ? <img src={profile.logoBase64} alt="Logo" className="w-full h-full object-contain" /> : <ImageIcon className="w-8 h-8 text-brand-text-secondary" />}
                        </div>
                        <input type="file" onChange={e => handleFileChange(e, 'logoBase64')} className="hidden" id="logo-upload" accept="image/*" />
                        <label htmlFor="logo-upload" className="button-secondary py-2 px-4 rounded-xl cursor-pointer text-sm">Ganti Logo</label>
                    </div>
                </div>
                <div className="bg-brand-bg/40 border border-brand-border rounded-3xl p-6">
                    <h4 className="text-base font-bold text-brand-text-light mb-4">Tanda Tangan Digital</h4>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-2xl bg-brand-surface border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden p-2">
                            {profile.signatureBase64 ? <img src={profile.signatureBase64} alt="TTD" className="w-full h-full object-contain filter invert opacity-80" /> : <PencilIcon className="w-8 h-8 text-brand-text-secondary" />}
                        </div>
                        <input type="file" onChange={e => handleFileChange(e, 'signatureBase64')} className="hidden" id="sig-upload" accept="image/*" />
                        <label htmlFor="sig-upload" className="button-secondary py-2 px-4 rounded-xl cursor-pointer text-sm">Ganti Tanda Tangan</label>
                    </div>
                </div>
            </div>

            {saveError && <div className="p-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-bold text-center">{saveError}</div>}
            {showSuccess && <div className="p-4 rounded-2xl bg-green-400/10 border border-green-400/20 text-green-400 text-sm font-bold text-center flex items-center justify-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Perubahan berhasil disimpan!</div>}

            <div className="flex justify-center pt-4">
                <button type="submit" disabled={isSaving} className="button-primary py-4 px-12 rounded-2xl font-bold text-lg shadow-xl shadow-brand-accent/20 hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto">
                    {isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                </button>
            </div>
        </form>
    );
};
