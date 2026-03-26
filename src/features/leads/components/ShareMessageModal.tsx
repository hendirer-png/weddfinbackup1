import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/shared/ui/Modal';
import { Lead, Profile, Gallery } from '@/types';
import { Share2Icon, LinkIcon } from '@/constants';
import { cleanPhoneNumber } from '@/constants';
import { listGalleries } from '@/services/galleries';
import { upsertProfile } from '@/services/profile';
import { escapeRegExp } from '@/features/leads/utils/leads.utils';

interface ShareMessageModalProps {
    type: 'package' | 'booking';
    lead: Lead;
    userProfile: Profile;
    publicPackagesUrl: string;
    publicBookingFormUrl: string;
    onClose: () => void;
    showNotification: (message: string) => void;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

export const ShareMessageModal: React.FC<ShareMessageModalProps> = ({
    type, lead, userProfile, publicPackagesUrl, publicBookingFormUrl,
    onClose, showNotification, setProfile
}) => {
    const [message, setMessage] = useState('');
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [selectedGalleryId, setSelectedGalleryId] = useState<string>('');

    useEffect(() => {
        let template = '';
        if (type === 'package') {
            template = (userProfile.packageShareTemplate || '').replace('{leadName}', lead.name).replace('{companyName}', userProfile.companyName).replace('{packageLink}', publicPackagesUrl);
        } else {
            const bookingUrlWithId = `${publicBookingFormUrl}?leadId=${lead.id}`;
            template = (userProfile.bookingFormTemplate || '').replace('{leadName}', lead.name).replace('{companyName}', userProfile.companyName).replace('{bookingFormLink}', bookingUrlWithId);
        }
        setMessage(template);
    }, [type, lead, userProfile, publicPackagesUrl, publicBookingFormUrl]);

    useEffect(() => {
        (async () => {
            try {
                const all = await listGalleries();
                const publicOnes = (all || []).filter(g => g.is_public && g.public_id);
                setGalleries(publicOnes);
                if (publicOnes.length > 0) setSelectedGalleryId(publicOnes[0].id);
            } catch (e) {
                console.warn('Failed to load galleries for share modal', e);
            }
        })();
    }, []);

    const selectedGallery = useMemo(() => galleries.find(g => g.id === selectedGalleryId) || null, [galleries, selectedGalleryId]);
    const selectedGalleryLink = useMemo(() => selectedGallery ? `${window.location.origin}/#/gallery/${selectedGallery.public_id}` : '', [selectedGallery]);

    const handleShareToWhatsApp = () => {
        if (!lead.whatsapp) { showNotification('Nomor WhatsApp untuk Calon Pengantin ini tidak tersedia.'); return; }
        window.open(`https://wa.me/${cleanPhoneNumber(lead.whatsapp)}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleSaveTemplate = async () => {
        try {
            if (type === 'package') {
                const rawTemplate = message
                    .replace(new RegExp(escapeRegExp(lead.name), 'g'), '{leadName}')
                    .replace(new RegExp(escapeRegExp(userProfile.companyName), 'g'), '{companyName}')
                    .replace(new RegExp(escapeRegExp(publicPackagesUrl), 'g'), '{packageLink}');
                setProfile(prev => ({ ...prev, packageShareTemplate: rawTemplate }));
                await upsertProfile({ id: userProfile.id, packageShareTemplate: rawTemplate });
            } else {
                const bookingUrlWithId = `${publicBookingFormUrl}?leadId=${lead.id}`;
                const rawTemplate = message
                    .replace(new RegExp(escapeRegExp(lead.name), 'g'), '{leadName}')
                    .replace(new RegExp(escapeRegExp(userProfile.companyName), 'g'), '{companyName}')
                    .replace(new RegExp(escapeRegExp(bookingUrlWithId), 'g'), '{bookingFormLink}');
                setProfile(prev => ({ ...prev, bookingFormTemplate: rawTemplate }));
                await upsertProfile({ id: userProfile.id, bookingFormTemplate: rawTemplate });
            }
            showNotification('Template berhasil disimpan!');
        } catch (err) {
            showNotification('Gagal menyimpan template. Coba lagi.');
        }
    };

    const title = type === 'package' ? `Bagikan Package ke ${lead.name}` : `Kirim Form Booking ke ${lead.name}`;

    return (
        <Modal isOpen={true} onClose={onClose} title={title}>
            <div className="space-y-4">
                <div className="input-group">
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={10} className="input-field w-full" placeholder=" "></textarea>
                    <label className="input-label">Pesan WhatsApp</label>
                </div>
                {galleries.length > 0 && (
                    <div className="p-3 bg-brand-bg rounded-lg border border-brand-border space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-brand-text-light inline-flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Link Pricelist</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                            <select value={selectedGalleryId} onChange={(e) => setSelectedGalleryId(e.target.value)} className="input-field md:col-span-2">
                                {galleries.map(g => <option key={g.id} value={g.id}>{g.title} • {g.region}</option>)}
                            </select>
                            <div className="flex gap-2 w-full">
                                <button type="button" onClick={() => { if (selectedGalleryLink) { navigator.clipboard.writeText(selectedGalleryLink); showNotification('Link Pricelist disalin'); } }} className="button-secondary flex-1">Salin Link</button>
                                <button type="button" onClick={() => { if (selectedGalleryLink) setMessage(prev => (prev ? prev + `\n${selectedGalleryLink}` : selectedGalleryLink)); }} className="button-primary flex-1">Masukkan</button>
                            </div>
                        </div>
                        {selectedGalleryLink && <p className="text-xs text-brand-text-secondary break-all">{selectedGalleryLink}</p>}
                    </div>
                )}
                <div className="flex flex-col md:flex-row md:justify-between gap-2 pt-4 border-t border-brand-border sticky bottom-0 bg-brand-surface">
                    <button onClick={handleSaveTemplate} className="button-secondary w-full md:w-auto">Simpan Template Ini</button>
                    <button onClick={handleShareToWhatsApp} className="button-primary inline-flex items-center gap-2 w-full md:w-auto"><Share2Icon className="w-4 h-4" /> Bagikan ke WhatsApp</button>
                </div>
            </div>
        </Modal>
    );
};
