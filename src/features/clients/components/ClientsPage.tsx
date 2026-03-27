import React from 'react';
// Types
import { 
    Client, Project, Transaction, Package, Card, PromoCode, FinancialPocket, 
    ViewType, NavigationAction, Profile, ClientFeedback, Contract 
} from '@/types';
import { ExtendedClient } from '@/features/clients/types';

// Hooks
import { useClientsPage } from '@/features/clients/hooks/useClientsPage';

// Components (Named & Default Imports)
import { ClientStatsCards } from '@/features/clients/components/ClientStatsCards';
import { ClientFilterBar } from '@/features/clients/components/ClientFilterBar';
import { ClientHeader } from '@/features/clients/components/ClientHeader';
import { ClientActiveList } from '@/features/clients/components/ClientActiveList';
import { ClientInactiveList } from '@/features/clients/components/ClientInactiveList';
import { ClientUnpaidList } from '@/features/clients/components/ClientUnpaidList';
import { ClientForm } from '@/features/clients/components/ClientForm';
import ClientDetailModal from '@/features/clients/components/ClientDetailModal';
import BillingChatModal from '@/features/clients/components/BillingChatModal';
import { NewClientsChart } from '@/features/clients/components/NewClientsChart';
import { ClientPortalQrModal, BookingFormShareModal } from '@/features/clients/components/ClientLinkModals';
import { InvoicePreviewModal } from '@/features/clients/components/InvoicePreviewModal';
import { ReceiptPreviewModal } from '@/features/clients/components/ReceiptPreviewModal';
import ProjectsPageFeature from '@/features/projects/ProjectsPage';
import ProjectListView from '@/features/projects/components/ProjectListView';
import { useProjectActions } from '@/features/projects/hooks/useProjectActions';
import ProjectForm from '@/features/projects/components/ProjectForm';
import ProjectDetailModal from '@/features/projects/components/ProjectDetailModal';
import QuickStatusModal from '@/features/projects/components/QuickStatusModal';
import BriefingModal from '@/features/projects/components/BriefingModal';
import ChatModal from '@/features/communication/components/ChatModal';
import ShareMessageModal from '@/features/communication/components/ShareMessageModal';
import Contracts from '@/pages/contracts/ContractsPage';

export interface ClientsFeatureProps {
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    packages: Package[];
    addOns: any[];
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    userProfile: Profile;
    showNotification: (message: string) => void;
    addNotification: (notif: any) => void;
    initialAction: any;
    setInitialAction: (val: any) => void;
    cards: Card[];
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    handleNavigation: (view: ViewType, action?: NavigationAction) => void;
    promoCodes: PromoCode[];
    setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
    totals: any;
    pockets: FinancialPocket[];
    setPockets: React.Dispatch<React.SetStateAction<FinancialPocket[]>>;
    clientFeedback: ClientFeedback[];
    onSignInvoice: (pId: string, sig: string) => void;
    onSignTransaction: (tId: string, sig: string) => void;
    teamMembers: any[];
    teamProjectPayments: any[];
    setTeamProjectPayments: React.Dispatch<React.SetStateAction<any[]>>;
    onRecordPayment: (projectId: string, amount: number, destinationCardId: string) => void;
    contracts: Contract[];
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
    onSignContract: (contractId: string, signatureDataUrl: string, signer: 'vendor' | 'client') => void;
}

