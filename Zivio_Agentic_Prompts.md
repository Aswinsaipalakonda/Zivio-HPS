# Zivio — Agentic Build Prompts
**How to use:** Paste each prompt into Claude Code (or Cursor/Windsurf) one at a time.
Wait for each step to fully complete before moving to the next.

---

## PROMPT 1 — Project Scaffold & Monorepo Structure

```
Create a monorepo project called "zivio" with two apps inside it:
1. A Next.js 14 frontend (App Router, TypeScript, Tailwind CSS) inside a folder called "frontend"
2. A Django 5 backend (Python) inside a folder called "backend"

Root-level files to create:
- .gitignore (covers Node, Python, .env files, __pycache__, .next, dist)
- README.md with project name "Zivio" and a brief description
- docker-compose.yml for local PostgreSQL only (postgres:16 image, port 5432, db name "zivio_db", user "zivio_user", password "zivio_pass", data volume)

For the frontend (Next.js):
- Initialize with: TypeScript, Tailwind CSS, App Router, src/ directory, no ESLint during init (we'll add manually)
- Install packages: @clerk/nextjs, @tanstack/react-query, react-hook-form, zod, @hookform/resolvers, recharts, lucide-react, axios, date-fns, next-pwa
- Create tailwind.config.ts with a custom theme:
  - Primary: #3A9DE9
  - Primary-dark: #2480CC
  - Primary-light: #EBF5FD
  - Secondary: #FFFFFF
  - Dark: #0F1117
  - Gray shades: gray-50 through gray-900
  - Font family: Inter (from Google Fonts)
- Create src/styles/globals.css importing Tailwind directives and Inter from Google Fonts
- Create a placeholder .env.local with keys: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, NEXT_PUBLIC_API_URL=http://localhost:8000

For the backend (Django):
- Create a Python virtual environment inside backend/
- Install: django, djangorestframework, django-cors-headers, python-dotenv, psycopg2-binary, PyJWT, requests, djangorestframework-simplejwt (we won't use it but install for reference), gunicorn
- Run django-admin startproject core . inside backend/
- Create Django apps: users, tasks, attendance, analytics
- Register all apps in settings.py
- Configure settings.py for: PostgreSQL from environment variables, CORS allowing http://localhost:3000, REST_FRAMEWORK with default authentication and permission classes (to be overridden per view), TIME_ZONE = "UTC", USE_TZ = True
- Create a placeholder .env file with: SECRET_KEY, DEBUG=True, DB_NAME=zivio_db, DB_USER=zivio_user, DB_PASSWORD=zivio_pass, DB_HOST=localhost, DB_PORT=5432, CLERK_JWKS_URL, ALLOWED_HOSTS=localhost

Print the final folder structure when done.
```

---

## PROMPT 2 — Django Models & Migrations

```
In the Zivio Django backend, create all database models as described below.
All models should use UUID primary keys (import uuid, use models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)).
Add __str__ methods to all models.
Add created_at and updated_at auto fields where specified.
Run makemigrations for all apps after creating the models.

App: users
Model: User (extends AbstractUser)
Fields:
- id: UUID PK
- clerk_user_id: CharField(max_length=200, unique=True, null=True, blank=True)
- email: EmailField(unique=True) — override AbstractUser's email
- full_name: CharField(max_length=200)
- role: CharField with choices: MANAGER, DIRECTOR, EMPLOYEE, INTERN — default EMPLOYEE
- department: CharField(max_length=100, blank=True, null=True)
- profile_picture_url: URLField(blank=True, null=True)
- is_active: BooleanField(default=True)
- date_joined: DateField(auto_now_add=True)
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
Set AUTH_USER_MODEL = 'users.User' in settings.py.

App: tasks
Model: TaskAssignment
Fields:
- id: UUID PK
- assigned_to: FK to settings.AUTH_USER_MODEL, related_name='assigned_tasks', on_delete CASCADE
- assigned_by: FK to settings.AUTH_USER_MODEL, related_name='created_assignments', on_delete CASCADE
- title: CharField(max_length=100)
- description: TextField(max_length=1000)
- assignment_date: DateField()
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
Add Meta: ordering=['-assignment_date', '-created_at'], indexes on (assigned_to, assignment_date)

Model: TaskLog
Fields:
- id: UUID PK
- assignment: OneToOneField to TaskAssignment, related_name='log', on_delete CASCADE
- submitted_by: FK to settings.AUTH_USER_MODEL, related_name='task_logs', on_delete CASCADE
- status: CharField with choices: COMPLETED, IN_PROGRESS, PENDING, NOT_STARTED — default NOT_STARTED
- notes: TextField(blank=True, null=True)
- logged_at: DateTimeField(auto_now=True)
- log_date: DateField(auto_now_add=True)

App: attendance
Model: Attendance
Fields:
- id: UUID PK
- user: FK to settings.AUTH_USER_MODEL, related_name='attendance_records', on_delete CASCADE
- date: DateField()
- check_in_time: TimeField(null=True, blank=True)
- status: CharField with choices: PRESENT, ABSENT, HALF_DAY — default PRESENT
- auto_recorded: BooleanField(default=True)
Add Meta: unique_together = [('user', 'date')]

After creating models, register all of them in their respective admin.py files with basic list_display and list_filter configurations.
Run python manage.py makemigrations users tasks attendance analytics.
Print a summary of all migrations created.
```

