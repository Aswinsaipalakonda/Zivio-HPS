# Zivio

Zivio is a daily task tracking and team management platform built for small teams. It allows managers to assign daily tasks, tracks completion status, and provides performance analytics.

## Project Structure

- `frontend/`: Next.js 14 application (App Router, TypeScript, Tailwind CSS)
- `backend/`: Django 5 application (Python, Django REST Framework)

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Clerk (Auth), TanStack Query
- **Backend:** Django, PostgreSQL
- **Infrastructure:** Docker (for local database)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Docker Desktop

### Setup

1. **Database:**
   ```bash
   docker-compose up -d
   ```

2. **Backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
