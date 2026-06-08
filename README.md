# ResortBook — Premium Booking System

A production-quality resort/hotel/café booking platform with a premium SaaS-style UI and full admin CRM panel.

## Stack

| Layer | Technology |
|--------|------------|
| Frontend | React (Vite), Tailwind CSS, Framer Motion, Recharts |
| Backend | Python Flask REST API, JWT Auth |
| Database | SQLite (demo) — swap to PostgreSQL in production |

## Features

### User Side
- Premium landing page (hero, services, gallery, testimonials, contact)
- Full booking flow with calendar, time slots, guest count, price calculation
- Demo payment (Razorpay / UPI placeholders)
- Booking confirmation with reference ID
- WhatsApp floating button, dark/light theme, toast notifications

### Admin Panel
- Dashboard with stats and charts
- Booking management (accept/reject, filters)
- Customer CRM with booking history
- Service/room CRUD
- Analytics (trends, popular services)

## Quick Start

### 1. Backend

```bash
cd booking-system/backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

API runs at **http://localhost:5000** (auto-seeds demo data on first run).

**Admin login:** `admin@resortbook.com` / `admin123`

### 2. Frontend

```bash
cd booking-system/frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/admin/login` | Admin login |
| GET | `/api/services` | List services |
| POST | `/api/bookings` | Create booking |
| POST | `/api/bookings/:ref/pay` | Process payment (demo) |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/bookings` | List bookings |
| PATCH | `/api/admin/bookings/:id/status` | Update status |
| GET | `/api/admin/customers` | Customer CRM |
| GET | `/api/admin/analytics` | Analytics data |

## Project Structure

```
booking-system/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── seed.py
│   ├── models/
│   ├── routes/
│   └── controllers/
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── admin/
        └── services/
```

## Production Notes

- Set `SECRET_KEY` and `JWT_SECRET_KEY` environment variables
- Replace SQLite with PostgreSQL: `DATABASE_URL=postgresql://...`
- Integrate real Razorpay/UPI payment gateway
- Wire email (SendGrid) and WhatsApp (Twilio) notification hooks in `booking_controller.py`

## License

MIT

