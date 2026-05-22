# 🦷 Dental Clinic Scheduler

Internal scheduling tool for admin and dentists. Replaces paper notes and WhatsApp tracking with a fast, mobile-first digital schedule.

**Not a patient-facing app. Staff only.**

---

## What It Does

- Admin creates appointments received via WhatsApp
- Dentists log in and view their own schedule
- Day view grouped by dentist, card-based mobile UI
- Search by patient name or phone number
- No patient accounts, no online booking, no payments

---

## Tech Stack

| Layer    | Tech                                  |
|----------|---------------------------------------|
| Frontend | React 18 + Vite + React Query         |
| Backend  | Django 5 + Django REST Framework      |
| Auth     | Django Session Authentication         |
| Database | PostgreSQL                            |
| Deploy   | Vercel (frontend) + Railway (backend) |

---

## Local Development Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL running locally

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd dental-scheduler
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set your local DB credentials and a real SECRET_KEY

# Create the database
createdb dental_db               # or create via pgAdmin

# Run migrations
python manage.py migrate

# Create initial users (admin + 3 dentists)
python manage.py seed_users

# Start the dev server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**
Django admin: **http://localhost:8000/admin/** (login: `admin` / `admin1234`)

### 3. Frontend setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

The Vite dev server proxies `/api/*` to Django automatically — no CORS issues in development.

### Default Login Credentials (development only)

| Username  | Password     | Role    |
|-----------|--------------|---------|
| admin     | admin1234    | Admin   |
| dentist1  | dentist1234  | Dentist |
| dentist2  | dentist1234  | Dentist |
| dentist3  | dentist1234  | Dentist |

⚠️ **Change all passwords before going live.**

---

## Project Structure

```
dental-scheduler/
├── backend/
│   ├── core/
│   │   ├── settings/
│   │   │   ├── base.py          # shared settings
│   │   │   ├── local.py         # development
│   │   │   └── production.py    # Railway deployment
│   │   ├── authentication.py    # CSRF-exempt session auth
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/
│   │   ├── models.py            # User with role field (admin/dentist)
│   │   ├── views.py             # login, logout, me, dentists
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── management/commands/
│   │       └── seed_users.py    # initial data seeding
│   ├── appointments/
│   │   ├── models.py            # Appointment (flat, no Patient model)
│   │   ├── serializers.py
│   │   ├── views.py             # role-filtered CRUD
│   │   ├── permissions.py       # IsAdminOrReadOnly
│   │   ├── urls.py
│   │   └── admin.py
│   ├── Procfile                 # Railway process definition
│   ├── runtime.txt              # Python version for Railway
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js        # Axios with withCredentials: true
    │   ├── context/
    │   │   └── AuthContext.jsx  # Login state, logout mutation
    │   ├── hooks/
    │   │   ├── useAppointments.js  # all CRUD mutations + queries
    │   │   └── useDentists.js      # dentist list for dropdowns
    │   ├── components/
    │   │   ├── AppointmentCard.jsx   # tap-to-expand, edit/delete
    │   │   ├── DayNavigator.jsx      # prev/next day buttons
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── SchedulePage.jsx       # main day view + embedded search
    │   │   └── AppointmentFormPage.jsx # create + edit (same component)
    │   ├── utils/
    │   │   └── dates.js         # date helpers, no library needed
    │   ├── App.jsx              # routes
    │   ├── main.jsx
    │   └── index.css            # all styles, mobile-first
    ├── vercel.json              # /api/* rewrites to Railway backend
    ├── vite.config.js           # dev proxy to Django
    └── package.json
```

---

## API Reference

### Auth endpoints

```
POST   /api/auth/login/       { username, password } → user object
POST   /api/auth/logout/      → { ok: true }
GET    /api/auth/me/          → current user
GET    /api/auth/dentists/    → list of active dentists (for dropdowns)
```

### Appointments endpoints

```
GET    /api/appointments/                 list (role-filtered automatically)
POST   /api/appointments/                 create (admin only)
GET    /api/appointments/{id}/            detail
PATCH  /api/appointments/{id}/            update (admin only)
DELETE /api/appointments/{id}/            delete (admin only)
```

**Query parameters for GET /api/appointments/:**

| Param       | Description                              | Example          |
|-------------|------------------------------------------|------------------|
| `date`      | Filter by date (day view)                | `?date=2025-01-15` |
| `search`    | Search patient name or phone             | `?search=John`   |
| `dentist_id`| Filter by dentist (admin only)           | `?dentist_id=2`  |

### Role-based access

