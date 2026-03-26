import { useState, useMemo, useEffect } from 'react';
import { Lead, LeadStatus, ContactChannel, Client, Project, Package, AddOn, Transaction, Card, PromoCode, Profile, PaymentStatus, TransactionType, ClientStatus, ClientType } from '@/types';
import { createLead as createLeadRow, updateLead as updateLeadRow, deleteLead as deleteLeadRow } from '@/services/leads';
import { createClient as createClientRow } from '@/services/clients';
import { createProject as createProjectRow } from '@/services/projects';
import { createTransaction as createTransactionRow } from '@/services/transactions';
import { findCardIdByMeta } from '@/services/cards';

export const useLeadsPage = ({
    leads, setLeads,
    clients, setClients,
    projects, setProjects,
    packages, addOns,
    transactions, setTransactions,
    userProfile,
    cards, setCards,
    promoCodes, setPromoCodes,
    showNotification,
}: any) => {
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'convert'>('add');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [activeStatModal, setActiveStatModal] = useState<string | null>(null);
    const [hiddenColumns, setHiddenColumns] = useState<Set<LeadStatus>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState<ContactChannel | 'all'>('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [shareModalState, setShareModalState] = useState<{ type: 'package' | 'booking'; lead: Lead } | null>(null);

    const publicLeadFormUrl = useMemo(() => `${window.location.origin}${window.location.pathname}#/public-lead-form/VEN001`, []);
    const publicBookingFormUrl = useMemo(() => `${window.location.origin}${window.location.pathname}#/public-booking/VEN001`, []);
    const publicPackagesUrl = useMemo(() => `${window.location.origin}${window.location.pathname}#/public-packages/VEN001`, []);

    useEffect(() => {
        if (isShareModalOpen && typeof (window as any).QRCode !== 'undefined') {
            const qrCodeContainer = document.getElementById('lead-form-qrcode');
            if (qrCodeContainer) {
                qrCodeContainer.innerHTML = '';
                new (window as any).QRCode(qrCodeContainer, {
                    text: publicLeadFormUrl, width: 200, height: 200, colorDark: '#020617', colorLight: '#ffffff', correctLevel: 2
                });
            }
        }
    }, [isShareModalOpen, publicLeadFormUrl]);

    const filteredLeads = useMemo(() => leads.filter((lead: Lead) => {
        const searchMatch = searchTerm === '' || lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || (lead.notes && lead.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        const sourceMatch = sourceFilter === 'all' || lead.contactChannel === sourceFilter;
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;
        if (from) from.setHours(0, 0, 0, 0);
        if (to) to.setHours(23, 59, 59, 999);
        const leadDate = new Date(lead.date);
        const dateMatch = (!from || leadDate >= from) && (!to || leadDate <= to);
        return searchMatch && sourceMatch && dateMatch;
    }), [leads, searchTerm, sourceFilter, dateFrom, dateTo]);

    const leadColumns = useMemo(() => {
        const columns: Record<LeadStatus, Lead[]> = {
            [LeadStatus.DISCUSSION]: [], [LeadStatus.FOLLOW_UP]: [], [LeadStatus.CONVERTED]: [], [LeadStatus.REJECTED]: [],
        };
        filteredLeads.forEach((lead: Lead) => { columns[lead.status]?.push(lead); });
        return columns;
    }, [filteredLeads]);

    const visibleLeadColumns = useMemo(() =>
        Object.entries(leadColumns).filter(([status]) => !hiddenColumns.has(status as LeadStatus)),
        [leadColumns, hiddenColumns]
    );

    const handleStatCardClick = (stat: string) => setActiveStatModal(stat);

    const toggleHiddenColumns = () => {
        setHiddenColumns(prev => {
            const newHidden = new Set(prev);
            const completedStatuses: LeadStatus[] = [LeadStatus.CONVERTED, LeadStatus.REJECTED];
            if (newHidden.has(LeadStatus.CONVERTED)) {
                completedStatuses.forEach(s => newHidden.delete(s));
            } else {
                completedStatuses.forEach(s => newHidden.add(s));
            }
            return newHidden;
        });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
        e.dataTransfer.setData('leadId', leadId);
        setDraggedLeadId(leadId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: LeadStatus) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        const leadToUpdate = leads.find((l: Lead) => l.id === leadId);
        if (leadToUpdate && leadToUpdate.status !== newStatus) {
            if (newStatus === LeadStatus.CONVERTED) {
                handleOpenModal('convert', leadToUpdate);
            } else {
                setLeads((prev: Lead[]) => prev.map((l: Lead) => l.id === leadId ? { ...l, status: newStatus, date: new Date().toISOString() } : l));
                void updateLeadRow(leadId, { status: newStatus, date: new Date().toISOString().split('T')[0] }).catch(err => console.warn('[Supabase] update lead status failed', err));
            }
        }
        setDraggedLeadId(null);
    };

    const handleNextStatus = (lead: Lead) => {
        let newStatus: LeadStatus | null = null;
        if (lead.status === LeadStatus.DISCUSSION) newStatus = LeadStatus.FOLLOW_UP;
        if (lead.status === LeadStatus.FOLLOW_UP) newStatus = LeadStatus.CONVERTED;
        if (newStatus) {
            if (newStatus === LeadStatus.CONVERTED) {
                handleOpenModal('convert', lead);
            } else {
                setLeads((prev: Lead[]) => prev.map((l: Lead) => l.id === lead.id ? { ...l, status: newStatus!, date: new Date().toISOString() } : l));
                void updateLeadRow(lead.id, { status: newStatus, date: new Date().toISOString().split('T')[0] }).catch(err => console.warn('[Supabase] update lead status failed', err));
                showNotification(`Calon Pengantin "${lead.name}" dipindahkan ke "${newStatus}".`);
            }
        }
    };

    const handleOpenModal = (mode: 'add' | 'edit' | 'convert', lead?: Lead) => {
        setModalMode(mode);
        setSelectedLead(lead || null);
        if (mode === 'edit' && lead) {
            setFormData(lead);
        } else if (mode === 'convert' && lead) {
            setFormData({
                clientName: lead.name, email: '', phone: '', whatsapp: lead.whatsapp || '', instagram: '', clientType: ClientType.DIRECT,
                projectName: `${lead.name}`, projectType: userProfile.projectTypes[0] || '',
                location: lead.location, address: lead.address || '', date: new Date().toISOString().split('T')[0],
                packageId: '', selectedAddOnIds: [], dp: '', dpDestinationCardId: '', notes: lead.notes || '', promoCodeId: ''
            });
        } else {
            setFormData({ name: '', contactChannel: ContactChannel.OTHER, location: '', address: '', whatsapp: '', notes: '', date: new Date().toISOString(), status: LeadStatus.DISCUSSION });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { id, checked } = e.target as HTMLInputElement;
            setFormData((prev: any) => ({ ...prev, selectedAddOnIds: checked ? [...prev.selectedAddOnIds, id] : prev.selectedAddOnIds.filter((addOnId: string) => addOnId !== id) }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add' || modalMode === 'edit') {
            try {
                if (modalMode === 'add') {
                    const created = await createLeadRow({ name: formData.name, contactChannel: formData.contactChannel, location: formData.location || '', status: formData.status || LeadStatus.DISCUSSION, date: new Date().toISOString().split('T')[0], notes: formData.notes || undefined, whatsapp: formData.whatsapp || undefined, address: formData.address || undefined } as Omit<Lead, 'id'>);
                    setLeads((prev: Lead[]) => [created, ...prev]);
                    showNotification('Calon Pengantin baru berhasil ditambahkan.');
                } else if (selectedLead) {
                    const updated = await updateLeadRow(selectedLead.id, { name: formData.name, contactChannel: formData.contactChannel, location: formData.location || '', status: formData.status, notes: formData.notes || undefined, whatsapp: formData.whatsapp || undefined, address: formData.address || undefined });
                    setLeads((prev: Lead[]) => prev.map((l: Lead) => l.id === selectedLead.id ? updated : l));
                    showNotification('Calon Pengantin berhasil diperbarui.');
                }
            } catch (err) {
                alert('Gagal menyimpan Calon Pengantin ke database. Coba lagi.');
                return;
            }
        } else if (modalMode === 'convert' && selectedLead) {
            const selectedPackage = packages.find((p: Package) => p.id === formData.packageId);
            if (!selectedPackage) { alert('Harap pilih Package.'); return; }
            const selectedAddOns = addOns.filter((addon: AddOn) => formData.selectedAddOnIds.includes(addon.id));
            const packagePrice = formData.unitPrice !== undefined && !isNaN(Number(formData.unitPrice)) ? Number(formData.unitPrice) : (selectedPackage.price || 0);
            const totalBeforeDiscount = packagePrice + selectedAddOns.reduce((sum: number, addon: AddOn) => sum + addon.price, 0);
            let finalDiscountAmount = 0;
            const promoCode = promoCodes.find((p: PromoCode) => p.id === formData.promoCodeId);
            if (promoCode) {
                if (promoCode.discountType === 'percentage') finalDiscountAmount = (totalBeforeDiscount * promoCode.discountValue) / 100;
                else finalDiscountAmount = promoCode.discountValue;
            }
            const totalProject = totalBeforeDiscount - finalDiscountAmount;
            const dpAmount = Number(formData.dp) || 0;
            try {
                await updateLeadRow(selectedLead.id, { status: LeadStatus.CONVERTED });
                const createdClient = await createClientRow({ name: formData.clientName, email: formData.email, phone: formData.phone, whatsapp: formData.whatsapp || undefined, instagram: '', clientType: ClientType.DIRECT, since: new Date().toISOString().split('T')[0], status: ClientStatus.ACTIVE, lastContact: new Date().toISOString(), portalAccessId: crypto.randomUUID(), address: formData.address || undefined } as Omit<Client, 'id'>);
                setClients((prev: Client[]) => [createdClient, ...prev]);
                const createdProject = await createProjectRow({ projectName: `${formData.clientName}`, clientName: formData.clientName, clientId: createdClient.id, projectType: formData.projectType, packageName: selectedPackage.name, date: formData.date, location: formData.location, address: formData.address, status: 'Dikonfirmasi', totalCost: totalProject, amountPaid: dpAmount, paymentStatus: dpAmount >= totalProject ? PaymentStatus.LUNAS : (dpAmount > 0 ? PaymentStatus.DP_TERBAYAR : PaymentStatus.BELUM_BAYAR), durationSelection: formData.durationSelection || undefined, unitPrice: formData.unitPrice !== undefined ? Number(formData.unitPrice) : undefined, notes: formData.notes || undefined, promoCodeId: formData.promoCodeId || undefined, discountAmount: finalDiscountAmount > 0 ? finalDiscountAmount : undefined, addOns: selectedAddOns.map((a: AddOn) => ({ id: a.id, name: a.name, price: a.price })), accommodation: undefined, driveLink: undefined, printingCost: undefined, transportCost: undefined, completedDigitalItems: [] } as any);
                const mergedProject: Project = { ...createdProject, addOns: selectedAddOns };
                setProjects((prev: Project[]) => [mergedProject, ...prev]);
                if (dpAmount > 0) {
                    const selectedCard = cards.find((c: Card) => c.id === formData.dpDestinationCardId);
                    const supaCardId = selectedCard ? await findCardIdByMeta(selectedCard.bankName, selectedCard.lastFourDigits) : null;
                    try {
                        const createdTx = await createTransactionRow({ date: new Date().toISOString().split('T')[0], description: `DP Acara Pernikahan ${mergedProject.projectName}`, amount: dpAmount, type: TransactionType.INCOME, projectId: mergedProject.id, category: 'DP Acara Pernikahan', method: 'Transfer Bank', cardId: supaCardId || undefined } as any);
                        setTransactions((prev: Transaction[]) => [...prev, createdTx].sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                        if (supaCardId) setCards((prev: Card[]) => prev.map((c: Card) => c.id === formData.dpDestinationCardId ? { ...c, balance: c.balance + dpAmount } : c));
                    } catch {
                        setCards((prev: Card[]) => prev.map((c: Card) => c.id === formData.dpDestinationCardId ? { ...c, balance: c.balance + dpAmount } : c));
                    }
                }
                if (promoCode) setPromoCodes((prev: PromoCode[]) => prev.map((p: PromoCode) => p.id === promoCode.id ? { ...p, usageCount: p.usageCount + 1 } : p));
                setLeads((prev: Lead[]) => prev.map((l: Lead) => l.id === selectedLead.id ? { ...l, status: LeadStatus.CONVERTED, notes: `Dikonversi menjadi Pengantin ID: ${createdClient.id}` } : l));
                showNotification(`Calon Pengantin ${selectedLead.name} berhasil dikonversi menjadi pengantin!`);
            } catch (err) {
                alert('Gagal mengkonversi Calon Pengantin. Coba lagi.');
                return;
            }
        }
        handleCloseModal();
    };

    const handleDeleteLead = (lead: Lead) => {
        if (!window.confirm(`Hapus Calon Pengantin "${lead.name}"?`)) return;
        setLeads((prev: Lead[]) => prev.filter((l: Lead) => l.id !== lead.id));
        void deleteLeadRow(lead.id).catch(err => {
            console.warn('[Supabase] delete lead failed', err);
            showNotification('Gagal menghapus Calon Pengantin. Silakan coba lagi.');
        });
    };

    return {
        isModalOpen, modalMode, selectedLead, formData, setFormData,
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
        filteredLeads, leadColumns, visibleLeadColumns,
        handleStatCardClick,
        handleDragStart, handleDragOver, handleDrop,
        handleNextStatus, handleDeleteLead,
    };
};
