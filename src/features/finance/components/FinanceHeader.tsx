import React from 'react';
import { PlusIcon, InfoIcon } from 'lucide-react';
import PageHeader from '@/layouts/PageHeader';

interface FinanceHeaderProps {
    onAddTransaction: () => void;
    onOpenInfoModal: () => void;
}

export const FinanceHeader: React.FC<FinanceHeaderProps> = ({
    onAddTransaction,
    onOpenInfoModal
}) => {
    return (
        <PageHeader 
            title="Kelola Keuangan Vendor" 
            subtitle="Pantau kesehatan Keuangan bisnis Anda dari transaksi hingga proyeksi masa depan."
        >
            <div className="flex items-center gap-2 non-printable">
                <button onClick={onAddTransaction} className="button-secondary inline-flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />Tambah Transaksi
                </button>
                <button onClick={onOpenInfoModal} className="p-2 text-brand-text-secondary hover:text-brand-accent transition-colors">
                    <InfoIcon className="w-5 h-5" />
                </button>
            </div>
        </PageHeader>
    );
};