export const ClientsPage: React.FC<ClientsFeatureProps> = (props) => {
    const {
        clients, setClients,
        projects, setProjects,
        packages, addOns,
        transactions, setTransactions,
        userProfile,
        showNotification,
        addNotification,
        initialAction, setInitialAction,
        cards, setCards,
        handleNavigation,
        promoCodes, setPromoCodes,
        onSignInvoice,
        onSignTransaction,
        onRecordPayment,
        pockets,
        setPockets,
        teamMembers,
        teamProjectPayments,
        setTeamProjectPayments,
        contracts,
        setContracts,
        onSignContract
    } = props;

    const [mainTab, setMainTab] = React.useState<'database' | 'progress' | 'contracts'>(() => {
        const hash = window.location.hash;
        if (hash.includes('progress') || hash.includes('projects')) return 'progress';
        if (hash.includes('contracts') || hash.includes('kontrak')) return 'contracts';
        return 'database';
    });

    const {
        activeTab, setActiveTab,
        searchQuery, setSearchQuery,
        statusFilter, setStatusFilter,
        typeFilter, setTypeFilter,
        startDate, setStartDate,
        endDate, setEndDate,
        sortConfig, setSortConfig,
        filteredClientData,
        stats,
        isModalOpen, modalMode, formData, setFormData,
        handleOpenModal, handleCloseModal, handleFormChange, handleFormSubmit,
        handleDeleteClient,
        handleSharePortal,
        handleDeleteProject,
        handleDownloadClients,
        isDetailModalOpen, selectedClientForDetail, handleViewDetail, handleCloseDetail,
        isBillingModalOpen, handleOpenBilling, handleCloseBilling,
        qrModalContent, handleCloseQrModal, handleDownloadQr, handleShareWhatsApp,
        isBookingFormShareModalOpen, handleOpenBookingModal, handleCloseBookingModal,
        bookingFormUrl, handleCopyBookingLink
    } = useClientsPage({
        clients, setClients,
        projects, setProjects,
        transactions, setTransactions,
        cards, setCards,
        promoCodes, setPromoCodes,
        packages, addOns,
        userProfile,
        showNotification,
        addNotification,
        initialAction,
        setInitialAction
    });

    const projectActions = useProjectActions({
        projects, setProjects, clients, teamMembers,
        teamProjectPayments, setTeamProjectPayments,
        transactions, setTransactions, cards, setCards,
        pockets, setPockets, profile: userProfile, showNotification
    });

    const handleManageProjects = (client: ExtendedClient) => {
        setMainTab('progress');
        window.location.hash = '#/progress';
        if (client.mostRecentProject) {
            projectActions.handleOpenDetailModal(client.mostRecentProject);
        }
    };

    const clientStats = {
        totalClients: stats.totalClients,
        activeClients: stats.activeClients,
        totalReceivables: stats.totalReceivables.toLocaleString(),
        mostFrequentLocation: stats.mostFrequentLocation
    };

    const [selectedInvoiceProject, setSelectedInvoiceProject] = React.useState<Project | null>(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);
    const [selectedReceiptTransaction, setSelectedReceiptTransaction] = React.useState<Transaction | null>(null);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = React.useState(false);

    const handleViewInvoiceModal = (project: Project) => {
        setSelectedInvoiceProject(project);
        setIsInvoiceModalOpen(true);
    };

    const handleViewReceiptModal = (transaction: Transaction) => {
        setSelectedReceiptTransaction(transaction);
        setIsReceiptModalOpen(true);
    };

    return (
        <div className="space-y-6 pb-20 sm:pb-8">
            <div className="flex p-1 bg-brand-surface/60 backdrop-blur-md rounded-2xl border border-brand-border/40 w-fit">
                <button
                    onClick={() => { setMainTab('database'); window.location.hash = '#/clients'; }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${mainTab === 'database' ? 'bg-brand-accent text-white shadow-lg' : 'text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/5'}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Database Pengantin
                </button>
                <button
                    onClick={() => { setMainTab('progress'); window.location.hash = '#/progress'; }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${mainTab === 'progress' ? 'bg-brand-accent text-white shadow-lg' : 'text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/5'}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Progress & Timeline Acara
                </button>
                <button
                    onClick={() => { setMainTab('contracts'); window.location.hash = '#/contracts'; }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${mainTab === 'contracts' ? 'bg-brand-accent text-white shadow-lg' : 'text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/5'}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Kontrak Digital
                </button>
            </div>

            {mainTab === 'database' ? (
                <>
                    <ClientHeader 
                        onAddClient={() => handleOpenModal('add')}
                        onDownloadClients={handleDownloadClients} 
                        onShareBookingForm={handleOpenBookingModal}
                    />

                    <ClientStatsCards stats={clientStats} />

                    <NewClientsChart clients={clients} />

                    <ClientUnpaidList 
                        clients={filteredClientData.filter(c => c.balanceDue > 0)}
                        onViewDetail={handleViewDetail}
                    />

                    <ClientFilterBar 
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        typeFilter={typeFilter}
                        onTypeFilterChange={setTypeFilter}
                        startDate={startDate}
                        onStartDateChange={setStartDate}
                        endDate={endDate}
                        onEndDateChange={setEndDate}
                        sortConfig={sortConfig}
                        onSortChange={setSortConfig}
                    />

                    <div className="space-y-6">
                        {(activeTab === 'all' || activeTab === 'unpaid') && (
                            <>
                                <ClientActiveList 
                                    clients={filteredClientData}
                                    onEditClient={(c: ExtendedClient) => handleOpenModal('edit', c, c.projects[0])}
                                    onViewDetail={handleViewDetail}
                                    onDeleteClient={handleDeleteClient}
                                    onAddProject={(c: ExtendedClient) => handleOpenModal('add', c)}
                                    onManageProjects={handleManageProjects}
                                />
                                <ClientInactiveList 
                                    clients={filteredClientData}
                                    onEditClient={(c: ExtendedClient) => handleOpenModal('edit', c, c.projects[0])}
                                    onViewDetail={handleViewDetail}
                                    onDeleteClient={handleDeleteClient}
                                />
                            </>
                        )}
                        {activeTab === 'inactive' && (
                            <ClientInactiveList 
                                clients={filteredClientData}
                                onEditClient={(c: ExtendedClient) => handleOpenModal('edit', c, c.projects[0])}
                                onViewDetail={handleViewDetail}
                                onDeleteClient={handleDeleteClient}
                            />
                        )}
                    </div>
                </>
            ) : mainTab === 'progress' ? (
                <ProjectsPageFeature 
                    initialAction={initialAction}
                    setInitialAction={setInitialAction}
                    profile={userProfile}
                    showNotification={showNotification}
                    clients={clients}
                    packages={packages}
                    teamMembers={teamMembers}
                    teamProjectPayments={teamProjectPayments}
                    transactions={transactions}
                    cards={cards}
                    pockets={pockets}
                    setProjects={setProjects}
                    setTeamProjectPayments={setTeamProjectPayments}
                    setTransactions={setTransactions}
                    setCards={setCards}
                    setPockets={setPockets}
                    projects={projects}
                    totals={props.totals}
                />
            ) : (
                <Contracts 
                    contracts={contracts}
                    setContracts={setContracts}
                    clients={clients}
                    projects={projects}
                    profile={userProfile}
                    showNotification={showNotification}
                    initialAction={initialAction}
                    setInitialAction={setInitialAction}
                    packages={packages}
                    onSignContract={onSignContract}
                />
            )}

            <ClientForm 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={modalMode}
                formData={formData}
                setFormData={setFormData}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                packages={packages}
                addOns={addOns}
                promoCodes={promoCodes}
                cards={cards}
                userProfile={userProfile}
            />

            {selectedClientForDetail && (
                <ClientDetailModal 
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetail}
                    client={selectedClientForDetail}
                    projects={projects}
                    transactions={transactions}
                    packages={packages}
                    cards={cards}
                    onEditClient={(c: Client) => handleOpenModal('edit', c, projects.find(p => p.clientId === c.id))}
                    onDeleteClient={handleDeleteClient}
                    onViewReceipt={handleViewReceiptModal}
                    onViewInvoice={handleViewInvoiceModal}
                    handleNavigation={handleNavigation}
                    onRecordPayment={onRecordPayment}
                    onSharePortal={handleSharePortal}
                    onDeleteProject={handleDeleteProject}
                    showNotification={showNotification}
                    setProjects={setProjects}
                    setTransactions={setTransactions}
                    setCards={setCards}
                    userProfile={userProfile}
                />
            )}

            <BillingChatModal 
                isOpen={isBillingModalOpen}
                onClose={handleCloseBilling}
                client={selectedClientForDetail}
                projects={projects}
                userProfile={userProfile}
                showNotification={showNotification}
            />

            <ClientPortalQrModal 
                qrModalContent={qrModalContent}
                onCloseQrModal={handleCloseQrModal}
                onDownloadQr={handleDownloadQr}
                onShareWhatsApp={handleShareWhatsApp}
            />

            <BookingFormShareModal 
                isBookingFormShareModalOpen={isBookingFormShareModalOpen}
                onCloseBookingModal={handleCloseBookingModal}
                bookingFormUrl={bookingFormUrl}
                onCopyLink={handleCopyBookingLink}
                onDownloadQr={handleDownloadQr}
            />

            {selectedInvoiceProject && (
                <InvoicePreviewModal 
                    isOpen={isInvoiceModalOpen}
                    onClose={() => setIsInvoiceModalOpen(false)}
                    project={selectedInvoiceProject}
                    profile={userProfile}
                    packages={packages}
                    client={clients.find(c => c.id === selectedInvoiceProject.clientId)}
                    onSign={(sig) => onSignInvoice(selectedInvoiceProject.id, sig)}
                    onEdit={() => {
                        const client = clients.find(c => c.id === selectedInvoiceProject.clientId);
                        if (client) handleOpenModal('edit', client, selectedInvoiceProject);
                    }}
                />
            )}

            {selectedReceiptTransaction && (
                <ReceiptPreviewModal 
                    isOpen={isReceiptModalOpen}
                    onClose={() => setIsReceiptModalOpen(false)}
                    transaction={selectedReceiptTransaction}
                    project={projects.find(p => p.id === selectedReceiptTransaction.projectId)}
                    client={selectedClientForDetail}
                    profile={userProfile}
                    onSign={(sig) => onSignTransaction(selectedReceiptTransaction.id, sig)}
                    onEdit={() => {
                        const project = projects.find(p => p.id === selectedReceiptTransaction.projectId);
                        if (selectedClientForDetail && project) {
                            handleOpenModal('edit', selectedClientForDetail, project);
                        }
                    }}
                />
            )}

            {/* Project Related Modals */}
            {projectActions.isFormModalOpen && projectActions.formData && (
                <ProjectForm 
                    isOpen={projectActions.isFormModalOpen}
                    onClose={projectActions.handleCloseForm}
                    mode={projectActions.formMode}
                    formData={projectActions.formData}
                    onFormChange={projectActions.handleFormChange}
                    onSubStatusChange={projectActions.handleSubStatusChange}
                    onClientChange={projectActions.handleClientChange}
                    onTeamChange={projectActions.handleTeamChange}
                    onTeamFeeChange={projectActions.handleTeamFeeChange}
                    onTeamSubJobChange={projectActions.handleTeamSubJobChange}
                    onTeamClientPortalLinkChange={projectActions.handleTeamClientPortalLinkChange}
                    onCustomSubStatusChange={projectActions.handleCustomSubStatusChange}
                    onAddCustomSubStatus={projectActions.addCustomSubStatus}
                    onRemoveCustomSubStatus={projectActions.removeCustomSubStatus}
                    onSubmit={projectActions.handleFormSubmit}
                    clients={clients}
                    teamMembers={teamMembers}
                    teamProjectPayments={teamProjectPayments}
                    profile={userProfile}
                    teamByCategory={projectActions.teamByCategory}
                    showNotification={showNotification}
                    setFormData={projectActions.setFormData}
                />
            )}

            {projectActions.isDetailModalOpen && projectActions.selectedProject && (
                <ProjectDetailModal 
                    isOpen={projectActions.isDetailModalOpen}
                    selectedProject={projectActions.selectedProject}
                    onClose={() => projectActions.setIsDetailModalOpen(false)}
                    profile={userProfile}
                    packages={packages}
                    teamProjectPayments={teamProjectPayments}
                    onProjectUpdate={(up: Project) => setProjects(prev => prev.map(p => p.id === up.id ? up : p))}
                    clients={clients}
                    handleOpenForm={projectActions.handleOpenForm}
                    handleOpenBriefingModal={() => projectActions.handleOpenBriefingModal(projectActions.selectedProject!)}
                    showNotification={showNotification}
                />
            )}

            {projectActions.isBriefingModalOpen && (
                <BriefingModal 
                    isOpen={projectActions.isBriefingModalOpen}
                    onClose={() => projectActions.setIsBriefingModalOpen(false)}
                    briefingText={projectActions.briefingText}
                />
            )}

            {projectActions.quickStatusModalOpen && projectActions.selectedProjectForStatus && (
                <QuickStatusModal 
                    isOpen={projectActions.quickStatusModalOpen}
                    onClose={() => projectActions.setQuickStatusModalOpen(false)}
                    project={projectActions.selectedProjectForStatus}
                    statusConfig={userProfile.projectStatusConfig}
                    onStatusChange={projectActions.handleQuickStatusChange}
                    showNotification={showNotification}
                />
            )}

            {projectActions.sharePreview && (
                <ShareMessageModal 
                    isOpen={!!projectActions.sharePreview}
                    onClose={() => projectActions.setSharePreview(null)}
                    title={projectActions.sharePreview.title}
                    initialMessage={projectActions.sharePreview.message}
                    phone={projectActions.sharePreview.phone}
                    showNotification={showNotification}
                />
            )}

            {projectActions.chatModalData && (
                <ChatModal 
                    isOpen={!!projectActions.chatModalData}
                    onClose={() => projectActions.setChatModalData(null)}
                    project={projectActions.chatModalData.project}
                    client={projectActions.chatModalData.client}
                    onSendMessage={() => {}} 
                    userProfile={userProfile}
                />
            )}
        </div>
    );
};
