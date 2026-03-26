import React from 'react';
import StatCard from '@/shared/ui/StatCard';
import { FileTextIcon, ClockIcon, DollarSignIcon } from '@/constants';
import { formatDisplayCurrency } from '@/features/contracts/utils/contracts.utils';

interface ContractStatsProps {
    totalContracts: number;
    waitingForClient: number;
    totalValue: number;
}

export const ContractStats: React.FC<ContractStatsProps> = ({
    totalContracts,
    waitingForClient,
    totalValue
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
                icon={<FileTextIcon className="w-6 h-6"/>} 
                title="Total Kontrak" 
                value={totalContracts.toString()} 
                subtitle="Semua kontrak terdaftar" 
                colorVariant="blue" 
            />
            <StatCard 
                icon={<ClockIcon className="w-6 h-6"/>} 
                title="Menunggu TTD Klien" 
                value={waitingForClient.toString()} 
                subtitle="Kontrak belum ditandatangani" 
                colorVariant="orange" 
            />
            <StatCard 
                icon={<DollarSignIcon className="w-6 h-6"/>} 
                title="Total Nilai Terkontrak" 
                value={formatDisplayCurrency(totalValue)} 
                subtitle="Nilai keseluruhan kontrak" 
                colorVariant="green" 
            />
        </div>
    );
};
