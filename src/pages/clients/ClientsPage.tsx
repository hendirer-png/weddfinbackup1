import React from 'react';
import { Client, Project, Package, Transaction, Profile, Card, ViewType, NavigationAction, PromoCode, FinancialPocket, ClientFeedback } from '@/types';
import { ClientsPage as ClientsPageFeature } from '@/features/clients/components/ClientsPage';

interface ClientsProps {
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    packages: Package[];
    addOns: any[];
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    userProfile: Profile;
    showNotification: (message: string) => void;
    initialAction: any;
    setInitialAction: (val: any) => void;
    cards: Card[];
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    handleNavigation: (view: ViewType, action?: NavigationAction) => void;
    promoCodes: PromoCode[];
    setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
    totals: any; // Using any for totals as it's just passed through
    pockets: FinancialPocket[];
    setPockets: React.Dispatch<React.SetStateAction<FinancialPocket[]>>;
    clientFeedback: ClientFeedback[];
    onSignInvoice: (pId: string, sig: string) => void;
    onSignTransaction: (tId: string, sig: string) => void;
    onRecordPayment: (projectId: string, amount: number, destinationCardId: string) => void;
    addNotification: (notif: any) => void;
}

const ClientsPage: React.FC<ClientsProps> = (props) => {
    return <ClientsPageFeature {...props} />;
};

export default ClientsPage;