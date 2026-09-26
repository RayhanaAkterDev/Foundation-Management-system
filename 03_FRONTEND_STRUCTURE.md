# Stand For People (SP)

## Complete Frontend Source Structure

This document records the current `frontend/src` structure of the existing Stand For People (SP) project.

This is a **structure/reference document**, not an implementation specification.

### Important rules

* This structure reflects the current project structure provided by the developer.
* Do not assume that every file is relevant to the current task.
* Do not modify, remove, rename, or reorganize files based on this document.
* Actual source-file contents are authoritative.
* A file listed here must still be inspected before relying on its implementation.
* For each task, inspect only the smallest relevant set of files.
* Do not audit unrelated parts of the application unless a confirmed dependency requires it.
* Do not invent files that are not present in the actual project.
* The structure may change as development continues; if a newer structure is provided, treat the newer one as authoritative.

---

## Current `frontend/src` Tree

```text
frontend/src/
│
├── App.jsx
├── main.jsx
│
├── api/
│   ├── categories.js
│   ├── client.js
│   ├── individualAPI.js
│   ├── notificationApi.js
│   └── publicCampaignsApi.js
│
├── assets/
│   ├── about/
│   │   ├── aboutHero.png
│   │   ├── aboutImpacts.jpg
│   │   ├── aboutIntro.png
│   │   ├── bePartOfChange.png
│   │   └── bePartOfChange3.png
│   │
│   ├── campaigns/
│   │   ├── campaignsHeroImage.png
│   │   ├── campaignsHeroImage1.png
│   │   └── campaignsHeroImage2.png
│   │
│   ├── home/
│   │   ├── heroIllustration.png
│   │   ├── heroIllustration1.png
│   │   ├── heroIllustration2.png
│   │   │
│   │   ├── featuredCampaign/
│   │   │   └── featuredCampaign.png
│   │   │
│   │   ├── hero/
│   │   │   └── hero.jpg
│   │   │
│   │   ├── localImpact/
│   │   │   └── leftPanel.png
│   │   │
│   │   └── transparency/
│   │       └── humanProof.png
│   │
│   ├── howItWorksPage/
│   │   └── trustSystem.png
│   │
│   └── shared/
│       ├── footerLogo.png
│       └── logo.png
│
├── auth/
│   ├── AccountSelection/
│   │   ├── AccountCard.jsx
│   │   ├── accountData.js
│   │   └── AccountSelection.jsx
│   │
│   ├── AdminLogin/
│   │   └── AdminLogin.jsx
│   │
│   ├── EmailVerification/
│   │   └── EmailVerification.jsx
│   │
│   ├── Login/
│   │   ├── Login.jsx
│   │   ├── LoginFooter.jsx
│   │   ├── LoginForm.jsx
│   │   └── LoginHeader.jsx
│   │
│   └── Register/
│       ├── Register.jsx
│       ├── RegisterNavigation.jsx
│       ├── RegisterProgress.jsx
│       ├── RegisterSuccess.jsx
│       │
│       └── steps/
│           ├── StepAccountType.jsx
│           ├── StepCredentials.jsx
│           ├── StepIndividualPreferences.jsx
│           ├── StepIndividualProfile.jsx
│           ├── StepOrganizationDetails.jsx
│           └── StepOrganizationProfile.jsx
│
├── components/
│   ├── Badge.jsx
│   ├── Button.jsx
│   ├── Hero.jsx
│   ├── SectionHeading.jsx
│   ├── StatCard.jsx
│   ├── StatValue.jsx
│   │
│   ├── dashboard/
│   │   ├── ActivityFeed.jsx
│   │   ├── DataTable.jsx
│   │   ├── EmptyState.jsx
│   │   ├── PageHeader.jsx
│   │   ├── QuickActions.jsx
│   │   ├── StatCard.jsx
│   │   └── StatusBadge.jsx
│   │
│   ├── loader/
│   │   └── Loader.jsx
│   │
│   └── motion/
│       └── Motion.jsx
│
├── dashboard/
│   │
│   ├── admin/
│   │   │
│   │   ├── campaigns/
│   │   │   ├── CampaignDetails.jsx
│   │   │   ├── Campaigns.jsx
│   │   │   │
│   │   │   ├── api/
│   │   │   │   └── campaignsAPI.js
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── CategoryTabs.jsx
│   │   │   │   ├── Filters.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── Stats.jsx
│   │   │   │   ├── SuccessToast.jsx
│   │   │   │   └── Table.jsx
│   │   │   │
│   │   │   └── modals/
│   │   │       ├── AssignmentModal.jsx
│   │   │       ├── CampaignCreateModal.jsx
│   │   │       ├── EditModal.jsx
│   │   │       ├── RelatedDetailsModal.jsx
│   │   │       ├── StatusUpdateModal.jsx
│   │   │       ├── VerificationModal.jsx
│   │   │       └── ViewModal.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── AdminLink.jsx
│   │   │   │   ├── NetworkMetric.jsx
│   │   │   │   ├── QueueCard.jsx
│   │   │   │   ├── RequestItem.jsx
│   │   │   │   ├── SectionAction.jsx
│   │   │   │   ├── SectionHeading.jsx
│   │   │   │   └── VerificationItem.jsx
│   │   │   │
│   │   │   ├── sections/
│   │   │   │   ├── ActivitySection.jsx
│   │   │   │   ├── AdministrationSection.jsx
│   │   │   │   ├── AttentionSection.jsx
│   │   │   │   ├── DashboardHero.jsx
│   │   │   │   ├── NetworkSection.jsx
│   │   │   │   └── ResponseFlowSection.jsx
│   │   │   │
│   │   │   └── utils/
│   │   │       └── dashboardHelpers.js
│   │   │
│   │   ├── donations/
│   │   │   ├── Donations.jsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── DonationSummary.jsx
│   │   │   │   └── DonationTable.jsx
│   │   │   │
│   │   │   └── modals/
│   │   │       └── DonationDetailsModal.jsx
│   │   │
│   │   ├── helpRequests/
│   │   │   ├── HelpRequests.jsx
│   │   │   │
│   │   │   ├── api/
│   │   │   │   └── helpRequestAPI.js
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── CategoryTabs.jsx
│   │   │   │   ├── Filters.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── Stats.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── SuccessToast.jsx
│   │   │   │   └── Table.jsx
│   │   │   │
│   │   │   └── modals/
│   │   │       ├── AssignmentModal.jsx
│   │   │       ├── DeleteModal.jsx
│   │   │       ├── EditModal.jsx
│   │   │       ├── FormModal.jsx
│   │   │       ├── OrganizationViewModal.jsx
│   │   │       ├── ReassignmentModal.jsx
│   │   │       ├── UserViewModal.jsx
│   │   │       ├── VerificationModal.jsx
│   │   │       └── ViewModal.jsx
│   │   │
│   │   ├── organizations/
│   │   │   ├── Organizations.jsx
│   │   │   │
│   │   │   ├── api/
│   │   │   │   └── organizationApi.js
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── CategoryTabs.jsx
│   │   │   │   ├── Filters.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── Stats.jsx
│   │   │   │   ├── SuccessToast.jsx
│   │   │   │   └── Table.jsx
│   │   │   │
│   │   │   ├── data/
│   │   │   │   └── organizationTypes.js
│   │   │   │
│   │   │   └── modals/
│   │   │       ├── DeleteModal.jsx
│   │   │       ├── FormModal.jsx
│   │   │       ├── VerificationModal.jsx
│   │   │       └── ViewModal.jsx
│   │   │
│   │   ├── profile/
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── settings/
│   │   │   └── Settings.jsx
│   │   │
│   │   └── users/
│   │       ├── Users.jsx
│   │       │
│   │       ├── api/
│   │       │   └── userApi.js
│   │       │
│   │       ├── components/
│   │       │   ├── CategoryTabs.jsx
│   │       │   ├── Filters.jsx
│   │       │   ├── Pagination.jsx
│   │       │   ├── Stats.jsx
│   │       │   ├── SuccessToast.jsx
│   │       │   └── Table.jsx
│   │       │
│   │       └── modals/
│   │           ├── DeleteModal.jsx
│   │           ├── FormModal.jsx
│   │           └── ViewModal.jsx
│   │
│   ├── admin/
│   │   └── volunteers/
│   │       ├── Volunteers.jsx
│   │       │
│   │       ├── api/
│   │       │   └── volunteerApi.js
│   │       │
│   │       ├── components/
│   │       │   ├── Filters.jsx
│   │       │   ├── Pagination.jsx
│   │       │   ├── Stats.jsx
│   │       │   ├── SuccessToast.jsx
│   │       │   └── Table.jsx
│   │       │
│   │       └── modals/
│   │           ├── EditModal.jsx
│   │           ├── ViewModal.jsx
│   │           └── VolunteerRequestModal.jsx
│   │
│   ├── individual/
│   │   ├── campaigns/
│   │   │   ├── IndividualCampaigns.jsx
│   │   │   │
│   │   │   └── components/
│   │   │       ├── CampaignCard.jsx
│   │   │       └── DonationModal/
│   │   │           ├── DonationAmountForm.jsx
│   │   │           ├── DonationCampaignSummary.jsx
│   │   │           ├── DonationModal.jsx
│   │   │           └── DonationTrustBar.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── IndividualDashboard.jsx
│   │   │   │
│   │   │   └── api/
│   │   │       └── individualDashboardApi.js
│   │   │
│   │   ├── myDonations/
│   │   │   ├── MyDonations.jsx
│   │   │   │
│   │   │   └── api/
│   │   │       └── donationApi.js
│   │   │
│   │   ├── myHelpRequests/
│   │   │   ├── MyHelpRequests.jsx
│   │   │   │
│   │   │   ├── api/
│   │   │   │   └── helpRequestAPI.js
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── HelpRequestCategoryTabs.jsx
│   │   │   │   ├── HelpRequestErrorState.jsx
│   │   │   │   ├── HelpRequestFilters.jsx
│   │   │   │   ├── HelpRequestLoadingState.jsx
│   │   │   │   ├── HelpRequestOverview.jsx
│   │   │   │   ├── HelpRequestPageHeader.jsx
│   │   │   │   ├── HelpRequestPagination.jsx
│   │   │   │   ├── HelpRequestSidebar.jsx
│   │   │   │   ├── HelpRequestStats.jsx
│   │   │   │   ├── HelpRequestSuccessToast.jsx
│   │   │   │   ├── HelpRequestTable.jsx
│   │   │   │   ├── HelpRequestTableColumns.jsx
│   │   │   │   └── HelpRequestWorkspace.jsx
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   └── helpRequestConstants.js
│   │   │   │
│   │   │   ├── modals/
│   │   │   │   ├── HelpRequestDeleteModal.jsx
│   │   │   │   ├── HelpRequestDetailsModal.jsx
│   │   │   │   ├── HelpRequestEditModal.jsx
│   │   │   │   ├── HelpRequestModal.jsx
│   │   │   │   ├── HelpRequestModals.jsx
│   │   │   │   └── OrganizationInfoDrawer.jsx
│   │   │   │
│   │   │   └── utils/
│   │   │       └── helpRequestUtils.js
│   │   │
│   │   ├── myVolunteerActivities/
│   │   │   ├── MyVolunteerActivities.jsx
│   │   │   │
│   │   │   └── api/
│   │   │       └── volunteerApi.js
│   │   │
│   │   ├── notifications/
│   │   │   └── IndividualNotifications.jsx
│   │   │
│   │   ├── profile/
│   │   │   └── IndividualProfile.jsx
│   │   │
│   │   └── settings/
│   │       └── IndividualSettings.jsx
│   │
│   └── organization/
│       ├── campaigns/
│       │   ├── OrgCampaigns.jsx
│       │   │
│       │   ├── components/
│       │   │   ├── CampaignCard.jsx
│       │   │   ├── CampaignEmptyState.jsx
│       │   │   ├── CampaignFilters.jsx
│       │   │   ├── CampaignIdentity.jsx
│       │   │   ├── CampaignList.jsx
│       │   │   ├── CampaignMeta.jsx
│       │   │   ├── CampaignOverview.jsx
│       │   │   ├── CampaignPageHeader.jsx
│       │   │   ├── CampaignPagination.jsx
│       │   │   ├── CampaignProgress.jsx
│       │   │   └── LinkedHelpRequest.jsx
│       │   │
│       │   └── modals/
│       │       └── CampaignCreateModal.jsx
│       │
│       ├── dashboard/
│       │   └── OrgDashboard.jsx
│       │
│       ├── helpRequests/
│       │   ├── OrgHelpRequests.jsx
│       │   │
│       │   ├── api/
│       │   │   └── helpRequestApi.js
│       │   │
│       │   ├── components/
│       │   │   ├── CaseReviewDrawer.jsx
│       │   │   ├── CategoryTabs.jsx
│       │   │   ├── Filters.jsx
│       │   │   ├── Pagination.jsx
│       │   │   ├── Stats.jsx
│       │   │   ├── Table.jsx
│       │   │   └── UrgencyBadge.jsx
│       │   │
│       │   ├── modals/
│       │   │   ├── RejectionModal.jsx
│       │   │   └── WithdrawalModal.jsx
│       │   │
│       │   └── utils/
│       │       └── helpRequestUtils.js
│       │
│       ├── notification/
│       │   └── OrgNotifications.jsx
│       │
│       ├── profile/
│       │   └── OrgProfile.jsx
│       │
│       ├── reports/
│       │   └── OrgReports.jsx
│       │
│       ├── settings/
│       │   └── OrgSettings.jsx
│       │
│       └── volunteers/
│           ├── OrgVolunteers.jsx
│           │
│           └── api/
│               └── volunteerApi.js
│
├── data/
│   ├── campaigns.js
│   ├── mockAdmin.js
│   ├── mockIndividual.js
│   ├── mockOrganization.js
│   ├── selectors.js
│   └── urgencyStyleMap.js
│
├── layouts/
│   ├── AuthLayout/
│   │   └── AuthLayout.jsx
│   │
│   ├── DashboardLayout/
│   │   ├── DashboardLayout.jsx
│   │   ├── DashboardMobileNav.jsx
│   │   ├── DashboardSidebar.jsx
│   │   └── DashboardTopbar.jsx
│   │
│   └── PublicLayout/
│       ├── PublicLayout.jsx
│       │
│       ├── footer/
│       │   ├── Footer.jsx
│       │   └── data/
│       │       └── data.js
│       │
│       └── navbar/
│           ├── MegaMenu.jsx
│           ├── Navbar.jsx
│           ├── NavMenu.jsx
│           └── data/
│               └── navLinks.js
│
├── pages/
│   ├── EmptyStateIllustration.jsx
│   ├── NotFound.jsx
│   │
│   └── public/
│       ├── about/
│       │   ├── About.jsx
│       │   │
│       │   └── sections/
│       │       ├── AboutImpactSection.jsx
│       │       ├── AboutIntroSection.jsx
│       │       ├── AboutPurposeCard.jsx
│       │       ├── AboutPurposeSection.jsx
│       │       ├── BePartOfChange.jsx
│       │       │
│       │       └── data/
│       │           ├── aboutImpactStats.js
│       │           ├── aboutPurposeCards.js
│       │           └── aboutStats.js
│       │
│       ├── campaignsPage/
│       │   ├── Campaigns.jsx
│       │   │
│       │   ├── campaignDetails/
│       │   │   ├── CampaignDetails.jsx
│       │   │   │
│       │   │   └── components/
│       │   │       ├── CampaignMainContent.jsx
│       │   │       ├── CampaignStory.jsx
│       │   │       └── DonationSidebar.jsx
│       │   │
│       │   └── sections/
│       │       ├── CampaignCard.jsx
│       │       ├── HeroSection.jsx
│       │       ├── Pagination.jsx
│       │       └── SearchBar.jsx
│       │
│       ├── categoriesPage/
│       │   ├── CategoriesPage.jsx
│       │   │
│       │   ├── hooks/
│       │   │   └── useActiveCategory.js
│       │   │
│       │   └── sections/
│       │       ├── AllCategoriesView.jsx
│       │       ├── CategoryGrid.jsx
│       │       ├── CategoryGridPreview.jsx
│       │       ├── CategoryHeader.jsx
│       │       ├── CategorySidebar.jsx
│       │       ├── CategoryView.jsx
│       │       ├── UrgentRail.jsx
│       │       └── UrgentView.jsx
│       │
│       ├── donationPage/
│       │   ├── Donate.jsx
│       │   ├── PaymentResult.jsx
│       │   │
│       │   └── DonateHub/
│       │       ├── DonateHub.jsx
│       │       │
│       │       └── components/
│       │           ├── BrowseCTA.jsx
│       │           ├── CategoryQuickAccess.jsx
│       │           ├── DonateHero.jsx
│       │           ├── FeaturedSection.jsx
│       │           └── UrgentSection.jsx
│       │
│       ├── home/
│       │   ├── Home.jsx
│       │   │
│       │   └── sections/
│       │       ├── exploreCategories/
│       │       │   ├── ExploreAllCategoriesCta.jsx
│       │       │   ├── ExploreCategories.jsx
│       │       │   ├── LeftPanel.jsx
│       │       │   └── RightPanel.jsx
│       │       │
│       │       ├── featuredCampaign/
│       │       │   ├── CampaignHeader.jsx
│       │       │   ├── CampaignStory.jsx
│       │       │   ├── DonationCard.jsx
│       │       │   ├── FeaturedCampaign.jsx
│       │       │   ├── ImpactRibbon.jsx
│       │       │   ├── ProgressBar.jsx
│       │       │   │
│       │       │   ├── data/
│       │       │   │   └── statsData.js
│       │       │   │
│       │       │   └── WaveProgressIndicator/
│       │       │       ├── WaveProgressIndicator.css
│       │       │       └── WaveProgressIndicator.jsx
│       │       │
│       │       ├── hero/
│       │       │   └── HeroStats.jsx
│       │       │
│       │       ├── howItWorks/
│       │       │   ├── HowItWorks.jsx
│       │       │   ├── WorkflowCard.jsx
│       │       │   ├── WorkflowGrid.jsx
│       │       │   ├── WorkflowLink.jsx
│       │       │   │
│       │       │   └── data/
│       │       │       └── workingSteps.js
│       │       │
│       │       ├── impactTrust/
│       │       │   ├── FinalCTA.jsx
│       │       │   ├── HumanProof.jsx
│       │       │   ├── ImpactTrust.jsx
│       │       │   ├── StoriesPreview.jsx
│       │       │   │
│       │       │   └── data/
│       │       │       └── storiesData.js
│       │       │
│       │       └── localImpact/
│       │           ├── LeftPanel.jsx
│       │           ├── LocalImpact.jsx
│       │           ├── RightPanel.jsx
│       │           │
│       │           └── data/
│       │               ├── impactData.js
│       │               ├── impactStats.js
│       │               └── pulseStats.js
│       │
│       ├── howItWorksPage/
│       │   ├── HowItWorksPage.jsx
│       │   │
│       │   └── sections/
│       │       ├── FinalCTA.jsx
│       │       ├── HowItWorksPageHero.jsx
│       │       ├── ProblemContext.jsx
│       │       ├── SystemOverview.jsx
│       │       │
│       │       ├── processScene/
│       │       │   ├── ProcessScene.jsx
│       │       │   ├── ProcessScenes.jsx
│       │       │   │
│       │       │   ├── data/
│       │       │   │   └── scenes.js
│       │       │   │
│       │       │   └── diagrams/
│       │       │       ├── Diagram.jsx
│       │       │       ├── PriorityDiagram.jsx
│       │       │       ├── TrustDiagram.jsx
│       │       │       ├── UnderstandingDiagram.jsx
│       │       │       │
│       │       │       └── NetworkDiagram/
│       │       │           ├── data.js
│       │       │           ├── NetworkDiagram.jsx
│       │       │           └── NetworkNodes.jsx
│       │       │
│       │       └── RoleBasedView/
│       │           ├── data.js
│       │           └── RoleBasedView.jsx
│       │
│       ├── partnersPage/
│       │   ├── Partner.jsx
│       │   │
│       │   └── components/
│       │       ├── PartnerFAQ.jsx
│       │       ├── PartnerForm.jsx
│       │       ├── PartnerHero.jsx
│       │       ├── PartnerImpact.jsx
│       │       ├── PartnerModels.jsx
│       │       └── PartnerTypes.jsx
│       │
│       ├── requestHelpPage/
│       │   ├── RequestHelp.jsx
│       │   │
│       │   └── components/
│       │       ├── RequestForm.jsx
│       │       ├── RequestHero.jsx
│       │       ├── RequestInfo.jsx
│       │       ├── RequestInput.jsx
│       │       ├── RequestSuccessModal.jsx
│       │       ├── RequestTypeSelector.jsx
│       │       └── UrgencySelector.jsx
│       │
│       ├── storiesPage/
│       │   └── Stories.jsx
│       │
│       └── volunteerPage/
│           ├── Volunteer.jsx
│           │
│           └── components/
│               ├── VolunteerBenefits.jsx
│               ├── VolunteerCTA.jsx
│               ├── VolunteerFAQ.jsx
│               ├── VolunteerForm.jsx
│               ├── VolunteerHero.jsx
│               ├── VolunteerJourney.jsx
│               ├── VolunteerRoles.jsx
│               └── VolunteerStories.jsx
│
├── routes/
│   ├── dashboardNav.js
│   ├── ProtectedRoute.jsx
│   └── Router.jsx
│
├── styles/
│   └── index.css
│
└── utils/
    └── auth.js
```

