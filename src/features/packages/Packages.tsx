import React from 'react';
import { Package, AddOn, Project, Profile, REGIONS } from '@/types';
import { PlusIcon, InfoIcon, Share2Icon, ChevronRightIcon } from '@/constants';
import { usePackages, emptyPackageForm, emptyAddOnForm, PackageForm, AddOnForm } from '@/features/packages/hooks/usePackages';
import PackageCard from '@/features/packages/components/PackageCard';
import AddOnSection from '@/features/packages/components/AddOnSection';
import PackageFormModal from '@/features/packages/components/PackageFormModal';
import { PackageInfoModal, PackageShareModal } from '@/features/packages/components/PackageModals';

interface PackagesProps {
    packages: Package[];
    setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
    addOns: AddOn[];
    setAddOns: React.Dispatch<React.SetStateAction<AddOn[]>>;
    projects: Project[];
    profile: Profile;
}

const Packages: React.FC<PackagesProps> = (props) => {
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
            .then(() => alert('Tautan berhasil disalin ke papan klip!'))
            .catch(err => console.error('Gagal menyalin tautan:', err));
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-4 md:p-6 rounded-3xl border border-white/60 shadow-sm backdrop-blur-md">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gradient flex items-center gap-3">
                        Layanan & Vendor
                        <button onClick={() => setIsInfoModalOpen(true)} className="p-1.5 rounded-full hover:bg-brand-accent/10 text-brand-accent transition-colors">
                            <InfoIcon className="w-5 h-5" />
                        </button>
                    </h2>
                    <p className="text-sm text-brand-text-secondary font-medium">Kelola Package foto/video dan layanan tambahan Anda.</p>
                </div>
                <div className="flex gap-2 h-fit">
                    <button onClick={() => setIsShareModalOpen(true)} className="button-secondary flex items-center gap-2 text-sm shadow-sm group">
                        <Share2Icon className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                        <span className="hidden sm:inline">Bagikan</span>
                    </button>
                    <button onClick={() => { setPackageEditMode('new'); setPackageFormData(emptyPackageForm); }} className="button-primary flex items-center gap-2 text-sm shadow-lg group">
                        <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" /> 
                        Tambah Package
                    </button>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
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
                onCopyLink={copyPackagesLinkToClipboard} 
            />
        </div>
    );
};

export default Packages;
