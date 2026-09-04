# 👤 Individual Dashboard — Complete Help Request (HR) Workflow

## 1. My Help Requests Page

The individual goes to:

**Dashboard → My Help Requests**

This page shows **only the help requests submitted by that individual**.

### Page contains:

- **My Help Requests** heading
- Short description
- **+ Submit Help Request** button
- Search
- Status filters
- Request summary/counts
- Help Request table

### HR Table

| Help Request | Submitted | Urgency | Status | Assigned | Action |
|---|---|---|---|---|---|

The **Assigned** field is always visible.

---

# 2. Submit a New Help Request

The individual clicks:

**+ Submit Help Request**

They fill out the HR form, such as:

- Title
- Description
- Category
- People affected
- Amount needed
- Location
- Urgency
- Supporting information
- Supporting documents/images

Then clicks:

**Submit Request**

The request is created as:

**Status:** `Pending`  
**Assigned:** `Not assigned`

### Table:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Pending | Not assigned | View · Edit · Delete |

---

# 3. Pending Status

`Pending` means:

> The help request has been submitted and is waiting for verification.

This is the **only stage where the individual can modify or delete the request**.

### Available actions:

**View · Edit · Delete**

### View

The individual can see:

- Request title
- Description
- Category
- People affected
- Amount needed
- Location
- Urgency
- Supporting information
- Submitted date
- Attachments
- Current status
- Assignment information

At this point:

**Status:** Pending  
**Assigned:** Not assigned

### Edit

The individual can edit the request information while it is still pending.

After editing:

**Save Changes**

### Delete

The individual can delete the request while it is still pending.

A confirmation should appear before deletion.

---

# 4. Admin Changes the Verification Status

The important rule:

> **The individual can Edit/Delete the request only while its verification status is `Pending`.**

As soon as Admin makes a verification decision, the individual's editing period ends.

There are two possible outcomes:

```text
Pending
   │
   ├── Verified
   │
   └── Rejected
```

After either decision:

- ❌ Edit is removed
- ❌ Delete is removed
- ✅ View remains

---

# 5. If the Request Is Verified

When Admin verifies the request:

```text
Pending → Verified
```

From the Individual's perspective, it now becomes an active/in-progress request.

### Table:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | In Progress | Not assigned | View |

### Individual can:

- View the request
- Track its status
- See available updates

### Individual cannot:

- Edit
- Delete
- Assign an organization

The **Assigned** field still says:

**Not assigned**

until an organization is actually assigned.

---

# 6. Waiting for Organization Assignment

After verification, the request may temporarily have:

**Status:** `In Progress`  
**Assigned:** `Not assigned`

The individual can open **View** and see that the request is being processed for assistance.

The individual does not need to perform any action.

---

# 7. Organization Is Assigned

Once an organization is actually assigned to the request, the **Assigned** field changes from:

```text
Not assigned
```

to the organization's name.

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | In Progress | Hope Foundation | View |

The individual can now see:

- Assigned organization
- Organization information
- Current request status
- Available progress updates

Still:

- ❌ Edit
- ❌ Delete

Only:

**View**

---

# 8. Assistance Is In Progress

While the organization is handling the request:

**Status:** `In Progress`

### Table:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | In Progress | Hope Foundation | View |

The individual can:

- View request details
- See assigned organization
- Track the current status
- See relevant progress/assistance updates

The individual cannot edit or delete the request.

---

# 9. Organization Withdrawal

If the assigned organization can no longer continue, the request may temporarily show:

**Status:** `Withdrawal`

### Table:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Withdrawal | Hope Foundation | View |

The individual can:

- View the request
- See the withdrawal/update information
- Track the request while further assistance is being arranged

The individual still cannot edit or delete it.

---

# 10. Reassignment

If another organization is assigned after withdrawal, the **Assigned** field updates to the new organization.

Example:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | In Progress | Helping Hands Foundation | View |

The individual can see the new assigned organization and continue tracking the request.

Again:

**View only**

---

# 11. Request Is Completed

When the help request has been successfully handled:

```text
In Progress
     ↓
Complete
```

The table becomes:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Complete | Helping Hands Foundation | View |

