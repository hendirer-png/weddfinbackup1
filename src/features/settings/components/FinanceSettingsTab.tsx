import React from 'react';
import { Profile } from '@/types';
import { CategoryManager } from '@/features/settings/components/CategoryManager';
import { CashIcon } from '@/constants';

interface FinanceSettingsTabProps {
    profile: Profile;
    incomeCategoryInput: string;
    setIncomeCategoryInput: (v: string) => void;
    editingIncomeCategory: string | null;
    setEditingIncomeCategory: (v: string | null) => void;
    expenseCategoryInput: string;
    setExpenseCategoryInput: (v: string) => void;
    editingExpenseCategory: string | null;
    setEditingExpenseCategory: (v: string | null) => void;
    handleCategoryUpdate: (field: keyof Profile, categories: string[]) => void;
}

export const FinanceSettingsTab: React.FC<FinanceSettingsTabProps> = ({
    profile, incomeCategoryInput, setIncomeCategoryInput, editingIncomeCategory, setEditingIncomeCategory,
    expenseCategoryInput, setExpenseCategoryInput, editingExpenseCategory, setEditingExpenseCategory,
    handleCategoryUpdate
}) => {
    const handleUpdate = (field: 'incomeCategories' | 'expenseCategories', input: string, setInput: any, categories: string[], editing: string | null, setEditing: any) => {
        const val = input.trim(); if (!val) return;
        let updated: string[];
        if (editing) updated = categories.map(c => c === editing ? val : c);
        else updated = categories.includes(val) ? categories : [...categories, val];
        handleCategoryUpdate(field, updated); setInput(''); setEditing(null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-brand-bg/40 border border-brand-border rounded-3xl p-6">
                <CategoryManager
                    title="Kategori Pemasukan" placeholder="Tambah Kategori (e.g. Booking Fee)" categories={profile.incomeCategories || []}
                    inputValue={incomeCategoryInput} onInputChange={setIncomeCategoryInput}
                    onAddOrUpdate={() => handleUpdate('incomeCategories', incomeCategoryInput, setIncomeCategoryInput, profile.incomeCategories || [], editingIncomeCategory, setEditingIncomeCategory)}
                    onEdit={(cat) => { setEditingIncomeCategory(cat); setIncomeCategoryInput(cat); }}
                    onDelete={(cat) => confirm(`Hapus "${cat}"?`) && handleCategoryUpdate('incomeCategories', (profile.incomeCategories || []).filter(c => c !== cat))}
                    editingValue={editingIncomeCategory} onCancelEdit={() => { setEditingIncomeCategory(null); setIncomeCategoryInput(''); }}
                />
            </div>
            <div className="bg-brand-bg/40 border border-brand-border rounded-3xl p-6">
                <CategoryManager
                    title="Kategori Pengeluaran" placeholder="Tambah Kategori (e.g. Gaji Team)" categories={profile.expenseCategories || []}
                    inputValue={expenseCategoryInput} onInputChange={setExpenseCategoryInput}
                    onAddOrUpdate={() => handleUpdate('expenseCategories', expenseCategoryInput, setExpenseCategoryInput, profile.expenseCategories || [], editingExpenseCategory, setEditingExpenseCategory)}
                    onEdit={(cat) => { setEditingExpenseCategory(cat); setExpenseCategoryInput(cat); }}
                    onDelete={(cat) => confirm(`Hapus "${cat}"?`) && handleCategoryUpdate('expenseCategories', (profile.expenseCategories || []).filter(c => c !== cat))}
                    editingValue={editingExpenseCategory} onCancelEdit={() => { setEditingExpenseCategory(null); setExpenseCategoryInput(''); }}
                />
            </div>
        </div>
    );
};
