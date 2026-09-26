# STAND FOR PEOPLE (SP)
# PHASE 1 — HOMEPAGE CONTEXT

## 1. PHASE NAME

Phase 1:

PUBLIC HOMEPAGE + HOMEPAGE-RELATED BACKEND

---

# 2. PHASE OBJECTIVE

The objective of this phase is to make the public SP homepage:

- visually polished
- presentation-ready
- responsive
- reliable
- connected to the correct backend data
- consistent with the SP design identity

This phase is NOT a general SP redesign.

---

# 3. EXACT SCOPE

This phase includes ONLY:

1. Public homepage UI
2. Homepage components
3. Homepage layout
4. Homepage typography
5. Homepage spacing
6. Homepage animations
7. Homepage responsive behavior
8. Homepage categories
9. Homepage active campaigns
10. Homepage loading states
11. Homepage empty states
12. Homepage error states
13. Homepage API/data integration
14. Laravel backend logic directly required by homepage data
15. Public routes directly related to homepage

Anything unrelated should remain untouched.

---

# 4. OUT OF SCOPE

Do NOT work on these during Phase 1 unless the homepage explicitly depends on a specific issue:

- Admin dashboard
- Individual dashboard
- Organization dashboard
- Volunteer system
- Help Requests
- Donation system
- Authentication
- Email verification
- User management
- Organization management
- Admin campaign management
- Campaign verification workflow
- Unrelated backend refactoring

Do not use homepage work as an excuse to refactor the rest of the application.

---

# 5. HOMEPAGE PURPOSE

The homepage is PUBLIC.

A visitor should be able to understand:

- what Stand For People is
- what humanitarian problems it addresses
- how people can participate
- what causes are currently active
- how they can help
- where they can learn more

The homepage should feel like the public face of a serious humanitarian organization.

It should not feel like an authenticated dashboard.

---

# 6. CURRENT FRONTEND ARCHITECTURE

The actual repository files are authoritative.

Before changing anything, inspect the existing:

- homepage page/component
- homepage child components
- shared components used by homepage
- PublicLayout
- Navbar
- Footer
- router
- API/service files
- global CSS
- Tailwind configuration
- package.json

Do not assume the exact filenames or structure.

Use the actual uploaded project.

---

# 7. HOMEPAGE DATA FLOW

The homepage may consume backend data.

The expected conceptual flow is:

Database
↓
Laravel Model / Relationship
↓
Controller / Service
↓
Public API Route
↓
Frontend API service
↓
Homepage React component
↓
UI

Before changing an API, trace this entire flow.

Do not create a duplicate API if an appropriate existing public endpoint already exists.

---

# 8. ACTIVE CAMPAIGNS

The homepage may display active campaigns.

Campaign statuses are:

- unverified
- active
- rejected
- completed
- cancelled

For public homepage display:

Normally only:

`active`

campaigns should be displayed, subject to the existing backend/public visibility rules.

Do NOT publicly display:

- unverified campaigns
- rejected campaigns
- cancelled campaigns

unless an explicit requirement changes this rule.

The backend should remain authoritative for public eligibility.

---

# 9. CAMPAIGN INFORMATION

Only information appropriate for public visitors should be exposed.

Potential public campaign information may include things such as:

- title
- description
- category
- image
- location
- progress/goal information
- relevant dates
- public organization information where appropriate

Do not expose private/internal information.

Do not expose:

- passwords
- internal admin information
- private user information
- sensitive operational information
- unnecessary verification internals

Use the existing API response structure when possible.

---

# 10. CATEGORIES

The homepage may display the centralized SP categories.

Known finalized examples:

education → শিক্ষা

healthcare → স্বাস্থ্যসেবা

food-assistance → খাদ্য

shelter → আশ্রয়

livelihood → জীবিকা

disaster-relief → দুর্যোগ সহায়তা

water-sanitation → বিশুদ্ধ পানি

child-support → শিশু সহায়তা

child-support and the other finalized categories should use the actual current project data.

IMPORTANT:

Do not manually create a second category database inside React.

If categories are provided by the backend, use the existing backend/category implementation.

Do not create inconsistent spelling, slugs, or labels.

---

# 11. CATEGORY CENTRALIZATION

Category names should have one authoritative source.

Avoid patterns such as:

Component A:
`Education`

Component B:
`শিক্ষা`

Component C:
`education`

Component D:
another manually maintained category object

unless there is a clear architectural reason.

Prefer the existing centralized category implementation.

---

# 12. HOMEPAGE UI STYLE

The homepage should communicate:

- trust
- humanity
- dignity
- clarity
- warmth
- professionalism
- calmness

Visual direction:

Premium humanitarian NGO.

Minimal.

Elegant.

Whitespace-driven.

Story-driven.

Editorial where appropriate.

---

# 13. WHAT TO AVOID

Avoid making the homepage look like:

- generic SaaS
- admin dashboard
- startup landing page template
- excessive card grid
- overly rounded interface
- overly animated interface
- overly colorful interface
- generic Tailwind template

Avoid unnecessary:

- cards
- pills
- badges
- shadows
- gradients
- borders
- decorative elements

Every visual element should have a purpose.

---

# 14. COLOR IDENTITY

Use the existing SP visual identity:

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

Text:

#0f172a

Secondary text:

#64748b

Border:

#e2e8f0

Do not introduce blue as a primary color.

Do not replace the palette with a generic modern/SaaS palette.

---

# 15. TYPOGRAPHY

Use the existing typography direction:

- Poppins — body/UI
- Jost — subheadings where appropriate
- Fraunces — display/editorial headings
- Noto Sans Bengali — Bangla

