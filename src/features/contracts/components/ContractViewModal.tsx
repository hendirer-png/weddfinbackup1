import React from 'react';
import Modal from '@/shared/ui/Modal';
import SignaturePad from '@/shared/ui/SignaturePad';
import { Contract, Project, Profile, Client } from '@/types';
import ContractDocument from '@/features/contracts/components/ContractDocument';
import { DownloadIcon, PrinterIcon, QrCodeIcon, CheckSquareIcon } from '@/constants';

interface ContractViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedContract: Contract | null;
    projects: Project[];
    clients: Client[];
    profile: Profile;
    isSignatureModalOpen: boolean;
    setIsSignatureModalOpen: (open: boolean) => void;
    handleSaveSignature: (signatureDataUrl: string) => void;
    handleDownloadPDF: () => void;
    handleDownloadPDFWithoutTTD: () => void;
    showNotification: (message: string) => void;
}

export const ContractViewModal: React.FC<ContractViewModalProps> = ({
    isOpen,
    onClose,
    selectedContract,
    projects,
    clients,
    profile,
    isSignatureModalOpen,
    setIsSignatureModalOpen,
    handleSaveSignature,
    handleDownloadPDF,
    handleDownloadPDFWithoutTTD,
    showNotification
}) => {
    if (!selectedContract) return null;
    
    const project = projects.find(p => p.id === selectedContract.projectId);
    const client = clients.find(c => c.id === selectedContract.clientId);

    if (!project) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Kontrak" size="4xl">
            <div>
                <div className="max-h-[65vh] overflow-y-auto border border-brand-border rounded-lg bg-white custom-scrollbar">
                    <ContractDocument 
                        id="contract-content-to-print"
                        contract={selectedContract} 
                        project={project} 
                        profile={profile} 
                    />
                </div>
                
                <div className="mt-6 flex flex-wrap justify-between items-center gap-4 border-t border-brand-border pt-4 non-printable">
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <div className={`p-2 rounded-lg ${selectedContract.vendorSignature || profile.signatureBase64 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                <CheckSquareIcon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">TTD Vendor</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className={`p-2 rounded-lg ${selectedContract.clientSignature ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                <CheckSquareIcon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">TTD Klien</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {!selectedContract.vendorSignature && (
                            <button 
                                onClick={() => setIsSignatureModalOpen(true)} 
                                className="px-4 py-2 bg-brand-accent text-white rounded-lg text-sm font-bold hover:bg-brand-accent-hover transition-colors shadow-lg shadow-brand-accent/20"
                            >
                                Tandatangani Sekarang
                            </button>
                        )}
                        
                        <div className="flex items-center bg-brand-bg rounded-lg border border-brand-border p-1">
                            <button onClick={handleDownloadPDF} className="p-2 text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/10 rounded-md transition-colors" title="Download PDF Full">
                                <DownloadIcon className="w-5 h-5"/>
                            </button>
                            <button onClick={handleDownloadPDFWithoutTTD} className="p-2 text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/10 rounded-md transition-colors" title="Download Tanpa TTD">
                                <PrinterIcon className="w-5 h-5"/>
                            </button>
                            <button 
                                onClick={() => {
                                    const url = `https://vandel-pro.web.app/#/public/contract/${selectedContract.id}`;
                                    navigator.clipboard.writeText(url);
                                    showNotification('Tautan portal klien berhasil disalin!');
                                }} 
                                className="p-2 text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/10 rounded-md transition-colors" 
                                title="Salin Tautan Portal"
                            >
                                <QrCodeIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        
                        <button onClick={onClose} className="button-secondary text-sm px-4 py-2">Tutup</button>
                    </div>
                </div>

                {/* Signature Modal Overlay */}
                <Modal 
                    isOpen={isSignatureModalOpen} 
                    onClose={() => setIsSignatureModalOpen(false)} 
                    title="Tanda Tangan Digital (Vendor)"
                    size="lg"
                >
                        <SignaturePad onSave={handleSaveSignature} onClose={() => setIsSignatureModalOpen(false)} />
                </Modal>
            </div>
        </Modal>
    );
};
