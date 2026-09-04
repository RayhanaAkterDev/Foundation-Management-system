# 🛡️ Admin Dashboard — Complete Help Request (HR) Workflow

## 1. Help Requests Page

The Admin goes to:

**Dashboard → Help Requests**

This page contains **all help requests submitted by individuals**.

### Page contains:

- **Help Requests** heading
- Short description
- Search
- Status filters
- Urgency filters
- Request summary/counts
- Help Request table

### HR Table

| Help Request | Submitted | Urgency | Status | Assigned | Action |
|---|---|---|---|---|---|

The **Assigned** field is always visible.

---

# 2. Individual Submits a Help Request

When an individual submits a new request, it enters the Admin system as:

**Status:** `Pending`  
**Assigned:** `Not assigned`

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Pending | Not assigned | View · Edit · Verify |

The Admin receives the request for review.

---

# 3. Admin Reviews a Pending Request

The Admin clicks:

**View**

The Help Request Details should show the complete request information:

- Request title
- Description
- Category
- People affected
- Amount needed
- Location
- Urgency
- Supporting information
- Attachments
- Submitted date
- Individual information
- Current verification status
- Assignment information

The Admin reviews the request before making a verification decision.

---

# 4. Pending Request — Admin Actions

While the request is still:

**Status:** `Pending`

The Admin can:

- **View**
- **Edit**
- **Verify**

### Edit

Admin can correct/update permitted request information when necessary.

### Verify

If the request is legitimate and eligible for assistance, Admin verifies it.

### Reject

If the request is not eligible or cannot be verified, Admin rejects it.

So the verification flow is:

```text
Pending
   │
   ├── Verify → Verified
   │
   └── Reject → Rejected
```

---

# 5. Admin Verifies the Request

When Admin verifies:

```text
Pending → Verified
```

The request is now eligible to move into the assistance/assignment process.

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Verified | Not assigned | View · Edit · Assign |

### Important

Verification does **NOT** mean that an organization has been assigned.

The request is verified, but:

**Assigned:** `Not assigned`

---

# 6. Verified Request — Waiting for Assignment

After verification:

**Status:** `Verified`  
**Assigned:** `Not assigned`

The Admin can:

- View
- Edit
- Assign an organization
- Assign/add volunteer support when appropriate

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Verified | Not assigned | View · Edit · Assign |

---

# 7. Admin Assigns an Organization

Admin clicks:

**Assign**

The Admin selects an eligible organization and can provide an assignment note.

Example:

```text
Help Request:
Medical Support

Organization:
Hope Foundation

Assignment Note:
Please review and confirm whether your team can provide
the required medical assistance.
```

Then Admin sends the assignment request.

### IMPORTANT

Sending the assignment request does **NOT** immediately mean:

**Assigned = Hope Foundation**

Instead, the organization must first accept the assignment.

So internally the flow is:

```text
Verified
   ↓
Assignment request sent
   ↓
Waiting for organization response
```

The organization sees the request as a pending assignment.

---

# 8. Organization Accepts the Assignment

When the organization accepts:

```text
Assignment Pending → Accepted
```

Only now is the organization officially assigned to the help request.

The Admin table can now show:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Verified | Hope Foundation | View · Edit · Reassign · Add Support |

### Important rule

**Organization name should NOT appear in the Assigned field before the organization accepts.**

Before acceptance:

```text
Assigned: Not assigned
```

After acceptance:

```text
Assigned: Hope Foundation
```

---

# 9. Organization Rejects the Assignment

The organization may reject the assignment.

Example:

```text
Verified
   ↓
Assignment sent
   ↓
Organization rejects
```

The help request itself is **not rejected**.

Only the organization's assignment is rejected.

The Admin can then assign another eligible organization.

Example:

```text
Hope Foundation
      ↓
   Rejected
      ↓
Admin assigns another organization
      ↓
Helping Hands Foundation
```

The individual continues to have the same help request.

---

# 10. Assigned Organization Starts Assistance

After an organization accepts the assignment, it can begin handling the request.

The request moves into the active assistance stage.

From the Admin's perspective, the request can now be treated as:

**In Progress / Active**

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | In Progress | Hope Foundation | View |

The Admin can monitor the request and its progress.

---

# 11. Assistance Is In Progress

While the organization is handling the case:

**Status:** `In Progress`

