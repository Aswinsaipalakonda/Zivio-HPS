# Zivio — Product Requirements Document (PRD)
**Version:** 1.0  
**Date:** May 2026  
**Status:** Ready for Development  

---

## 1. Product Overview

### 1.1 Product Name
**Zivio** — A daily task tracking and team management platform built for small teams.

### 1.2 Tagline
*"Every task. Every person. Every day."*

### 1.3 Product Summary
Zivio is an internal web application (deployed as a Progressive Web App) that allows a manager to assign daily tasks to employees and interns every morning, track their completion status throughout the day, and allow directors and managers to review performance analytics by date, person, and time period. The application is role-based, Google-authenticated (via Clerk), and designed for a team of up to 50 users.

### 1.4 Problem Statement
Small teams managing interns and employees struggle with informal task delegation via WhatsApp/email, with no structured way to track what was assigned, what got done, and what is pending — especially across multiple people over time.

### 1.5 Solution
A clean, mobile-friendly web app where managers assign tasks each morning, employees update their status each evening, and directors/managers get date-filterable analytics and reports at any time.

### 1.6 Target Users
- **Super Admin** — 1 person (IT/owner), manages all user accounts
- **Director** — 1–2 people, views analytics and all task statuses
- **Manager** — 1–3 people, assigns tasks, reviews statuses
- **Employee/Intern** — 10–50 people, receives tasks, updates status

### 1.7 Design System
- **Primary color:** #3A9DE9 (from logo — medium blue)
- **Secondary color:** #FFFFFF (white)
- **Accent/dark:** #0F1117 (near-black for backgrounds where needed)
- **Font:** Inter (Google Fonts)
- **Style:** Clean, flat, mobile-first, card-based layout with generous spacing

---

## 2. User Roles & Permissions

| Feature | Super Admin | Director | Manager | Employee / Intern |
|---|---|---|---|---|
| Create / edit / deactivate users | ✅ | ❌ | ❌ | ❌ |
| Assign roles to users | ✅ | ❌ | ❌ | ❌ |
| Assign tasks to any person | ❌ | ❌ | ✅ | ❌ |
| View own task dashboard | ❌ | ❌ | ❌ | ✅ |
| Update task status | ❌ | ❌ | ❌ | ✅ |
| View all task statuses (any person, any date) | ❌ | ✅ | ✅ | ❌ |
| View analytics dashboard | ❌ | ✅ | ✅ | ❌ |
| View own attendance | ❌ | ❌ | ❌ | ✅ |
| View all attendance | ❌ | ✅ | ✅ | ❌ |

---

## 3. Authentication & Access Control

### 3.1 Login Method
- All users log in exclusively via **Google OAuth** through **Clerk**.
- Email/password login is **disabled** in the Clerk dashboard.
- No self-registration — users can only access the system if their email has been pre-approved.

### 3.2 Email Allowlist
- The Super Admin adds emails to an allowlist in Django (stored in the `User` model).
- On login, after Clerk authenticates with Google, the Django backend validates that the email exists in the allowlist and is marked `is_active = True`.
- If the email is not in the system, the user is shown a "You are not authorized" screen.

### 3.3 Session & Token Flow
1. User visits the app and clicks "Sign in with Google."
2. Clerk redirects to Google OAuth consent screen.
3. Google returns an identity to Clerk.
4. Clerk issues a short-lived **JWT** signed with Clerk's private key.
5. Next.js stores the JWT in memory/cookie.
6. Every API call to Django includes `Authorization: Bearer <jwt>`.
7. Django validates the JWT against Clerk's JWKS public endpoint.
8. Django identifies the user by `clerk_user_id` and applies role-based permissions.

### 3.4 Post-login Routing
After successful login, users are routed based on their role:
- Employee/Intern → `/dashboard`
- Manager → `/manager`
- Director → `/director`
- Super Admin → Django Admin at `/admin`

---

## 4. Super Admin — Features

The Super Admin operates exclusively through **Django Admin** (no custom frontend needed).

