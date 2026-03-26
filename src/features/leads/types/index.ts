import { Lead, LeadStatus, ContactChannel, Client, Project, Package, AddOn, Transaction, Card, FinancialPocket, PromoCode, Profile, ViewType, NavigationAction } from '@/types';

export interface LeadFormData {
    name: string;
    contactChannel: ContactChannel;
    location: string;
    address: string;
    whatsapp: string;
    notes: string;
    date: string;
    status: LeadStatus;
}

export interface ConvertLeadFormData {
    clientName: string;
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    clientType: string;
    projectName: string;
    projectType: string;
    location: string;
    address: string;
    date: string;
    packageId: string;
    selectedAddOnIds: string[];
    dp: string | number;
    dpDestinationCardId: string;
    notes: string;
    promoCodeId: string;
    unitPrice?: number;
    durationSelection?: string;
}

export interface LeadsPageProps {
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    packages: Package[];
    addOns: AddOn[];
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    userProfile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
    showNotification: (message: string) => void;
    handleNavigation: (view: ViewType, action?: NavigationAction) => void;
    cards: Card[];
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    pockets: FinancialPocket[];
    setPockets: React.Dispatch<React.SetStateAction<FinancialPocket[]>>;
    promoCodes: PromoCode[];
    setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
    totals: {
        projects: number; activeProjects: number; clients: number; activeClients: number;
        leads: number; discussionLeads: number; followUpLeads: number; teamMembers: number;
        transactions: number; revenue: number; expense: number;
    };
}
