import StatCard from '@/shared/ui/StatCard';
import { 
    SearchIcon, FilterIcon, DownloadIcon, ArchiveIcon, 
    ChevronDownIcon, ArrowRightIcon, PlusIcon 
} from 'lucide-react';
import { Transaction, Project, Card, FinancialPocket, TransactionType } from '@/types';
import { formatCurrency } from '@/features/finance/utils/finance.utils';
import { TransactionTable } from '@/features/finance/components/TransactionTable';

interface TransactionListProps {
    transactions: Transaction[];
    filteredTransactions: Transaction[];
    projects: Project[];
    cards: Card[];
    pockets: FinancialPocket[];
    filters: {
        searchTerm: string;
        dateFrom: string;
        dateTo: string;
    };
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    categoryFilter: {
        type: TransactionType | 'all';
        category: string;
    };
    onCategoryFilterChange: (filter: { type: TransactionType | 'all'; category: string }) => void;
    categoryTotals: {
        income: Record<string, number>;
        expense: Record<string, number>;
    };
    onDownloadCSV: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    monthlyBudgetPocket?: FinancialPocket;
    onCloseBudget: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
    transactions,
    filteredTransactions,
    projects,
    cards,
    pockets,
    filters,
    onFilterChange,
    categoryFilter,
    onCategoryFilterChange,
    categoryTotals,
    onDownloadCSV,
    hasMore,
    isLoadingMore,
    onLoadMore,
    monthlyBudgetPocket,
    onCloseBudget
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 widget-animate">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-brand-surface p-6 rounded-2xl shadow-lg border border-brand-border">
                    <div className="flex items-center gap-2 mb-4">
                        <FilterIcon className="w-5 h-5 text-brand-accent" />
                        <h4 className="font-bold text-gradient">Filter & Cari</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="input-group">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                            <input
                                type="text"
                                name="searchTerm"
                                value={filters.searchTerm}
                                onChange={onFilterChange}
                                placeholder="Cari deskripsi..."
                                className="input-field !pl-10"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="date"
                                name="dateFrom"
                                value={filters.dateFrom}
                                onChange={onFilterChange}
                                className="input-field"
                            />
                            <label className="input-label">Dari Tanggal</label>
                        </div>
                        <div className="input-group">
                            <input
                                type="date"
                                name="dateTo"
                                value={filters.dateTo}
                                onChange={onFilterChange}
                                className="input-field"
                            />
                            <label className="input-label">Sampai Tanggal</label>
                        </div>
                    </div>
                </div>

                <div className="bg-brand-surface p-6 rounded-2xl shadow-lg border border-brand-border h-[500px] overflow-y-auto custom-scrollbar">
                    <h4 className="font-bold text-gradient mb-4">Kategori</h4>
                    <div className="space-y-2">
                        <button
                            onClick={() => onCategoryFilterChange({ type: 'all', category: 'Semua' })}
                            className={`w-full text-left p-3 rounded-xl transition-all ${categoryFilter.type === 'all' ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30' : 'hover:bg-brand-input text-brand-text-secondary'}`}
                        >
                            <span className="font-medium">Semua Transaksi</span>
                        </button>
                        
                        <div className="mt-4 mb-2 text-[10px] uppercase font-bold text-brand-text-secondary tracking-widest pl-2">Pemasukan</div>
                        {Object.entries(categoryTotals.income).map(([cat, total]) => (
                            <button
                                key={cat}
                                onClick={() => onCategoryFilterChange({ type: TransactionType.INCOME, category: cat })}
                                className={`w-full group p-3 rounded-xl transition-all border ${categoryFilter.category === cat && categoryFilter.type === TransactionType.INCOME ? 'bg-brand-success/10 border-brand-success/30 text-brand-success' : 'border-transparent hover:bg-brand-input'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium truncate pr-2">{cat}</span>
                                    <span className="text-[11px] font-bold whitespace-nowrap">{formatCurrency(total)}</span>
                                </div>
                            </button>
                        ))}

                        <div className="mt-4 mb-2 text-[10px] uppercase font-bold text-brand-text-secondary tracking-widest pl-2">Pengeluaran</div>
                        {Object.entries(categoryTotals.expense).sort((a,b) => b[1] - a[1]).map(([cat, total]) => (
                            <button
                                key={cat}
                                onClick={() => onCategoryFilterChange({ type: TransactionType.EXPENSE, category: cat })}
                                className={`w-full group p-3 rounded-xl transition-all border ${categoryFilter.category === cat && categoryFilter.type === TransactionType.EXPENSE ? 'bg-brand-danger/10 border-brand-danger/30 text-brand-danger' : 'border-transparent hover:bg-brand-input'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium truncate pr-2">{cat}</span>
                                    <span className="text-[11px] font-bold whitespace-nowrap">{formatCurrency(total)}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transaction Main View */}
            <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gradient">Data Transaksi</h3>
                        <p className="text-sm text-brand-text-secondary">Menampilkan {filteredTransactions.length} transaksi</p>
                    </div>
                    <button onClick={onDownloadCSV} className="button-secondary inline-flex items-center gap-2">
                        <DownloadIcon className="w-4 h-4" /> Unduh CSV
                    </button>
                </div>

                {monthlyBudgetPocket && (
                    <div className="bg-gradient-to-r from-brand-accent/20 to-brand-purple/20 p-6 rounded-2xl border border-brand-accent/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center">
                                <ArchiveIcon className="w-6 h-6 text-brand-accent" />
                            </div>
                            <div>
                                <h4 className="font-bold text-brand-text-light">Anggaran Bulanan Aktif</h4>
                                <p className="text-sm text-brand-text-secondary">Sisa dana di kantong {monthlyBudgetPocket.name}: <span className="font-bold text-brand-accent">{formatCurrency(monthlyBudgetPocket.amount)}</span></p>
                            </div>
                        </div>
                        <button onClick={onCloseBudget} className="px-4 py-2 bg-brand-accent text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand-accent/30 transition-all flex items-center gap-2">
                            <ChevronDownIcon className="w-4 h-4" /> Tutup & Kembalikan Dana
                        </button>
                    </div>
                )}

                <div className="bg-brand-surface rounded-2xl shadow-lg border border-brand-border overflow-hidden">
                    <div className="overflow-x-auto h-[600px] custom-scrollbar">
                        <TransactionTable 
                            transactions={filteredTransactions} 
                            projects={projects} 
                            cards={cards} 
                            pockets={pockets} 
                        />
                    </div>
                    
                    {hasMore && (
                        <div className="p-4 bg-brand-input/30 border-t border-brand-border text-center">
                            <button 
                                onClick={onLoadMore} 
                                disabled={isLoadingMore}
                                className="text-brand-accent font-bold hover:underline inline-flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoadingMore ? 'Memuat...' : <>Lihat Transaksi Lainnya <ChevronDownIcon className="w-4 h-4" /></>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
