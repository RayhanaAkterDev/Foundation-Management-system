# Foundation-Management-system

## Stand For People (SP)

**Stand For People (SP)** is a web-based foundation management and social support platform designed to connect people in need with organizations, volunteers, donors, and administrators.

The platform provides a centralized system for managing help requests, organizations, campaigns, donations, volunteers, and user accounts while allowing administrators to verify and coordinate activities.

---

## 🌐 Live Application

**Main Website:**
https://foundation-management-system.vercel.app/

### Authentication

* **Admin Login:**
  https://foundation-management-system.vercel.app/admin/login

* **Account Registration:**
  https://foundation-management-system.vercel.app/account/register

* **Account Selection:**
  https://foundation-management-system.vercel.app/account/

* **Individual Login:**
  https://foundation-management-system.vercel.app/account/login?role=individual

* **Organization Login:**
  https://foundation-management-system.vercel.app/account/login?role=organization

---

## 📊 Dashboards

### Admin

* **Admin Dashboard:**
  https://foundation-management-system.vercel.app/dashboard/admin

* **Admin Users:**
  https://foundation-management-system.vercel.app/dashboard/admin/users

### Individual

* **Individual Dashboard:**
  https://foundation-management-system.vercel.app/dashboard/individual

### Organization

* **Organization Dashboard:**
  https://foundation-management-system.vercel.app/dashboard/organization

---

## ✨ Main Features

### 👤 User Management

* Individual and organization account registration
* Role-based authentication
* User account management
* Admin user management
* Account status management

### 🏢 Organization Management

* Organization registration
* Organization profile management
* Admin organization verification
* Organization approval/rejection workflow
* Verified organization management

### 🆘 Help Requests

Individuals and organizations can submit requests for assistance.

The help request workflow includes:

**Pending → Verified/Rejected → Assigned → Accepted → In Progress → Completed**

Administrators can:

* Review help requests
* Verify or reject requests
* Assign verified requests
* Assign organizations
* Assign one or multiple SP volunteers
* Track assignment status

A request can be handled by:

* A verified organization
* SP volunteers
* Both an organization and SP volunteers

### 📢 Campaign Management

SP supports multiple campaign types, including:

* Local case campaigns
* Organization-proposed campaigns
* Global situation campaigns

Administrators can review, approve, reject, start, complete, and cancel campaigns.

### 💰 Donations

* Guest donations
* Registered-user donations
* Campaign-based donations
* Automatic campaign collected-amount updates
* Donation management through the admin dashboard

### 🙋 Volunteers

Volunteering is handled as an activity/profile of an **Individual** account rather than as a separate account role.

The system supports:

* Volunteer applications
* Volunteer approval
* Volunteer availability
* Volunteer assignment to help requests
* Assignment status tracking

### 📊 Admin Dashboard

The admin dashboard provides centralized management for:

* Users
* Organizations
* Help Requests
* Campaigns
* Donations
* Volunteers
* Reports and system management

---

## 🔐 User Roles

SP currently supports three main account roles:

| Role             | Description                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Individual**   | Users who can request help, donate, and participate as volunteers                         |
| **Organization** | Verified organizations that can participate in supporting cases and managing activities   |
| **Admin**        | System administrators responsible for verification, management, assignment, and oversight |

> **Note:** Volunteer is not a separate account role. A volunteer is an Individual user with an approved volunteer profile.

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router

### Backend

* Laravel
* PHP
* Laravel Sanctum

### Database

* MySQL

### Deployment

* Vercel — Frontend
* Render — Backend
* Aiven — Database

---

## 🏗️ System Architecture

```text
                    Stand For People (SP)
                             │
             ┌───────────────┼───────────────┐
             │               │               │
         Individual      Organization      Admin
             │               │               │
             └───────────────┼───────────────┘
                             │
                         SP Platform
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   Help Requests         Campaigns           Donations
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                         Volunteers
```

---

## 🔄 Help Request Assignment Model

Once a help request has been verified by an administrator, it can be assigned according to the needs of the case.

```text
                    Verified Help Request
                            │
             ┌──────────────┼──────────────┐
             │              │              │
       Organization     SP Volunteer(s)   Both
             │              │              │
             └──────────────┼──────────────┘
                            │
                         Accepted
                            │
                       In Progress
                            │
                        Completed
```

This allows SP to support cases directly through its own volunteers when an external organization is not required.

---

## 🎯 Project Goal

The goal of Stand For People is to provide a structured and transparent platform for coordinating social support activities.

The system aims to make it easier to:

* Connect people with appropriate assistance
* Coordinate organizations and volunteers
* Manage humanitarian campaigns
* Track donations
* Verify organizations and requests
* Centralize administrative operations
* Improve transparency and accountability

---

## 📁 Project Structure

```text
Foundation-Management-system/
│
├── backend/
│   └── Laravel application
│
├── frontend/
│   └── React + Vite application
│
└── README.md
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone <https://github.com/RayhanaAkterDev/Foundation-Management-system.git>
cd Foundation-Management-system
```

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Make sure the frontend environment variables point to the appropriate backend API.

---

## 📄 Project Status

**Stand For People (SP)** is an actively developed foundation-management platform.

Current development focuses on completing and verifying the core administrative workflows, user management, organization verification, help-request management, campaign management, donations, volunteer management, and related dashboard functionality.

---

## 👩‍💻 Developed With

**Stand For People (SP)**
Foundation Management System

Built as a full-stack web application using **React, Laravel, MySQL, and REST APIs**.
