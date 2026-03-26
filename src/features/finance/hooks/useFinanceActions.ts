import { useState } from 'react';
import { 
    Transaction, FinancialPocket, Card, Project, Profile, 
    TransactionType, PocketType, CardType 
} from '@/types';
import * as transactionService from '@/services/transactions';
import * as pocketService from '@/services/pockets';
import * as cardService from '@/services/cards';
import * as projectService from '@/services/projects';

interface UseFinanceActionsProps {
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    setPockets: React.Dispatch<React.SetStateAction<FinancialPocket[]>>;
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    profile: Profile;
}

export const useFinanceActions = ({
    setTransactions,
    setPockets,
    setCards,
    setProjects,
    profile
}: UseFinanceActionsProps) => {
    const [modalState, setModalState] = useState<{ type: string | null; mode: 'add' | 'edit'; data?: any }>({ type: null, mode: 'add' });
    const [form, setForm] = useState<any>({});

    const toast = { 
        success: (msg: string) => console.log('Success:', msg),
        error: (msg: string) => console.error('Error:', msg)
    };

    const handleOpenModal = (type: any, mode: 'add' | 'edit' = 'add', data?: any) => {
        setModalState({ type, mode, data });
        if (mode === 'edit' && data) {
            setForm({ ...data });
        } else {
            const initialForm: any = { date: new Date().toISOString().split('T')[0], type: TransactionType.EXPENSE };
            if (type === 'card') {
                initialForm.cardType = CardType.DEBIT;
            } else if (type === 'pocket') {
                initialForm.type = PocketType.SAVING;
                initialForm.icon = 'Wallet';
            } else if (type === 'topup-cash') {
                initialForm.type = 'topup-cash';
            } else if (type === 'transfer') {
                initialForm.type = 'transfer';
            }
            setForm(initialForm);
        }
    };

    const handleCloseModal = () => {
        setModalState({ type: null, mode: 'add' });
        setForm({});
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { type, mode, data: originalData } = modalState;

        try {
            if (type === 'transaction') {
                if (mode === 'add') {
                    await transactionService.createTransaction({
                        ...form,
                        amount: Number(form.amount),
                        sourceId: form.sourceId,
                        cardId: form.cardId
                    });
                    toast.success('Transaksi berhasil disimpan');
                } else {
                    await transactionService.updateTransaction(originalData.id, {
                        ...form,
                        amount: Number(form.amount)
                    });
                    toast.success('Transaksi berhasil diperbarui');
                }
            } else if (type === 'pocket') {
                if (mode === 'add') {
                    await pocketService.createPocket({ ...form, amount: 0 });
                    toast.success('Kantong berhasil dibuat');
                } else {
                    await pocketService.updatePocket(originalData.id, form);
                    toast.success('Kantong berhasil diperbarui');
                }
            } else if (type === 'card') {
                if (mode === 'add') {
                    await cardService.createCard({ 
                        card_holder_name: form.cardHolderName,
                        bank_name: form.bankName,
                        card_type: form.cardType,
                        last_four_digits: form.lastFourDigits,
                        initialBalance: Number(form.initialBalance) || 0 
                    } as any);
                    toast.success('Kartu/Akun berhasil ditambah');
                } else {
                    await cardService.updateCard(originalData.id, form);
                    toast.success('Kartu/Akun berhasil diperbarui');
                }
            } else if (type === 'transfer' || type === 'topup-cash') {
                const isTopup = type === 'topup-cash';
                await transactionService.transferFunds({
                    fromCardId: form.fromCardId,
                    toPocketId: !isTopup && form.type === 'deposit' ? originalData.id : undefined,
                    fromPocketId: !isTopup && form.type === 'withdraw' ? originalData.id : undefined,
                    isCashTopup: isTopup,
                    amount: Number(form.amount)
                });
                toast.success(isTopup ? 'Top-up tunai berhasil' : 'Transfer berhasil');
            }
            handleCloseModal();
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan');
        }
    };

    const handleDelete = async (type: 'transaction' | 'pocket' | 'card', id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
        try {
            if (type === 'transaction') {
                await transactionService.deleteTransaction(id);
            } else if (type === 'pocket') {
                await pocketService.deletePocket(id);
            } else if (type === 'card') {
                await cardService.deleteCard(id);
            }
            toast.success('Data berhasil dihapus');
        } catch (err: any) {
            toast.error(err.message || 'Gagal menghapus data');
        }
    };

    const handleCloseBudget = async (pocket: FinancialPocket) => {
        if (!confirm(`Tutup anggaran "${pocket.name}"? Sisa dana ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(pocket.amount)} akan dikembalikan ke kartu utama.`)) return;
        try {
            await pocketService.closePocketBudget(pocket.id);
            toast.success('Anggaran berhasil ditutup');
        } catch (err: any) {
            toast.error(err.message || 'Gagal menutup anggaran');
        }
    };

    return {
        modalState,
        form,
        setForm,
        handleOpenModal,
        handleCloseModal,
        handleFormChange,
        handleSubmit,
        handleDelete,
        handleCloseBudget
    };
};