---

## PROMPT 3 — Clerk JWT Authentication Middleware (Django)

```
In the Zivio Django backend, implement Clerk JWT authentication so that every API request from the Next.js frontend can be verified.

Create a file: backend/core/clerk_auth.py

This file should:
1. Fetch Clerk's JWKS (JSON Web Key Set) from the URL in settings (CLERK_JWKS_URL env var) — cache it in memory for 1 hour using a module-level dict with a timestamp.
2. Implement a function verify_clerk_token(token: str) -> dict that:
   - Strips "Bearer " prefix if present
   - Fetches the JWKS keys
   - Decodes and verifies the JWT using PyJWT with RS256 algorithm
   - Returns the decoded payload on success
   - Raises AuthenticationFailed on any error
3. Implement a DRF Authentication class ClerkJWTAuthentication(BaseAuthentication) that:
   - Reads the Authorization header
   - Calls verify_clerk_token
   - Looks up the user in the database by clerk_user_id field
   - If user not found by clerk_user_id, tries to find by email (from JWT 'email' claim)
   - If found by email but clerk_user_id not set, updates the user's clerk_user_id
   - If user not found at all, raises AuthenticationFailed with message "User not registered in the system"
   - If user is inactive, raises AuthenticationFailed
   - Returns (user, token_payload) tuple

4. Add this class as the DEFAULT_AUTHENTICATION_CLASSES in REST_FRAMEWORK settings.
5. Set DEFAULT_PERMISSION_CLASSES to IsAuthenticated.

Create DRF permission classes in backend/core/permissions.py:
- IsManager: checks request.user.role == 'MANAGER'
- IsDirector: checks request.user.role == 'DIRECTOR'
- IsEmployee: checks request.user.role in ('EMPLOYEE', 'INTERN')
- IsManagerOrDirector: checks role in ('MANAGER', 'DIRECTOR')
- IsOwnerOrManagerOrDirector: for task status updates — checks user is the assigned_to person OR is manager/director

Create a test endpoint GET /api/auth/me/ that returns the current user's profile (id, email, full_name, role, profile_picture_url). No special permission needed beyond IsAuthenticated.

Create backend/users/views.py with the MeView.
Create backend/users/urls.py and wire it into core/urls.py under /api/.
```

---

## PROMPT 4 — Task API (Django)

```
In the Zivio Django backend, create the complete Tasks API.

File: backend/tasks/serializers.py
Create:
- TaskAssignmentSerializer (all fields, nested user info: id + full_name + profile_picture_url + role for assigned_to and assigned_by)
- TaskAssignmentCreateSerializer (only: assigned_to id, title, description, assignment_date — assigned_by is set automatically from request.user)
- TaskLogSerializer (all fields)
- TaskStatusUpdateSerializer (only: status, notes — with validation: if status != 'completed', notes must not be blank)
- TaskWithLogSerializer: TaskAssignment data + nested log (null if no log exists yet)

File: backend/tasks/views.py
Create these DRF ViewSets/APIViews:

1. MyTasksView (GET /api/tasks/my/)
   - Permission: IsEmployee
   - Returns all TaskAssignments where assigned_to == request.user
   - Filter by ?date=YYYY-MM-DD (default today)
   - Include the TaskLog if it exists (null otherwise)
   - On first call of the day, also trigger attendance auto-record (call a helper)

2. AllTasksView (GET /api/tasks/)
   - Permission: IsManagerOrDirector
   - Returns all TaskAssignments with optional filters:
     - ?assigned_to=uuid
     - ?date=YYYY-MM-DD
     - ?month=YYYY-MM (returns all tasks in that month)
     - ?start=YYYY-MM-DD&end=YYYY-MM-DD
     - ?status=completed|in_progress|pending|not_started
   - Include TaskLog data nested

3. AssignTaskView (POST /api/tasks/)
   - Permission: IsManager
   - Validates and creates a TaskAssignment
   - Sets assigned_by = request.user automatically
   - Also creates an initial TaskLog with status='not_started', notes=null

4. UpdateTaskStatusView (PATCH /api/tasks/{id}/status/)
   - Permission: IsOwnerOrManagerOrDirector but only employee can actually change status
   - Finds or creates the TaskLog for this assignment
   - Updates status and notes
   - Returns the updated TaskWithLogSerializer

5. TaskDetailView (GET /api/tasks/{id}/)
   - Permission: IsAuthenticated (but employee can only see their own)
   - Returns full task with log

Wire all URLs in backend/tasks/urls.py and include in core/urls.py.
Add database indexes to the TaskAssignment model on (assigned_to, assignment_date) if not already present.
```

---

## PROMPT 5 — Attendance & Analytics API (Django)

