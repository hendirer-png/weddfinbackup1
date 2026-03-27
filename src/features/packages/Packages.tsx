import React from 'react';
import { Package, AddOn, Project, Profile, REGIONS } from '@/types';
import { PlusIcon, InfoIcon, Share2Icon, ChevronRightIcon } from '@/constants';
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
            <header className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-4 md:p-6 rounded-3xl border border-white/60 shadow-sm backdrop-blur-md">
                    <div className="space-y-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-gradient flex items-center gap-3">
                            Layanan & Portofolio
                            <button onClick={() => setIsInfoModalOpen(true)} className="p-1.5 rounded-full hover:bg-brand-accent/10 text-brand-accent transition-colors">
                                <InfoIcon className="w-5 h-5" />
                            </button>
                        </h2>
                        <p className="text-sm text-brand-text-secondary font-medium">Kelola Package layanan dan portofolio pricelist Anda.</p>
                    </div>
                    <div className="flex gap-2 h-fit">
                        {activeTab === 'packages' && (
                            <>
                                <button onClick={() => setIsShareModalOpen(true)} className="button-secondary flex items-center gap-2 text-sm shadow-sm group">
                                    <Share2Icon className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                                    <span className="hidden sm:inline">Bagikan</span>
                                </button>
                                <button onClick={() => { setPackageEditMode('new'); setPackageFormData(emptyPackageForm); }} className="button-primary flex items-center gap-2 text-sm shadow-lg group">
                                    <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" /> 
                                    Tambah Package
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex p-1.5 bg-brand-surface/60 backdrop-blur-md rounded-2xl border border-brand-border/40 w-fit">
                    <button
                        onClick={() => { setActiveTab('packages'); window.location.hash = '#/packages'; }}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'packages' ? 'bg-brand-accent text-white shadow-lg' : 'text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/5'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Layanan & Package
                    </button>
                    <button
                        onClick={() => { setActiveTab('galleries'); window.location.hash = '#/gallery'; }}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'galleries' ? 'bg-brand-accent text-white shadow-lg' : 'text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/5'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Portofolio (Pricelist)
                    </button>
                </div>
            </header>

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
