// Mock data for Admin dashboard
// Replace with real Laravel API responses when backend is ready

export const mockAdminStats = {
  totalUsers: 4821,
  totalOrganizations: 138,
  pendingVerification: 12,       // used by AdminDashboard StatCard
  pendingHelpRequests: 47,
  activeCampaigns: 23,
  totalDonations: 2840000,
  donationsThisMonth: 384000,    // used by AdminDonations
  totalDonors: 1240,             // used by AdminDonations
  totalVolunteers: 612,
  activeVolunteersThisMonth: 87, // used by AdminVolunteers + AdminReports
  totalVolunteerHours: 9840,     // used by AdminVolunteers
  totalBeneficiaries: 18400,
  newUsersThisMonth: 243,        // used by AdminDashboard + AdminReports
  reportsGenerated: 31,          // used by AdminReports
};

export const mockAdminUsers = [
  { id: 'u1', name: 'Maria Santos',       email: 'maria.santos@email.com',         role: 'individual',   joinedDate: '2025-07-01', status: 'active' },
  { id: 'u2', name: 'Roberto Lim',        email: 'roberto.lim@email.com',           role: 'individual',   joinedDate: '2025-07-03', status: 'active' },
  { id: 'u3', name: 'Bayanihan Foundation',email: 'info@bayanihanfoundation.org',   role: 'organization', joinedDate: '2025-06-28', status: 'active' },
  { id: 'u4', name: 'Anna Cruz',          email: 'anna.cruz@email.com',             role: 'individual',   joinedDate: '2025-07-10', status: 'suspended' },
  { id: 'u5', name: 'Helping Hands PH',   email: 'contact@helpinghandsph.org',      role: 'organization', joinedDate: '2025-07-12', status: 'active' },
  { id: 'u6', name: 'Pedro Manalo',       email: 'pedro.manalo@email.com',          role: 'individual',   joinedDate: '2025-07-15', status: 'active' },
];

export const mockAdminOrganizations = [
  { id: 'org1', name: 'Bayanihan Foundation', type: 'Foundation',            contactEmail: 'info@bayanihanfoundation.org', verificationStatus: 'verified',   registeredDate: '2024-01-10' },
  { id: 'org2', name: 'Helping Hands PH',     type: 'NGO',                  contactEmail: 'contact@helpinghandsph.org',   verificationStatus: 'pending',    registeredDate: '2025-07-12' },
  { id: 'org3', name: 'Kabuhayan Center',      type: 'Non-Profit Organization', contactEmail: 'info@kabuhayan.org',        verificationStatus: 'pending',    registeredDate: '2025-07-20' },
  { id: 'org4', name: 'Green Earth PH',        type: 'Community Organization',  contactEmail: 'hello@greenearthph.org',    verificationStatus: 'verified',   registeredDate: '2024-06-05' },
  { id: 'org5', name: 'Alalay sa Buhay',       type: 'Charity',              contactEmail: 'alalay@email.com',             verificationStatus: 'unverified', registeredDate: '2025-08-01' },
];

export const mockAdminHelpRequests = [
  { id: 'hr1', title: 'School Supplies for 3 Children', requester: 'Maria Santos', category: 'Education', submittedDate: '2025-07-15', status: 'approved' },
  { id: 'hr2', title: 'Medical Assistance — Elderly Parent', requester: 'Maria Santos', category: 'Healthcare', submittedDate: '2025-08-01', status: 'pending' },
  { id: 'hr3', title: 'Food Assistance — Family of 6', requester: 'Juan Dela Cruz', category: 'Food Assistance', submittedDate: '2025-08-02', status: 'pending' },
  { id: 'hr4', title: 'Livelihood Support — Single Mother', requester: 'Ana Reyes', category: 'Livelihood', submittedDate: '2025-07-28', status: 'under_review' },
  { id: 'hr5', title: 'Shelter Repair After Typhoon', requester: 'Pedro Manalo', category: 'Disaster Relief', submittedDate: '2025-07-30', status: 'pending' },
  { id: 'hr6', title: 'Disability Aid for Child', requester: 'Liza Gomez', category: 'Healthcare', submittedDate: '2025-07-10', status: 'completed' },
];