```
In the Zivio Django backend, create the Attendance and Analytics APIs.

File: backend/attendance/views.py

1. AutoCheckInView (POST /api/attendance/checkin/)
   - Permission: IsEmployee
   - Gets or creates an Attendance record for request.user and today's date
   - If creating: sets status=PRESENT, check_in_time=now(), auto_recorded=True
   - If already exists: returns existing record (idempotent)
   - Returns the Attendance record

2. MyAttendanceView (GET /api/attendance/my/)
   - Permission: IsEmployee
   - Filter by ?month=YYYY-MM (required)
   - Returns list of all Attendance records for request.user in that month
   - Also returns a summary: total days in month, present count, absent count

3. AllAttendanceView (GET /api/attendance/)
   - Permission: IsManagerOrDirector
   - Filter by ?user_id=uuid AND ?month=YYYY-MM (both required)
   - Returns attendance records for that user in that month
   - Also returns full month grid (all days, absent if no record)

4. AllAttendanceGridView (GET /api/attendance/grid/)
   - Permission: IsManagerOrDirector
   - Filter by ?month=YYYY-MM
   - Returns all users × all days as a 2D structure for the grid view

File: backend/analytics/views.py

1. DailyAnalyticsView (GET /api/analytics/daily/)
   - Permission: IsManagerOrDirector
   - Filter by ?date=YYYY-MM-DD (default today)
   - Returns: total_assigned, completed, in_progress, pending, not_started counts
   - Also returns per-person breakdown

2. WeeklyAnalyticsView (GET /api/analytics/weekly/)
   - Permission: IsManagerOrDirector
   - Filter by ?start=YYYY-MM-DD&end=YYYY-MM-DD
   - Returns array of {date, completed, in_progress, pending, not_started} for each day

3. MonthlyTrendView (GET /api/analytics/monthly/)
   - Permission: IsManagerOrDirector
   - Filter by ?month=YYYY-MM
   - Returns array of {date, total_assigned, total_completed} for line chart

4. PerPersonAnalyticsView (GET /api/analytics/per-person/)
   - Permission: IsManagerOrDirector
   - Filter by ?month=YYYY-MM
   - Returns array of {user_id, full_name, total_tasks, completed, completion_rate_percent}
   - Sorted by completion_rate_percent descending

5. ExportTasksView (GET /api/export/tasks/)
   - Permission: IsManagerOrDirector
   - Accepts same filters as AllTasksView
   - Returns a CSV response (Content-Type: text/csv, Content-Disposition: attachment)
   - Columns: Date, Employee Name, Task Title, Description, Status, Notes, Last Updated

Wire all URLs and include in core/urls.py.
Use Django's ORM aggregation (Count, Q objects, TruncDay) — no raw SQL.
```

---

## PROMPT 6 — Next.js Foundation: Layout, Theme & Clerk Setup

```
In the Zivio Next.js frontend, set up the complete application foundation.

1. App-level setup in src/app/layout.tsx:
   - Wrap everything in ClerkProvider from @clerk/nextjs
   - Wrap in ReactQueryProvider (create src/providers/QueryProvider.tsx with QueryClient)
   - Import Inter from next/font/google, apply to html element
   - Set metadata: title "Zivio", description "Daily task tracking for teams", theme-color #3A9DE9

2. Create a PWA manifest at public/manifest.json:
   - name: "Zivio", short_name: "Zivio"
   - theme_color: "#3A9DE9", background_color: "#FFFFFF"
   - display: "standalone", start_url: "/"
   - icons: reference /icons/icon-192.png and /icons/icon-512.png (create placeholder 1x1 PNG files)
   - Add <link rel="manifest"> in layout.tsx

3. Create the following utility files:
   - src/lib/api.ts — axios instance with baseURL from NEXT_PUBLIC_API_URL, interceptor that adds Authorization Bearer token using Clerk's getToken() before each request
   - src/lib/queryKeys.ts — constants for React Query cache keys
   - src/lib/utils.ts — helper functions: formatDate(date), getStatusColor(status), getStatusLabel(status), getStatusIcon(status)
   - src/types/index.ts — TypeScript interfaces for: User, TaskAssignment, TaskLog, TaskWithLog, Attendance, AnalyticsDay, AnalyticsPerPerson

4. Create Tailwind theme colors matching the design:
   - primary.DEFAULT: #3A9DE9
   - primary.dark: #2480CC
   - primary.light: #EBF5FD
   - status.completed: #22C55E
   - status.in_progress: #3A9DE9
   - status.pending: #F59E0B
   - status.not_started: #9CA3AF

5. Create reusable UI components in src/components/ui/:
   - Badge.tsx — status badge with color prop (completed=green, in_progress=blue, pending=amber, not_started=gray). Accepts status string, renders pill badge.
   - SkeletonCard.tsx — animated skeleton placeholder for loading states
   - EmptyState.tsx — centered illustration (use a Lucide icon) + title + description props
   - Avatar.tsx — circular avatar with fallback initials, accepts name + imageUrl
   - LoadingSpinner.tsx — centered spinner using primary color
   - Button.tsx — primary, secondary, ghost, danger variants with loading state
   - Card.tsx — white card with shadow-sm, rounded-xl, padding variants

6. Create src/middleware.ts using Clerk's authMiddleware:
   - Public routes: /sign-in, /sign-up, /api/auth/me (for initial check)
   - Everything else requires auth
   - After auth, call /api/auth/me to get user role
   - Redirect based on role:
     - employee/intern → /dashboard
     - manager → /manager
     - director → /director
   - Store role in Clerk session claims (publicMetadata) if possible, otherwise fetch from API

Print a summary of all files created.
```

---

## PROMPT 7 — Authentication Pages & Role-Based Routing

