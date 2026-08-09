// Mock data for Organization dashboard
// Replace with real Laravel API responses when backend is ready

export const mockOrganization = {
  id: 'org_001',
  name: 'Bayanihan Foundation',
  email: 'info@bayanihanfoundation.org',
  phone: '+63 2 8123 4567',
  type: 'Foundation',
  registrationNumber: 'SEC-F-2018-00421',
  address: '45 Mabini Street, Manila, Philippines',
  website: 'https://bayanihanfoundation.org',
  verificationStatus: 'verified', // 'verified' | 'pending' | 'unverified'
  memberSince: '2024-01-10',
  focusAreas: ['Education', 'Food Relief', 'Livelihood Support'],
  communitiesServed: ['Children', 'Low-Income Families', 'Rural Communities'],
  teamSize: '11–50',
  mission:
    'To uplift marginalized Filipino communities through education, livelihood programs, and emergency relief assistance.',
  logo: null,
};

export const mockOrgCampaignSummary = {
  active: 3,
  completed: 12,
  totalBeneficiaries: 1840,
};

export const mockOrgCampaigns = [
  { id: 'c1', title: 'Back to School Drive 2025', status: 'active', beneficiaries: 320, budget: 50000, spent: 36000, deadline: '2025-08-31' },
  { id: 'c2', title: 'Community Food Bank — Q3', status: 'active', beneficiaries: 580, budget: 20000, spent: 9000, deadline: '2025-09-15' },
  { id: 'c3', title: 'Livelihood Training — Batch 3', status: 'active', beneficiaries: 45, budget: 15000, spent: 4500, deadline: '2025-10-01' },
  { id: 'c4', title: 'Medical Outreach — June', status: 'completed', beneficiaries: 410, budget: 25000, spent: 24800, deadline: '2025-06-30' },
  { id: 'c5', title: 'Flood Relief — 2025', status: 'completed', beneficiaries: 485, budget: 80000, spent: 78500, deadline: '2025-05-15' },
];

export const mockOrgVolunteerSummary = {
  total: 28,
  hoursThisMonth: 312,
  upcoming: 2,
};

export const mockOrgVolunteers = [
  { id: 'vol1', name: 'Juan dela Cruz', role: 'Field Coordinator', hours: 40, status: 'active' },
  { id: 'vol2', name: 'Ana Reyes', role: 'Medical Staff', hours: 32, status: 'active' },
  { id: 'vol3', name: 'Carlo Bautista', role: 'Logistics', hours: 28, status: 'active' },
  { id: 'vol4', name: 'Mia Torres', role: 'Teacher', hours: 24, status: 'inactive' },
];

export const mockOrgResponses = [
  { id: 'r1', helpRequest: 'School Supplies Request — Batangas', status: 'in_progress', assignedDate: '2025-07-20', lead: 'Ana Reyes' },
  { id: 'r2', helpRequest: 'Food Assistance — Families in Tondo', status: 'completed', assignedDate: '2025-06-15', lead: 'Juan dela Cruz' },
  { id: 'r3', helpRequest: 'Medical Assistance — Senior Citizens', status: 'pending', assignedDate: '2025-08-01', lead: null },
];

export const mockOrgImpact = {
  totalBeneficiaries: 1840,
  totalCampaigns: 15,
  totalVolunteerHours: 2840,
  communitiesReached: 12,
};

export const mockOrgActivity = [
  { id: 'a1', type: 'campaign', text: 'Campaign "Back to School Drive 2025" reached 72% of goal', time: '1 day ago' },
  { id: 'a2', type: 'volunteer', text: '3 new volunteers joined Livelihood Training team', time: '3 days ago' },
  { id: 'a3', type: 'response', text: 'Assigned to Help Request: Medical Assistance — Senior Citizens', time: '7 days ago' },
  { id: 'a4', type: 'campaign', text: 'Campaign "Medical Outreach — June" marked as completed', time: '1 month ago' },
];
