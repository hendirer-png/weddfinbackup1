import { useState, useEffect, useCallback } from 'react';
import { Profile, Transaction, Project, User, Package, ChatTemplate, ChecklistTemplate } from '@/types';
import { upsertProfile } from '@/services/profile';
import { CHAT_TEMPLATES, DEFAULT_BILLING_TEMPLATES } from '@/constants';

interface UseSettingsPageProps {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    currentUser: User | null;
}

export const useSettingsPage = ({ profile, setProfile, users, setUsers, currentUser }: UseSettingsPageProps) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('Perubahan berhasil disimpan!');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const showNotification = useCallback((msg: string) => {
        setSuccessMessage(msg);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    }, []);

    useEffect(() => {
        try {
            const tab = window.localStorage.getItem('vena-settings-tab');
            if (tab) {
                setActiveTab(tab);
                window.localStorage.removeItem('vena-settings-tab');
            }
        } catch (e) {}
    }, []);

    const handleProfileSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        setSaveError('');
        try {
            const updated = await upsertProfile(profile);
            setProfile(updated);
            showNotification('Profil berhasil diperbarui!');
        } catch (err: any) {
            setSaveError(err?.message || 'Gagal menyimpan profil.');
        } finally {
            setIsSaving(false);
        }
    };

    // Category Management Logic (Generic)
    const handleCategoryUpdate = async (field: keyof Profile, categories: string[]) => {
        try {
            const updated = await upsertProfile({ id: profile.id, [field]: categories } as any);
            setProfile(updated);
            showNotification('Kategori berhasil diperbarui!');
        } catch (err: any) {
            alert('Gagal menyimpan: ' + (err?.message || 'Coba lagi.'));
        }
    };

    // Chat Template Logic
    const [chatTemplates, setChatTemplates] = useState<ChatTemplate[]>(profile.chatTemplates || CHAT_TEMPLATES);
    const [billingTemplates, setBillingTemplates] = useState<ChatTemplate[]>(profile.billingTemplates || DEFAULT_BILLING_TEMPLATES);

    const persistChatTemplates = async (updated: ChatTemplate[]) => {
        setIsSaving(true);
        try {
            const updatedProfile = await upsertProfile({ ...profile, chatTemplates: updated } as any);
            setProfile(updatedProfile);
            setChatTemplates(updated);
            showNotification('Template berhasil disimpan!');
        } catch (err: any) {
            alert('Gagal menyimpan: ' + (err?.message || 'Coba lagi.'));
        } finally {
            setIsSaving(false);
        }
    };

    const persistBillingTemplates = async (updated: ChatTemplate[]) => {
        setIsSaving(true);
        try {
            const updatedProfile = await upsertProfile({ ...profile, billingTemplates: updated } as any);
            setProfile(updatedProfile);
            setBillingTemplates(updated);
            showNotification('Template tagihan berhasil disimpan!');
        } catch (err: any) {
            alert('Gagal menyimpan: ' + (err?.message || 'Coba lagi.'));
        } finally {
            setIsSaving(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        showSuccess,
        successMessage,
        isSaving,
        saveError,
        showNotification,
        handleProfileSubmit,
        handleCategoryUpdate,
        chatTemplates,
        setChatTemplates,
        persistChatTemplates,
        billingTemplates,
        setBillingTemplates,
        persistBillingTemplates,
    };
};