```
In the Zivio Next.js frontend, create the authentication flow.

1. Sign-in page at src/app/sign-in/[[...sign-in]]/page.tsx:
   - Full-screen centered layout
   - Left half (desktop only): 
     - Blue background (#3A9DE9)
     - Show the Zivio logo (img tag pointing to /logo.png)
     - Tagline "Every task. Every person. Every day." in white
     - A decorative description of the app in white/transparent text
   - Right half (or full screen on mobile):
     - White background
     - "Welcome to Zivio" heading in dark color
     - Subtitle "Sign in with your company Google account"
     - Clerk's <SignIn> component with appearance customization:
       - Primary color: #3A9DE9
       - Border radius: 12px
       - Hide "sign up" link entirely
     - Small footer note: "Only approved company emails can access this system"
   - If user is already signed in, redirect to their role-based dashboard

2. Unauthorized page at src/app/unauthorized/page.tsx:
   - Centered layout
   - Large lock icon (Lucide) in red
   - Heading: "Access Denied"
   - Body: "Your email is not registered in the Zivio system. Please contact your manager or system administrator."
   - A "Sign out" button that calls Clerk's signOut and redirects to /sign-in

3. Create a hook src/hooks/useCurrentUser.ts:
   - Uses useUser() from Clerk to get the Clerk user
   - Fetches /api/auth/me using React Query
   - Returns { user, isLoading, isError, role } where user is the Django User object
   - Caches the result (staleTime: 5 minutes)

4. Create role guard components in src/components/guards/:
   - ManagerGuard.tsx — wraps children, redirects non-managers to /unauthorized
   - DirectorGuard.tsx — wraps children, redirects non-directors to /unauthorized  
   - EmployeeGuard.tsx — wraps children, redirects non-employees to /unauthorized
   - ManagerOrDirectorGuard.tsx — allows either role

5. Create the root page src/app/page.tsx:
   - If not signed in → redirect to /sign-in
   - If signed in → fetch user role and redirect accordingly
   - Show a full-screen loading state (Zivio logo centered, pulsing) during the redirect
```

---

## PROMPT 8 — Navigation Layouts

```
In the Zivio Next.js frontend, create the navigation layouts for each role.

DESIGN GUIDELINES for all navigation:
- Primary color #3A9DE9 for active states and icons
- White backgrounds
- Subtle gray borders (border-gray-100)
- Smooth hover transitions
- User avatar and name visible in the nav

1. Create src/components/layout/MobileBottomNav.tsx:
   - Fixed bottom bar, white bg, top border gray-100, safe-area-inset-bottom padding
   - Accepts navItems array: { href, icon (Lucide component), label }
   - Active item: icon in #3A9DE9, label in #3A9DE9, dot indicator below icon
   - Inactive: gray-400 icon and text
   - Tappable area minimum 56px height, full-width divided equally

2. Create src/components/layout/DesktopSidebar.tsx:
   - Fixed left sidebar, width 240px, white bg, right border gray-100, full height
   - Top: Zivio logo (80px wide) + "Zivio" text in primary color, 24px bold
   - Middle: nav items with Lucide icons, label, active state = primary-light bg + primary text + left border 3px primary
   - Bottom: user avatar + full_name + role badge + sign out button
   - Role badge colors: Manager=purple, Director=blue, Employee=green, Intern=teal

3. Create three role-specific layout files:

src/app/(employee)/layout.tsx:
   - Wraps with EmployeeGuard
   - Mobile: MobileBottomNav with items: Dashboard (/dashboard, Home icon), Attendance (/dashboard/attendance, Calendar icon), Profile (/profile, User icon)
   - Desktop: DesktopSidebar with same items
   - Main content area with top padding for mobile nav

src/app/(manager)/layout.tsx:
   - Wraps with ManagerGuard
   - Nav items: Assign Tasks (/manager/assign, Plus icon), Task Review (/manager/tasks, ClipboardList icon), Analytics (/manager/analytics, BarChart2 icon), Team (/manager/team, Users icon), Profile (/profile, User icon)

src/app/(director)/layout.tsx:
   - Wraps with DirectorGuard
   - Nav items: Analytics (/director, BarChart2 icon), Tasks (/director/tasks, ClipboardList icon), Attendance (/director/attendance, Calendar icon), Profile (/profile, User icon)

4. Create src/app/profile/page.tsx (shared for all roles):
   - Shows Google profile picture (large, circular)
   - Full name, email, role badge, department (if set), date joined
   - "Sign Out" button at bottom (red/outlined)
   - Uses useCurrentUser hook
```

---

## PROMPT 9 — Employee Dashboard

