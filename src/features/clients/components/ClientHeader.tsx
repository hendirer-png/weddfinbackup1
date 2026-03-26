import React from 'react';
import PageHeader from '@/layouts/PageHeader';
import { Share2Icon, PlusIcon } from '@/constants';

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
        <PageHeader title="Data Pengantin" subtitle="Kelola semua pengantin, Acara Pernikahan, dan pembayaran mereka.">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-0">
                <button onClick={onDownloadClients} className="button-secondary justify-center text-xs sm:text-sm py-2">Download Data (Excel)</button>
                <button onClick={onShareBookingForm} className="button-secondary inline-flex items-center justify-center gap-2 text-xs sm:text-sm py-2">
                    <Share2Icon className="w-4 h-4" /> Bagikan Form Booking
                </button>
                <button onClick={onAddClient} className="button-primary inline-flex items-center justify-center gap-2 text-xs sm:text-sm py-2">
                    <PlusIcon className="w-5 h-5" /> Tambah Pengantin & Acara Pernikahan
                </button>
            </div>
        </PageHeader>
    );
};
