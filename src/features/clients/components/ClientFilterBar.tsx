import React from 'react';
import { PaymentStatus, ClientType } from '@/types';

interface ClientFilterBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    searchQuery: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusFilterChange: (val: string) => void;
    typeFilter: string;
    onTypeFilterChange: (val: string) => void;
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
    onSortChange: (config: { key: string; direction: 'asc' | 'desc' } | null) => void;
}

export const ClientFilterBar: React.FC<ClientFilterBarProps> = ({
    activeTab, onTabChange,
    searchQuery, onSearchChange,
    statusFilter, onStatusFilterChange,
    typeFilter, onTypeFilterChange,
}) => {
    const tabConfigs = [
        { id: 'all', label: 'Semua', activeColor: 'bg-blue-600 text-white shadow-md shadow-blue-100', inactiveColor: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
        { id: 'inactive', label: 'Tidak Aktif', activeColor: 'bg-slate-600 text-white shadow-md shadow-slate-100', inactiveColor: 'bg-slate-100 text-slate-500 hover:bg-slate-200' },
        { id: 'unpaid', label: 'Belum Lunas', activeColor: 'bg-rose-600 text-white shadow-md shadow-rose-100', inactiveColor: 'bg-rose-50 text-rose-600 hover:bg-rose-100' },
    ];

    return (
        <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            {/* Tabs & Search Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex gap-2 flex-wrap">
                    {tabConfigs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                                activeTab === tab.id
                                    ? tab.activeColor
                                    : `${tab.inactiveColor} opacity-70 hover:opacity-100`
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative flex-grow lg:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={e => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium text-slate-700 transition-all placeholder:text-slate-400"
                        placeholder="Cari pengantin (nama, email, telepon)..."
                    />
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Filter Cepat</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-grow">
                    <select
                        value={statusFilter}
                        onChange={e => onStatusFilterChange(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer w-full sm:w-48"
                    >
                        <option value="Semua Status">Semua Status (Pembayaran)</option>
                        {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select
                        value={typeFilter}
                        onChange={e => onTypeFilterChange(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer w-full sm:w-48"
                    >
                        <option value="Semua Tipe">Semua Tipe Klien</option>
                        {Object.values(ClientType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};