```
In the Zivio Next.js frontend, build the complete Employee Dashboard.

DESIGN GUIDELINES:
- White page background
- Cards with rounded-xl, shadow-sm, border border-gray-100
- Status colors: completed=#22C55E, in_progress=#3A9DE9, pending=#F59E0B, not_started=#9CA3AF
- All touch targets minimum 44px
- Skeleton loaders while loading

1. Create src/app/(employee)/dashboard/page.tsx:

Header section (full width, white card, no border at top):
   - Left: "Good morning / afternoon / evening, {first_name}" (dynamic based on time)
   - Subtitle: Today's date formatted as "Monday, 23 May 2026"
   - Right: User avatar (circular, 48px, with full name tooltip)
   - Below header: attendance status chip ("✅ Checked in — 9:04 AM") in green

Summary row (3 mini cards in a horizontal scroll or grid):
   - Total tasks today | Completed | Remaining
   - Numbers in 24px bold primary color, labels in gray-500 12px

Tasks section:
   - Section heading "Today's Tasks" with task count badge
   - If no tasks: EmptyState component ("No tasks assigned for today yet.")
   - Task cards list (see TaskCard below)
   - Date picker (small, at the top right of section) to switch to past dates — on past date, cards are read-only

TaskCard component (src/components/tasks/TaskCard.tsx):
   - White card, rounded-xl, shadow-sm, border-l-4 with status color
   - Top row: Task title (16px semibold dark) + Status Badge (right aligned)
   - Middle: Description text (gray-600, 14px, 2-line clamp, expandable with "see more")
   - Bottom row: "Last updated" timestamp (gray-400, 12px) + "Update Status" button (primary, small)
   - On past dates: no Update Status button, show read-only note
   - Loading state: SkeletonCard

2. Create the TaskStatusModal (src/components/tasks/TaskStatusModal.tsx):
   This is a bottom sheet on mobile (slides up from bottom) and a centered modal on desktop.

   Layout:
   - Drag handle (mobile only) — gray pill at top center
   - Task title at top in 16px semibold
   - Section heading "Update Status"
   - Four status option buttons arranged in a 2×2 grid:
     - Each button: icon + label + currently selected = filled colored bg + white text, unselected = white bg + colored border + colored text
     - Completed: CheckCircle2 icon, green
     - In Progress: RefreshCw icon, blue (#3A9DE9)
     - Pending: PauseCircle icon, amber
     - Not Yet Started: Circle icon, gray
   - Notes textarea below the grid:
     - If Completed selected: label "Add remarks (optional)", placeholder "Any comments…"
     - Otherwise: label "Notes (required *)", placeholder "Explain the current situation, blockers, next steps…"
     - Red asterisk on required
     - 4-row textarea, rounded-lg, border gray-300, focus:border-primary, resize-none
   - Submit button:
     - Full width, rounded-xl, 48px height, primary color
     - Disabled + gray when notes required but empty
     - Loading state while API call in progress
   - On success: close modal, update task card status optimistically, show toast "Status updated"

3. Create src/app/(employee)/dashboard/attendance/page.tsx:
   - Monthly calendar grid view (7 columns for days)
   - Each day cell: date number + color dot (green=present, red=absent, amber=half_day, empty=no record)
   - Month selector (prev/next arrows + "May 2026" label)
   - Summary row: "Present: 18 | Absent: 2 | This month"
   - Uses /api/attendance/my/?month= endpoint

4. Create React Query hooks in src/hooks/useTasks.ts:
   - useMyTasks(date) — fetches /api/tasks/my/?date=
   - useUpdateTaskStatus() — mutation for PATCH /api/tasks/{id}/status/
   - On mutation success: invalidate useMyTasks cache
```

---

## PROMPT 10 — Manager Dashboard

```
In the Zivio Next.js frontend, build all Manager pages.

DESIGN STYLE:
- Clean white pages
- Primary blue #3A9DE9 for action buttons and active states
- Person cards with avatar, name, task count badge
- Consistent card style from employee dashboard

1. Create src/app/(manager)/manager/assign/page.tsx — Task Assignment Page:

Header:
   - "Assign Tasks" heading (24px bold)
   - Today's date subtitle
   - Small counter: "X / Y people assigned today" — Y is total employees+interns, X is how many have at least one task today

Team member grid:
   - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
   - Each PersonCard (src/components/manager/PersonCard.tsx):
     - Avatar (48px) + full_name + role badge (Intern/Employee)
     - If tasks already assigned today: show count badge "2 tasks" in primary-light color
     - "Assign Task" button (outlined primary, full width of card)
     - If at least 1 task assigned: green checkmark in top-right corner of card
   - Search bar at top to filter by name
   - Tab filter: "All" | "Employees" | "Interns"

AssignTaskDrawer (src/components/manager/AssignTaskDrawer.tsx):
   - Right-side drawer on desktop, bottom sheet on mobile
   - Shows selected person's name + avatar at top
   - Form fields:
     - Task Title: text input, character counter (max 100), required
     - Task Description: textarea (6 rows), character counter (max 1000), required
     - Date: date picker, defaults to today, can pick future dates
   - "Assign Task" submit button (primary, full width)
   - "Add Another Task" button appears after first task is assigned (adds another form below)
   - On success: close drawer, show success toast, update PersonCard badge

2. Create src/app/(manager)/manager/tasks/page.tsx — Task Review Page:

Filter bar (sticky top):
   - Person dropdown (all employees + interns + "All people")
   - Date picker OR month picker (toggle between "Day" and "Month" mode)
   - Status dropdown (All / Completed / In Progress / Pending / Not Started)
   - "Clear filters" link

Results summary:
   - Row of 4 colored chips: "12 Completed", "3 In Progress", "2 Pending", "1 Not Started"

Task list:
   - ManagerTaskCard (src/components/manager/ManagerTaskCard.tsx):
     - Left: Status color bar (4px left border)
     - Person avatar + name (small)
     - Task title (semibold) + date
     - Status badge + notes preview (if notes exist, show 1 line with "..." expand)
     - Expandable: click to show full description + full notes
   - Grouped by person when "All people" selected (show person name as section header)
   - Grouped by date when month view is active

3. Create src/app/(manager)/manager/analytics/page.tsx — Analytics:
   (Same as Director analytics but limited to manager's own team)
   See Prompt 11 for full analytics implementation — reuse the same components.

4. Create src/app/(manager)/manager/team/page.tsx — Team Overview:
   - List of all employees and interns
   - Each row: avatar, name, role badge, department, join date, "View Tasks" link
   - No editing — display only

5. React Query hooks in src/hooks/useManager.ts:
   - useTeamMembers() — fetch all active employees/interns
   - useAssignTask() — mutation for POST /api/tasks/
   - useAllTasks(filters) — fetches /api/tasks/ with filters
   - useTodayAssignmentStatus() — counts for today's assignment progress
```