---

## Homepage Location

The current public homepage is located at:

```text
frontend/src/pages/public/home/Home.jsx
```

Homepage sections are located under:

```text
frontend/src/pages/public/home/sections/
```

The homepage currently contains these section areas:

```text
exploreCategories/
featuredCampaign/
hero/
howItWorks/
impactTrust/
localImpact/
```

---

## Public Layout

The public website layout is located at:

```text
frontend/src/layouts/PublicLayout/
```

It contains:

```text
PublicLayout.jsx

navbar/
├── MegaMenu.jsx
├── Navbar.jsx
├── NavMenu.jsx
└── data/
    └── navLinks.js

footer/
├── Footer.jsx
└── data/
    └── data.js
```

---

## Public API Layer

The frontend API directory is:

```text
frontend/src/api/
```

Current files:

```text
categories.js
client.js
individualAPI.js
notificationApi.js
publicCampaignsApi.js
```

For public homepage work, only the files confirmed by the actual homepage dependency chain should be inspected.

---

## Global Styling

The current global stylesheet is:

```text
frontend/src/styles/index.css
```

Shared UI components are located at:

```text
frontend/src/components/
```

These include:

```text
Badge.jsx
Button.jsx
Hero.jsx
SectionHeading.jsx
StatCard.jsx
StatValue.jsx
```

