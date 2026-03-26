import React from 'react';
import { Lead, Project, Client, BookingStatus, ViewType, NavigationAction } from '@/types';
import { PencilIcon, Trash2Icon, WhatsappIcon, CalendarIcon } from '@/constants';
import { formatCurrency, formatDate } from '@/features/booking/utils/booking.utils';

interface BookingTableProps {
    title: string;
    bookings: { lead: Lead; project: Project }[];
    clients: Client[];
    onEdit: (clientId: string) => void;
    onDelete: (projectId: string, clientName: string) => void;
    onStatusChange?: (projectId: string, status: BookingStatus) => void;
    onViewProof?: (url: string) => void;
    onOpenWhatsapp?: (project: Project, client: Client) => void;
    onViewDetail?: (clientId: string) => void;
    isNewSection?: boolean;
    dateFilters?: {
        from: string;
        to: string;
        onFromChange: (val: string) => void;
        onToChange: (val: string) => void;
    };
}

const BookingTable: React.FC<BookingTableProps> = ({
    title,
    bookings,
    clients,
    onEdit,
    onDelete,
    onStatusChange,
    onViewProof,
    onOpenWhatsapp,
    onViewDetail,
    isNewSection,
    dateFilters
}) => {
    return (
        <div className="bg-brand-surface rounded-2xl shadow-lg border border-brand-border h-full">
            <div className="p-4 border-b border-brand-border flex justify-between items-center">
                <h3 className="font-semibold text-brand-text-light">{title} ({bookings.length})</h3>
            </div>
            
            {dateFilters && (
                <div className="p-4 flex items-center gap-4">
                    <input 
                        type="date" 
                        value={dateFilters.from} 
                        onChange={e => dateFilters.onFromChange(e.target.value)} 
                        className="input-field !rounded-lg !border !bg-brand-bg p-2.5 w-full" 
                        placeholder="Dari Tanggal" 
                    />
                    <input 
                        type="date" 
                        value={dateFilters.to} 
                        onChange={e => dateFilters.onToChange(e.target.value)} 
                        className="input-field !rounded-lg !border !bg-brand-bg p-2.5 w-full" 
                        placeholder="Sampai Tanggal" 
                    />
                </div>
            )}

            {/* Mobile cards */}
            <div className="md:hidden p-4 space-y-3">
                {bookings.map(booking => {
                    const client = clients.find(c => c.id === booking.project.clientId);
                    return (
                        <div key={booking.project.id} className="rounded-2xl bg-white/5 border border-brand-border p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-brand-text-light leading-tight">{booking.project.clientName}</p>
                                    <p className="text-xs text-brand-text-secondary mt-0.5">{booking.project.projectName}</p>
                                    <p className="text-[11px] text-brand-text-secondary mt-1">{formatDate(booking.lead.date)} • {booking.project.projectType}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{booking.project.packageName}</p>
                                    <p className="text-xs text-brand-text-secondary">{booking.project.location}</p>
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                                <span className="text-brand-text-secondary">Total Biaya</span>
                                <span className="text-right font-semibold">{formatCurrency(booking.project.totalCost)}</span>
                                <span className="text-brand-text-secondary">DP Dibayar</span>
                                <span className="text-right font-semibold text-green-400">{formatCurrency(booking.project.amountPaid)}</span>
                            </div>
                            <div className="mt-3 flex items-center justify-end gap-2 flex-wrap">
                                {booking.project.dpProofUrl && (
                                    <button onClick={() => onViewProof?.(booking.project.dpProofUrl!)} className="button-secondary !text-[10px] !px-2.5 !py-1.5">Lihat Bukti</button>
                                )}
                                {onOpenWhatsapp && client && (
                                    <button onClick={() => onOpenWhatsapp(booking.project, client)} className="button-secondary !text-[10px] !px-2.5 !py-1.5 flex items-center gap-1">
                                        <WhatsappIcon className="w-3 h-3" /> WA
                                    </button>
                                )}
                                <button onClick={() => onEdit(booking.project.clientId)} className="button-secondary !text-[10px] !px-2.5 !py-1.5 inline-flex items-center gap-1"><PencilIcon className="w-3 h-3" /> Edit</button>
                                <button onClick={() => onDelete(booking.project.id, booking.project.clientName)} className="button-secondary !text-[10px] !px-2.5 !py-1.5 !text-brand-danger !border-brand-danger hover:!bg-brand-danger/10 inline-flex items-center gap-1"><Trash2Icon className="w-3 h-3" /> Hapus</button>
                                {isNewSection && onStatusChange && (
                                    <button onClick={() => onStatusChange(booking.project.id, BookingStatus.TERKONFIRMASI)} className="button-primary !text-[10px] !px-2.5 !py-1.5">Konfirmasi</button>
                                )}
                                {!isNewSection && onViewDetail && (
                                    <button onClick={() => onViewDetail(booking.project.clientId)} className="button-secondary !text-[10px] !px-2.5 !py-1.5">Detail</button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {bookings.length === 0 && (
                    <p className="text-center py-6 text-sm text-brand-text-secondary">Tidak ada booking {isNewSection ? 'baru' : ''} yang tersedia.</p>
                )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-brand-text-secondary uppercase">
                        <tr>
                            <th className="px-4 py-3">Tanggal Booking</th>
                            <th className="px-4 py-3">Nama Pengantin</th>
                            <th className="px-4 py-3">Nama Acara</th>
                            <th className="px-4 py-3">Jenis Acara</th>
                            <th className="px-4 py-3">Lokasi</th>
                            <th className="px-4 py-3">Package</th>
                            <th className="px-4 py-3 text-right">Total Biaya</th>
                            <th className="px-4 py-3 text-right">DP Dibayar</th>
                            <th className="px-4 py-3 text-center">Bukti Bayar</th>
                            <th className="px-4 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                        {bookings.map(booking => {
                            const client = clients.find(c => c.id === booking.project.clientId);
                            return (
                                <tr key={booking.project.id} className="hover:bg-brand-bg transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(booking.lead.date)}</td>
                                    <td className="px-4 py-3 font-semibold text-brand-text-light">{booking.project.clientName}</td>
                                    <td className="px-4 py-3">{booking.project.projectName}</td>
                                    <td className="px-4 py-3">{booking.project.projectType}</td>
                                    <td className="px-4 py-3">{booking.project.location}</td>
                                    <td className="px-4 py-3">{booking.project.packageName}</td>
                                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(booking.project.totalCost)}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-green-400">{formatCurrency(booking.project.amountPaid)}</td>
                                    <td className="px-4 py-3 text-center">
                                        {booking.project.dpProofUrl ? (
                                            <button
                                                onClick={() => onViewProof?.(booking.project.dpProofUrl!)}
                                                className="button-secondary !text-xs !px-3 !py-1.5"
                                            >
                                                Lihat Bukti
                                            </button>
                                        ) : (
                                            <span className="text-brand-text-secondary">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => onEdit(booking.project.clientId)} className="p-2 text-brand-text-secondary hover:bg-brand-input rounded-full" title="Edit Booking"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => onDelete(booking.project.id, booking.project.clientName)} className="p-2 text-brand-danger hover:bg-brand-danger/10 rounded-full" title="Hapus Booking"><Trash2Icon className="w-4 h-4" /></button>
                                            {onOpenWhatsapp && client && (
                                                <button
                                                    onClick={() => onOpenWhatsapp(booking.project, client)}
                                                    className="button-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
                                                    title="Kirim Pesan WhatsApp"
                                                >
                                                    <WhatsappIcon className="w-4 h-4" /> 
                                                    <span className="hidden lg:inline">Chat</span>
                                                </button>
                                            )}
                                            {isNewSection && onStatusChange && (
                                                <button
                                                    onClick={() => onStatusChange(booking.project.id, BookingStatus.TERKONFIRMASI)}
                                                    className="button-primary !text-xs !px-3 !py-1.5"
                                                >
                                                    Konfirmasi
                                                </button>
                                            )}
                                            {!isNewSection && onViewDetail && (
                                                <button
                                                    onClick={() => onViewDetail(booking.project.clientId)}
                                                    className="button-secondary text-xs px-3 py-1.5"
                                                >
                                                    Detail
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={10} className="text-center py-8 text-brand-text-secondary">Tidak ada booking {isNewSection ? 'baru' : ''} yang tersedia.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingTable;