---

## PROMPT 11 — Director & Analytics Pages

```
In the Zivio Next.js frontend, build the Director dashboard and all analytics components.

CHART DESIGN:
- All charts use Recharts
- Primary color #3A9DE9 for main data
- Status colors: completed=#22C55E, in_progress=#3A9DE9, pending=#F59E0B, not_started=#9CA3AF
- Charts have custom tooltips matching the app's card style
- All charts have responsive containers
- Chart cards: white, rounded-xl, shadow-sm, padding 24px, title in gray-700 16px semibold

1. Create shared chart components in src/components/analytics/:

StatusBarChart.tsx:
   - Recharts BarChart
   - Grouped bars (one group per day, 4 bars per group: each status)
   - X-axis: dates formatted as "Mon 23"
   - Y-axis: task count
   - Custom legend with status color dots
   - Custom tooltip: shows date + all 4 status counts

CompletionLineChart.tsx:
   - Recharts LineChart with two lines: Total Assigned (gray dashed) + Completed (primary blue solid)
   - X-axis: dates, Y-axis: count
   - Gradient fill under completed line (primary-light)
   - Dots on data points
   - Custom tooltip

PerPersonBarChart.tsx:
   - Horizontal Recharts BarChart
   - Y-axis: person names
   - X-axis: 0–100% (completion rate)
   - Bars filled with primary color, width proportional to completion %
   - Value label at end of each bar ("87%")
   - Bars clickable → navigates to that person's task review

StatusDonutChart.tsx:
   - Recharts PieChart with innerRadius
   - 4 segments for each status
   - Center: large number (total tasks) + "tasks today" label
   - Legend below with count + percentage per status

2. Create src/app/(director)/director/page.tsx — Director Analytics:

Top summary cards row (4 cards):
   - "Total Team": count of all active users, Users icon in primary
   - "Tasks Today": total assigned today, ClipboardList icon
   - "Completed Today": count + percentage, CheckCircle2 icon in green
   - "Still Pending": in_progress + pending + not_started count, AlertCircle icon in amber

Date range filter (sticky, below summary cards):
   - Three tabs: "Today" | "This Week" | "This Month" + custom date range button
   - Selecting a tab updates all charts simultaneously

Charts grid:
   - Row 1: StatusDonutChart (left, 40% width) + StatusBarChart (right, 60% width)
   - Row 2 full width: CompletionLineChart
   - Row 3 full width: PerPersonBarChart

All charts use React Query hooks and update when date filter changes.

3. Create src/app/(director)/director/tasks/page.tsx:
   - Same as Manager task review page (reuse ManagerTaskCard component)
   - Add "Export CSV" button that calls GET /api/export/tasks/ with current filters
   - The response triggers a file download in the browser

4. Create src/app/(director)/director/attendance/page.tsx:
   - Month selector at top
   - Full grid table: rows = employees (sorted alphabetically), columns = all days in month (1–31)
   - Cell: "P" with green bg / "A" with red bg / "H" with amber bg / empty gray for days not in month
   - Sticky first column (employee names)
   - Horizontal scroll on mobile
   - Summary column at the end: "Present: 18 / 22 days"

5. React Query hooks in src/hooks/useAnalytics.ts:
   - useDailyAnalytics(date)
   - useWeeklyAnalytics(start, end)
   - useMonthlyTrend(month)
   - usePerPersonAnalytics(month)
   - useAttendanceGrid(month)
   All use staleTime: 2 minutes, refetchOnWindowFocus: false
```

---

## PROMPT 12 — Polish, PWA & Local Docker Setup

