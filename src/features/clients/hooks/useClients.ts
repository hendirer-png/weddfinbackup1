import { useState, useMemo, useCallback } from 'react';
import { Client, Project, Transaction, Card, FinancialPocket, PromoCode, Package, AddOn, ClientStatus, PaymentStatus, TransactionType, ClientType } from '@/types';
import { createClient as createClientRow, updateClient as updateClientRow, deleteClient as deleteClientRow } from '@/services/clients';
import { createProject as createProjectRow, updateProject as updateProjectRow, deleteProject as deleteProjectRow } from '@/services/projects';
import { createTransaction as createTransactionRow, updateCardBalance, updateTransaction as updateTransactionRow } from '@/services/transactions';
import { findCardIdByMeta } from '@/services/cards';

export const useClients = (
    clients: Client[],
    setClients: React.Dispatch<React.SetStateAction<Client[]>>,
    projects: Project[],
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
    transactions: Transaction[],
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
    cards: Card[],
    setCards: React.Dispatch<React.SetStateAction<Card[]>>,
    showNotification: (message: string) => void
) => {
    const handleRecordPayment = useCallback(async (projectId: string, amount: number, destinationCardId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        try {
            const createdTx = await createTransactionRow({
                date: new Date().toISOString().split('T')[0],
                description: `Pembayaran Acara Pernikahan ${project.projectName}`,
                amount,
                type: TransactionType.INCOME,
                projectId: project.id,
                category: 'Pelunasan Acara Pernikahan',
                method: 'Transfer Bank',
                cardId: destinationCardId,
            } as any);

            setTransactions(prev => [createdTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

            if (destinationCardId) {
                await updateCardBalance(destinationCardId, amount);
                setCards(prev => prev.map(c => c.id === destinationCardId ? { ...c, balance: (c.balance || 0) + amount } : c));
            }

            const newAmountPaid = (project.amountPaid || 0) + amount;
            const newStatus = newAmountPaid >= project.totalCost ? PaymentStatus.LUNAS : PaymentStatus.DP_TERBAYAR;

            const updated = await updateProjectRow(projectId, {
                amountPaid: newAmountPaid,
                paymentStatus: newStatus as any
            });

            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, amountPaid: updated.amountPaid, paymentStatus: updated.paymentStatus } : p));
            showNotification('Pembayaran berhasil dicatat.');
        } catch (err) {
            console.error('Failed to record payment:', err);
            showNotification('Gagal mencatat pembayaran.');
        }
    }, [projects, setProjects, setTransactions, setCards, showNotification]);

    const handleDeleteClient = useCallback(async (clientId: string) => {
        if (!window.confirm('Hapus pengantin ini?')) return;
        try {
            await deleteClientRow(clientId);
            setClients(prev => prev.filter(c => c.id !== clientId));
            setProjects(prev => prev.filter(p => p.clientId !== clientId));
            showNotification('Pengantin berhasil dihapus.');
        } catch (err) {
            showNotification('Gagal menghapus pengantin.');
        }
    }, [setClients, setProjects, showNotification]);

    return {
        handleRecordPayment,
        handleDeleteClient
    };
};
