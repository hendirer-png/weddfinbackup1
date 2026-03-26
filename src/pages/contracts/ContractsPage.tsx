import React from 'react';
import { Contract, Client, Project, Profile, Package, NavigationAction } from '@/types';
import PageHeader from '@/layouts/PageHeader';
import { PlusIcon, FileTextIcon } from '@/constants';
import { useContractsPage } from '@/features/contracts/hooks/useContractsPage';
import { ContractStats } from '@/features/contracts/components/ContractStats';
import { ContractTable } from '@/features/contracts/components/ContractTable';
import { ContractMobileList } from '@/features/contracts/components/ContractMobileList';
import { ContractFormModal } from '@/features/contracts/components/ContractFormModal';
import { ContractViewModal } from '@/features/contracts/components/ContractViewModal';
import { ContractInfoModal } from '@/features/contracts/components/ContractInfoModal';
import { handleDownloadPDF, handleDownloadPDFWithoutTTD } from '@/features/contracts/utils/pdf.utils';

interface ContractsProps {
    contracts: Contract[];
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
    clients: Client[];
    projects: Project[];
    profile: Profile;
    showNotification: (message: string) => void;
    initialAction: NavigationAction | null;
    setInitialAction: (action: NavigationAction | null) => void;
    packages: Package[];
    onSignContract: (contractId: string, signatureDataUrl: string, signer: 'vendor' | 'client') => void;
}

const Contracts: React.FC<ContractsProps> = ({ 
    contracts, 
    setContracts, 
    clients, 
    projects, 
    profile, 
    showNotification, 
    initialAction, 
    setInitialAction, 
    packages, 
    onSignContract 
}) => {
    const {
        isFormModalOpen,
        isViewModalOpen,
        modalMode,
        selectedContract,
        isInfoModalOpen,
        setIsInfoModalOpen,
        isSignatureModalOpen,
        setIsSignatureModalOpen,
        formData,
        setFormData,
        selectedClientId,
        setSelectedClientId,
        selectedProjectId,
        setSelectedProjectId,
        availableProjects,
        handleOpenModal,
        handleCloseModal,
        handleFormChange,
        handleSubmit,
        handleDelete,
        handleSaveSignature,
        stats
    } = useContractsPage({
        contracts,
        setContracts,
        clients,
        projects,
        profile,
        packages,
        showNotification,
        initialAction,
        setInitialAction,
        onSignContract
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader 
                title="Kontrak" 
                subtitle="Buat, kelola, dan arsipkan semua kontrak kerja Anda." 
                icon={<FileTextIcon className="w-6 h-6" />}
            >
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsInfoModalOpen(true)} className="button-secondary">Pelajari Halaman Ini</button>
                    <button onClick={() => handleOpenModal('add')} className="button-primary inline-flex items-center gap-2 shadow-lg shadow-brand-accent/20">
                        <PlusIcon className="w-5 h-5"/> Buat Kontrak
                    </button>
                </div>
            </PageHeader>

            <ContractStats 
                totalContracts={contracts.length}
                waitingForClient={stats.waitingForClient}
                totalValue={stats.totalValue}
            />
            
            <ContractTable 
                contracts={contracts}
                clients={clients}
                projects={projects}
                onView={(c) => handleOpenModal('view', c)}
                onEdit={(c) => handleOpenModal('edit', c)}
                onDelete={handleDelete}
            />

            <ContractMobileList 
                contracts={contracts}
                clients={clients}
                projects={projects}
                onView={(c) => handleOpenModal('view', c)}
                onEdit={(c) => handleOpenModal('edit', c)}
                onDelete={handleDelete}
            />

            <ContractInfoModal 
                isOpen={isInfoModalOpen} 
                onClose={() => setIsInfoModalOpen(false)} 
            />
            
            <ContractFormModal 
                isOpen={isFormModalOpen}
                onClose={handleCloseModal}
                mode={modalMode === 'view' ? 'edit' : modalMode} // Fallback for safety
                formData={formData}
                setFormData={setFormData}
                clients={clients}
                availableProjects={availableProjects}
                selectedClientId={selectedClientId}
                setSelectedClientId={setSelectedClientId}
                selectedProjectId={selectedProjectId}
                setSelectedProjectId={setSelectedProjectId}
                handleFormChange={handleFormChange}
                handleSubmit={handleSubmit}
            />
            
            <ContractViewModal 
                isOpen={isViewModalOpen}
                onClose={handleCloseModal}
                selectedContract={selectedContract}
                projects={projects}
                clients={clients}
                profile={profile}
                isSignatureModalOpen={isSignatureModalOpen}
                setIsSignatureModalOpen={setIsSignatureModalOpen}
                handleSaveSignature={handleSaveSignature}
                handleDownloadPDF={() => handleDownloadPDF(selectedContract)}
                handleDownloadPDFWithoutTTD={() => handleDownloadPDFWithoutTTD(selectedContract, projects, profile)}
                showNotification={showNotification}
            />
        </div>
    );
};

export default Contracts;