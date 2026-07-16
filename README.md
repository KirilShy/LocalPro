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
profiles and services are **publicly readable** (anyone can search and browse, 
even unauthenticated), but only the owning provider can create or modify their 
own listings. This mixed public-read / scoped-write permission model is more 
representative of real marketplace platforms than a simple "isolate by 
organization" pattern.

**Core entities:**
- `User` — custom user model with a `client` / `provider` role
- `ProviderProfile` — public business profile, one-to-one with a provider user
- `Service` — a bookable offering belonging to a provider
- `Booking` *(planned)* — links a client to a provider's service at a scheduled time
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
git clone https://github.com/<your-username>/localpro.git
cd localpro
python -m venv venv
source venv/bin/activate
pip install -r requirements/local.txt
python manage.py migrate
python manage.py runserver
```

*(Docker Compose setup coming soon — will replace the manual steps above.)*

## Roadmap

- [x] Custom User model with role-based access
- [x] Provider profile and service models with public-read / owner-write permissions
- [x] JWT authentication
- [ ] Registration flow
- [ ] Availability and booking system
- [ ] Review system
- [ ] React frontend
- [ ] Dockerized local dev environment
- [ ] AI-powered semantic provider search
- [ ] AWS deployment via Terraform
- [ ] CI/CD pipeline

## Author

Built by [Kiril](https://kiril.pl) — Backend Developer & IT Administrator, 
AWS Certified AI Practitioner.