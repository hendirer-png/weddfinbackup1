import React from 'react';
import { Lead, LeadStatus, ContactChannel } from '@/types';
import { EyeIcon, Share2Icon, PlusIcon } from '@/constants';
import { LeadCard } from '@/features/leads/components/LeadCard';
import { statusConfig } from '@/features/leads/utils/leads.utils';

interface LeadKanbanProps {
    visibleLeadColumns: [string, Lead[]][];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: LeadStatus) => void;
    onEdit: (lead: Lead) => void;
    onDelete: (lead: Lead) => void;
    onNextStatus: (lead: Lead) => void;
    onShare: (type: 'package' | 'booking', lead: Lead) => void;
    hiddenColumns: Set<LeadStatus>;
    toggleHiddenColumns: () => void;
    isShareModalOpen: boolean;
    onOpenShareModal: () => void;
    onAddLead: () => void;
    showNotification: (msg: string) => void;
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export const LeadKanban: React.FC<LeadKanbanProps> = ({
    visibleLeadColumns, onDragStart, onDragOver, onDrop,
    onEdit, onDelete, onNextStatus, onShare,
    hiddenColumns, toggleHiddenColumns, onOpenShareModal, onAddLead,
}) => {
    return (
        <>
            {/* Mobile grouped list */}
            <div className="md:hidden space-y-3 -mx-4 px-4">
                {visibleLeadColumns.map(([status, leadItems]) => {
                    const statusInfo = statusConfig[status as LeadStatus];
                    return (
                        <div key={status} className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden">
                            <div className="p-3 text-sm md:text-base font-semibold text-brand-text-light border-b flex justify-between items-center" style={{ borderColor: statusInfo.color, borderBottomWidth: 2 }}>
                                <span className="truncate">{statusInfo.title}</span>
                            </div>
                            <div className="p-2 space-y-2">
                                {leadItems.map(lead => (
                                    <LeadCard
                                        key={lead.id}
                                        lead={lead}
                                        onDragStart={() => { }}
                                        onClick={() => onEdit(lead)}
                                        onEdit={() => onEdit(lead)}
                                        onDelete={() => onDelete(lead)}
                                        onNextStatus={() => onNextStatus(lead)}
                                        onShare={(type) => onShare(type, lead)}
                                    />
                                ))}
                                {leadItems.length === 0 && (
                                    <p className="text-center py-6 text-xs md:text-sm text-brand-text-secondary">Tidak ada Calon Pengantin.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop kanban columns */}
            <div className="hidden md:flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                {visibleLeadColumns.map(([status, leadItems]) => {
                    const statusInfo = statusConfig[status as LeadStatus];
                    return (
                        <div
                            key={status}
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, status as LeadStatus)}
                            className="w-80 flex-shrink-0 bg-brand-bg rounded-2xl border border-brand-border flex flex-col leads-column-container"
                        >
                            <div className="p-4 font-semibold text-brand-text-light border-b-2 flex justify-between items-center sticky top-0 bg-brand-bg/80 backdrop-blur-sm rounded-t-2xl z-10 leads-column-header" style={{ borderColor: statusInfo.color }}>
                                <span>{statusInfo.title}</span>
                            </div>
                            <div className="p-3 space-y-3 h-auto pr-1">
                                {leadItems.map(lead => (
                                    <LeadCard
                                        key={lead.id}
                                        lead={lead}
                                        onDragStart={onDragStart}
                                        onClick={() => onEdit(lead)}
                                        onEdit={() => onEdit(lead)}
                                        onDelete={() => onDelete(lead)}
                                        onNextStatus={() => onNextStatus(lead)}
                                        onShare={(type) => onShare(type, lead)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
