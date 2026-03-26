import React from 'react';
import { LeadStatus, ContactChannel } from '@/types';
import { WhatsappIcon, CameraIcon, FileTextIcon, PhoneIncomingIcon, Share2Icon, LightbulbIcon } from '@/constants';

export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export const getContactChannelIcon = (channel: ContactChannel) => {
    const iconProps = { className: 'w-4 h-4' };
    switch (channel) {
        case ContactChannel.WHATSAPP: return React.createElement(WhatsappIcon, iconProps);
        case ContactChannel.INSTAGRAM: return React.createElement(CameraIcon, iconProps);
        case ContactChannel.WEBSITE: return React.createElement(FileTextIcon, iconProps);
        case ContactChannel.PHONE: return React.createElement(PhoneIncomingIcon, iconProps);
        case ContactChannel.REFERRAL: return React.createElement(Share2Icon, iconProps);
        case ContactChannel.SUGGESTION_FORM: return React.createElement(WhatsappIcon, iconProps);
        default: return React.createElement(LightbulbIcon, iconProps);
    }
};

export const getDaysSince = (dateString: string) => {
    const leadDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - leadDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Hari ini';
    if (diffDays === 2) return 'Kemarin';
    return `${diffDays} hari lalu`;
};

export const sourceColors: { [key in ContactChannel]?: string } = {
    [ContactChannel.INSTAGRAM]: '#c13584',
    [ContactChannel.WHATSAPP]: '#25D366',
    [ContactChannel.WEBSITE]: '#3b82f6',
    [ContactChannel.REFERRAL]: '#f59e0b',
    [ContactChannel.PHONE]: '#8b5cf6',
    [ContactChannel.SUGGESTION_FORM]: '#14b8a6',
    [ContactChannel.OTHER]: '#64748b',
};

export const statusConfig: Record<LeadStatus, { color: string; title: string }> = {
    [LeadStatus.DISCUSSION]: { color: '#3b82f6', title: 'Sedang Diskusi' },
    [LeadStatus.FOLLOW_UP]: { color: '#8b5cf6', title: 'Menunggu Follow Up' },
    [LeadStatus.CONVERTED]: { color: '#10b981', title: 'Dikonversi' },
    [LeadStatus.REJECTED]: { color: '#ef4444', title: 'Ditolak' },
};

export const escapeRegExp = (string: string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