**Assigned:** Organization name

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | In Progress | Hope Foundation | View |

Admin can view:

- Request details
- Individual information
- Assigned organization
- Assignment information
- Progress/updates
- Assistance history
- Current status

The Admin monitors the case rather than manually changing it without a valid reason.

---

# 12. Add Support

Sometimes the assigned organization may need additional support.

For example:

- Additional volunteers
- Additional organizational support
- Extra assistance required for the case

The organization can request additional support.

Only when such a request exists should Admin's:

**Add Support**

action actually perform that workflow.

### If no support request exists:

Admin should see:

> **The initial organization has not requested additional support. Add Support is not available.**

### If additional support is requested:

Admin can review the request and arrange the required support.

---

# 13. Organization Requests Withdrawal

An assigned organization may determine that it can no longer continue handling the request.

It can request withdrawal.

The request then enters:

**Withdrawal**

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Withdrawal | Hope Foundation | View · Reassign |

The Admin can review the withdrawal and arrange reassignment.

---

# 14. Reassignment

Reassignment should **not** be available simply because Admin wants to switch organizations.

The initial organization must first request withdrawal.

### If no withdrawal request exists:

When Admin tries to reassign, show:

> **The initial organization has not requested withdrawal. Reassignment is not available.**

### If withdrawal has been requested:

Admin can select another eligible organization.

Example:

```text
Hope Foundation
      ↓
Withdrawal requested
      ↓
Admin reviews
      ↓
Reassign
      ↓
Helping Hands Foundation
```

After the new organization accepts the assignment:

**Assigned:** `Helping Hands Foundation`

The request continues toward assistance.

---

# 15. Request Returns to In Progress

After reassignment and acceptance:

```text
Withdrawal
    ↓
New organization accepts
    ↓
In Progress
```

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | In Progress | Helping Hands Foundation | View |

The new organization becomes the current assigned organization.

---

# 16. Assistance Is Completed

When the assigned organization successfully finishes the assistance:

```text
In Progress → Complete
```

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Complete | Helping Hands Foundation | View |

The Admin can view:

- Original request
- Individual information
- Assigned organization
- Assistance details
- Progress/history
- Completion information
- Completion date

The request is now closed.

---

# 17. Admin Rejects the Help Request

The other verification path is:

```text
Pending → Rejected
```

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Rejected | Not assigned | View · Edit |

The Admin should provide a rejection reason/note when rejecting.

The individual can see the rejection information from their own dashboard.

### Important

A rejected help request:

- Has no assigned organization
- Does not enter the assistance workflow
- Cannot be assigned to an organization
- Is no longer editable/deletable by the individual

---

# 18. Admin Table Action Rules

The Admin's available actions should depend on the current HR state.

### Pending

```text
View · Edit · Verify
```

**Status:** Pending  
**Assigned:** Not assigned

---

### Verified — Not Assigned

```text
View · Edit · Assign
```

**Status:** Verified  
**Assigned:** Not assigned

---

### Verified — Organization Assigned

```text
View · Edit · Reassign · Add Support
```

**Status:** Verified  
**Assigned:** Organization name

But:

- Reassign only when withdrawal has been requested
- Add Support only when additional support has been requested

---

### In Progress

```text
View
```

**Status:** In Progress  
**Assigned:** Organization name

Admin monitors the active assistance.

---

### Withdrawal

```text
View · Reassign
```

**Status:** Withdrawal  
**Assigned:** Current organization

Reassignment is available because the organization has requested withdrawal.

---

### Complete

```text
View
```

**Status:** Complete  
**Assigned:** Organization name

The case is finished.

---

### Rejected

```text
View · Edit
```

**Status:** Rejected  
**Assigned:** Not assigned

No organization assignment is available.

---

# 19. Admin HR Status Rules

| HR State | Status | Assigned | Main Admin Action |
|---|---|---|---|
| Newly submitted | **Pending** | Not assigned | View · Edit · Verify |
| Waiting for verification | **Pending** | Not assigned | View · Edit · Verify |
| Verified, no organization | **Verified** | Not assigned | View · Edit · Assign |
| Assignment sent, awaiting acceptance | **Verified** | Not assigned | View |
| Organization accepted | **Verified** | Organization | View · Edit · Reassign · Add Support |
| Assistance ongoing | **In Progress** | Organization | View |
| Organization withdrawal | **Withdrawal** | Current organization | View · Reassign |
| Reassigned organization accepted | **In Progress** | New organization | View |
| Assistance completed | **Complete** | Organization | View |
| Admin rejected | **Rejected** | Not assigned | View · Edit |

