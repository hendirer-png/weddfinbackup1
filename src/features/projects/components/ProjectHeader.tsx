import React from 'react';
import { PlusIcon } from 'lucide-react';
import PageHeader from '@/layouts/PageHeader';

interface ProjectHeaderProps {
    onOpenInfoModal: () => void;
    onAddProject: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ onOpenInfoModal, onAddProject }) => {
    return (
        <PageHeader 
            title="Acara Pernikahan Wedding" 
            subtitle="Lacak semua Acara Pernikahan dari awal hingga selesai."
        >
            <div className="flex items-center gap-2">
                <button 
                    onClick={onOpenInfoModal} 
                    className="button-secondary"
                >
                    Pelajari Halaman Ini
                </button>
                <button 
                    onClick={onAddProject} 
                    className="button-primary inline-flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Tambah Acara Pernikahan
                </button>
            </div>
        </PageHeader>
    );
};

export default ProjectHeader;