```
In the Zivio project, complete the final polish, PWA configuration, and Docker local development setup.

1. TOAST NOTIFICATIONS:
   Install react-hot-toast. Create src/components/ui/ToastProvider.tsx.
   Add <Toaster> to root layout with position "top-center" on mobile, "bottom-right" on desktop.
   Add toasts for:
   - Task assigned successfully: "Task assigned to {name}" (green)
   - Task status updated: "Status updated to {status}" (color matches status)
   - Error fallback: "Something went wrong. Please try again." (red)
   - Session expired: "Your session expired. Please sign in again." (amber)

2. ERROR HANDLING:
   Create src/components/ui/ErrorBoundary.tsx as a React class component.
   Create src/app/error.tsx (Next.js error page): centered card with triangle warning icon, "Something went wrong" heading, "Try again" button.
   Create src/app/not-found.tsx: "Page not found" with home button.
   In the axios interceptor in src/lib/api.ts:
   - On 401 response: clear Clerk session and redirect to /sign-in
   - On 403 response: redirect to /unauthorized
   - On 500+ response: show error toast

3. LOADING SKELETONS:
   In every page that fetches data, show skeleton placeholders while isLoading is true:
   - Dashboard: 3 skeleton task cards
   - Manager assign: skeleton person cards (6 cards in grid)
   - Analytics: skeleton rectangles where charts will appear
   - Use the SkeletonCard component with animate-pulse Tailwind class

4. PWA CONFIGURATION:
   In next.config.js, configure next-pwa:
   - dest: 'public'
   - disable in development
   - runtimeCaching for API calls: NetworkFirst strategy for /api/ routes
   - runtimeCaching for static assets: CacheFirst strategy
   Add to public/manifest.json: screenshots array (dummy entry), orientation: portrait
   Copy the uploaded logo to public/logo.png and public/icons/icon-192.png and public/icons/icon-512.png
   Add <meta name="apple-mobile-web-app-capable" content="yes"> and related iOS meta tags to layout.tsx

5. DOCKER LOCAL DEVELOPMENT:
   Update the root docker-compose.yml to be production-ready for local use:
   - PostgreSQL 16 service with persistent named volume
   - Environment variables from .env file
   - Health check: pg_isready
   - Port 5432 exposed only to localhost (not 0.0.0.0)
   
   Create a root Makefile with these commands:
   - make db-start: start postgres container
   - make db-stop: stop postgres container
   - make db-reset: stop + remove volume + restart (for fresh start)
   - make migrate: cd backend && python manage.py migrate
   - make superuser: cd backend && python manage.py createsuperuser
   - make seed: run a seed script (see below)
   - make dev: starts both frontend (port 3000) and backend (port 8000) concurrently using concurrently npm package

   Create backend/scripts/seed_data.py (Django management command):
   - Creates 1 manager user, 1 director user, 5 employee users, 3 intern users
   - All with realistic Indian names
   - Creates sample task assignments for the last 7 days with varied statuses

6. RESPONSIVE FINAL CHECK:
   Audit these breakpoints for all pages:
   - 375px (iPhone SE) — everything must be usable without horizontal scroll
   - 768px (iPad) — sidebar appears, grid changes to 2 columns
   - 1280px (desktop) — full sidebar, 3-column grids
   
   Fix any overflow issues. All text must be readable without zoom.
   All form inputs must not cause page zoom on focus on iOS (font-size minimum 16px on inputs).

Print a final file tree of all created files.
```

---

## PROMPT 13 — VPS Deployment (Hostinger)

```
Create all deployment configuration files for deploying Zivio to a Hostinger VPS running Ubuntu 22.04.

Assume:
- VPS IP is in an environment variable DEPLOY_IP
- Domain will be configured later (use IP initially)
- Python 3.11 and Node 20 will be installed on the VPS
- Nginx and Certbot will be installed

1. Create backend/gunicorn.conf.py:
   - workers = 3
   - worker_class = "sync"
   - bind = "127.0.0.1:8000"
   - timeout = 120
   - access_logfile = "/var/log/zivio/gunicorn_access.log"
   - error_logfile = "/var/log/zivio/gunicorn_error.log"

2. Create a Systemd service file at deploy/zivio-backend.service:
   - Service name: zivio-backend
   - WorkingDirectory: /var/www/zivio/backend
   - ExecStart: gunicorn with the conf file
   - EnvironmentFile: /var/www/zivio/backend/.env
   - Restart: always
   - User: www-data

3. Create a Systemd service file at deploy/zivio-frontend.service:
   - Service name: zivio-frontend
   - WorkingDirectory: /var/www/zivio/frontend
   - ExecStart: node .next/standalone/server.js
   - Environment: PORT=3001, NODE_ENV=production
   - Restart: always
   - User: www-data

4. Create deploy/nginx.conf:
   - Server block listening on 80 (to be updated to 443 after Certbot)
   - Location /api/: proxy_pass to http://127.0.0.1:8000, include proxy headers (X-Forwarded-For, X-Real-IP, Host)
   - Location /admin/: proxy_pass to http://127.0.0.1:8000
   - Location /static/: alias /var/www/zivio/backend/staticfiles/ (for Django static files)
   - Location /: proxy_pass to http://127.0.0.1:3001 (Next.js)
   - Gzip compression enabled for text, js, css, json
   - Client max body size 10m

5. Create deploy/deploy.sh — a deployment shell script:
   Steps in order:
   a. Pull latest code from git
   b. Install Python dependencies: pip install -r requirements.txt
   c. Run Django migrations: python manage.py migrate --no-input
   d. Collect Django static files: python manage.py collectstatic --no-input
   e. Restart zivio-backend service
   f. Install Node dependencies: npm ci in frontend/
   g. Build Next.js: npm run build
   h. Copy .next/standalone and public to deployment location
   i. Restart zivio-frontend service
   j. Reload Nginx
   k. Print "✅ Zivio deployed successfully"

6. Create deploy/initial_setup.sh — first-time VPS setup:
   a. Update apt and install: python3.11, python3.11-venv, nodejs 20, nginx, certbot, python3-certbot-nginx, postgresql, postgresql-contrib
   b. Create /var/log/zivio/ directory
   c. Create /var/www/zivio/ directory structure
   d. Create PostgreSQL database and user (using the credentials from .env)
   e. Copy systemd service files to /etc/systemd/system/
   f. Enable and start both services
   g. Copy nginx.conf to /etc/nginx/sites-available/zivio
   h. Create symlink in sites-enabled
   i. Test and reload nginx
   j. Print next steps: run migrations, create superuser, configure Clerk webhook

7. Create deploy/README.md with:
   - Step-by-step deployment guide for a first-time setup
   - How to update the domain and SSL with Certbot
   - How to add environment variables on the server
   - How to run database backups (cron job command)
   - How to view logs (journalctl commands)
   - Common troubleshooting commands

8. Update next.config.js for standalone output:
   output: 'standalone'
   This is required for the deploy script to work.

9. Update backend settings to read ALLOWED_HOSTS from environment (comma-separated list).
   Add STATIC_ROOT = BASE_DIR / 'staticfiles' if not already present.
```