### Action:

**View only**

The individual can open the request and see:

- Original request details
- Assigned organization
- Assistance information
- Relevant progress/history
- Completion information
- Completion date

No Edit.

No Delete.

---

# 12. If Admin Rejects the Request

The other possible verification outcome is:

```text
Pending → Rejected
```

The table becomes:

| Help Request | Status | Assigned | Action |
|---|---|---|---|
| Medical Support | Rejected | Not assigned | View |

### Action:

**View only**

The individual can open the request and see:

- Submitted request information
- Rejected status
- Rejection reason/note, if provided

The individual cannot:

- Edit
- Delete
- Assign an organization

Because the request was rejected before assistance.

---

# 13. Final Individual HR Status/Action Rules

| Request State | Status Shown | Assigned | Action |
|---|---|---|---|
| Newly submitted | **Pending** | Not assigned | **View · Edit · Delete** |
| Waiting for verification | **Pending** | Not assigned | **View · Edit · Delete** |
| Verified, waiting for organization | **In Progress** | Not assigned | **View** |
| Organization assigned | **In Progress** | Organization name | **View** |
| Assistance ongoing | **In Progress** | Organization name | **View** |
| Organization withdrawal | **Withdrawal** | Current organization | **View** |
| Reassigned | **In Progress** | New organization | **View** |
| Assistance completed | **Complete** | Organization name | **View** |
| Admin rejected | **Rejected** | Not assigned | **View** |

---

# 14. Complete Individual HR Lifecycle

```text
                    ┌──────────────────────┐
                    │  MY HELP REQUESTS    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  SUBMIT HR           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      PENDING         │
                    │                      │
                    │ Assigned:            │
                    │ Not assigned         │
                    │                      │
                    │ Actions:             │
                    │ View · Edit · Delete │
                    └──────────┬───────────┘
                               │
                               │ Admin makes
                               │ verification decision
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
             ┌─────────────┐       ┌─────────────┐
             │   VERIFIED  │       │   REJECTED  │
             └──────┬──────┘       └──────┬──────┘
                    │                     │
                    ▼                     ▼
             ┌─────────────┐       ┌─────────────┐
             │ IN PROGRESS │       │    VIEW     │
             │             │       │    ONLY     │
             │ Assigned:   │       │             │
             │ Not assigned│       │ No Edit     │
             │             │       │ No Delete   │
             │ View only   │       └─────────────┘
             └──────┬──────┘
                    │
                    │ Organization assigned
                    ▼
             ┌─────────────┐
             │ IN PROGRESS │
             │             │
             │ Assigned:   │
             │ Organization│
             │             │
             │ View only   │
             └──────┬──────┘
                    │
                    │ Assistance ongoing
                    ▼
             ┌─────────────┐
             │ IN PROGRESS │
             │             │
             │ Track       │
             │ progress    │
             └──────┬──────┘
                    │
          ┌─────────┴──────────┐
          │                    │
          │ Organization       │
          │ withdraws          │
          ▼                    │
   ┌─────────────┐             │
   │  WITHDRAWAL │             │
   │             │             │
   │ View only   │             │
   └──────┬──────┘             │
          │                    │
          │ Reassigned         │
          ▼                    │
   ┌─────────────┐             │
   │ IN PROGRESS │◄────────────┘
   │             │
   │ New org     │
   │ assigned    │
   └──────┬──────┘
          │
          │ Assistance successfully
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

# 🔴 Core Individual HR Rules

1. **Pending = View + Edit + Delete**
2. **The moment Admin verifies OR rejects = Edit + Delete are removed**
3. **After verification/rejection = View only**
4. **Assigned field is always visible**
5. **Assigned always shows `Not assigned` until an organization is actually assigned**
6. **After an organization is assigned, Assigned shows the organization name**
7. **Verified/active assistance = `In Progress`**
8. **Organization withdrawal = `Withdrawal`**
9. **Successfully finished assistance = `Complete`**
10. **Rejected request = `Rejected` + Assigned: `Not assigned` + View only**
11. **The individual never assigns or chooses the organization**
12. **The individual primarily submits, manages while pending, and tracks the request afterward**