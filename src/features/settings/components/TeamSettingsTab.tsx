import React, { useState } from 'react';
import { User, ViewType, Profile } from '@/types';
import Modal from '@/shared/ui/Modal';
import { PlusIcon, PencilIcon, Trash2Icon, MailIcon, LockIcon, UsersIcon, KeyIcon } from '@/constants';
import { createUser, updateUser, deleteUser } from '@/services/users';

interface TeamSettingsTabProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    currentUser: User | null;
}

const VIEW_TYPES: { value: ViewType; label: string }[] = [
    { value: ViewType.DASHBOARD, label: 'Dashboard' },
    { value: ViewType.CALENDAR, label: 'Kalendar' },
    { value: ViewType.BOOKING, label: 'Booking' },
    { value: ViewType.PROJECTS, label: 'Acara' },
    { value: ViewType.FINANCE, label: 'Finance' },
    { value: ViewType.CLIENTS, label: 'Klien' },
    { value: ViewType.TEAM, label: 'Team & Vendor' },
    { value: ViewType.SETTINGS, label: 'Settings' },
];

export const TeamSettingsTab: React.FC<TeamSettingsTabProps> = ({ users, setUsers, currentUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'Member' as User['role'], permissions: [] as ViewType[] });
    const [error, setError] = useState('');

    const handleOpenModal = (mode: 'add' | 'edit', user?: User) => {
        setModalMode(mode);
        setSelectedUser(user || null);
        if (mode === 'edit' && user) {
            setForm({ fullName: user.fullName, email: user.email, role: user.role, password: '', confirmPassword: '', permissions: user.permissions || [] });
        } else {
            setForm({ fullName: '', email: '', password: '', confirmPassword: '', role: 'Member', permissions: [] });
        }
        setError(''); setIsModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        if (form.password && form.password !== form.confirmPassword) { setError('Password tidak cocok'); return; }
        try {
            if (modalMode === 'add') {
                const created = await createUser({ ...form });
                setUsers(prev => [...prev, created]);
            } else if (selectedUser) {
                const updated = await updateUser(selectedUser.id, { ...form });
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? updated : u));
            }
            setIsModalOpen(false);
        } catch (err: any) { setError(err?.message || 'Gagal'); }
    };

    const handleDeleteUser = async (user: User) => {
        if (!confirm(`Hapus ${user.fullName}?`)) return;
        try { await deleteUser(user.id); setUsers(prev => prev.filter(u => u.id !== user.id)); }
        catch (err: any) { alert(err?.message || 'Gagal'); }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center bg-brand-bg/40 p-6 rounded-3xl border border-brand-border">
                <div><h3 className="text-lg font-bold text-brand-text-light">Manajemen Team & Akses</h3><p className="text-xs text-brand-text-secondary mt-1">Kelola anggota tim dan hak akses mereka ke fitur aplikasi.</p></div>
                <button onClick={() => handleOpenModal('add')} className="button-primary py-2.5 px-6 rounded-xl flex items-center gap-2"><PlusIcon className="w-5 h-5" /> Tambah Anggota</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user.id} className="group bg-brand-bg/40 border border-brand-border rounded-3xl p-6 transition-all hover:border-brand-accent/30 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center text-xl font-bold">{user.fullName[0].toUpperCase()}</div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal('edit', user)} className="p-2 text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg"><PencilIcon className="w-4 h-4" /></button>
                                {user.id !== currentUser?.id && <button onClick={() => handleDeleteUser(user)} className="p-2 text-brand-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2Icon className="w-4 h-4" /></button>}
                            </div>
                        </div>
                        <h4 className="font-bold text-brand-text-light text-lg">{user.fullName}</h4>
                        <p className="text-sm text-brand-text-secondary flex items-center gap-1.5"><MailIcon className="w-3.5 h-3.5" /> {user.email}</p>
                        <div className="mt-4 pt-4 border-t border-brand-border/50">
                            <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-wider">Role</span><span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${user.role === 'Admin' ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20' : 'bg-brand-surface border border-brand-border text-brand-text-secondary'}`}>{user.role}</span></div>
                            <div className="mt-4"><span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-wider block mb-2">Akses Menu</span><div className="flex flex-wrap gap-1.5">{user.role === 'Admin' ? <span className="px-2 py-1 rounded-lg bg-green-400/10 text-green-400 border border-green-400/20 text-[10px] font-bold">Semua Akses</span> : user.permissions?.map(p => <span key={p} className="px-2 py-1 rounded-lg bg-brand-surface border border-brand-border text-brand-text-secondary text-[10px] uppercase font-bold">{p}</span>)}</div></div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Tambah Anggota Tim' : 'Edit Anggota Tim'}>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group"><UsersIcon className="w-5 h-5 input-icon" /><input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} className="input-field-with-icon" placeholder=" " required /><label className="input-label-with-icon">Nama Lengkap</label></div>
                        <div className="input-group"><MailIcon className="w-5 h-5 input-icon" /><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field-with-icon" placeholder=" " required /><label className="input-label-with-icon">Alamat Email</label></div>
                        <div className="input-group"><KeyIcon className="w-5 h-5 input-icon" /><input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="input-field-with-icon" placeholder=" " required={modalMode === 'add'} /><label className="input-label-with-icon">{modalMode === 'add' ? 'Kata Sandi' : 'Kata Sandi Baru'}</label></div>
                        <div className="input-group"><KeyIcon className="w-5 h-5 input-icon" /><input type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} className="input-field-with-icon" placeholder=" " required={modalMode === 'add'} /><label className="input-label-with-icon">Konfirmasi Kata Sandi</label></div>
                        <div className="input-group md:col-span-2"><LockIcon className="w-5 h-5 input-icon" /><select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as User['role'] }))} className="input-field-with-icon appearance-none"><option value="Member">Member (Akses Terbatas)</option><option value="Admin">Admin (Semua Akses)</option></select><label className="input-label-with-icon">Role Akses</label></div>
                    </div>
                    {form.role === 'Member' && (
                        <div><label className="text-sm font-bold text-brand-text-secondary mb-3 block">Berikan Izin Akses Menu:</label><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{VIEW_TYPES.map(vt => <button key={vt.value} type="button" onClick={() => setForm(p => ({ ...p, permissions: p.permissions.includes(vt.value) ? p.permissions.filter(x => x !== vt.value) : [...p.permissions, vt.value] }))} className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${form.permissions.includes(vt.value) ? 'bg-brand-accent/20 border-brand-accent text-brand-accent shadow-lg shadow-brand-accent/10' : 'bg-brand-surface border-brand-border text-brand-text-secondary hover:border-brand-accent/30'}`}>{vt.label}</button>)}</div></div>
                    )}
                    {error && <div className="p-4 bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-bold rounded-2xl">{error}</div>}
                    <div className="flex justify-end gap-3 pt-6 border-t border-brand-border"><button type="button" onClick={() => setIsModalOpen(false)} className="button-secondary px-6">Batal</button><button type="submit" className="button-primary px-10 rounded-xl font-bold shadow-lg shadow-brand-accent/20">{modalMode === 'add' ? 'Daftarkan User' : 'Update Detail User'}</button></div>
                </form>
            </Modal>
        </div>
    );
};
