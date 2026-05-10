# Smart Inventory Manager

## Cloud Technologies – Assessment 002

This project was developed as part of the **SWE5308 – Cloud Technologies** module at **New York College of Athens** for the 2025–2026 academic year.

The application demonstrates the implementation of a modern cloud-ready full stack web application using contemporary technologies including React, Django REST Framework, MySQL, Docker, and cloud deployment services.

---

## Developed By

**Nikos Tsigkros**

---

## Project Overview

Smart Inventory Manager is a simple inventory and product management system designed to demonstrate:

- User authentication and authorization
- CRUD operations
- REST API communication
- Database integration
- Containerization with Docker
- Cloud deployment workflows
- Basic security practices aligned with OWASP principles

The application allows authenticated users to manage inventory products through a modern web interface connected to a RESTful backend API.

---

## Deployment (DigitalOcean App Platform)

Step-by-step notes for a **backend** Web Service (Dockerfile) and **frontend** Static Site or Web Service are in [deploy/DIGITALOCEAN.md](deploy/DIGITALOCEAN.md). The repository root [`.gitignore`](.gitignore) excludes `backend/venv/` so Python buildpacks do not fail; use the Dockerfile-based backend deploy for production.

---

## Technologies Used

### Frontend
- React
- Vite
- Axios
- React Router DOM

### Backend
- Django
- Django REST Framework
- JWT Authentication

### Database
- MySQL

### DevOps & Cloud
- Docker
- Docker Compose
- DigitalOcean / AWS Cloud Deployment

---

## Project Architecture

```text
React Frontend
       ↓
REST API Requests
       ↓
Django REST Framework Backend
       ↓
MySQL Database