# 🏢 Organization Dashboard — Complete Help Request (HR) Workflow

## 1. Help Requests Page

The organization goes to:

**Dashboard → Help Requests**

This page shows help requests that are relevant to the organization, especially requests that:

- Are awaiting the organization's response
- Have been assigned to the organization
- Are currently being handled by the organization
- Were previously handled by the organization

### Page contains:

- **Help Requests** heading
- Short description
- Search
- Status filters
- Request summary/counts
- Help Request table

### Organization Status Filters

**All | Pending | Assigned | Active | Completed | Rejected | Withdrawal**

### HR Table

| Help Request | Submitted | Urgency | Status | Action |
|---|---|---|---|---|

---

# 2. Admin Sends an Assignment Request

After Admin verifies a help request, Admin may select the organization to handle it.

The organization receives an assignment request.

### Important

At this point, the organization has **NOT been officially assigned yet**.

The organization must first decide whether it can handle the case.

The request appears as:

**Status:** `Pending`

Example:

| Help Request | Urgency | Status | Action |
|---|---|---|---|
| Medical Support | High | Pending | Review · Accept · Reject |

---

# 3. Pending Assignment

`Pending` means:

> Admin has requested the organization to handle this help request, but the organization has not accepted the assignment yet.

The organization can review the request before making a decision.

### Available actions:

**Review · Accept · Reject**

---

# 4. Organization Reviews the Request

The organization clicks:

**Review**

The Help Request Details should show:

- Request title
- Description
- Category
- People affected
- Amount needed
- Location
- Urgency
- Supporting information
- Attachments
- Individual information
- Submitted date
- Assignment information
- Admin assignment note
- Current status

The organization uses this information to determine whether it can provide the required assistance.

---

# 5. Organization Accepts the Assignment

If the organization agrees to handle the case:

```text
Pending → Assigned
```

The organization is now officially assigned to the help request.

Example:

| Help Request | Urgency | Status | Action |
|---|---|---|---|
| Medical Support | High | Assigned | View · Start |

### Important

Only after the organization accepts should the Admin system consider the organization officially assigned.

---

# 6. Assigned Status

`Assigned` means:

> The organization has accepted responsibility for the help request, but assistance has not started yet.

The organization can:

- View the request
- Review the case
- Start assistance

### Action:

**View · Start**

Example:

| Help Request | Status | Action |
|---|---|---|
| Medical Support | Assigned | View · Start |

---

# 7. Organization Starts Assistance

When the organization is ready to begin helping:

**Start**

The request moves:

```text
Assigned → Active
```

Example:

| Help Request | Status | Action |
|---|---|---|
| Medical Support | Active | Continue · Update · Complete |

---

# 8. Active Assistance

`Active` means:

> The organization is currently handling the help request.

The organization can:

- Continue working on the case
- Add progress/assistance updates
- Record relevant assistance information
- Review the original request
- Complete the assistance
- Request withdrawal if it can no longer continue
- Request additional support when necessary

### Example:

| Help Request | Status | Action |
|---|---|---|
| Medical Support | Active | Continue · Update · Complete |

---

# 9. Updating Assistance Progress

While the request is active, the organization can record meaningful progress.

For example:

```text
Initial assessment completed.
Medical consultation arranged.
Required medicine provided.
Follow-up assistance scheduled.
```

These updates become part of the request's assistance history.

The individual and Admin can then track relevant progress.

---

# 10. Requesting Additional Support

Sometimes the organization accepts a request but later determines that it needs additional support.

For example:

- More volunteers
- Additional organizational assistance
- Additional resources
- Help from another support team

The organization can submit an:

**Additional Support Request**

The organization continues handling the case unless otherwise decided.

### Important

The organization does **not** automatically get replaced just because it requests additional support.

Admin reviews the support request and decides how to provide the required support.

---

# 11. Organization Requests Withdrawal

If the organization can no longer continue handling the request, it can request withdrawal.

For example:

- Resources are no longer available
- The organization cannot provide the required assistance
- The case requires support outside its capacity

The organization submits:

**Request Withdrawal**

The request moves to:

**Withdrawal**

Example:

| Help Request | Status | Action |
|---|---|---|
| Medical Support | Withdrawal | View |

The organization should no longer continue normal assistance unless Admin directs otherwise.

---

# 12. Withdrawal Status

`Withdrawal` means:

> The organization has requested to withdraw from the help request and the case requires further administrative handling.

The organization can:

- View the request
- See the withdrawal information/status
- Track the outcome

It should not be able to start or complete the case while the withdrawal is being handled.

---

# 13. Organization Rejects the Assignment

If the organization cannot accept the assignment from the beginning, it can reject it.

The flow is:

```text
Pending
   ↓
Reject
```

Example:

| Help Request | Status | Action |
|---|---|---|
| Medical Support | Rejected | View |

### Important

This does **not** mean the help request itself was rejected.

The organization is only declining to handle the request.

The Admin can then consider another organization.

---

# 14. After Organization Rejects

Once the organization rejects an assignment:

**Status:** `Rejected`

The organization can:

**View**

It cannot:

- Start the request
- Update assistance
- Complete the request
- Request withdrawal

The help request remains available for Admin to handle through another assignment.

---

# 15. Reassignment to Another Organization

If the current organization withdraws or rejects the assignment, Admin can arrange another organization.

For the new organization, the process starts again:

```text
Admin sends assignment
        ↓
Pending
        ↓
New organization reviews
        ↓
Accept
        ↓
Assigned
        ↓
Start
        ↓
Active
```

