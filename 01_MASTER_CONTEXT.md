# STAND FOR PEOPLE (SP)
# MASTER PROJECT CONTEXT

## 1. PROJECT IDENTITY

Project name: Stand For People (SP)

Current project phrase:

Centralized Humanitarian Coordination Platform

SP is a humanitarian platform designed to coordinate people who need help, volunteers, organizations, campaigns, and donors through one centralized system.

This is an EXISTING software project.

The goal is to continue developing and improving the existing system.

DO NOT treat this as a greenfield project.

---

# 2. CORE DEVELOPMENT PRINCIPLE

The existing application contains working functionality.

Therefore:

- Preserve working functionality.
- Inspect existing code before changing it.
- Make small, focused changes.
- Do not rewrite large parts of the application unnecessarily.
- Do not invent architecture when an existing implementation already works.
- Do not introduce unnecessary dependencies.
- Do not change unrelated functionality.
- Do not modify backend business rules merely to make frontend development easier.

When a requested change can be made without touching the backend, prefer not touching the backend.

When backend changes are genuinely necessary, modify only the relevant part.

---

# 3. TECHNOLOGY STACK

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React

## Backend

- Laravel 12
- PHP
- Laravel Sanctum
- PostgreSQL
- Aiven PostgreSQL

The frontend and backend are deployed separately.

Frontend deployment:

https://foundation-management-system.vercel.app

Backend deployment:

https://stand-for-people-api.onrender.com

Old frontend URL:

https://standforpeople.vercel.app

---

# 4. APPLICATION ROLES

The application has exactly these primary roles:

- admin
- individual
- organization

IMPORTANT:

Volunteer is NOT an application role.

An individual user can have a Volunteer profile.

Do not introduce a separate volunteer role unless explicitly requested.

---

# 5. MAJOR SYSTEM AREAS

The existing SP application contains functionality related to:

- Public website
- Authentication
- Admin dashboard
- Individual dashboard
- Organization dashboard
- Users
- Organizations
- Campaigns
- Categories
- Volunteers
- Help Requests
- Donations
- Email verification

These areas are connected, but they should NOT all be modified at once.

Work should be divided into clearly defined phases.

---

# 6. CAMPAIGN WORKFLOW

Campaign statuses:

- unverified
- active
- rejected
- completed
- cancelled

Expected transitions:

unverified
→ active
→ completed

unverified
→ rejected

active
→ cancelled

Do not introduce a `pending_review` campaign status.

For public-facing pages, campaigns should normally only be publicly displayed when their status is `active`, subject to the existing backend/public visibility rules.

---

# 7. CAMPAIGN TYPES

Existing campaign types:

- local_case
- organization_proposed
- global_situation

Do not invent additional campaign types unless explicitly requested.

---

# 8. HELP REQUEST WORKFLOW

Help Request statuses:

- pending
- verified
- rejected
- completed

Expected flow:

pending
→ verified
→ completed

pending
→ rejected

Individual users can edit/delete Help Requests only while pending.

Urgency is handled after verification according to the existing business rules.

Assignments are separate from the Help Request's main status.

Assignment flow:

assigned
→ accepted
→ in_progress
→ completed

An assignment can also be rejected.

Do not modify this workflow unless the current task explicitly concerns Help Requests.

---

# 9. VOLUNTEER SYSTEM

Volunteer is a profile/functionality associated with an individual user, not a role.

Volunteer request statuses:

- pending
- accepted
- rejected
- cancelled

Individual application:

individual
→ sends request
→ admin receives request

Individual sees:

- Pending
- Cancel Request

Admin sees:

- Pending
- Accept
- Reject

Admin acceptance creates an active Volunteer profile.

Admin rejection sets the request to rejected.

Admin invitation:

admin
→ sends invitation
→ individual receives invitation

Individual can:

- Accept
- Reject

Individual does NOT see Cancel Request for an admin invitation.

Volunteer profile statuses:

- active
- inactive
- suspended

Suspended volunteers are not eligible for volunteer assignment.

Do not modify this system during unrelated work.

---

# 10. DONATION SYSTEM

The project uses SSLCOMMERZ for donations.

Donation attempts are handled through the DonationAttempt model/system.

The donations database workflow has been changed so that payment attempts are handled separately rather than relying on a simple donation status field.

For authenticated individual users, the desired donation flow uses their stored account information rather than unnecessarily asking them to enter their name/email again.

Do not modify donation logic during unrelated work.

---

# 11. EMAIL VERIFICATION

Individual users are required to verify their email according to the existing authentication/business rules.

The application has email verification functionality.

Existing verification endpoint pattern:

`/api/email/verify/{id}/{hash}`

Verification expiry was configured for 10 minutes.

Do not modify authentication/email verification during unrelated work.

---

# 12. CATEGORY SYSTEM

SP uses centralized categories.

Category names should have stable English slugs and user-facing names.

Known finalized category examples include:

- education → শিক্ষা
- healthcare → স্বাস্থ্যসেবা
- food-assistance → খাদ্য
- shelter → আশ্রয়
- livelihood → জীবিকা
- disaster-relief → দুর্যোগ সহায়তা
- water-sanitation → বিশুদ্ধ পানি
- child-support → শিশু সহায়তা

