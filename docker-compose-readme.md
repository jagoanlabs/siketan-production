# Docker Setup for Project Siketan

This project uses Docker Compose to manage multiple services including the frontend, backend, MySQL database, and an Nginx reverse proxy.

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## How to Run

1. Copy the example environment files and customize if needed:
   ```bash
   # In backend directory
   cp .env.example .env
   
   # In frontend directory
   cp .env.example .env
   ```

2. Build and start the services:
   ```bash
   docker-compose up --build
   ```

3. To run in detached mode:
   ```bash
   docker-compose up --build -d
   ```

4. To stop the services:
   ```bash
   docker-compose down
   ```

## Services

- **Web Access**: Available at http://localhost (handled by Nginx reverse proxy)
- **Backend API**: Available internally at http://backend:5000 (proxied via /api/ path)
- **Database**: MySQL on port 3306 (internal usage)
- **Nginx**: Reverse proxy handling routing between frontend and backend

## Nginx Configuration

The Nginx reverse proxy is configured to:
- Serve frontend assets from the React build at the root path `/`
- Proxy API requests to `/api/` path to the backend service
- Handle health checks at `/health` path to the backend service

## Notes

- The database will persist data using Docker volumes
- The backend service waits for the database to be ready before starting
- The frontend service waits for the backend to be ready before starting
- The nginx service waits for both frontend and backend to be ready before starting
- API requests from the frontend should be made to `/api/` path which will be proxied to the backend