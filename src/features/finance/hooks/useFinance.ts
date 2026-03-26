import { useState, useMemo, useCallback } from 'react';
import { Transaction, TransactionType, FinancialPocket, Card, CardType, Project } from '@/types';
import { createTransaction as createTransactionRow, updateCardBalance, updateTransaction as updateTransactionRow, deleteTransaction as deleteTransactionApi } from '@/services/transactions';
import { updatePocket as updatePocketRow } from '@/services/pockets';

export const useFinance = (
    transactions: Transaction[],
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
    pockets: FinancialPocket[],
    setPockets: React.Dispatch<React.SetStateAction<FinancialPocket[]>>,
    cards: Card[],
    setCards: React.Dispatch<React.SetStateAction<Card[]>>,
    showNotification: (message: string) => void
) => {
    const handleAddTransaction = useCallback(async (data: any) => {
        try {
            const created = await createTransactionRow(data);
            setTransactions(prev => [created, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

            if (created.cardId) {
                const delta = created.type === TransactionType.INCOME ? created.amount : -created.amount;
                await updateCardBalance(created.cardId, delta);
                setCards(prev => prev.map(c => c.id === created.cardId ? { ...c, balance: (c.balance || 0) + delta } : c));
            }

            showNotification('Transaksi berhasil dicatat.');
            return created;
        } catch (err) {
            showNotification('Gagal mencatat transaksi.');
            throw err;
        }
    }, [setTransactions, setCards, showNotification]);

    const handleDeleteTransaction = useCallback(async (id: string) => {
        if (!window.confirm('Hapus transaksi ini?')) return;
        try {
            const tx = transactions.find(t => t.id === id);
            if (tx && tx.cardId) {
                const reverseDelta = tx.type === TransactionType.INCOME ? -tx.amount : tx.amount;
                await updateCardBalance(tx.cardId, reverseDelta);
                setCards(prev => prev.map(c => c.id === tx.cardId ? { ...c, balance: (c.balance || 0) + reverseDelta } : c));
            }

            await deleteTransactionApi(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
            showNotification('Transaksi berhasil dihapus.');
        } catch (err) {
            showNotification('Gagal menghapus transaksi.');
        }
    }, [transactions, setTransactions, setCards, showNotification]);

    return {
        handleAddTransaction,
        handleDeleteTransaction
    };
};