There are additional finalized categories in the current project.

IMPORTANT:

Do not invent a second category system.

Do not duplicate category names independently across many frontend components.

Use the existing centralized category implementation/data when available.

The current database/backend should be treated as the source of truth for the actual existing category data.

---

# 13. UI / DESIGN IDENTITY

SP should look like a:

- premium humanitarian NGO
- trustworthy organization
- calm and human platform
- elegant editorial website
- story-driven humanitarian platform

The design should NOT look like a generic SaaS dashboard.

Avoid:

- excessive cards
- excessive rounded containers
- excessive shadows
- excessive gradients
- excessive badges
- dense dashboard-style layouts
- unnecessary visual decoration
- generic startup/SaaS aesthetics

The interface should use whitespace intentionally.

The design should feel human rather than overly technical.

---

# 14. COLOR SYSTEM

Current visual identity:

Primary:

#0f766e

Primary hover:

#115e59

Accent:

#f59e0b

Background:

#f6f8fb

Alternative background:

#eef2f6

Surface:

#ffffff

Main text:

#0f172a

Secondary text:

#64748b

Border:

#e2e8f0

IMPORTANT:

Do not introduce blue as the primary visual identity.

Do not replace this visual language with an unrelated palette without explicit instruction.

---

# 15. TYPOGRAPHY

The existing visual identity uses:

- Poppins for body/UI text
- Jost for subheadings where appropriate
- Fraunces for display/editorial headings
- Noto Sans Bengali for Bangla typography where appropriate

Typography should remain elegant and readable.

Do not globally replace the typography without a clear reason.

Be particularly careful with Bangla typography.

---

# 16. RESPONSIVE DESIGN

Responsive design is a high priority throughout the public website.

Always consider:

- mobile
- tablet
- LG/laptop
- XL/large desktop

IMPORTANT:

LG/laptop and XL are NOT the same layout.

LG/laptop screens should receive deliberate attention.

Common laptop widths must not result in:

- oversized hero sections
- excessive empty space
- cramped content
- navigation collisions
- awkward image cropping
- excessively tall sections
- desktop layouts designed only for very wide monitors

XL should use additional horizontal space intentionally without simply scaling everything larger.

Avoid horizontal overflow at every breakpoint.

---

# 17. CODE CHANGE RULES

Before modifying code:

1. Inspect the actual current implementation.
2. Identify the exact file(s) involved.
3. Understand the existing data flow.
4. Make the smallest reasonable change.
5. Preserve existing behavior outside the requested task.

Do not assume a route exists.

Do not assume an API endpoint exists.

Do not assume a database column exists.

Do not assume a component exists.

Do not invent missing code when the actual project files can be inspected.

---

# 18. FILE-BASED DEVELOPMENT RULE

The uploaded/current project files are authoritative.

If a file has not been provided and its contents are necessary for a safe change:

- identify the exact file needed
- ask for that file
- do not invent its contents

Do not pretend to have inspected files that were not provided.

---

# 19. TESTING / VERIFICATION

After a change, verify the affected functionality.

For frontend changes, consider:

- rendering
- routing
- API integration
- responsive behavior
- loading states
- empty states
- error states
- console errors

For backend changes, consider:

- route
- controller
- service
- model
- database compatibility
- API response
- authentication/public accessibility
- existing business rules

Do not claim something was tested if it was not actually tested.

---

# 20. BACKEND SAFETY

This is extremely important.

Do not modify working backend logic simply because a frontend page needs visual changes.

Especially avoid unrelated changes to:

- authentication
- admin dashboard
- individual dashboard
- organization dashboard
- volunteer system
- Help Requests
- donations
- email verification
- campaign verification
- user management

If a public website feature requires backend work, isolate the backend change to the functionality actually needed.

---

# 21. RECENT DATABASE HISTORY

The project recently experienced a database/data disruption during development.

At one point, Aiven data was found missing, including users, organizations, and campaigns.

Therefore:

- do not assume test/production data exists
- do not hardcode fake database data into frontend production logic
- inspect the current database/migrations before assuming fields exist
- do not unnecessarily alter database schema
- use controlled test data when testing requires records

The current repository and current database state are more authoritative than historical assumptions.

---

# 22. DEVELOPMENT STYLE

The preferred development style is:

- one issue at a time
- small focused edits
- exact files identified
- minimal changes
- preserve existing architecture
- avoid unnecessary refactors

Do not perform a broad code audit unless explicitly requested.

Do not fix unrelated problems just because they are noticed.

---

# 23. PROJECT PHASING

SP development is intentionally divided into phases.

Each phase should have:

- a defined scope
- relevant files
- relevant backend logic
- specific UI goals
- specific testing goals

Do not expand the current phase without explicit instruction.

The current phase is defined in:

`02_HOMEPAGE_CONTEXT.md`

That file is authoritative for the homepage phase.

---

# 24. GOLDEN RULE

When uncertain:

PRESERVE WORKING FUNCTIONALITY.

Do not rebuild SP.

Do not make unrelated changes.

Do not guess.

Inspect first, then make the smallest focused change required.