The new organization becomes responsible only after it accepts.

---

# 16. Completing the Assistance

When the organization has successfully provided the required assistance:

**Complete**

The request moves:

```text
Active → Completed
```

Example:

| Help Request | Status | Action |
|---|---|---|
| Medical Support | Completed | View |

Before completing, the organization should record the relevant final assistance information.

For example:

- What assistance was provided
- Outcome
- Important notes
- Completion information
- Completion date

---

# 17. Completed Status

`Completed` means:

> The organization has finished providing assistance for the help request.

The organization can:

**View**

The organization cannot:

- Edit the original request
- Start the case again
- Continue normal assistance
- Request withdrawal

The completed request remains available as part of the organization's assistance history.

---

# 18. Organization HR Actions by Status

### Pending

Assignment waiting for organization response.

```text
Review · Accept · Reject
```

---

### Assigned

Organization accepted the assignment but has not started assistance.

```text
View · Start
```

---

### Active

Organization is currently handling the case.

```text
Continue · Update · Complete
```

Additional options when applicable:

```text
Request Support
Request Withdrawal
```

---

### Completed

Assistance successfully finished.

```text
View
```

---

### Rejected

Organization declined the assignment.

```text
View
```

---

### Withdrawal

Organization requested to withdraw.

```text
View
```

---

# 19. Organization HR Status Rules

| Request State | Status | Meaning | Main Action |
|---|---|---|---|
| Assignment received | **Pending** | Waiting for organization decision | Review · Accept · Reject |
| Organization accepted | **Assigned** | Organization officially responsible | View · Start |
| Assistance started | **Active** | Organization is handling the case | Continue · Update · Complete |
| Organization requests withdrawal | **Withdrawal** | Organization wants to stop handling the case | View |
| Organization rejects assignment | **Rejected** | Organization declined the assignment | View |
| Assistance finished | **Completed** | Case successfully handled | View |
| Reassigned to another organization | **No longer current** | Previous organization is no longer responsible | View/history |

---

# 20. Complete Organization HR Lifecycle

```text
                    ┌──────────────────────┐
                    │ ORGANIZATION         │
                    │ HELP REQUESTS        │
                    └──────────┬───────────┘
                               │
                               │ Admin sends
                               │ assignment request
                               ▼
                    ┌──────────────────────┐
                    │       PENDING        │
                    │                      │
                    │ Assignment received  │
                    │                      │
                    │ Review · Accept      │
                    │ · Reject             │
                    └──────────┬───────────┘
                               │
                     ┌─────────┴─────────┐
                     │                   │
                     ▼                   ▼
              ┌─────────────┐     ┌─────────────┐
              │   ACCEPT    │     │   REJECT    │
              │             │     │             │
              │ Officially  │     │ Organization│
              │ assigned    │     │ declines    │
              └──────┬──────┘     └──────┬──────┘
                     │                   │
                     ▼                   ▼
              ┌─────────────┐     ┌─────────────┐
              │   ASSIGNED  │     │   REJECTED  │
              │             │     │             │
              │ View · Start│     │ View only   │
              └──────┬──────┘     └─────────────┘
                     │
                     │ Start assistance
                     ▼
              ┌─────────────┐
              │    ACTIVE   │
              │             │
              │ Continue    │
              │ Update      │
              │ Complete    │
              │             │
              │ Request     │
              │ Support     │
              │ Withdrawal  │
              └──────┬──────┘
                     │
             ┌───────┴───────────┐
             │                   │
             │ Withdrawal        │
             │ requested         │
             ▼                   │
      ┌──────────────┐           │
      │  WITHDRAWAL  │           │
      │              │           │
      │ View         │           │
      └──────┬───────┘           │
             │                   │
             │ Admin handles     │
             │ reassignment      │
             │                   │
             │                   │ Assistance
             │                   │ continues
             │                   │
             │                   │
             └─────────────┐     │
                           │     │
                           ▼     ▼
                    ┌─────────────┐
                    │  COMPLETED  │
                    │             │
                    │ View only   │
                    └─────────────┘
```

---

# 🔴 Core Organization HR Rules

1. **The organization does not choose help requests to assign itself.**
2. Admin sends an assignment request to the organization.
3. **Assignment request received = Pending.**
4. **Pending = Review + Accept + Reject.**
5. Sending the assignment request does **NOT** make the organization officially assigned.
6. **Accepting the assignment = Assigned.**
7. **Assigned = View + Start.**
8. Starting assistance = **Active**.
9. **Active = Continue + Update + Complete.**
10. While Active, the organization may request **Additional Support** when necessary.
11. While Active, the organization may request **Withdrawal** if it can no longer continue.
12. **Withdrawal** means the organization has asked to stop handling the case.
13. **Rejecting an assignment does NOT reject the help request itself.**
14. After rejecting, the organization is no longer responsible for the case.
15. Admin may assign the request to another organization.
16. A new organization must go through **Pending → Accept → Assigned** before becoming responsible.
17. Successfully finished assistance = **Completed**.
18. Completed requests are **View only**.
19. The organization cannot edit the individual's original help request.
20. The organization cannot assign another organization to the request.
21. The organization handles the actual assistance after accepting the assignment.
22. The organization should only request withdrawal or additional support when there is a genuine need.
23. **Pending, Assigned, Active, Completed, Rejected, and Withdrawal are statuses/actions within the Help Requests module — they do not need separate sidebar pages.**