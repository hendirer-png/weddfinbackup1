import React from 'react';
import { ShareTemplateConfig } from '@/features/settings/types';
import { RefreshCwIcon } from '@/constants';
import { escapeRegExp } from '@/features/settings/utils/settings.utils';

interface ShareTemplateItemProps {
    config: ShareTemplateConfig;
    stringValue: string;
    onProfileUpdate: (key: any, val: string) => void;
    onReset: () => void;
    showSuccess: (msg: string) => void;
}

export const ShareTemplateItem: React.FC<ShareTemplateItemProps> = ({ config, stringValue, onProfileUpdate, onReset, showSuccess }) => {
    const processPreview = (text: string) => {
        let p = text;
        const PREVIEW_VARS: Record<string, string> = {
            clientName: 'Budi & Ani',
            projectName: 'Wedding Budi & Ani',
            packageName: 'Gold Package',
            amountPaid: 'Rp 5.000.000',
            totalCost: 'Rp 10.000.000',
            sisaTagihan: 'Rp 5.000.000',
            portalLink: 'https://example.com/portal/abc123',
            projectDetails: '- Acara Pernikahan: *Wedding Budi & Ani*\n  Sisa Tagihan: Rp 5.000.000',
            totalDue: 'Rp 5.000.000',
            bankAccount: 'BCA 1234567890 a.n. Wedding Studio',
            companyName: 'Wedding Studio',
            leadName: 'Calon Pengantin',
            packageLink: 'https://example.com/packages/abc123',
            bookingFormLink: 'https://example.com/booking/abc123',
            invoiceLink: 'https://example.com/invoice/abc123',
            receiptLink: 'https://example.com/receipt/abc123',
            txDate: '14 Maret 2026',
            txAmount: 'Rp 2.000.000',
            txMethod: 'Transfer BCA',
            txDesc: 'Pelunasan biaya fotografi',
            targetName: 'Vendor Bunga',
        };
        Object.entries(PREVIEW_VARS).forEach(([k, v]) => {
            p = p.replace(new RegExp(escapeRegExp(`{${k}}`), 'g'), v);
        });
        return p;
    };

    const insertVar = (v: string) => {
        const textarea = document.getElementById(`share-${config.key}`) as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = stringValue;
            const newValue = text.substring(0, start) + v + text.substring(end);
            onProfileUpdate(config.key, newValue);
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + v.length, start + v.length);
            }, 0);
        } else {
            onProfileUpdate(config.key, stringValue + v);
        }
    };

    return (
        <div className="bg-brand-bg/40 border border-brand-border rounded-3xl p-6 transition-all hover:border-brand-accent/30 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center text-2xl shadow-inner">{config.icon}</div>
                    <div><h4 className="font-bold text-brand-text-light">{config.label}</h4><p className="text-[10px] text-brand-text-secondary mt-0.5">{config.desc}</p></div>
                </div>
                <button onClick={onReset} className="p-2 text-brand-text-secondary hover:text-brand-accent transition-colors" title="Reset ke Default"><RefreshCwIcon className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4 flex-grow">
                <div className="flex flex-wrap gap-1.5">
                    {config.variables.map(v => (
                        <button key={v.label} onClick={() => insertVar(v.label)} className="px-2 py-1 rounded-lg text-[10px] bg-brand-accent/10 text-brand-accent border border-brand-accent/20 hover:bg-brand-accent/20 transition-all font-bold" title={v.desc}>{v.label}</button>
                    ))}
                </div>
                <div className="input-group !mt-0">
                    <textarea id={`share-${config.key}`} value={stringValue} onChange={e => onProfileUpdate(config.key, e.target.value)} className="input-field min-h-[140px] text-xs leading-relaxed font-mono" placeholder={config.placeholder} />
                </div>
            </div>
            <div className="mt-6 pt-6 border-t border-brand-border/50">
                <label className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-wider mb-3 block">Preview Hasil Pesan:</label>
                <div className="p-4 bg-brand-surface/50 rounded-2xl border border-brand-border/50"><p className="text-[11px] text-brand-text-light whitespace-pre-wrap leading-relaxed italic">{processPreview(stringValue)}</p></div>
            </div>
        </div>
    );
};
