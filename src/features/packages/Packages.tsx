import React from 'react';
import { Package, AddOn, Project, Profile, REGIONS } from '@/types';
import PageHeader from '@/layouts/PageHeader';
import { PlusIcon, InfoIcon, Share2Icon, ChevronRightIcon, PackageIcon } from '@/constants';
import { usePackages, emptyPackageForm, emptyAddOnForm, PackageForm, AddOnForm } from '@/features/packages/hooks/usePackages';
import PackageCard from '@/features/packages/components/PackageCard';
import AddOnSection from '@/features/packages/components/AddOnSection';
import PackageFormModal from '@/features/packages/components/PackageFormModal';
import { PackageInfoModal, PackageShareModal } from '@/features/packages/components/PackageModals';
import GalleryUpload from '@/features/public/components/GalleryUpload';
import { useApp } from '@/app/AppProviders';

interface PackagesProps {
    packages: Package[];
    setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
    addOns: AddOn[];
    setAddOns: React.Dispatch<React.SetStateAction<AddOn[]>>;
    projects: Project[];
    profile: Profile;
}

const Packages: React.FC<PackagesProps> = (props) => {
    const { showNotification } = useApp();
    const [activeTab, setActiveTab] = React.useState<'packages' | 'galleries'>(() => {
        const hash = window.location.hash;
        return hash.includes('gallery') || hash.includes('pricelist-upload') ? 'galleries' : 'packages';
    });

    const {
        packageFormData, setPackageFormData,
        packageEditMode, setPackageEditMode,
        regionFilter, setRegionFilter,
        addOnFormData, setAddOnFormData,
        addOnEditMode, setAddOnEditMode,
        isShareModalOpen, setIsShareModalOpen,
        isInfoModalOpen, setIsInfoModalOpen,
        expandedDurationIndex, setExpandedDurationIndex,
        publicPackagesUrl,
        publicBookingUrl,
        unionRegions,
        packagesByCategory,
        existingRegions,
        handleDurationOptionChange,
        addDurationOption,
        removeDurationOption,
        handleDurationDetailChange,
        addDurationDetail,
        removeDurationDetail,
        handlePackageInputChange,
        handleCoverImageChange,
        handleListChange,
        addListItem,
        removeListItem,
        handlePackageEdit,
        handlePackageSubmit,
        handlePackageDelete,
        handleAddOnSubmit,
        handleAddOnDelete
    } = usePackages(props);

    const copyPackagesLinkToClipboard = () => {
        navigator.clipboard.writeText(publicPackagesUrl)
            .then(() => alert('Tautan Pricelist berhasil disalin!'))
            .catch(err => console.error('Gagal menyalin tautan:', err));
    };

    const copyBookingLinkToClipboard = () => {
        navigator.clipboard.writeText(publicBookingUrl)
            .then(() => alert('Tautan Form Booking berhasil disalin!'))
            .catch(err => console.error('Gagal menyalin tautan:', err));
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <PageHeader
                title="Katalog Produk & Layanan"
                subtitle="Susun Package wedding terbaik, kelola tambahan jasa (Add-ons), dan update portofolio visual Anda."
                icon={<PackageIcon className="w-6 h-6" />}
            >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-white/10 rounded-xl border border-white/10 shrink-0">
                        <button 
                            onClick={() => { setActiveTab('packages'); window.location.hash = '#/packages'; }}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'packages' ? 'bg-white text-blue-600 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                        >
                            Paket & Add-on
                        </button>
                        <button 
                            onClick={() => { setActiveTab('galleries'); window.location.hash = '#/gallery'; }}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'galleries' ? 'bg-white text-blue-600 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                        >
                            Portofolio
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsInfoModalOpen(true)} 
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-xs font-bold"
                        >
                            Info
                        </button>
                        <button 
                            onClick={() => setIsShareModalOpen(true)} 
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-xs font-bold"
                        >
                            Bagikan
                        </button>
                    </div>

                    <button 
                        onClick={() => { setPackageEditMode('new'); setPackageFormData(emptyPackageForm); }}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all text-xs sm:text-sm font-black shadow-lg shadow-blue-900/40"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Tambah Paket</span>
                    </button>
                </div>
            </PageHeader>

            {/* Main Content Grid */}
            {activeTab === 'packages' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Packages Content */}
                    <main className="lg:col-span-3 space-y-10 md:space-y-12 pb-10">
                        {/* Region Filter */}
                        <div className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto custom-scrollbar no-scrollbar">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-secondary mr-2">Wilayah:</span>
                            <button onClick={() => setRegionFilter('')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${!regionFilter ? 'bg-brand-accent text-white border-brand-accent shadow-md' : 'bg-white/60 text-brand-text-secondary border-brand-border hover:border-brand-accent/50'}`}>Semua Wilayah</button>
                            {unionRegions.map(r => (
                                <button key={r.value} onClick={() => setRegionFilter(r.value as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${regionFilter === r.value ? 'bg-brand-accent text-white border-brand-accent shadow-md' : 'bg-white/60 text-brand-text-secondary border-brand-border hover:border-brand-accent/50'}`}>{r.label}</button>
                            ))}
                        </div>

                        {Object.entries(packagesByCategory).map(([category, pkgs]) => (
                            <section key={category} className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <ChevronRightIcon className="w-5 h-5 text-brand-accent" />
                                    <h3 className="text-xl md:text-2xl font-bold text-brand-text-light">{category}</h3>
                                    <div className="h-[1px] flex-grow bg-gradient-to-r from-brand-border/60 to-transparent"></div>
                                    <span className="bg-brand-accent/10 px-3 py-1 rounded-full text-[10px] font-bold text-brand-accent uppercase tracking-wider">{pkgs.length} Items</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {pkgs.map(pkg => (
                                        <PackageCard key={pkg.id} pkg={pkg} onEdit={handlePackageEdit} onDelete={handlePackageDelete} />
                                    ))}
                                </div>
                            </section>
                        ))}

                        {Object.keys(packagesByCategory).length === 0 && (
                            <div className="glass-card rounded-[2rem] p-12 md:p-20 text-center border-2 border-dashed border-brand-border/40">
                                <div className="w-20 h-20 bg-brand-input/50 rounded-full flex items-center justify-center mx-auto mb-6 scale-110">
                                    <PlusIcon className="w-10 h-10 text-brand-text-secondary opacity-30" />
                                </div>
                                <h4 className="text-xl font-bold text-brand-text-light mb-2">Belum ada Package {regionFilter ? 'di wilayah ini' : ''}</h4>
                                <p className="text-sm text-brand-text-secondary max-w-xs mx-auto mb-8">Tambahkan package layanan pertama Anda untuk mulai membagikan portofolio.</p>
                                <button onClick={() => { setPackageEditMode('new'); setPackageFormData(emptyPackageForm); }} className="button-primary px-8 py-3 shadow-xl">Buat Package Sekarang</button>
                            </div>
                        )}
                    </main>

                    {/* AddOns Sidebar */}
                    <AddOnSection 
                        addOns={props.addOns}
                        regionFilter={regionFilter}
                        editMode={addOnEditMode}
                        formData={addOnFormData}
                        onInputChange={(e) => setAddOnFormData((prev: AddOnForm) => ({ ...prev, [e.target.name]: e.target.value }))}
                        onPriceChange={(raw) => setAddOnFormData((prev: AddOnForm) => ({ ...prev, price: raw }))}
                        onRegionSelect={(r) => setAddOnFormData((prev: AddOnForm) => ({ ...prev, region: r }))}
                        onSubmit={handleAddOnSubmit}
                        onEdit={(a) => { setAddOnEditMode(a.id); setAddOnFormData({ name: a.name, price: a.price.toString(), region: a.region || '' }); }}
                        onDelete={handleAddOnDelete}
                        onCancelEdit={() => { setAddOnEditMode(null); setAddOnFormData(emptyAddOnForm); }}
                        unionRegions={unionRegions}
                    />
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <GalleryUpload userProfile={props.profile} showNotification={showNotification} />
                </div>
            )}

            {/* Modals */}
            {packageEditMode && (
                <PackageFormModal 
                    isOpen={!!packageEditMode}
                    onClose={() => { setPackageEditMode(null); setPackageFormData(emptyPackageForm); }}
                    onSubmit={handlePackageSubmit}
                    editMode={packageEditMode}
                    formData={packageFormData}
                    onInputChange={handlePackageInputChange}
                    onPriceChange={(raw) => setPackageFormData((prev: PackageForm) => ({ ...prev, price: raw }))}
                    onCoverImageChange={handleCoverImageChange}
                    onDurationOptionChange={handleDurationOptionChange}
                    addDurationOption={addDurationOption}
                    removeDurationOption={removeDurationOption}
                    expandedDurationIndex={expandedDurationIndex}
                    setExpandedDurationIndex={setExpandedDurationIndex}
                    onDurationDetailChange={handleDurationDetailChange}
                    addDurationDetail={addDurationDetail}
                    removeDurationDetail={removeDurationDetail}
                    onListChange={handleListChange}
                    addListItem={addListItem}
                    removeListItem={removeListItem}
                    profile={props.profile}
                    existingRegions={existingRegions}
                    unionRegions={unionRegions}
                />
            )}

            <PackageInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
            
            <PackageShareModal 
                isOpen={isShareModalOpen} 
                onClose={() => setIsShareModalOpen(false)} 
                publicUrl={publicPackagesUrl} 
                bookingUrl={publicBookingUrl}
                onCopyLink={copyPackagesLinkToClipboard} 
                onCopyBookingLink={copyBookingLinkToClipboard}
                regionName={regionFilter ? unionRegions.find(r => r.value === regionFilter)?.label : undefined}
            />
        </div>
    );
};

export default Packages;
