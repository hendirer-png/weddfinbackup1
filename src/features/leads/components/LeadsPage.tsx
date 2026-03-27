import React from 'react';
import Modal from '@/shared/ui/Modal';
import PageHeader from '@/layouts/PageHeader';
import { LightbulbIcon, PlusIcon } from '@/constants';
import { LeadsPageProps } from '@/features/leads/types';
import { useLeadsPage } from '@/features/leads/hooks/useLeadsPage';
import { LeadForm } from '@/features/leads/components/LeadForm';
import { ConvertLeadForm } from '@/features/leads/components/ConvertLeadForm';
import { LeadsAnalytics } from '@/features/leads/components/LeadsAnalytics';
import { LeadFilterBar } from '@/features/leads/components/LeadFilterBar';
import { LeadKanban } from '@/features/leads/components/LeadKanban';
import { ShareMessageModal } from '@/features/leads/components/ShareMessageModal';

export const LeadsPage: React.FC<LeadsPageProps> = (props) => {
    const {
        leads, packages, addOns, userProfile, setProfile, cards, promoCodes, showNotification, totals,
    } = props;

    const {
        isModalOpen, modalMode, formData, setFormData,
        handleOpenModal, handleCloseModal, handleFormChange, handleSubmit,
        isShareModalOpen, setIsShareModalOpen,
        activeStatModal, setActiveStatModal,
        hiddenColumns, toggleHiddenColumns,
        searchTerm, setSearchTerm,
        sourceFilter, setSourceFilter,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        shareModalState, setShareModalState,
        publicLeadFormUrl, publicBookingFormUrl, publicPackagesUrl,
        visibleLeadColumns,
        handleStatCardClick,
        handleDragStart, handleDragOver, handleDrop,
        handleNextStatus, handleDeleteLead,
    } = useLeadsPage({ ...props });

    const isEmpty = leads.length === 0;

    return (
        <div className="space-y-6">
            {isEmpty ? (
                <div className="text-center py-20">
                    <LightbulbIcon className="mx-auto h-16 w-16 text-brand-accent" />
                    <h2 className="mt-4 text-2xl font-bold text-brand-text-light">Selamat Datang di Halaman Calon Pengantin!</h2>
                    <p className="mt-2 text-brand-text-secondary max-w-lg mx-auto">Halaman ini adalah tempat Anda mengelola semua calon pengantin (Calon Pengantin) sebelum mereka resmi menjadi Acara Pernikahan.</p>
                    <button onClick={() => handleOpenModal('add')} className="mt-8 button-primary inline-flex items-center gap-2"><PlusIcon className="w-5 h-5" />Tambah Calon Pengantin Pertama Anda</button>
                </div>
            ) : (
                <>
                    <PageHeader
                        title="Database Calon Pengantin"
                        subtitle="Kelola prospek calon pengantin, track interaksi awal, dan konversi mereka menjadi Client utama Anda."
                        icon={<LightbulbIcon className="w-6 h-6" />}
                    >
                        <button 
                            onClick={() => handleOpenModal('add')} 
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all text-xs sm:text-sm font-black shadow-lg shadow-blue-900/40"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>Tambah Calon Pengantin</span>
                        </button>
                    </PageHeader>

                    <LeadsAnalytics leads={leads} totals={totals} onStatCardClick={handleStatCardClick} />

                    <LeadFilterBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        dateFrom={dateFrom}
                        onDateFromChange={setDateFrom}
                        dateTo={dateTo}
                        onDateToChange={setDateTo}
                        sourceFilter={sourceFilter}
                        onSourceFilterChange={setSourceFilter}
                        hiddenColumns={hiddenColumns}
                        onToggleHiddenColumns={toggleHiddenColumns}
                        onOpenShareModal={() => setIsShareModalOpen(true)}
                        onAddLead={() => handleOpenModal('add')}
                    />

                    <LeadKanban
                        visibleLeadColumns={visibleLeadColumns}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onEdit={(lead) => handleOpenModal('edit', lead)}
                        onDelete={handleDeleteLead}
                        onNextStatus={handleNextStatus}
                        onShare={(type, lead) => setShareModalState({ type, lead })}
                        hiddenColumns={hiddenColumns}
                        toggleHiddenColumns={toggleHiddenColumns}
                        isShareModalOpen={isShareModalOpen}
                        onOpenShareModal={() => setIsShareModalOpen(true)}
                        onAddLead={() => handleOpenModal('add')}
                        showNotification={showNotification}
                        setLeads={props.setLeads}
                    />
                </>
            )}

            {/* Lead Add/Edit/Convert Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalMode === 'add' ? 'Tambah Calon Pengantin Baru' : modalMode === 'edit' ? 'Edit Calon Pengantin' : 'Konversi Calon Pengantin Menjadi Pengantin'}
                size={modalMode === 'convert' ? '4xl' : 'lg'}
            >
                {modalMode === 'convert' ? (
                    <ConvertLeadForm
                        formData={formData}
                        setFormData={setFormData}
                        handleFormChange={handleFormChange}
                        handleSubmit={handleSubmit}
                        handleCloseModal={handleCloseModal}
                        packages={packages}
                        addOns={addOns}
                        userProfile={userProfile}
                        cards={cards}
                        promoCodes={promoCodes}
                    />
                ) : (
                    <LeadForm
                        formData={formData}
                        handleFormChange={handleFormChange}
                        handleSubmit={handleSubmit}
                        handleCloseModal={handleCloseModal}
                        modalMode={modalMode}
                    />
                )}
            </Modal>

            {/* QR Share Modal */}
            <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Bagikan Formulir Calon Pengantin Publik" size="sm">
                <div className="text-center p-4">
                    <div id="lead-form-qrcode" className="p-4 bg-white rounded-lg inline-block mx-auto"></div>
                    <p className="text-xs text-brand-text-secondary mt-4 break-all">{publicLeadFormUrl}</p>
                    <div className="flex items-center gap-2 mt-6">
                        <button onClick={() => { navigator.clipboard.writeText(publicLeadFormUrl); showNotification('Tautan berhasil disalin!'); }} className="button-secondary w-full">Salin Tautan</button>
                        <a href={`https://wa.me/?text=Silakan%20isi%20formulir%20berikut%20untuk%20memulai%3A%20${encodeURIComponent(publicLeadFormUrl)}`} target="_blank" rel="noopener noreferrer" className="button-primary w-full">Bagikan ke WA</a>
                    </div>
                </div>
            </Modal>

            {/* WhatsApp Share Template Modal */}
            {shareModalState && (
                <ShareMessageModal
                    type={shareModalState.type}
                    lead={shareModalState.lead}
                    userProfile={userProfile}
                    publicBookingFormUrl={publicBookingFormUrl}
                    publicPackagesUrl={publicPackagesUrl}
                    onClose={() => setShareModalState(null)}
                    showNotification={showNotification}
                    setProfile={setProfile}
                />
            )}

            {/* Stat Detail Modal */}
            <Modal isOpen={!!activeStatModal} onClose={() => setActiveStatModal(null)} title="" size="2xl">
                <p className="text-center text-brand-text-secondary py-8">Tidak ada data untuk ditampilkan.</p>
            </Modal>
        </div>
    );
};
