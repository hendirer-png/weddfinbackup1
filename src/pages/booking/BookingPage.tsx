import React from 'react';
import { Lead, Client, Project, Package, ViewType, NavigationAction, Profile, BookingStatus } from '@/types';
import PageHeader from '@/layouts/PageHeader';
import Modal from '@/shared/ui/Modal';
import { CalendarIcon } from '@/constants';

// Feature Components
import BookingStats from '@/features/booking/components/BookingStats';
import BookingChartsSection from '@/features/booking/components/BookingChartsSection';
import BookingTable from '@/features/booking/components/BookingTable';
import WhatsappTemplateModal from '@/features/booking/components/WhatsappTemplateModal';

// Feature Hooks & Utils
import { useBookingPage } from '@/features/booking/hooks/useBookingPage';

interface BookingProps {
    leads: Lead[];
    clients: Client[];
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    packages: Package[];
    userProfile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
    handleNavigation: (view: ViewType, action?: NavigationAction) => void;
    showNotification: (message: string) => void;
}

const Booking: React.FC<BookingProps> = (props) => {
    const {
        leads, clients, projects, setProjects,
        userProfile, handleNavigation, showNotification
    } = props;

    const {
        // UI & State
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        viewingProofUrl, setViewingProofUrl,
        whatsappTemplateModal, setWhatsappTemplateModal,
        activeStatModal, setActiveStatModal,
        isInfoModalOpen, setIsInfoModalOpen,
        
        // Data
        allBookings,
        newBookings,
        confirmedBookings,
        filteredNewBookings,
        packageDonutData,
        mostPopularPackage,
        statModalData,
        
        // Handlers
        handleDeleteBooking,
        handleEditBooking,
        handleStatusChange
    } = useBookingPage({
        leads, clients, projects, setProjects,
        handleNavigation, showNotification
    });

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Penjadwalan Wedding" 
                subtitle="Pantau seluruh antrian booking, verifikasi pembayaran DP, dan jadwalkan Acara Pernikahan dengan kalender terpadu." 
                icon={<CalendarIcon className="w-6 h-6" />} 
            >
                <button 
                    onClick={() => setIsInfoModalOpen(true)} 
                    className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-xs font-bold"
                >
                    Pelajari
                </button>
            </PageHeader>

            <BookingStats 
                allBookingsCount={allBookings.length}
                totalValue={allBookings.reduce((sum, b) => sum + b.project.totalCost, 0)}
                mostPopularPackage={mostPopularPackage}
                newBookingsCount={newBookings.length}
                onStatClick={setActiveStatModal}
            />

            <BookingChartsSection 
                bookings={allBookings}
                packageData={packageDonutData}
            />

            {/* Booking Baru Section */}
            <BookingTable 
                title="Booking Baru Menunggu Konfirmasi"
                bookings={filteredNewBookings}
                clients={clients}
                onEdit={handleEditBooking}
                onDelete={handleDeleteBooking}
                onStatusChange={handleStatusChange}
                onViewProof={setViewingProofUrl}
                isNewSection={true}
                dateFilters={{
                    from: dateFrom,
                    to: dateTo,
                    onFromChange: setDateFrom,
                    onToChange: setDateTo
                }}
            />

            {/* Riwayat Booking Section */}
            <BookingTable 
                title="Riwayat Booking Dikonfirmasi"
                bookings={confirmedBookings}
                clients={clients}
                onEdit={handleEditBooking}
                onDelete={handleDeleteBooking}
                onOpenWhatsapp={(project, client) => setWhatsappTemplateModal({ project, client })}
                onViewDetail={(clientId) => handleNavigation(ViewType.CLIENTS, { type: 'VIEW_CLIENT_DETAILS', id: clientId })}
                onViewProof={setViewingProofUrl}
                isNewSection={false}
            />

            {/* Modals */}
            <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title="Panduan Halaman Booking">
                <div className="space-y-4 text-sm text-brand-text-primary">
                    <p>Halaman ini adalah pusat kendali untuk semua booking yang masuk dari formulir publik.</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Statistik:</strong> Kartu di atas memberikan ringkasan cepat. Klik kartu untuk melihat detailnya.</li>
                        <li><strong>Grafik:</strong> Visualisasikan tren booking per bulan dan popularitas Package.</li>
                        <li><strong>Booking Baru:</strong> Tabel teratas berisi semua booking yang menunggu tindakan Anda. Verifikasi bukti bayar dan konfirmasi booking untuk memindahkannya ke riwayat.</li>
                        <li><strong>Riwayat Booking:</strong> Tabel bawah berisi semua booking yang sudah Anda konfirmasi. Dari sini, Anda bisa memulai komunikasi dengan pengantin atau melihat detail Acara Pernikahan lebih lanjut.</li>
                        <li><strong>Aksi Cepat:</strong> Gunakan tombol "Konfirmasi", "Chat & WA", dan "Lihat Detail" untuk alur kerja yang lebih cepat.</li>
                    </ul>
                </div>
            </Modal>

            <Modal isOpen={!!activeStatModal} onClose={() => setActiveStatModal(null)} title={statModalData.title} size="2xl">
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-3">
                        {statModalData.bookings.length > 0 ? statModalData.bookings.map(booking => (
                            <div key={booking.project.id} className="p-3 bg-brand-bg rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-brand-text-light">{booking.project.projectName}</p>
                                    <p className="text-sm text-brand-text-secondary">{booking.project.clientName}</p>
                                </div>
                                <span className="font-semibold text-brand-text-primary">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(booking.project.totalCost)}
                                </span>
                            </div>
                        )) : <p className="text-center text-brand-text-secondary py-8">Tidak ada booking dalam kategori ini.</p>}
                    </div>
                </div>
            </Modal>

            {whatsappTemplateModal && (
                <WhatsappTemplateModal
                    project={whatsappTemplateModal.project}
                    client={whatsappTemplateModal.client}
                    onClose={() => setWhatsappTemplateModal(null)}
                    showNotification={showNotification}
                    userProfile={userProfile}
                />
            )}

            <Modal isOpen={!!viewingProofUrl} onClose={() => setViewingProofUrl(null)} title="Bukti Pembayaran">
                {viewingProofUrl && (
                    <img src={viewingProofUrl} alt="Bukti Pembayaran" className="w-full h-auto rounded-lg" />
                )}
            </Modal>
        </div>
    );
};

export default Booking;