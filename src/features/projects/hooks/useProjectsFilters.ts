import { useState, useMemo } from 'react';
import { Project, ProjectStatusConfig } from '@/features/projects/types/project.types';

interface UseProjectsFiltersProps {
    projects: Project[];
    projectStatusConfig: ProjectStatusConfig[];
}

export const useProjectsFilters = ({ projects, projectStatusConfig }: UseProjectsFiltersProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = 
                project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            
            const projectDate = new Date(project.date);
            const matchesDateFrom = !dateFrom || projectDate >= new Date(dateFrom);
            const matchesDateTo = !dateTo || projectDate <= new Date(dateTo);

            return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
        });
    }, [projects, searchTerm, statusFilter, dateFrom, dateTo]);

    const activeProjects = useMemo(() => {
        return filteredProjects.filter(p => p.status !== 'Selesai' && p.status !== 'Dibatalkan');
    }, [filteredProjects]);

    const completedAndCancelledProjects = useMemo(() => {
        return filteredProjects.filter(p => p.status === 'Selesai' || p.status === 'Dibatalkan');
    }, [filteredProjects]);

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        viewMode,
        setViewMode,
        filteredProjects,
        activeProjects,
        completedAndCancelledProjects
    };
};
