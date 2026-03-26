import React, { useMemo } from 'react';
import { Lead, LeadStatus } from '@/types';
import { EyeIcon, ChevronRightIcon, CheckCircleIcon, Trash2Icon } from '@/constants';
import DonutChart from '@/shared/ui/DonutChart';
import { statusConfig } from '@/features/leads/utils/leads.utils';

interface LeadsAnalyticsProps {
    leads: Lead[];
    totals: {
        discussionLeads: number;
        followUpLeads: number;
        [key: string]: any;
    };
    onStatCardClick: (stat: string) => void;
}

export const LeadsAnalytics: React.FC<LeadsAnalyticsProps> = ({ leads, totals }) => {
    const regionDonutData = useMemo(() => {
        const palette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f43f5e', '#a855f7', '#14b8a6'];
        const distribution = leads.reduce((acc, l) => {
            const key = ((l.location || '').trim()) || 'Tidak Diketahui';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(distribution)
            .sort(([, a], [, b]) => Number(b) - Number(a))
            .map(([label, value], idx) => ({ label, value, color: palette[idx % palette.length] }));
    }, [leads]);

    const overallCounts = useMemo(() => ({
        discussion: totals.discussionLeads,
        followUp: totals.followUpLeads,
        converted: leads.filter(l => l.status === LeadStatus.CONVERTED).length,
        rejected: leads.filter(l => l.status === LeadStatus.REJECTED).length,
    }), [leads, totals]);

    return (
        <div className="space-y-6 mb-6">
            <div className="bg-brand-surface p-6 rounded-2xl shadow-lg border border-brand-border">
                <div className="flex items-center justify-between mb-4 gap-3">
                    <h4 className="text-lg font-bold text-gradient">Distribusi Calon Pengantin per Wilayah</h4>
                </div>
                <DonutChart data={regionDonutData} />
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-brand-border bg-brand-bg/60">
                        <span className="inline-flex items-center gap-1.5 text-xs text-brand-text-secondary"><EyeIcon className="w-4 h-4" /> {statusConfig[LeadStatus.DISCUSSION].title}</span>
                        <span className="text-sm font-semibold" style={{ color: statusConfig[LeadStatus.DISCUSSION].color }}>{overallCounts.discussion}</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-brand-border bg-brand-bg/60">
                        <span className="inline-flex items-center gap-1.5 text-xs text-brand-text-secondary"><ChevronRightIcon className="w-4 h-4" /> {statusConfig[LeadStatus.FOLLOW_UP].title}</span>
                        <span className="text-sm font-semibold" style={{ color: statusConfig[LeadStatus.FOLLOW_UP].color }}>{overallCounts.followUp}</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-brand-border bg-brand-bg/60">
                        <span className="inline-flex items-center gap-1.5 text-xs text-brand-text-secondary"><CheckCircleIcon className="w-4 h-4" /> {statusConfig[LeadStatus.CONVERTED].title}</span>
                        <span className="text-sm font-semibold" style={{ color: statusConfig[LeadStatus.CONVERTED].color }}>{overallCounts.converted}</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-brand-border bg-brand-bg/60">
                        <span className="inline-flex items-center gap-1.5 text-xs text-brand-text-secondary"><Trash2Icon className="w-4 h-6" /> {statusConfig[LeadStatus.REJECTED].title}</span>
                        <span className="text-sm font-semibold" style={{ color: statusConfig[LeadStatus.REJECTED].color }}>{overallCounts.rejected}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
