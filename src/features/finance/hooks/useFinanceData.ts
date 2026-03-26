import { useState, useMemo } from 'react';
import { Transaction, FinancialPocket, Card, Project, TransactionType } from '@/types';

interface UseFinanceDataProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    pockets: FinancialPocket[];
    cards: Card[];
}

export const useFinanceData = ({
    transactions,
    setTransactions,
    pockets,
    cards
}: UseFinanceDataProps) => {
    const [offset, setOffset] = useState(100);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMoreTransactions = async () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        try {
            const { listTransactions } = await import('@/services/transactions');
            const nextTxs = await listTransactions({ limit: 100, offset });
            if (nextTxs.length < 100) {
                setHasMore(false);
            }
            if (nextTxs.length > 0) {
                setTransactions(prev => {
                    const existingIds = new Set(prev.map(t => t.id));
                    const uniqueNew = nextTxs.filter(t => !existingIds.has(t.id));
                    return [...prev, ...uniqueNew].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                });
                setOffset(prev => prev + 100);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error('[Finance] Failed to load more transactions:', e);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const summary = useMemo(() => {
        const totalAssets = cards.reduce((sum, c) => sum + (Number(c.balance) || 0), 0);
        const pocketsTotal = pockets.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const thisMonthTransactions = transactions.filter(t => {
            const txDate = new Date(t.date);
            return txDate >= startOfMonth && txDate <= endOfMonth;
        });

        const totalIncomeThisMonth = thisMonthTransactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenseThisMonth = thisMonthTransactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalAssets,
            pocketsTotal,
            totalIncomeThisMonth,
            totalExpenseThisMonth
        };
    }, [cards, pockets, transactions]);

    return {
        hasMore,
        isLoadingMore,
        loadMoreTransactions,
        summary
    };
};
