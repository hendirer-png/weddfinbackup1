import React from 'react';
import PageHeader from '@/layouts/PageHeader';
import { Share2Icon, PlusIcon, UsersIcon, DownloadIcon } from '@/constants';

interface ClientHeaderProps {
    onAddClient: () => void;
    onDownloadClients: () => void;
    onShareBookingForm: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
    onAddClient,
    onDownloadClients,
    onShareBookingForm
}) => {
    return (
        <PageHeader 
            title="Data Pengantin" 
            subtitle="Kelola semua database pengantin, progres acara pernikahan, dan status pembayaran mereka secara terpadu."
            icon={<UsersIcon className="w-6 h-6" />}
        >
            <button 
                onClick={onDownloadClients} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-white border border-white/20 hover:bg-white/20 transition-all text-xs sm:text-sm font-bold shadow-sm"
                title="Download Data Excel"
            >
                <DownloadIcon className="w-4 h-4" />
                <span className="hidden md:inline">Export Excel</span>
                <span className="md:hidden">Excel</span>
            </button>
            <button 
                onClick={onShareBookingForm} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-xs sm:text-sm font-bold shadow-sm"
                title="Bagikan Formulir Booking Publik"
            >
                <Share2Icon className="w-4 h-4" />
                <span>Form Booking</span>
            </button>
            <button 
                onClick={onAddClient} 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all text-xs sm:text-sm font-black shadow-lg shadow-blue-900/20"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Tambah Pengantin</span>
            </button>
        </PageHeader>
    );
};
