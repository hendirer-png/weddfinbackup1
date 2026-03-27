import React from 'react';
import { Package } from '@/types';
import { CameraIcon, Trash2Icon, PencilIcon } from '@/constants';
import { formatCurrency } from '@/features/booking/utils/booking.utils';

interface PackageCardProps {
    pkg: Package;
    onEdit: (pkg: Package) => void;
    onDelete: (id: string) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onEdit, onDelete }) => {
    return (
        <div className="glass-card card-hover-lift rounded-3xl flex flex-col overflow-hidden border border-brand-border/50 group">
            {pkg.coverImage ? (
                <div className="h-32 md:h-44 overflow-hidden relative">
                    <img src={pkg.coverImage} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
            ) : (
                <div className="h-32 md:h-44 bg-brand-input/50 flex flex-col items-center justify-center relative overflow-hidden text-brand-text-secondary/50">
                    <CameraIcon className="w-10 md:w-12 h-10 md:h-12 mb-2 opacity-50" />
                    <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">Tanpa Cover</span>
                </div>
            )}
            <div className="p-4 md:p-5 flex-grow flex flex-col bg-brand-surface/40">
                <h4 className="font-bold text-base md:text-lg text-brand-text-light flex items-start justify-between gap-2">
                    <span className="line-clamp-2">{pkg.name}</span>
                </h4>

                <div className="mt-3 mb-4 p-3 bg-brand-bg/50 rounded-xl border border-brand-border/40">
                    <p className="text-xl md:text-2xl font-bold text-brand-text-light">
                        {pkg.durationOptions && pkg.durationOptions.length > 0 ? (
                            <span className="block text-xs md:text-sm font-semibold text-brand-text-secondary space-y-1">
                                {pkg.durationOptions.map((o, i) => (
                                    <span key={i} className="block flex justify-between items-center border-b border-brand-border/30 pb-1 last:border-0 last:pb-0">
                                        <span className="opacity-80 truncate pr-2">{o.label}</span>
                                        <span className="text-brand-accent flex-shrink-0">{formatCurrency(o.price)}</span>
                                    </span>
                                ))}
                            </span>
                        ) : (
                            <span className="text-brand-accent">{formatCurrency(pkg.price)}</span>
                        )}
                    </p>
                </div>

                <div className="text-xs space-y-3 flex-grow bg-white/30 p-3 rounded-xl border border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    {pkg.processingTime && (
                        <p className="flex justify-between items-center pb-2 border-b border-brand-border/40">
                            <span className="text-brand-text-secondary font-medium uppercase tracking-wider text-[9px]">Pengerjaan</span>
                            <span className="font-semibold text-brand-text-light">{pkg.processingTime}</span>
                        </p>
                    )}
                    {(pkg.photographers || pkg.videographers) && (
                        <div className="pb-2 border-b border-brand-border/40">
                            <h5 className="font-semibold text-brand-text-secondary text-[9px] uppercase tracking-wider mb-1">Tim</h5>
                            <p className="font-medium text-brand-text-light">{[pkg.photographers, pkg.videographers].filter(Boolean).join(' & ')}</p>
                        </div>
                    )}
                    {pkg.digitalItems.length > 0 && (
                        <div className="pb-2 border-b border-brand-border/40 last:border-0 last:pb-0">
                            <h5 className="font-semibold text-brand-text-secondary text-[9px] uppercase tracking-wider mb-1.5">Deskripsi Package</h5>
                            <ul className="space-y-1">
                                {pkg.digitalItems.map((item, i) => (
                                    <li key={i} className="flex items-start gap-1.5 text-brand-text-light font-medium before:content-[''] before:w-1 before:h-1 before:bg-brand-accent/50 before:rounded-full before:mt-1.5 text-[10px] md:text-xs leading-tight">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {pkg.physicalItems.length > 0 && (
                        <div className="pt-1">
                            <h5 className="font-semibold text-brand-text-secondary text-[9px] uppercase tracking-wider mb-1.5">Vendor (Allpackage)</h5>
                            <ul className="space-y-1">
                                {pkg.physicalItems.map((item, i) => (
                                    <li key={i} className="flex justify-between items-center text-brand-text-light font-medium bg-brand-surface/50 px-2 py-1 rounded-md border border-brand-border/30 text-[10px] md:text-xs">
                                        <span className="truncate pr-2 opacity-90">{item.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-brand-border/50">
                    <button onClick={() => onEdit(pkg)} className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all flex-1 text-xs font-bold shadow-sm group">
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit Package</span>
                    </button>
                    <button onClick={() => onDelete(pkg.id)} className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all text-xs font-bold shadow-sm group" title="Hapus Package">
                        <Trash2Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">Hapus</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageCard;