| Action              | Admin | Dentist         |
|---------------------|-------|-----------------|
| View all schedules  | ✅    | ❌ (own only)   |
| Create appointment  | ✅    | ❌              |
| Edit appointment    | ✅    | ❌              |
| Delete appointment  | ✅    | ❌              |
| Search              | ✅    | ✅ (own only)   |

---

## Deployment

### Backend → Railway

#### First-time setup

1. Go to [railway.app](https://railway.app) → New Project
2. **Add PostgreSQL** plugin first (click + → Database → PostgreSQL)
3. **Add Python service** → connect your GitHub repo → select the `backend/` folder as root (or set root directory in Railway settings)
4. Set environment variables in Railway:

```
DJANGO_SETTINGS_MODULE = core.settings.production
SECRET_KEY              = <generate a strong random key>
RAILWAY_PUBLIC_DOMAIN   = <your-app>.railway.app  (Railway provides this)
FRONTEND_URL            = https://your-app.vercel.app
```

`DATABASE_URL` is injected automatically by Railway — do not set it manually.

5. Railway reads `Procfile` automatically:
   ```
   web:     gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 2
   release: python manage.py migrate --noinput
   ```
   The `release` phase runs migrations before every deploy. No manual steps needed.

6. After first deploy, seed users:
   ```bash
   # In Railway dashboard → your service → Shell tab
   python manage.py seed_users
   ```

#### Generating a SECRET_KEY

```python
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → import your repo
2. **Root directory**: `frontend`
3. **Framework preset**: Vite (auto-detected)
4. **No environment variables needed** — the `vercel.json` proxy handles everything

5. Update `vercel.json` with your Railway backend URL:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR_ACTUAL_BACKEND.railway.app/api/:path*"
    }
  ]
}
```

**Why `vercel.json` rewrites?**
Vercel rewrites `/api/*` server-side to your Railway backend. The browser only sees your Vercel domain — no CORS, no cross-origin cookie issues. Session cookies work perfectly.

6. Deploy. Done.

---

### Adding a New Dentist

No code changes needed — all managed through Django admin:

1. Go to `https://your-backend.railway.app/admin/`
2. Users → Add User
3. Fill in: username, password, first name, last name
4. Set **Role = Dentist**
5. Save

The dentist appears immediately in the app dropdown and gets their own login.

---

### Changing a Password

1. Django admin → Users → click the user → Password section → Change Password
2. Or via shell: `python manage.py changepassword <username>`

---

## Common Issues

### "Session not working in production"
- Check `CORS_ALLOW_CREDENTIALS = True` in production settings
- Check `SESSION_COOKIE_SAMESITE = 'Lax'`
- Make sure `vercel.json` rewrites are correct (the `/api/` destination URL must be exact)

### "CSRF verification failed"
- The app uses `CsrfExemptSessionAuthentication` — CSRF is intentionally skipped on API endpoints
- If Django admin CSRF breaks, it's unrelated to the API; check middleware order

### "502 Bad Gateway on Railway"
- Check Railway logs → most likely a missing environment variable
- Verify `DJANGO_SETTINGS_MODULE` is set to `core.settings.production`

### "Appointments not showing after create"
- React Query invalidates by `{ date }` key — make sure the appointment `date` returned by the API matches the format expected (`YYYY-MM-DD`)

### "iOS keyboard zooms the form"
- All inputs use `font-size: 16px` in CSS — this prevents iOS auto-zoom. Do not set font-size below 16px on inputs.

### "Sunday appointments can be created"
- Sunday validation runs in both serializer (`validate()`) and model (`clean()`)
- The form's `<input type="date">` doesn't restrict by day — the backend rejects it

---

## Next Steps (Post-MVP)

These are **not** in v1 — add only when the clinic actually asks for them:

| Feature               | Effort | When to add                        |
|-----------------------|--------|------------------------------------|
| Conflict detection    | Small  | When double-bookings become a problem |
| Appointment duration  | Small  | Add `end_time` field to model      |
| Week overview         | Medium | After day view is well-established |
| Patient history       | Medium | Add separate Patient model + link  |
| Push notifications    | Large  | If dentists miss appointments      |
| PWA / installable app | Small  | Add manifest + service worker      |
| Swipe navigation      | Small  | Add `react-swipeable` when needed  |

---

## Security Notes

- All API routes require authentication — unauthenticated requests return 403
- Dentists can only read their own appointments — enforced server-side in `get_queryset()`
- `IsAdminOrReadOnly` permission blocks write operations for dentist role
- Sessions expire after 7 days (`SESSION_COOKIE_AGE`)
- `SESSION_COOKIE_SECURE = True` in production (HTTPS only)
- No sensitive data in localStorage or URL params

---

## License

Private — internal tool for [clinic name]. Not for redistribution.
