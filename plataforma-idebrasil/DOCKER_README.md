Run the full stack (frontend + backend + MySQL) locally with Docker Compose.

From the repo root:

```bash
docker compose up --build
```

This will:
- build the backend (Node/TypeScript) and run it on port 3001
- build the frontend static site and serve it via nginx on port 3000
- start a MySQL 8.0 container with a preconfigured database and user

Default MySQL credentials (for local dev):
- root / rootpassword
- idebrasil / idebrasilpass (database: idebrasil_platform)

You can stop the stack with:

```bash
docker compose down -v
```
