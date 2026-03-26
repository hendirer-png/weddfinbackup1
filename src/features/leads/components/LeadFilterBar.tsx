import React from 'react';
import { ContactChannel as CC } from '@/types';
import { EyeIcon, Share2Icon, PlusIcon } from '@/constants';

interface LeadFilterBarProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    dateFrom: string;
    onDateFromChange: (val: string) => void;
    dateTo: string;
    onDateToChange: (val: string) => void;
    sourceFilter: CC | 'all';
    onSourceFilterChange: (val: CC | 'all') => void;
    hiddenColumns: Set<any>;
    onToggleHiddenColumns: () => void;
    onOpenShareModal: () => void;
    onAddLead: () => void;
}

export const LeadFilterBar: React.FC<LeadFilterBarProps> = ({
    searchTerm, onSearchChange,
    dateFrom, onDateFromChange,
    dateTo, onDateToChange,
    sourceFilter, onSourceFilterChange,
    hiddenColumns, onToggleHiddenColumns,
    onOpenShareModal, onAddLead,
}) => {
    return (
        <div className="bg-brand-surface p-4 rounded-xl shadow-lg border border-brand-border flex flex-col md:flex-row justify-between items-center gap-4 leads-filter-section">
            <div className="input-group flex-grow !mt-0 w-full md:w-auto">
                <input type="search" value={searchTerm} onChange={e => onSearchChange(e.target.value)} className="input-field !rounded-lg !border !bg-brand-bg p-2.5" placeholder=" " />
                <label className="input-label">Cari Calon Pengantin...</label>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto leads-filter-row">
                <input type="date" value={dateFrom} onChange={e => onDateFromChange(e.target.value)} className="input-field !rounded-lg !border !bg-brand-bg p-2.5 w-full" />
                <span className="text-brand-text-secondary flex-shrink-0">-</span>
                <input type="date" value={dateTo} onChange={e => onDateToChange(e.target.value)} className="input-field !rounded-lg !border !bg-brand-bg p-2.5 w-full" />
                <select value={sourceFilter} onChange={e => onSourceFilterChange(e.target.value as any)} className="input-field !rounded-lg !border !bg-brand-bg p-2.5 w-full leads-source-filter">
                    <option value="all">Semua Sumber</option>
                    {Object.values(CC).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex items-center gap-2 w-full leads-filter-buttons">
                    <button onClick={onToggleHiddenColumns} className="button-secondary text-sm px-3 py-2.5 inline-flex items-center gap-2 flex-shrink-0" title={hiddenColumns.has('CONVERTED') ? 'Tampilkan Kolom Selesai' : 'Sembunyikan Kolom Selesai'}>
                        <EyeIcon className="w-5 h-5" />
                    </button>
                    <button onClick={onOpenShareModal} className="button-secondary p-2.5" title="Bagikan Form Calon Pengantin">
                        <Share2Icon className="w-5 h-5" />
                    </button>
                    <button onClick={onAddLead} className="button-primary p-2.5" title="Tambah Calon Pengantin Manual">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
