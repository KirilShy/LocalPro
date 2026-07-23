# LocalPro

A two-sided marketplace connecting local service providers (coaches, tutors, 
repair technicians, etc.) with clients who search for and book them.

Built as a portfolio project to demonstrate backend architecture, API design, 
and cloud deployment practices — not just CRUD.

## Status

🚧 **In active development.** This is a work-in-progress capstone project. 
Current focus: core data model, authentication, and permission architecture.

## Architecture

LocalPro is a two-sided marketplace, not a simple multi-tenant SaaS. Provider 
profiles and services are meant to be **publicly readable** (anyone can search 
and browse, even unauthenticated), while only the owning provider can create 
or modify their own listings. This mixed public-read / scoped-write permission 
model is more representative of real marketplace platforms than a simple 
"isolate by organization" pattern.

So far only the public-read half is built (`GET /api/providers/profiles/`); 
the owner-scoped write endpoints for `ProviderProfile` and `Service` don't 
exist yet — see Roadmap.

**Core entities:**
- `User` — custom user model with a `client` / `provider` role
- `ProviderProfile` — public business profile, one-to-one with a provider user
- `Service` — a bookable offering belonging to a provider
- `Availability` — a bookable time slot for a provider's service
- `Booking` — links a client to an availability slot; created through a
  concurrency-safe service (`select_for_update()`) so two clients can't
  double-book the same slot
- `Review` *(planned)* — client feedback tied to a completed booking

## Tech stack

**Backend**
- Django + Django REST Framework
- PostgreSQL
- JWT authentication (SimpleJWT), with rotating refresh tokens
- Celery + Redis for async tasks (booking reminders, notifications)

**Frontend**
- React + TypeScript (Vite)

**Infrastructure**
- Docker + docker-compose for local development
- NGINX as reverse proxy
- AWS (ECS Fargate, RDS, S3, CloudFront), provisioned with Terraform
- GitHub Actions for CI/CD

**Testing**
- pytest-django + factory_boy (backend)
- Jest + React Testing Library (frontend)
- Playwright for end-to-end coverage of the core search → book → confirm flow

**Docs**
- drf-spectacular (OpenAPI/Swagger)

## Local development

```bash
git clone https://github.com/KirilShy/LocalPro.git
cd LocalPro
python -m venv venv
source venv/bin/activate       # venv\Scripts\activate on Windows
pip install -r backend/requirements/local.txt

cp .env.example .env           # then fill in SECRET_KEY and DB_* values
docker compose up -d db redis  # starts Postgres + Redis (backend is also
                                # dockerized, but --reload workflows are
                                # smoother running Django from the venv below)

python backend/manage.py migrate
python backend/manage.py runserver

cd frontend
npm install
npm run dev                    # http://localhost:5173
```

If Docker isn't available, Postgres 16 and Redis installed directly (e.g. 
`brew install postgresql@16 redis`) work fine too — just match the 
`DB_*` values in `.env` to whatever's running locally.

## Roadmap

- [x] Custom User model with role-based access
- [x] Provider profile and service models (schema only — see write endpoints below)
- [x] JWT authentication
- [x] Registration flow
- [x] Postgres + Redis via docker-compose for local development
- [x] Backend containerized (production Dockerfile, included in docker-compose)
- [x] Concurrency-safe booking creation (`select_for_update()`), covered by a threaded test
- [x] Provider list endpoint (public read: `GET /api/providers/profiles/`)
- [x] React frontend scaffolded (Vite + TS), talking to the API over JWT
- [x] Booking creation returns serialized data (`BookingSerializer`) instead of a
      raw model instance
- [x] Availability endpoints — public list, filterable by service (`GET
      /api/providers/availability/?service=<id>`)
- [x] My-bookings endpoint (`GET /api/bookings/mine/`)
- [x] Frontend: routed app (react-router) with the full search → book → confirm
      flow — browse providers, view a provider's services and open slots, book a
      slot, register/log in, review bookings
- [ ] Provider-owner write endpoints (create/update `ProviderProfile` and `Service`, 
      scoped to the owning user) — the permission model the README architecture 
      section describes isn't implemented yet, only the public-read side is
- [ ] Real test coverage — only the booking-concurrency test exists; `users` and 
      `providers` still have the default empty Django test stubs, and `factory_boy` 
      isn't used anywhere despite being in `requirements/local.txt`
- [ ] Review system
- [ ] AI-powered semantic provider search
- [ ] AWS deployment via Terraform
- [ ] CI/CD pipeline

## Author

Built by [Kiril](https://kiril.pl) — Backend Developer & IT Administrator, 
AWS Certified AI Practitioner.