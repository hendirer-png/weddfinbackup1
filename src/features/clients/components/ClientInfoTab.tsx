import React from 'react';
import { UsersIcon, Share2Icon, FolderKanbanIcon, DollarSignIcon, TrendingUpIcon, TrendingDownIcon } from '@/constants';
import { Client, Project } from '@/types';
import { formatCurrency, cleanPhoneNumber } from '@/features/clients/utils/clients.utils';

interface ClientInfoTabProps {
    client: Client;
    clientProjects: Project[];
    onSharePortal: (client: Client) => void;
}

const InfoStatCard: React.FC<{ icon: React.ReactNode, title: string, value: string }> = ({ icon, title, value }) => (
    <div className="bg-brand-bg p-3 md:p-4 rounded-xl flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 border border-brand-border shadow-sm">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center bg-brand-surface flex-shrink-0">
            {icon}
        </div>
        <div className="text-center md:text-left">
            <p className="text-[10px] md:text-sm text-brand-text-secondary">{title}</p>
            <p className="text-sm md:text-lg font-bold text-brand-text-light truncate">{value}</p>
        </div>
    </div>
);

const DetailRow: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="py-2.5 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-1 sm:gap-4 border-b border-brand-border">
        <dt className="text-sm text-brand-text-secondary">{label}</dt>
        <dd className="text-sm text-brand-text-light font-semibold">{children}</dd>
    </div>
);

const ClientInfoTab: React.FC<ClientInfoTabProps> = ({ client, clientProjects, onSharePortal }) => {
    const totalProjects = clientProjects.length;
    const totalProjectValue = clientProjects.reduce((sum, p) => sum + p.totalCost, 0);
    const totalPaid = clientProjects.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalDue = totalProjectValue - totalPaid;

    return (
        <div className="space-y-6 md:space-y-8 tab-content-mobile">
            {/* Mobile: Card-based info display */}
            <div className="md:hidden bg-brand-surface rounded-2xl p-4 border border-brand-border shadow-sm">
                <div className="space-y-3">
                    <div className="pb-2 border-b border-brand-border/50">
                        <p className="text-xs text-brand-text-secondary mb-1">Nama Pengantin</p>
                        <p className="text-sm font-semibold text-brand-text-light">{client.name}</p>
                    </div>
                    <div className="pb-2 border-b border-brand-border/50">
                        <p className="text-xs text-brand-text-secondary mb-1">Jenis Pengantin</p>
                        <p className="text-sm font-semibold text-brand-text-light">{client.clientType}</p>
                    </div>
                    <div className="pb-2 border-b border-brand-border/50">
                        <p className="text-xs text-brand-text-secondary mb-1">Email</p>
                        <p className="text-sm font-semibold text-brand-text-light break-all">{client.email}</p>
                    </div>
                    <div className="pb-2 border-b border-brand-border/50">
                        <p className="text-xs text-brand-text-secondary mb-1">Telepon</p>
                        <a href={`https://wa.me/${cleanPhoneNumber(client.whatsapp || client.phone)}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-400 hover:underline active:text-blue-300">{client.whatsapp || client.phone}</a>
                    </div>
                    <div className="pb-2 border-b border-brand-border/50">
                        <p className="text-xs text-brand-text-secondary mb-1">No. WhatsApp</p>
                        <a href={`https://wa.me/${cleanPhoneNumber(client.whatsapp || client.phone)}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-400 hover:underline active:text-blue-300">{client.whatsapp || client.phone}</a>
                    </div>
                    <div className="pb-2 border-b border-brand-border/50">
                        <p className="text-xs text-brand-text-secondary mb-1">Instagram</p>
                        <p className="text-sm font-semibold text-brand-text-light">{client.instagram || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-brand-text-secondary mb-1">Alamat Lengkap</p>
                        <p className="text-sm font-semibold text-brand-text-light">{client.address || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-brand-text-secondary mb-1">Pengantin Sejak</p>
                        <p className="text-sm font-semibold text-brand-text-light">{new Date(client.since).toLocaleDateString('id-ID')}</p>
                    </div>
                </div>
                <button onClick={() => onSharePortal(client)} className="mt-4 w-full button-primary inline-flex items-center justify-center gap-2 text-sm active:scale-95 transition-transform"><Share2Icon className="w-4 h-4" /> Bagikan Portal Pengantin</button>
            </div>

            {/* Desktop: Table-based info display */}
            <div className="hidden md:block">
                <dl>
                    <DetailRow label="Nama Pengantin">{client.name}</DetailRow>
                    <DetailRow label="Jenis Pengantin">{client.clientType}</DetailRow>
                    <DetailRow label="Email">{client.email}</DetailRow>
                    <DetailRow label="Telepon"><a href={`https://wa.me/${cleanPhoneNumber(client.whatsapp || client.phone)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{client.whatsapp || client.phone}</a></DetailRow>
                    <DetailRow label="No. WhatsApp"><a href={`https://wa.me/${cleanPhoneNumber(client.whatsapp || client.phone)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{client.whatsapp || client.phone}</a></DetailRow>
                    <DetailRow label="Instagram">{client.instagram || '-'}</DetailRow>
                    <DetailRow label="Alamat Lengkap">{client.address || '-'}</DetailRow>
                    <DetailRow label="Pengantin Sejak">{new Date(client.since).toLocaleDateString('id-ID')}</DetailRow>
                </dl>
                <button onClick={() => onSharePortal(client)} className="mt-5 button-secondary inline-flex items-center gap-2 text-sm"><Share2Icon className="w-4 h-4" /> Bagikan Portal Pengantin</button>
            </div>

            <div>
                <h4 className="text-sm md:text-base font-semibold text-brand-text-light mb-1">Ringkasan Keuangan Pengantin</h4>
                <p className="text-xs text-brand-text-secondary mb-3 md:mb-4">Total Package, pembayaran, dan sisa tagihan pengantin ini</p>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <InfoStatCard icon={<FolderKanbanIcon className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />} title="Jumlah Acara Pernikahan" value={totalProjects.toString()} />
                    <InfoStatCard icon={<DollarSignIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />} title="Total Package" value={formatCurrency(totalProjectValue)} />
                    <InfoStatCard icon={<TrendingUpIcon className="w-5 h-5 md:w-6 md:h-6 text-green-400" />} title="Total Telah Dibayar" value={formatCurrency(totalPaid)} />
                    <InfoStatCard icon={<TrendingDownIcon className="w-5 h-5 md:w-6 md:h-6 text-red-400" />} title="Total Sisa Tagihan" value={formatCurrency(totalDue)} />
                </div>
            </div>
        </div>
    );
};

export default ClientInfoTab;
