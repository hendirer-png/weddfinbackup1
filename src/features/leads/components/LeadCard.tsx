import React, { useMemo } from 'react';
import { Lead, LeadStatus } from '@/types';
import { PencilIcon, Trash2Icon, Share2Icon, SendIcon, ChevronRightIcon, CheckCircleIcon, MapPinIcon } from '@/constants';
import { statusConfig, getContactChannelIcon, getDaysSince } from '@/features/leads/utils/leads.utils';

interface LeadCardProps {
    lead: Lead;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onNextStatus: () => void;
    onShare: (type: 'package' | 'booking') => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onDragStart, onClick, onEdit, onDelete, onNextStatus, onShare }) => {
    const isHot = useMemo(() => new Date(lead.date) > new Date(Date.now() - 24 * 60 * 60 * 1000), [lead.date]);
    const needsFollowUp = useMemo(() => lead.status === LeadStatus.DISCUSSION && new Date(lead.date) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), [lead.date, lead.status]);
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    const renderActions = () => {
        if (lead.status === LeadStatus.DISCUSSION) {
            return (
                <div className="flex items-center gap-1.5 md:gap-2 leads-card-actions">
                    <button onClick={(e) => { e.stopPropagation(); onShare('package'); }} className="button-secondary !p-2 md:!p-2.5" title="Bagikan Package"><Share2Icon className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onNextStatus(); }} className="button-primary !text-xs !px-3 md:!px-4 !py-2 md:!py-2.5 inline-flex items-center gap-1">Follow Up <ChevronRightIcon className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                </div>
            );
        }
        if (lead.status === LeadStatus.FOLLOW_UP) {
            return (
                <div className="flex items-center gap-1.5 md:gap-2 leads-card-actions">
                    <button onClick={(e) => { e.stopPropagation(); onShare('booking'); }} className="button-secondary !p-2 md:!p-2.5" title="Kirim Form Booking"><SendIcon className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onNextStatus(); }} className="button-primary !text-xs !px-3 md:!px-4 !py-2 md:!py-2.5 inline-flex items-center gap-1">Konversi <CheckCircleIcon className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            draggable
            onDragStart={e => onDragStart(e, lead.id)}
            onClick={onClick}
            className="p-3 md:p-4 bg-brand-surface rounded-xl cursor-grab border-l-4 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] leads-card"
            style={{ borderLeftColor: statusConfig[lead.status].color }}
        >
            <div className="flex justify-between items-start gap-2 leads-card-header">
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base text-brand-text-light truncate">{lead.name}</p>
                    {lead.location && (
                        <p className="text-xs text-brand-text-secondary mt-0.5 flex items-center gap-1 truncate">
                            <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{lead.location}</span>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isHot && <span className="text-base md:text-lg" title="Calon Pengantin baru (24 jam terakhir)">🔥</span>}
                    {needsFollowUp && <span className="text-base md:text-lg" title="Perlu Follow Up">⏰</span>}
                    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="button-secondary !p-2 md:!p-2.5" title="Edit"><PencilIcon className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="button-secondary !p-2 md:!p-2.5" title="Hapus"><Trash2Icon className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                </div>
            </div>
            {lead.notes && (
                <p className="text-xs text-brand-text-primary mt-2 pt-2 border-t border-brand-border/50 line-clamp-2">{lead.notes}</p>
            )}
            <div className="flex justify-between items-center mt-2 md:mt-3 text-xs text-brand-text-secondary">
                <span className="flex items-center gap-1.5">
                    {getContactChannelIcon(lead.contactChannel)}
                    <span className="hidden sm:inline">{getDaysSince(lead.date)}</span>
                    <span className="sm:hidden">{getDaysSince(lead.date).replace(' lalu', '')}</span>
                </span>
            </div>
            <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-brand-border/50 flex justify-end leads-card-actions">
                {renderActions()}
            </div>
        </div>
    );
};
