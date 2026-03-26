# Project Structure: Photography Vendor Application

This document provides a hierarchical overview of the project's file and directory structure.

```text
.
├── .github/
│   └── workflows/
│       └── ios-testflight.yml
├── .kiro
├── .orchids
├── android/
├── app/
│   └── index.css
├── dist/
├── docs/
│   ├── build_output.txt
│   ├── output.txt
│   ├── PERPORMA WEB
│   └── reverensi nama2 kontne unutk forontand
├── ios/
├── node_modules/
├── public/
├── scripts/
│   ├── check_all_delimiters.cjs
│   ├── check_all_tables.cjs
│   ├── check_balance.cjs
│   ├── check_braces_stack.cjs
│   ├── check_braces_stack_v2.cjs
│   ├── check_db.cjs
│   ├── check_profile_demo.cjs
│   ├── check_rpc.cjs
│   ├── check_tables.cjs
│   ├── count_quotes.cjs
│   ├── find_hadi.ts
│   ├── find_odd_quotes.cjs
│   ├── inspect_cols.cjs
│   ├── inspect_missing_tx.cjs
│   ├── print_last_lines.cjs
│   ├── repair_transactions.cjs
│   ├── seed_profile.cjs
│   ├── test_insert.cjs
│   ├── validate-terminology.ts
│   └── ...
├── src/
│   ├── constants/
│   │   └── index.tsx
│   ├── features/
│   │   ├── booking/
│   │   │   ├── components/
│   │   │   │   ├── BookingChartsSection.tsx
│   │   │   │   ├── BookingStats.tsx
│   │   │   │   ├── BookingTable.tsx
│   │   │   │   └── WhatsappTemplateModal.tsx
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   │       └── booking.utils.ts
│   │   ├── clients/
│   │   │   ├── components/
│   │   │   │   ├── BillingChatModal.tsx
│   │   │   │   ├── ClientActiveList.tsx
│   │   │   │   ├── ClientCard.tsx
│   │   │   │   ├── ClientDetailModal.tsx
│   │   │   │   ├── ClientFilterBar.tsx
│   │   │   │   ├── ClientForm.tsx
│   │   │   │   ├── ClientHeader.tsx
│   │   │   │   ├── ClientInactiveList.tsx
│   │   │   │   ├── ClientInfoTab.tsx
│   │   │   │   ├── ClientKPI.tsx
│   │   │   │   ├── ClientLinkModals.tsx
│   │   │   │   ├── ClientPortal.tsx
│   │   │   │   ├── ClientsPage.tsx
│   │   │   │   ├── ClientStatsCards.tsx
│   │   │   │   ├── ClientUnpaidList.tsx
│   │   │   │   ├── NewClientsChart.tsx
│   │   │   │   └── ProjectPaymentCard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useClientActions.ts
│   │   │   │   ├── useClientPortal.ts
│   │   │   │   ├── useClients.ts
│   │   │   │   ├── useClientsData.ts
│   │   │   │   ├── useClientsFilters.ts
│   │   │   │   └── useClientsPage.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   ├── communication/
│   │   │   └── components/
│   │   │       ├── ChatModal.tsx
│   │   │       ├── ChatTemplateManager.tsx
│   │   │       ├── CommunicationHub.tsx
│   │   │       └── ShareMessageModal.tsx
│   │   ├── contracts/
│   │   │   ├── components/
│   │   │   │   ├── ContractDocument.tsx
│   │   │   │   ├── ContractFormModal.tsx
│   │   │   │   ├── ContractInfoModal.tsx
│   │   │   │   ├── ContractMobileList.tsx
│   │   │   │   ├── ContractStats.tsx
│   │   │   │   ├── ContractTable.tsx
│   │   │   │   └── ContractViewModal.tsx
│   │   │   ├── constants/
│   │   │   │   └── contracts.constants.ts
│   │   │   ├── hooks/
│   │   │   │   └── useContractsPage.ts
│   │   │   └── utils/
│   │   ├── finance/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   │   ├── useFinance.ts
│   │   │   │   ├── useFinanceActions.ts
│   │   │   │   ├── useFinanceAnalytics.ts
│   │   │   │   ├── useFinanceData.ts
│   │   │   │   └── useFinanceFilters.ts
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── FinancePage.tsx
│   │   ├── leads/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── packages/
│   │   │   ├── components/
│   │   │   │   ├── AddOnSection.tsx
│   │   │   │   ├── PackageCard.tsx
│   │   │   │   ├── PackageFormModal.tsx
│   │   │   │   └── PackageModals.tsx
│   │   │   ├── hooks/
│   │   │   │   └── usePackages.ts
│   │   │   ├── utils/
│   │   │   │   └── packages.utils.ts
│   │   │   └── Packages.tsx
│   │   ├── projects/
│   │   │   ├── components/
│   │   │   │   ├── CalendarView.tsx
│   │   │   │   ├── ProjectAnalytics.tsx
│   │   │   │   ├── ProjectDetailModal.tsx
│   │   │   │   ├── ProjectFilters.tsx
│   │   │   │   ├── ProjectForm.tsx
│   │   │   │   ├── ProjectHeader.tsx
│   │   │   │   ├── ProjectKanbanView.tsx
│   │   │   │   ├── ProjectListView.tsx
│   │   │   │   └── QuickStatusModal.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProjectActions.ts
│   │   │   │   ├── useProjectData.ts
│   │   │   │   ├── useProjectForm.ts
│   │   │   │   └── useProjectsPage.ts
│   │   │   ├── types/
│   │   │   │   └── project.types.ts
│   │   │   ├── utils/
│   │   │   │   └── project.utils.ts
│   │   │   └── ProjectsPage.tsx
│   │   ├── promo/
│   │   │   └── PromoCodes.tsx
│   │   ├── public/
│   │   │   └── components/
│   │   │       ├── GalleryUpload.tsx
│   │   │       ├── PublicBookingForm.tsx
│   │   │       ├── PublicContract.tsx
│   │   │       ├── PublicFeedbackForm.tsx
│   │   │       ├── PublicGallery.tsx
│   │   │       ├── PublicInvoice.tsx
│   │   │       ├── PublicLeadForm.tsx
│   │   │       ├── PublicPackages.tsx
│   │   │       ├── PublicReceipt.tsx
│   │   │       └── SuggestionForm.tsx
│   │   ├── settings/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── team/
│   │   │   ├── components/
│   │   │   │   ├── TeamMemberDetail/
│   │   │   │   │   ├── CreatePaymentTab.tsx
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── PaymentsTab.tsx
│   │   │   │   │   ├── PerformanceTab.tsx
│   │   │   │   │   └── ProjectsTab.tsx
│   │   │   │   ├── FreelancerPortal.tsx
│   │   │   │   ├── FreelancerProjects.tsx
│   │   │   │   ├── PaymentSlip.tsx
│   │   │   │   ├── PaymentSlipModal.tsx
│   │   │   │   ├── TeamInfoModal.tsx
│   │   │   │   ├── TeamMemberModal.tsx
│   │   │   │   ├── TeamStatsSection.tsx
│   │   │   │   └── TeamTable.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useTeamPage.ts
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── test/
│   ├── hooks/
│   │   ├── useAppData.ts
│   │   ├── useChatTemplates.ts
│   │   ├── useDataManager.ts
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useLazyData.ts
│   │   ├── useLazyDataLoader.ts
│   │   ├── useOfflineSync.ts
│   │   ├── useOptimizedData.ts
│   │   ├── useOptimizedRealtime.ts
│   │   ├── usePaginatedData.ts
│   │   ├── usePagination.ts
│   │   └── useSearchableInfiniteScroll.ts
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── booking/
│   │   ├── clients/
│   │   │   └── ClientsPage.tsx
│   │   ├── contracts/
│   │   │   └── ContractsPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── finance/
│   │   │   └── FinancePage.tsx
│   │   ├── home/
│   │   │   └── Homepage.tsx
│   │   ├── leads/
│   │   │   └── LeadsPage.tsx
│   │   ├── projects/
│   │   │   └── ProjectsPage.tsx (Modular Wrapper)
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   └── team/
│   │       └── TeamPage.tsx
│   ├── services/
│   │   ├── addOns.ts
│   │   ├── balanceValidator.test.ts
│   │   ├── balanceValidator.ts
│   │   ├── calendarEvents.ts
│   │   ├── cards.ts
│   │   ├── chatTemplatesOffline.ts
│   │   ├── clientFeedback.ts
│   │   ├── clients.ts
│   │   ├── clientsOffline.ts
│   │   ├── contracts.ts
│   │   ├── data-loader.ts
│   │   ├── deduplication.ts
│   │   ├── galleries.ts
│   │   ├── geminiSDK.ts
│   │   ├── leads.ts
│   │   ├── notifications.ts
│   │   ├── offlineStorage.ts
│   │   ├── optimized-queries.ts
│   │   ├── packages.ts
│   │   ├── pagination-helper.ts
│   │   ├── pockets.ts
│   │   ├── profile.ts
│   │   ├── projectPrintItems.ts
│   │   ├── projects.ts
│   │   ├── projectsOffline.ts
│   │   ├── projectSubStatusConfirmations.ts
│   │   ├── projectTeamAssignments.ts
│   │   ├── promoCodes.ts
│   │   ├── storage.ts
│   │   ├── suggestions.ts
│   │   ├── syncManager.ts
│   │   ├── teamMembers.ts
│   │   ├── teamPaymentRecords.ts
│   │   ├── teamProjectPayments.ts
│   │   ├── transactions.ts
│   │   ├── transactionsOffline.ts
│   │   ├── users.ts
│   │   ├── weddingDayChecklist.test.ts
│   │   ├── weddingDayChecklist.ts
│   │   └── weddingDayChecklistCategories.ts
│   ├── shared/
│   │   ├── form/
│   │   │   ├── FilterBar.tsx
│   │   │   ├── RupiahInput.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── ui/
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── CollapsibleSection.tsx
│   │   │   ├── DonutChart.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── FailedSyncModal.tsx
│   │   │   ├── FloatingActionButton.tsx
│   │   │   ├── HelpBox.tsx
│   │   │   ├── InteractiveCashflowChart.tsx
│   │   │   ├── LazyImage.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── OfflineSyncIndicator.tsx
│   │   │   ├── PrintButton.tsx
│   │   │   ├── PullToRefresh.tsx
│   │   │   ├── QrCodeDisplay.tsx
│   │   │   ├── SignaturePad.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatCardModal.tsx
│   │   │   └── SwipeableCard.tsx
│   │   └── README_UIUX_COMPONENTS.md
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   └── index.css
├── supabase/
├── .env
├── .env.production
├── .gitignore
├── App.tsx
├── bitrise.yml
├── capacitor.config.ts
├── codemagic.yaml
├── constants.test.ts
├── env.d.ts
├── index.html
├── index.tsx
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