---

# 20. Complete Admin HR Lifecycle

```text
                    ┌──────────────────────┐
                    │   ADMIN HELP         │
                    │   REQUESTS PAGE      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   NEW HELP REQUEST   │
                    │                      │
                    │ Status: Pending      │
                    │ Assigned:            │
                    │ Not assigned         │
                    │                      │
                    │ View · Edit · Verify │
                    └──────────┬───────────┘
                               │
                    Admin verification
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌────────────────┐          ┌────────────────┐
        │    VERIFIED    │          │    REJECTED    │
        │                │          │                │
        │ Not assigned   │          │ Not assigned   │
        │                │          │                │
        │ View · Edit    │          │ View · Edit    │
        │ · Assign       │          └────────────────┘
        └───────┬────────┘
                │
                │ Admin sends
                │ assignment request
                ▼
        ┌────────────────────┐
        │ WAITING FOR ORG     │
        │ RESPONSE            │
        │                      │
        │ Assigned:            │
        │ Not assigned         │
        └─────────┬────────────┘
                  │
           ┌──────┴───────┐
           │              │
           ▼              ▼
     ┌───────────┐   ┌──────────────┐
     │ ACCEPTED  │   │   REJECTED   │
     │           │   │              │
     │ Org       │   │ Admin can    │
     │ assigned  │   │ assign       │
     └─────┬─────┘   │ another org  │
           │         └──────┬───────┘
           │                │
           │                └───────► Assignment
           │                           request again
           ▼
    ┌──────────────────┐
    │   IN PROGRESS    │
    │                  │
    │ Assigned: Org    │
    │                  │
    │ View             │
    └────────┬─────────┘
             │
             │ Assistance ongoing
             │
       ┌─────┴─────────────┐
       │                   │
       ▼                   │
 ┌─────────────┐           │
 │  WITHDRAWAL │           │
 │             │           │
 │ Org requests│           │
 │ withdrawal  │           │
 └──────┬──────┘           │
        │                   │
        │ Admin reassigns   │
        ▼                   │
 ┌─────────────┐            │
 │ NEW ORG     │            │
 │ ASSIGNED    │            │
 └──────┬──────┘            │
        │                   │
        │ New org accepts   │
        ▼                   │
 ┌─────────────┐            │
 │ IN PROGRESS │◄───────────┘
 │             │
 │ New org     │
 │ handling    │
 └──────┬──────┘
        │
        │ Assistance
        │ completed
        ▼
 ┌─────────────┐
 │   COMPLETE  │
 │             │
 │ Assigned:   │
 │ Organization│
 │             │
 │ View only   │
 └─────────────┘
```

# 🔴 Core Admin HR Rules

1. **Every new HR starts as `Pending`.**
2. **Pending = View + Edit + Verify.**
3. Admin can either **Verify** or **Reject** a pending request.
4. **Verified does NOT mean assigned.**
5. **Assigned = Not assigned** until an organization actually accepts the assignment.
6. Admin sends an organization an **assignment request** first.
7. Only after the organization accepts is it officially shown as **Assigned**.
8. If an organization rejects the assignment, Admin can assign another organization.
9. Once assigned, the organization handles the assistance.
10. Active assistance = **In Progress**.
11. **Reassign is only available when the current organization has requested withdrawal.**
12. Without a withdrawal request, show: **“The initial organization has not requested withdrawal. Reassignment is not available.”**
13. **Add Support is only available when the current organization has requested additional support.**
14. Without a support request, show: **“The initial organization has not requested additional support. Add Support is not available.”**
15. Organization withdrawal = **Withdrawal**.
16. After withdrawal, Admin can arrange reassignment.
17. After the new organization accepts, the request returns to **In Progress**.
18. Successfully finished assistance = **Complete**.
19. Admin rejection = **Rejected**, with **Assigned: Not assigned**.
20. A rejected request does not enter the organization-assistance workflow.
21. **The individual never chooses or assigns an organization.**
22. The Admin is responsible for verification and organization assignment management.
23. The organization is responsible for accepting/rejecting the assignment and handling the actual assistance.
24. The Individual primarily submits the request and tracks its progress.