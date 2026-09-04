# 🤝 Stand For People — Complete Help Request Workflow

## 1. Individual Submits a Help Request

The **Individual** submits a help request with the required information.

```text
Individual
   ↓
Submit Help Request
```

Initial state:

**Status:** `Pending`  
**Assigned:** `Not assigned`

While the request is pending, the Individual can:

**View · Edit · Delete**

---

## 2. Admin Reviews the Request

The **Admin** receives the submitted request and reviews it.

```text
Pending
   ↓
Admin Review
```

Admin has two possible decisions:

```text
             Pending
             /     \
            /       \
       Verify       Reject
          ↓           ↓
      Verified     Rejected
```

### If Rejected

The request ends from the assistance workflow.

**Status:** `Rejected`  
**Assigned:** `Not assigned`

Individual can only **View** the request and rejection information.

---

## 3. Admin Verifies the Request

If Admin verifies the request:

```text
Pending → Verified
```

The request is now eligible for assistance.

**Assigned:** `Not assigned`

The Individual can now only **View** and track the request.

The Individual does **not** choose an organization.

---

## 4. Admin Sends Assignment to an Organization

Admin selects an appropriate organization and sends an assignment request.

```text
Verified
   ↓
Admin selects Organization
   ↓
Assignment Request Sent
```

### Important

The organization is **not officially assigned yet**.

The Organization sees:

**Status:** `Pending`

and can:

**Review · Accept · Reject**

---

## 5. Organization Responds

### If Organization Rejects

```text
Pending
   ↓
Organization Rejects
```

The organization is no longer considered for the case.

Admin can send the assignment to another organization.

The Individual's help request itself is **not rejected**.

---

### If Organization Accepts

```text
Pending
   ↓
Organization Accepts
   ↓
Assigned
```

Now the organization is officially responsible for the request.

The Admin and Individual can now see the organization name in **Assigned**.

---

## 6. Organization Starts Assistance

The organization starts handling the case:

```text
Assigned
   ↓
Active / In Progress
```

The organization can:

- Provide assistance
- Add progress updates
- Request additional support if needed
- Request withdrawal if it can no longer continue

The Individual can only **track the request**.

The Admin can **monitor the request**.

---

## 7. Additional Support — If Needed

If the organization needs additional support:

```text
Active
   ↓
Organization requests additional support
   ↓
Admin reviews and arranges support
```

This does not automatically replace the current organization.

The current organization can continue handling the case.

---

## 8. Withdrawal — If Needed

If the organization can no longer handle the case:

```text
Active
   ↓
Organization requests withdrawal
   ↓
Withdrawal
```

Admin reviews the situation and can arrange reassignment.

### Reassignment rule

Admin can only use **Reassign** when the current organization has requested withdrawal.

If there is no withdrawal request:

> The initial organization has not requested withdrawal. Reassignment is not available.

---

## 9. Reassignment

After withdrawal:

```text
Withdrawal
   ↓
Admin selects another Organization
   ↓
Assignment Request Sent
   ↓
New Organization Pending
   ↓
Accept
   ↓
Assigned
   ↓
Active / In Progress
```

The new organization becomes responsible only after it accepts the assignment.

The Individual sees the updated organization and continues tracking the request.

---

## 10. Assistance Completed

When the organization successfully finishes the assistance:

```text
Active / In Progress
        ↓
    Completed
```

Final state:

**Status:** `Complete`  
**Assigned:** Organization name  
**Action:** `View`

The request is now closed.

---

# 🔄 Complete Cross-Dashboard Workflow

```text
┌──────────────────┐
│    INDIVIDUAL    │
│                  │
│ Submit Request   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      ADMIN       │
│                  │
│ Review Request   │
└────────┬─────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
 Verified    Rejected
    │          │
    │          └──────────► END
    │
    ▼
┌──────────────────┐
│      ADMIN       │
│                  │
│ Assign Org       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  ORGANIZATION    │
│                  │
│ Pending          │
│ Review           │
└────────┬─────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
 Reject      Accept
    │          │
    │          ▼
    │       Assigned
    │          │
    │          ▼
    │        Active
    │          │
    │     ┌────┴──────────┐
    │     │               │
    │     ▼               ▼
    │  Withdrawal     Completed
    │     │               │
    │     ▼               │
    │  Admin Reassign     │
    │     │               │
    │     ▼               │
    │ New Org Pending     │
    │     │               │
    │     ▼               │
    │  Accept             │
    │     │               │
    │     ▼               │
    │  Assigned           │
    │     │               │
    │     ▼               │
    │   Active ───────────┘
    │
    └──────────────► Admin assigns another organization
```

# 📌 What Each Dashboard Does

| Dashboard | Main Responsibility |
|---|---|
| **Individual** | Submit the request and track its progress |
| **Admin** | Review/verify requests, manage organization assignments, monitor cases, handle withdrawal/reassignment |
| **Organization** | Review assignment requests, accept/reject them, provide assistance, update progress, request support/withdrawal, complete assistance |

# 🔴 The Core Logic

```text
Individual submits
       ↓
Admin verifies
       ↓
Admin sends assignment
       ↓
Organization accepts
       ↓
Organization becomes assigned
       ↓
Organization starts assistance
       ↓
Active / In Progress
       ↓
 ┌───────────────┐
 │               │
Complete      Withdrawal
 │               │
 ▼               ▼
 END        Admin reassigns
                 ↓
             New Org
                 ↓
              Accept
                 ↓
              Active
                 ↓
             Complete
```

### The most important rules

1. **Individual submits; Admin verifies; Organization handles the assistance.**
2. **Pending before Admin's decision = Individual can Edit/Delete.**
3. **After Admin verifies or rejects = Individual can only View.**
4. **Verified does not mean an organization is assigned.**
5. **Admin sends the assignment; Organization must accept it before becoming officially assigned.**
6. **Organization rejection does not reject the help request.**
7. **Only the assigned organization handles the assistance.**
8. **Reassignment requires the current organization to request withdrawal.**
9. **Additional Support is requested by the current organization when needed.**
10. **The Individual never selects or assigns an organization.**
11. **Completed means the assistance has been successfully finished and the request is closed.**