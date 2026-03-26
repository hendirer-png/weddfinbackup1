import React from 'react';
import { Profile } from '@/types';
import { CategoryManager } from '@/features/settings/components/CategoryManager';

interface PackageSettingsTabProps {
    profile: Profile;
    packageCategoryInput: string;
    setPackageCategoryInput: (v: string) => void;
    editingPackageCategory: string | null;
    setEditingPackageCategory: (v: string | null) => void;
    handleCategoryUpdate: (field: keyof Profile, categories: string[]) => void;
}

export const PackageSettingsTab: React.FC<PackageSettingsTabProps> = ({
    profile, packageCategoryInput, setPackageCategoryInput, editingPackageCategory, setEditingPackageCategory,
    handleCategoryUpdate
}) => {
    const handleUpdate = () => {
        const val = packageCategoryInput.trim(); if (!val) return;
        const categories = profile.packageCategories || [];
        let updated: string[];
        if (editingPackageCategory) updated = categories.map(c => c === editingPackageCategory ? val : c);
        else updated = categories.includes(val) ? categories : [...categories, val];
        handleCategoryUpdate('packageCategories', updated); setPackageCategoryInput(''); setEditingPackageCategory(null);
    };

    return (
        <div className="max-w-2xl mx-auto bg-brand-bg/40 border border-brand-border rounded-3xl p-6 md:p-8">
            <CategoryManager
                title="Kategori Package" placeholder="Tambah Kategori (e.g. Wedding)" categories={profile.packageCategories || []}
                inputValue={packageCategoryInput} onInputChange={setPackageCategoryInput}
                onAddOrUpdate={handleUpdate}
                onEdit={(cat) => { setEditingPackageCategory(cat); setPackageCategoryInput(cat); }}
                onDelete={(cat) => confirm(`Hapus "${cat}"?`) && handleCategoryUpdate('packageCategories', (profile.packageCategories || []).filter(c => c !== cat))}
                editingValue={editingPackageCategory} onCancelEdit={() => { setEditingPackageCategory(null); setPackageCategoryInput(''); }}
            />
        </div>
    );
};