Motion utilities are located at:

```text
frontend/src/components/motion/
```

---

## Routing

The main frontend routing configuration is:

```text
frontend/src/routes/Router.jsx
```

Other routing-related files:

```text
frontend/src/routes/dashboardNav.js
frontend/src/routes/ProtectedRoute.jsx
```

The router should be inspected when confirming how the public homepage is mounted.

---

## Homepage Content and Language Rule

The public website should preserve the established SP content strategy.

* Do not arbitrarily rewrite or translate existing public-site content.
* English is used for the main public-site content/UI.
* The centralized humanitarian category system uses established Bangla visible names where applicable.
* Examples:

  * `education → শিক্ষা`
  * `healthcare → স্বাস্থ্যসেবা`
  * `food-assistance → খাদ্য`
  * `shelter → আশ্রয়`
  * `livelihood → জীবিকা`
  * `disaster-relief → দুর্যোগ সহায়তা`
  * `water-sanitation → বিশুদ্ধ পানি`
  * `child-support → শিশু সহায়তা`
* Do not create a new bilingual/i18n architecture unless explicitly requested.
* Do not replace established Bangla category names with arbitrary translations.
* Bangla typography must remain readable and properly supported.

---

## Responsive Design Rule

For public-site UI work, responsive behavior must be considered separately across:

```text
Mobile
Tablet
LG / Laptop
XL / Large Desktop
```

In particular:

* `lg` must not simply be treated as a smaller version of `xl`.
* Laptop widths must receive deliberate layout attention.
* Avoid oversized hero sections on laptops.
* Avoid excessive empty space.
* Avoid cramped columns.
* Avoid navigation collisions.
* Avoid horizontal overflow.
* Avoid image clipping and poor crops.
* Avoid CTA/button overflow.
* XL should use additional width intentionally rather than simply enlarging every element.

---

## Phase 1 Scope Reminder

The current development phase is:

**Public Homepage + Homepage-Related Backend**

Relevant frontend areas are primarily:

```text
pages/public/home/
layouts/PublicLayout/
routes/Router.jsx
api/
components/
styles/index.css
assets/home/
```

Other areas of the frontend are outside the current Phase 1 scope unless an actual dependency is confirmed.

Do not use this structure document as a reason to inspect or modify unrelated dashboard, authentication, donation, volunteer, or help-request functionality.

---

## Golden Rule

**The folder structure tells you where things are. The actual source files tell you how they work.**

Always inspect the actual implementation before proposing or making a change.