### 4.1 User Management
- Create a new user by entering: Full name, Email address, Role (manager / director / employee / intern), Department (optional text field), Join date.
- Edit any user's details at any time.
- Deactivate a user (sets `is_active = False`; the user can no longer log in even if their email is in Clerk's system).
- Delete a user (soft delete — marks deleted, retains data for historical records).

### 4.2 Role Assignment
- Change any user's role at any time.
- A user can only have one role at a time.

---

## 5. Manager — Features

### 5.1 Morning Task Assignment Flow
1. Manager opens the app and lands on the **Task Assignment** page (`/manager/assign`).
2. They see a list of all active employees and interns in a scrollable card list.
3. Each person has an **"Assign Task"** button.
4. Clicking it opens a side drawer/modal with:
   - **Task Title** (required, max 100 characters)
   - **Task Description** (required, rich text / textarea, max 1000 characters)
   - **Assignment Date** (pre-filled with today's date; manager can change it to assign future tasks)
   - A **Submit** button.
5. After submitting, a success indicator appears on that person's card (e.g., a green checkmark badge).
6. Manager can assign **multiple tasks** to the same person (each task is a separate card on the employee's dashboard).
7. Manager can assign tasks to **all people** in one session before the workday starts.

### 5.2 Task Overview (Manager View)
- A page `/manager/tasks` shows all task assignments for **today** by default.
- Manager can filter by:
  - **Person** — dropdown of all employees/interns
  - **Date** — single date picker
  - **Month** — month/year selector
  - **Status** — Completed / In Progress / Pending / Not Yet Started / (All)
- Each task card shows: Person name, Task title, Status badge (color-coded), Last updated time, Notes (if any).
- Clicking a task card shows the full task details and the employee's notes.

### 5.3 Team Status Summary
- A summary widget at the top of `/manager/tasks` shows:
  - Total tasks assigned today
  - How many are Completed / In Progress / Pending / Not Yet Started
  - Displayed as color-coded counters (not a full graph — that's the analytics page)

---

## 6. Employee / Intern — Features

### 6.1 Personal Dashboard (`/dashboard`)
The dashboard is the employee's home screen. It shows:

**Header Section:**
- Greeting with their name: "Good morning, Arjun"
- Today's date
- Attendance status for today (auto-recorded on first login of the day as "Present")

**Task Section:**
- List of all tasks assigned to them **for today** (default view).
- Each task is shown as a card with:
  - Task title
  - Description (collapsed by default, expandable)
  - Current status badge
  - Last updated timestamp
  - An **"Update Status"** button

**Past Tasks:**
- A date picker allows employees to view tasks from previous days (read-only for past days).

### 6.2 Task Status Update
When an employee clicks "Update Status" on a task, a bottom sheet / modal appears with:

- **Status selector** — four options displayed as large tap-friendly buttons:
  - ✅ **Completed** — green
  - 🔄 **In Progress** — blue
  - ⏸ **Pending** — amber/yellow
  - ○ **Not Yet Started** — gray

- **Notes field** (textarea):
  - If status is **Completed**: notes are optional (placeholder: "Add any remarks…")
  - If status is **In Progress**, **Pending**, or **Not Yet Started**: notes are **mandatory** (placeholder: "Explain why — what's blocking, what's next…"). The submit button is disabled until notes are filled.

- A **Submit** button that saves the status and notes.
- The task card immediately reflects the new status and timestamp.

### 6.3 Attendance
- On the first login of each day, the system automatically records an attendance entry (`status = present`, `check_in = current time`).
- No manual check-in required.
- Employees can see their own attendance history in a dedicated `/dashboard/attendance` tab:
  - Calendar view showing present/absent days (color-coded)
  - Monthly summary: X days present, Y days absent

### 6.4 Notifications (Phase 2 — optional)
- In-app notification if a new task is assigned during the day.
- Reminder at 5 PM if any tasks are still "Not Yet Started."

---

## 7. Director — Features

The Director has a read-only view of everything. They cannot assign tasks or modify any data.

### 7.1 Analytics Dashboard (`/director`)
The main landing page for the Director is the analytics dashboard.

**Summary cards (top row):**
- Total employees/interns in the system
- Tasks assigned today
- Completion rate today (% completed / total)
- Pending/In-progress tasks today

**Day-wise bar chart:**
- X-axis: last 7 days (or custom date range)
- Y-axis: number of tasks
- Grouped bars: Completed / In Progress / Pending / Not Started
- Color-coded bars matching the status color system

**Per-person completion chart:**
- Horizontal bar chart
- Each bar represents one employee
- Bar filled proportionally to their completion rate this week/month
- Clicking a bar navigates to that person's task detail view

**Monthly trend line chart:**
- Line graph showing total tasks vs completed tasks over the last 30 days
- Helps identify patterns (e.g., end-of-week dips)

### 7.2 Task Review Page (`/director/tasks`)
- Same filter options as the Manager view: person, date, month, status.
- Read-only — Director cannot edit tasks or statuses.
- Can see employee notes on all tasks.
- Export to CSV button (downloads a spreadsheet of filtered tasks with all fields).

### 7.3 Attendance Overview
- `/director/attendance` — grid view of all employees × all days in the selected month.
- Each cell shows P (present, green) / A (absent, red) / H (half-day, amber).
- Monthly summary row at the bottom.

---

## 8. Shared Features

### 8.1 Date Filtering (All Review Pages)
Three filter modes available on any task/attendance review page:
1. **Single day** — date picker, shows all tasks for that exact day
2. **Month view** — month/year picker, shows aggregated data for the whole month
3. **Custom range** — start date + end date picker (max 90 days)

### 8.2 Profile Page (All Users)
- `/profile` — shows name, email, role, join date, profile picture (from Google).
- No editing — data is managed by Super Admin.

### 8.3 Responsive Layout
- The entire application is designed **mobile-first**.
- All tap targets are minimum 44×44px.
- Bottom navigation bar on mobile (max 4 items).
- Sidebar navigation on desktop (≥768px wide).

### 8.4 Empty States
All list/table views have a well-designed empty state illustration + message when no data is found (e.g., "No tasks assigned for this day yet.").

### 8.5 Loading States
- Skeleton loaders (not spinners) for all card lists and tables.
- Optimistic UI updates on task status changes.

---

## 9. Navigation Structure

### Employee / Intern
```
Bottom nav:
  🏠 Dashboard     (today's tasks)
  📅 Attendance    (own calendar)
  👤 Profile
```

### Manager
```
Sidebar (desktop) / Bottom nav (mobile):
  📋 Assign Tasks  (/manager/assign)
  👁 Task Review   (/manager/tasks)
  📊 Analytics     (/manager/analytics)
  👥 Team          (/manager/team — list of people)
  👤 Profile
```

### Director
```
Sidebar:
  📊 Analytics     (/director)
  👁 Task Review   (/director/tasks)
  🗓 Attendance    (/director/attendance)
  👤 Profile
```

---

## 10. Technical Requirements

### 10.1 Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with a custom theme (primary: #3A9DE9)
- **Auth client:** Clerk Next.js SDK (`@clerk/nextjs`)
- **State management:** React Query (TanStack Query) for server state; Zustand for UI state
- **Charts:** Recharts (lightweight, React-native)
- **Form handling:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **PWA:** `next-pwa` package — adds a web manifest and service worker so the app is installable from the browser

### 10.2 Backend
- **Framework:** Django 5.x + Django REST Framework (DRF)
- **Auth middleware:** Custom Clerk JWT verification using Clerk's JWKS endpoint
- **Permissions:** Custom DRF permission classes per role
- **Admin:** Django Admin (default) for Super Admin user management
- **CORS:** `django-cors-headers` configured for the Next.js origin
- **API format:** JSON REST
- **Date/time:** All stored in UTC, frontend converts to local time (IST by default)

### 10.3 Database
- **Engine:** PostgreSQL 16
- **Local development:** Docker Desktop with a `docker-compose.yml` file (postgres:16 image)
- **Production:** PostgreSQL on the Hostinger VPS (installed directly or via Docker on VPS)
- **Migrations:** Django migrations

### 10.4 Local Development Environment
- Next.js dev server on `http://localhost:3000`
- Django dev server on `http://localhost:8000`
- PostgreSQL on `localhost:5432` via Docker Desktop
- `.env.local` for Next.js secrets (Clerk publishable key, API URL)
- `.env` for Django secrets (Clerk secret key, DB credentials, JWKS URL)

### 10.5 Production Deployment (Hostinger VPS)
- OS: Ubuntu 22.04 LTS
- **Django:** Run with Gunicorn (WSGI), managed by Systemd service
- **Next.js:** Built with `next build`, run with `node server.js` or PM2
- **Reverse proxy:** Nginx (handles both frontend port 443 and backend at `/api/`)
- **SSL:** Let's Encrypt via Certbot
- **PostgreSQL:** Installed on VPS, secured with a dedicated DB user
- **Environment variables:** Stored in `.env` files on the server, not in version control
- **Process manager:** PM2 for Node.js, Systemd for Django/Gunicorn

---

## 11. Data Models (Logical)

### User
- id (UUID, primary key)
- clerk_user_id (string, unique — from Clerk)
- email (string, unique)
- full_name (string)
- role (enum: manager / director / employee / intern)
- department (string, optional)
- profile_picture_url (string, optional — from Google via Clerk)
- is_active (boolean, default true)
- date_joined (date)
- created_at (datetime)
- updated_at (datetime)

### TaskAssignment
- id (UUID)
- assigned_to (FK → User)
- assigned_by (FK → User)
- title (string, max 100)
- description (text, max 1000)
- assignment_date (date — the day the task is for)
- created_at (datetime)
- updated_at (datetime)

### TaskLog
- id (UUID)
- assignment (FK → TaskAssignment, one-to-one)
- submitted_by (FK → User)
- status (enum: completed / in_progress / pending / not_started)
- notes (text, nullable)
- logged_at (datetime — when the employee last updated)
- log_date (date — the date of the log entry)

### Attendance
- id (UUID)
- user (FK → User)
- date (date)
- check_in_time (time, nullable)
- status (enum: present / absent / half_day)
- auto_recorded (boolean — true if recorded on login)
- Unique constraint: (user, date)

---

## 12. API Endpoints (Summary)

### Auth
- `POST /api/auth/verify/` — validates Clerk JWT, returns user profile + role

### Users (Super Admin only via Django Admin — no REST endpoint needed)

### Tasks
- `GET /api/tasks/my/?date=YYYY-MM-DD` — employee's own tasks for a date
- `GET /api/tasks/?assigned_to=&date=&month=&status=` — manager/director filtered view
- `POST /api/tasks/` — assign a new task (manager only)
- `PATCH /api/tasks/{id}/status/` — update task status + notes (employee only)

### Attendance
- `GET /api/attendance/my/?month=YYYY-MM` — employee's own attendance
- `GET /api/attendance/?user_id=&month=YYYY-MM` — all attendance (manager/director)
- `POST /api/attendance/checkin/` — auto record on login (employee)

### Analytics
- `GET /api/analytics/daily/?date=YYYY-MM-DD` — task counts by status for a day
- `GET /api/analytics/weekly/?start=&end=` — grouped bar chart data
- `GET /api/analytics/monthly/?month=YYYY-MM` — monthly trend data
- `GET /api/analytics/per-person/?month=YYYY-MM` — per-person completion rates

### Export
- `GET /api/export/tasks/?...filters...` — returns CSV of tasks matching filters

---

## 13. Non-Functional Requirements

### Performance
- Initial page load under 2 seconds on a 4G mobile connection.
- Task status update reflected in UI within 300ms (optimistic update).
- Analytics charts render within 1 second on filtered queries.

### Security
- All API endpoints require a valid Clerk JWT.
- Role checks enforced on every endpoint in Django — no client-side-only guards.
- PostgreSQL credentials never exposed to the frontend.
- HTTPS enforced in production (Let's Encrypt).
- CORS strictly limited to the registered frontend domain.

### Scalability
- Designed for 50 users; architecture can scale to 500 without changes.
- Database indexes on: `(assigned_to, assignment_date)`, `(user_id, date)` on attendance.

### Reliability
- Daily database backups via a cron job on the VPS.
- Gunicorn runs with 2–4 worker processes.

---

## 14. Out of Scope (Phase 1)

- Push notifications
- In-app chat or comments
- File attachments on tasks
- Multiple managers assigning tasks to overlapping teams
- Time tracking (start/stop timers on tasks)
- Task priorities or deadlines within the day
- Public API or webhooks

---

## 15. Success Metrics

- 100% of daily tasks assigned via Zivio (not WhatsApp/email)
- ≥ 90% of employees update their task status by 6 PM every day
- Manager spends less than 10 minutes assigning all tasks in the morning
- Director can pull any historical day's report within 30 seconds

---

*End of PRD — Zivio v1.0*