---

## PROMPT 14 — Final QA & Seed Data

```
Perform a complete audit of the Zivio application and fix any issues found. Also create comprehensive seed data.

1. API INTEGRATION AUDIT:
   Test that every React Query hook correctly maps to its Django endpoint:
   - GET /api/tasks/my/?date= → useMyTasks(date)
   - GET /api/tasks/ with all filter combinations → useAllTasks(filters)
   - POST /api/tasks/ → useAssignTask()
   - PATCH /api/tasks/{id}/status/ → useUpdateTaskStatus()
   - GET /api/attendance/my/?month= → useMyAttendance(month)
   - GET /api/attendance/grid/?month= → useAttendanceGrid(month)
   - GET /api/analytics/daily/?date= → useDailyAnalytics(date)
   - GET /api/analytics/weekly/?start=&end= → useWeeklyAnalytics(start, end)
   - GET /api/analytics/monthly/?month= → useMonthlyTrend(month)
   - GET /api/analytics/per-person/?month= → usePerPersonAnalytics(month)
   
   Ensure every hook handles: loading state, error state, empty array (not null) for lists.

2. FORM VALIDATION AUDIT:
   Verify these validations work with user-friendly error messages:
   - Task title: required, max 100 chars, error shown below field in red
   - Task description: required, max 1000 chars, char counter visible
   - Task notes: required when status is not 'completed', inline error
   - Date picker: cannot assign to past dates (disable past dates in the picker)

3. MOBILE UX AUDIT:
   Check on 375px width:
   - No horizontal overflow on any page
   - Bottom sheet modals don't cover the entire screen (85vh max, scrollable)
   - Date pickers are native on mobile (type="date" input inside a styled wrapper)
   - All font sizes minimum 14px
   - No tiny close buttons — minimum 44×44px tap area

4. CREATE DJANGO MANAGEMENT COMMAND backend/users/management/commands/create_sample_data.py:
   This command (run with python manage.py create_sample_data) creates:
   
   Users:
   - Director: Rajesh Kumar, rajesh.kumar@company.com, role=director
   - Manager: Priya Sharma, priya.sharma@company.com, role=manager
   - Employees: Arjun Patel, Deepa Nair, Vikram Singh, Ananya Reddy (role=employee)
   - Interns: Rohan Mehta, Kavya Iyer, Siddharth Joshi (role=intern)
   - Set clerk_user_id to a placeholder string for each
   
   Tasks (for the last 14 days, 2-3 tasks per person per day):
   - Realistic task titles related to software company work:
     "Review pull request #142", "Update API documentation", "Fix login page bug",
     "Write unit tests for user module", "Daily standup meeting notes",
     "Research competitor features", "Update project timeline", etc.
   - Vary statuses realistically:
     - Older days (> 2 days ago): mostly completed, some pending
     - Yesterday: mix of all statuses
     - Today: mostly not_started (morning) or in_progress
   - Add realistic notes for non-completed tasks

5. ENVIRONMENT SETUP DOCUMENTATION:
   Create a root .env.example file with all required environment variables (with placeholder values and comments explaining each).
   Create a root SETUP.md with:
   - Prerequisites: Node 20, Python 3.11, Docker Desktop
   - Step-by-step local development setup (clone → docker → migrate → seed → run)
   - How to get Clerk keys from the Clerk dashboard
   - How to configure Google OAuth in Clerk
   - How to add the email allowlist in Django admin

Print "✅ Zivio is ready for development" when all checks pass.
```

---

## Notes for Each Prompt

- **Run each prompt in order.** Later prompts reference files and patterns from earlier ones.
- **After Prompt 1:** Manually start Docker Desktop and run `make db-start` before running Prompt 2.
- **After Prompt 3:** You need your actual Clerk publishable key and the JWKS URL from your Clerk dashboard. Get these before running any auth-related prompts.
- **After Prompt 14:** Run `python manage.py create_sample_data` and test all 4 roles by adding those emails to Clerk's allowlist and logging in with Google.
- **For deployment (Prompt 13):** You'll need SSH access to your Hostinger VPS and a domain pointed to its IP.

---

*End of Agentic Build Prompts — Zivio v1.0*
