import React from 'react';
import { EyeIcon } from '@/constants';
import { PencilIcon, Trash2Icon, ArrowDownIcon } from 'lucide-react';
import ProjectCard from '@/features/projects/components/ProjectCard';
import { 
    Project, 
    ProjectStatusConfig, 
    Client, 
    ProjectListViewProps 
} from '@/features/projects/types/project.types';
import { 
    getStatusColor, 
    getStatusClass, 
    getSubStatusText, 
    getDisplayProgress 
} from '@/features/projects/utils/project.utils';

const ProjectListView: React.FC<ProjectListViewProps> = ({ 
    projects, 
    handleOpenDetailModal, 
    handleOpenForm, 
    handleProjectDelete, 
    config, 
    clients, 
    handleQuickStatusChange, 
    handleSendMessage, 
    hasMore, 
    isLoadingMore, 
    onLoadMore 
}) => {

    const ProgressBar: React.FC<{ progress: number, status: string, config: ProjectStatusConfig[] }> = ({ progress, status, config }) => (
        <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: getStatusColor(status, config) }}></div>
        </div>
    );

    return (
        <div>
            {/* Mobile cards - Using ProjectCard Component */}
            <div className="md:hidden space-y-3">
                {projects.map(p => {
                    const client = clients.find(c => c.id === p.clientId);
                    return (
                        <ProjectCard
                            key={p.id}
                            project={p}
                            client={client}
                            projectStatusConfig={config}
                            onStatusChange={(projectId, newStatus) => handleQuickStatusChange(projectId, newStatus, false)}
                            onViewDetails={handleOpenDetailModal}
                            onEdit={(project) => handleOpenForm('edit', project)}
                            onSendMessage={handleSendMessage}
                        />
                    );
                })}
                {projects.length === 0 && <p className="text-center py-8 text-sm text-brand-text-secondary">Tidak ada Acara Pernikahan dalam kategori ini.</p>}
            </div>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-brand-text-secondary uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium tracking-wider">Nama Acara Pernikahan</th>
                            <th className="px-6 py-4 font-medium tracking-wider">Pengantin</th>
                            <th className="px-6 py-4 font-medium tracking-wider">Tanggal</th>
                            <th className="px-6 py-4 font-medium tracking-wider min-w-[200px]">Progress</th>
                            <th className="px-6 py-4 font-medium tracking-wider">Tim</th>
                            <th className="px-6 py-4 font-medium tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                        {projects.map(p => (
                            <tr key={p.id} className="hover:bg-brand-bg transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-brand-text-light">{p.projectName}</p>
                                    </div>
                                    <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${getStatusClass(p.status, config)}`}>
                                        {getSubStatusText(p)}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-brand-text-primary">{p.clientName}</td>
                                <td className="px-6 py-4 text-brand-text-primary">{new Date(p.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <ProgressBar progress={getDisplayProgress(p, config)} status={p.status} config={config} />
                                        <span className="text-xs font-semibold text-brand-text-secondary">{getDisplayProgress(p, config)}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-brand-text-primary">{p.team.map(t => t.name.split(' ')[0]).join(', ') || '-'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center space-x-1">
                                        <button onClick={() => handleOpenDetailModal(p)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors" title="Detail Acara Pernikahan"><EyeIcon className="w-5 h-5 text-white" /></button>
                                        <button onClick={() => handleOpenForm('edit', p)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors" title="Edit Acara Pernikahan"><PencilIcon className="w-5 h-5 text-white" /></button>
                                        <button onClick={() => handleProjectDelete(p.id)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-600 hover:bg-red-700 transition-colors" title="Hapus Acara Pernikahan"><Trash2Icon className="w-5 h-5 text-white" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {hasMore && (
                <div className="mt-8 flex justify-center pb-8">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text-primary hover:bg-brand-surface transition-all disabled:opacity-50"
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                Loading...
                            </>
                        ) : (
                            <>
                                <ArrowDownIcon className="w-4 h-4" />
                                Muat Lebih Banyak
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectListView;
