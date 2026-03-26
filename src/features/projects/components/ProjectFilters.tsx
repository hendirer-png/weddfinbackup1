import React from 'react';
import { 
    CalendarIcon, 
    ListIcon, 
    LayoutGridIcon 
} from 'lucide-react';
import { ProjectStatusConfig } from '@/features/projects/types/project.types';

interface ProjectFiltersProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    dateFrom: string;
    setDateFrom: (val: string) => void;
    dateTo: string;
    setDateTo: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    viewMode: 'list' | 'kanban';
    setViewMode: (mode: 'list' | 'kanban') => void;
    projectStatusConfig: ProjectStatusConfig[];
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    projectStatusConfig
}) => {
    return (
        <div className="bg-brand-surface p-3 md:p-4 rounded-xl shadow-lg border border-brand-border flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <div className="input-group flex-grow !mt-0 w-full md:w-auto">
                <input 
                    type="search" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="input-field !rounded-lg !border !bg-brand-bg p-2 md:p-2.5 text-sm" 
                    placeholder=" " 
                />
                <label className="input-label text-sm">Cari Acara Pernikahan atau pengantin...</label>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 w-full md:w-auto">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <CalendarIcon className="w-4 h-4 text-brand-text-secondary flex-shrink-0" />
                    <input 
                        type="date" 
                        value={dateFrom} 
                        onChange={e => setDateFrom(e.target.value)} 
                        className="input-field !rounded-lg !border !bg-brand-bg p-2 md:p-2.5 text-sm w-full md:w-40" 
                        title="Dari tanggal" 
                    />
                </div>
                <span className="text-brand-text-secondary text-sm hidden md:inline">–</span>
                <input 
                    type="date" 
                    value={dateTo} 
                    onChange={e => setDateTo(e.target.value)} 
                    className="input-field !rounded-lg !border !bg-brand-bg p-2 md:p-2.5 text-sm w-full md:w-40" 
                    title="Sampai tanggal" 
                />
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)} 
                    className="input-field !rounded-lg !border !bg-brand-bg p-2 md:p-2.5 text-sm w-full md:w-48"
                >
                    <option value="all">Semua Status</option>
                    {projectStatusConfig.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <div className="p-0.5 md:p-1 bg-brand-bg rounded-lg flex items-center h-fit w-full md:w-auto">
                    <button 
                        onClick={() => setViewMode('list')} 
                        className={`flex-1 md:flex-none flex justify-center p-1.5 md:p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-brand-surface shadow-sm text-brand-text-light' : 'text-brand-text-secondary'}`}
                    >
                        <ListIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button 
                        onClick={() => setViewMode('kanban')} 
                        className={`flex-1 md:flex-none flex justify-center p-1.5 md:p-2 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-brand-surface shadow-sm text-brand-text-light' : 'text-brand-text-secondary'}`}
                    >
                        <LayoutGridIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectFilters;
