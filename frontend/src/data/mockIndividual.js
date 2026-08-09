// Mock data for Individual dashboard
// Replace with real Laravel API responses when backend is ready

export const mockIndividualUser = {
  id: 'usr_001',
  name: 'Maria Santos',
  email: 'maria.santos@email.com',
  phone: '+1 555 012 3456',
  district: 'Quezon City',
  address: '123 Sampaguita Street, Quezon City',
  profilePhoto: null,
  memberSince: '2024-03-15',
  preferences: {
    participationTypes: ['volunteer', 'donate'],
    causes: ['education', 'childWelfare', 'foodAssistance'],
  },
};

export const mockDonationSummary = {
  totalDonated: 1250.00,
  donationCount: 8,
  lastDonation: '2025-07-28',
};

export const mockDonations = [
  { id: 'd1', campaign: 'Back to School Drive', amount: 200, date: '2025-07-28', status: 'completed' },
  { id: 'd2', campaign: 'Flood Relief — Pampanga', amount: 500, date: '2025-06-10', status: 'completed' },
  { id: 'd3', campaign: 'Community Food Bank', amount: 150, date: '2025-05-22', status: 'completed' },
  { id: 'd4', campaign: 'Medical Aid Fund', amount: 300, date: '2025-04-05', status: 'completed' },
  { id: 'd5', campaign: 'Livelihood Training', amount: 100, date: '2025-03-18', status: 'completed' },
];

export const mockVolunteerSummary = {
  totalHours: 38,
  activitiesCount: 5,
  nextActivity: 'Aug 15, 2025',
};

export const mockVolunteerActivities = [
  { id: 'v1', activity: 'Food Packing Drive', date: '2025-08-15', location: 'Quezon City', status: 'upcoming', hours: null },
  { id: 'v2', activity: 'Community Clean-up', date: '2025-07-20', location: 'Marikina', status: 'completed', hours: 6 },
  { id: 'v3', activity: 'Teaching Support', date: '2025-07-05', location: 'Pasay', status: 'completed', hours: 8 },
  { id: 'v4', activity: 'Medical Outreach', date: '2025-06-12', location: 'Caloocan', status: 'completed', hours: 10 },
  { id: 'v5', activity: 'Relief Pack Assembly', date: '2025-05-30', location: 'Taguig', status: 'completed', hours: 7 },
];

export const mockHelpRequestSummary = {
  total: 2,
  pending: 1,
  approved: 1,
  completed: 0,
};

export const mockHelpRequests = [
  {
    id: 'hr1',
    title: 'School Supplies for 3 Children',
    category: 'Education',
    submittedDate: '2025-07-15',
    status: 'approved',
    notes: 'Assigned to Back to School Drive campaign.',
  },
  {
    id: 'hr2',
    title: 'Medical Assistance — Elderly Parent',
    category: 'Healthcare',
    submittedDate: '2025-08-01',
    status: 'pending',
    notes: 'Under review by SP Admin.',
  },
];

export const mockActiveCampaigns = [
  { id: 'c1', title: 'Back to School Drive 2025', category: 'Education', progress: 72, goal: 50000, raised: 36000, deadline: '2025-08-31' },
  { id: 'c2', title: 'Community Food Bank — Q3', category: 'Food Assistance', progress: 45, goal: 20000, raised: 9000, deadline: '2025-09-15' },
  { id: 'c3', title: 'Typhoon Preparedness Kit', category: 'Disaster Relief', progress: 88, goal: 30000, raised: 26400, deadline: '2025-08-20' },
];

export const mockIndividualActivity = [
  { id: 'a1', type: 'donation', text: 'Donated ₱200 to Back to School Drive', time: '2 days ago' },
  { id: 'a2', type: 'helpRequest', text: 'Help request "Medical Assistance" submitted', time: '7 days ago' },
  { id: 'a3', type: 'volunteer', text: 'Signed up for Food Packing Drive on Aug 15', time: '10 days ago' },
  { id: 'a4', type: 'donation', text: 'Donated ₱500 to Flood Relief — Pampanga', time: '1 month ago' },
];
