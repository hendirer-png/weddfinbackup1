import React from 'react';
import { SettingsPage as SettingsFeature } from '@/features/settings';
import { Profile, Transaction, Project, Package, User } from '@/types';

interface SettingsProps {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
    transactions: Transaction[];
    projects: Project[];
    packages: Package[];
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    currentUser: User | null;
}

const SettingsPage: React.FC<SettingsProps> = (props) => {
    return <SettingsFeature {...props} />;
};

export default SettingsPage;