Bangla typography must be treated as a first-class design requirement.

Do not solve Bangla readability by globally destroying the existing English typography.

Do not arbitrarily increase heading weights.

Preserve the visual character of the existing identity while improving readability.

---

# 16. RESPONSIVE REQUIREMENT

Responsive quality is one of the highest priorities of this phase.

The homepage must be intentionally considered at:

- mobile
- tablet
- LG/laptop
- XL/large desktop

IMPORTANT:

LG/laptop requires its own attention.

Do not assume:

`lg = simply smaller xl`

The LG/laptop version should be independently checked for:

- hero height
- typography scale
- horizontal spacing
- content width
- image proportions
- navigation
- section spacing
- card/content density
- CTA placement

XL should use additional screen width without making the entire page oversized.

---

# 17. RESPONSIVE FAILURE CASES TO AVOID

Avoid:

- horizontal scrolling
- text clipping
- overlapping elements
- oversized headings
- hero sections that consume the entire laptop screen
- huge empty spaces
- broken image crops
- cramped columns
- navigation collisions
- buttons overflowing containers
- excessively tall mobile sections

---

# 18. HOMEPAGE SECTION APPROACH

The exact current homepage sections must be inspected first.

Potential sections may include:

- Hero
- Mission/introduction
- Categories
- Active campaigns
- How it works
- Ways to help
- Impact
- CTA
- Footer

Do NOT automatically rebuild all sections.

First understand the existing homepage.

Then improve sections individually.

---

# 19. ANIMATION

Framer Motion is already available.

Use animation selectively.

Preferred characteristics:

- subtle
- smooth
- purposeful
- premium

Avoid:

- excessive movement
- constant motion
- bouncing everything
- animation on every element
- distracting entrance effects

Animation should improve hierarchy and perceived quality.

---

# 20. HOMEPAGE LOADING STATE

Dynamic homepage data must have a clear loading state.

The page should not look broken while campaigns/categories are loading.

Do not use an unnecessarily complex loading system.

---

# 21. HOMEPAGE EMPTY STATE

An empty state is different from an error.

If the API succeeds and returns no active campaigns:

This is an EMPTY state.

Do not present it as:

"Unable to load campaigns."

Instead, create a graceful presentation appropriate for the humanitarian homepage.

The rest of the homepage should remain functional.

---

# 22. HOMEPAGE ERROR STATE

If a homepage API request fails:

- show a graceful fallback
- do not expose Laravel errors
- do not expose SQL errors
- do not crash the entire homepage

Ideally, failure of one dynamic section should not destroy unrelated static sections.

For example:

Campaign API failure
↓
Campaign section shows fallback
↓
Hero/categories/other sections remain usable

---

# 23. BACKEND HOMEPAGE RULE

Only modify Laravel backend logic when it is actually necessary for the homepage.

Before creating or changing an endpoint:

1. Check existing routes.
2. Check existing controller methods.
3. Check existing services.
4. Check existing models.
5. Check existing API response structure.
6. Determine whether an existing endpoint can safely be reused.

If a new endpoint is genuinely needed, keep it focused on public homepage requirements.

Do NOT rewrite existing dashboard logic just to make the homepage easier.

---

# 24. API SAFETY

Public homepage endpoints should:

- work without authentication when intended
- return only public information
- respect campaign visibility rules
- respect existing business rules
- avoid private/internal data

Do not weaken authentication or authorization elsewhere to make a public endpoint work.

---

# 25. IMAGE HANDLING

Homepage images should:

- maintain good aspect ratios
- avoid layout shift
- crop gracefully
- remain visually balanced at LG/laptop
- remain visually balanced at XL
- use appropriate object positioning

Avoid forcing one image treatment across every breakpoint if that causes poor composition.

---

# 26. DEVELOPMENT METHOD

Work ONE homepage problem at a time.

Recommended sequence:

1. Understand current homepage.
2. Fix/improve one section.
3. Check the result.
4. Move to the next section.

Do not modify the entire homepage in one uncontrolled rewrite.

---

# 27. FILE CHANGE RULE

For every requested change:

- identify exact file(s)
- explain what needs changing
- modify only necessary files
- preserve unrelated components
- preserve existing API contracts unless a change is genuinely necessary

If an exact file is missing from the uploaded project:

Ask for that file.

Do not invent its contents.

---

# 28. FIRST TASK IN PHASE 1

The first task is NOT to redesign anything.

First:

Inspect all uploaded homepage-related files.

Then produce a concise map of:

1. Homepage component structure
2. Shared components used by homepage
3. Homepage API calls
4. Public Laravel routes used by homepage
5. Controllers involved
6. Services involved
7. Models involved
8. Category data flow
9. Campaign data flow
10. Current obvious problems

Do not modify code during this inspection.

Do not audit unrelated parts of SP.

---

# 29. DEFINITION OF DONE

Phase 1 should eventually result in:

- polished public homepage
- consistent SP visual identity
- strong humanitarian presentation
- clean typography
- readable Bangla typography
- good mobile layout
- good tablet layout
- polished LG/laptop layout
- polished XL layout
- no horizontal overflow
- active campaigns loading correctly
- categories loading correctly
- proper loading state
- proper empty state
- proper error state
- public API working correctly
- no unnecessary backend changes
- no dashboard regressions

---

# 30. PHASE 1 GOLDEN RULE

The homepage is being improved.

The rest of SP is being protected.

DO NOT break working functionality to make the homepage prettier.

Inspect first.

Understand the current implementation.

Then make one focused change at a time.