export const mockAdminCampaigns = [
  { id: 'c1', title: 'Back to School Drive 2025', organization: 'Bayanihan Foundation', startDate: '2025-07-01', endDate: '2025-08-31', raised: 36000, status: 'active' },
  { id: 'c2', title: 'Community Food Bank — Q3',  organization: 'Bayanihan Foundation', startDate: '2025-07-15', endDate: '2025-09-15', raised:  9000, status: 'active' },
  { id: 'c3', title: 'Typhoon Preparedness Kit',  organization: 'SP Platform',          startDate: '2025-07-10', endDate: '2025-08-20', raised: 26400, status: 'active' },
  { id: 'c4', title: 'Medical Outreach — June',   organization: 'Bayanihan Foundation', startDate: '2025-06-01', endDate: '2025-06-30', raised: 24800, status: 'completed' },
  { id: 'c5', title: 'Flood Relief — 2025',       organization: 'Helping Hands PH',     startDate: '2025-04-01', endDate: '2025-05-15', raised: 78500, status: 'completed' },
];

export const mockAdminDonations = [
  { id: 'don1', donor: 'Maria Santos', amount: 200,  campaign: 'Back to School Drive',    date: '2025-07-28', status: 'completed' },
  { id: 'don2', donor: 'Roberto Lim',  amount: 1000, campaign: 'Typhoon Preparedness Kit', date: '2025-07-27', status: 'completed' },
  { id: 'don3', donor: 'Anonymous',    amount: 500,  campaign: 'Community Food Bank',       date: '2025-07-25', status: 'completed' },
  { id: 'don4', donor: 'Ana Reyes',    amount: 300,  campaign: 'Medical Outreach',          date: '2025-07-22', status: 'completed' },
  { id: 'don5', donor: 'Pedro Manalo', amount: 750,  campaign: 'Back to School Drive',      date: '2025-07-20', status: 'completed' },
];

export const mockAdminVolunteers = [
  { id: 'vol1', name: 'Juan dela Cruz', activity: 'Back to School Drive',  organization: 'Bayanihan Foundation', hours: 40, status: 'active' },
  { id: 'vol2', name: 'Ana Reyes',      activity: 'Medical Outreach',       organization: 'Bayanihan Foundation', hours: 32, status: 'active' },
  { id: 'vol3', name: 'Carlo Bautista', activity: 'Flood Relief — 2025',    organization: 'Helping Hands PH',     hours: 28, status: 'active' },
  { id: 'vol4', name: 'Mia Torres',     activity: 'Community Food Bank Q3', organization: null,                   hours: 24, status: 'inactive' },
];

export const mockAdminVerification = [
  { id: 'org2', organization: 'Helping Hands PH',     type: 'NGO',                    contactEmail: 'contact@helpinghandsph.org', submittedDate: '2025-07-12', status: 'pending' },
  { id: 'org3', organization: 'Kabuhayan Center',      type: 'Non-Profit Organization', contactEmail: 'info@kabuhayan.org',         submittedDate: '2025-07-20', status: 'pending' },
  { id: 'org6', organization: 'Sama-sama Foundation',  type: 'Foundation',             contactEmail: 'info@sama-sama.org',         submittedDate: '2025-08-02', status: 'pending' },
];

export const mockAdminActivity = [
  { id: 'a1', type: 'helpRequest', text: 'New help request submitted: "Food Assistance — Family of 6"', time: '1 hour ago' },
  { id: 'a2', type: 'organization', text: 'Organization "Kabuhayan Center" registered and awaiting verification', time: '3 hours ago' },
  { id: 'a3', type: 'donation', text: 'Donation of ₱1,000 received for Typhoon Preparedness Kit', time: '5 hours ago' },
  { id: 'a4', type: 'user', text: '12 new users registered today', time: '8 hours ago' },
  { id: 'a5', type: 'campaign', text: 'Campaign "Typhoon Preparedness Kit" reached 88% of goal', time: '1 day ago' },
  { id: 'a6', type: 'volunteer', text: '3 volunteers completed Medical Outreach — June', time: '2 days ago' },
];
