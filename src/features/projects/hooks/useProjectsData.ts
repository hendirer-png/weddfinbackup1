import { useState, useMemo, useEffect } from 'react';
import { Project, Client, TeamMember, TeamProjectPayment, Transaction, Card, FinancialPocket } from '@/features/projects/types/project.types';
import { listProjectsWithRelations } from '@/services/projects';

interface UseProjectsDataProps {
    initialProjects: Project[];
    clients: Client[];
    teamMembers: TeamMember[];
    transactions: Transaction[];
    showNotification: (msg: string) => void;
}

export const useProjectsData = ({
    initialProjects,
    clients,
    teamMembers,
    transactions,
    showNotification
}: UseProjectsDataProps) => {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const totals = useMemo(() => {
        const activeProjectsCount = projects.filter(p => p.status !== 'Selesai' && p.status !== 'Dibatalkan').length;
        const activeClientsCount = clients.filter(c => c.status === 'Aktif').length;
        
        const discussionLeads = 0; // Simplified for now
        const followUpLeads = 0; 

        return {
            projects: projects.length,
            activeProjects: activeProjectsCount,
            clients: clients.length,
            activeClients: activeClientsCount,
            leads: discussionLeads + followUpLeads,
            discussionLeads,
            followUpLeads,
            teamMembers: teamMembers.length,
            transactions: transactions.length,
            revenue: projects.reduce((sum, p) => sum + (p.totalCost || 0), 0),
            expense: transactions.filter(t => t.type === 'Pengeluaran').reduce((sum, t) => sum + (t.amount || 0), 0)
        };
    }, [projects, clients, teamMembers, transactions]);

    const loadMoreProjects = async () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        try {
            const nextProjects = await listProjectsWithRelations({ limit: 20, offset: projects.length });
            if (nextProjects.length < 20) setHasMore(false);
            setProjects(prev => [...prev, ...nextProjects]);
        } catch (err) {
            console.error('Failed to load more projects:', err);
            showNotification('Gagal memuat lebih banyak proyek.');
        } finally {
            setIsLoadingMore(false);
        }
    };

    return {
        projects,
        setProjects,
        isLoading,
        setIsLoading,
        hasMore,
        isLoadingMore,
        loadMoreProjects,
        totals
    };
};
