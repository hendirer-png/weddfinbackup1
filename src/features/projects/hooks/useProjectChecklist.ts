import { useState, useEffect, useMemo, useCallback } from 'react';
import supabase from '@/lib/supabaseClient';
import { 
    Project, 
    WeddingDayChecklist 
} from '@/features/projects/types/project.types';
import { 
    listChecklistByProject,
    setChecklistItemCompleted,
    updateChecklistItemFields,
    upsertChecklistItems,
    deleteChecklistItem,
    renameChecklistCategory,
    deleteChecklistItemsByProjectAndCategory,
    initializeDefaultChecklist
} from '@/services/weddingDayChecklist';

export const useProjectChecklist = (
    projectId: string | undefined,
    onChecklistUpdate: (items: WeddingDayChecklist[]) => void,
    showNotification: (msg: string) => void
) => {
    const [isInitializingChecklist, setIsInitializingChecklist] = useState(false);

    useEffect(() => {
        if (!projectId) return;

        // Fetch initial data
        const loadChecklist = async () => {
            try {
                const items = await listChecklistByProject(projectId);
                onChecklistUpdate(items);
            } catch (e) {
                console.error('Failed to load checklist:', e);
            }
        };

        loadChecklist();

        // Setup real-time subscription
        const channel = supabase
            .channel(`admin:wedding_day_checklists:project_id=eq.${projectId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'wedding_day_checklists',
                    filter: `project_id=eq.${projectId}`
                },
                (payload) => {
                    // Logic to handle payload handled by the caller or we can do it here
                    // To keep it clean, we'll re-fetch or apply the delta
                    // Re-fetching is safer for complex state sync
                    loadChecklist();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [projectId]);

    const handleToggleChecklistItem = async (itemId: string, currentStatus: boolean, currentList: WeddingDayChecklist[]) => {
        try {
            const updatedRow = await setChecklistItemCompleted(itemId, !currentStatus);
            const newList = currentList.map(item =>
                item.id === itemId ? { ...item, isCompleted: updatedRow.isCompleted, updatedAt: updatedRow.updatedAt } : item
            );
            onChecklistUpdate(newList);
        } catch (err) {
            console.error('Failed to toggle checklist item:', err);
            showNotification('Gagal memperbarui checklist.');
        }
    };

    const handleSaveChecklistNotes = async (itemId: string, notes: string, currentList: WeddingDayChecklist[]) => {
        try {
            const updatedRow = await updateChecklistItemFields(itemId, { notes });
            const newList = currentList.map(item =>
                item.id === itemId ? { ...item, notes: updatedRow.notes, updatedAt: updatedRow.updatedAt } : item
            );
            onChecklistUpdate(newList);
        } catch (err) {
            console.error('Failed to save checklist notes:', err);
            showNotification('Gagal menyimpan catatan.');
        }
    };

    const handleSaveItemEdits = async (itemId: string, name: string, pic: string, currentList: WeddingDayChecklist[]) => {
        try {
            const updatedRow = await updateChecklistItemFields(itemId, { 
                itemName: name,
                assignedTo: pic || null
            });
            const newList = currentList.map(item =>
                item.id === itemId ? { 
                    ...item, 
                    itemName: updatedRow.itemName, 
                    assignedTo: updatedRow.assignedTo, 
                    updatedAt: updatedRow.updatedAt 
                } : item
            );
            onChecklistUpdate(newList);
        } catch (err) {
            console.error('Failed to save item edits:', err);
            showNotification('Gagal menyimpan perubahan item.');
        }
    };

    const handleAddChecklistItem = async (category: string, itemName: string, currentList: WeddingDayChecklist[]) => {
        if (!projectId) return;
        try {
            const newItem = {
                projectId,
                category,
                itemName: itemName.trim(),
                isCompleted: false
            };
            const result = await upsertChecklistItems([newItem]);
            onChecklistUpdate([...currentList, ...result]);
        } catch (err) {
            console.error('Failed to add checklist item:', err);
            showNotification('Gagal menambah item checklist.');
        }
    };

    const handleDeleteChecklistItem = async (itemId: string, currentList: WeddingDayChecklist[]) => {
        try {
            await deleteChecklistItem(itemId);
            onChecklistUpdate(currentList.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Failed to delete checklist item:', err);
            showNotification('Gagal menghapus item checklist.');
        }
    };

    const handleSaveCategoryName = async (oldName: string, newName: string) => {
        if (!projectId) return;
        try {
            await renameChecklistCategory(projectId, oldName, newName);
            const refreshedChecklist = await listChecklistByProject(projectId);
            onChecklistUpdate(refreshedChecklist);
            showNotification('Kategori berhasil diubah.');
        } catch (err) {
            console.error('Failed to rename category:', err);
            showNotification('Gagal mengubah nama kategori.');
        }
    };

    const handleDeleteCategory = async (category: string) => {
        if (!projectId) return;
        try {
            await deleteChecklistItemsByProjectAndCategory(projectId, category);
            const refreshedChecklist = await listChecklistByProject(projectId);
            onChecklistUpdate(refreshedChecklist);
            showNotification('Kategori berhasil dihapus.');
        } catch (err) {
            console.error('Failed to delete category:', err);
            showNotification('Gagal menghapus kategori.');
        }
    };

    const handleInitializeChecklist = async (templateConfigs: any[]) => {
        if (!projectId || isInitializingChecklist) return;
        setIsInitializingChecklist(true);
        try {
            const result = await initializeDefaultChecklist(projectId, templateConfigs);
            onChecklistUpdate(result);
            showNotification('Checklist Hari H berhasil dibuat.');
        } catch (err) {
            console.error('Failed to initialize checklist:', err);
            showNotification('Gagal membuat checklist default.');
        } finally {
            setIsInitializingChecklist(false);
        }
    };

    return {
        isInitializingChecklist,
        handleToggleChecklistItem,
        handleSaveChecklistNotes,
        handleSaveItemEdits,
        handleAddChecklistItem,
        handleDeleteChecklistItem,
        handleSaveCategoryName,
        handleDeleteCategory,
        handleInitializeChecklist
    };
};
