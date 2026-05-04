Dev run options

This project supports three practical local workflows on macOS (choose one):

A) Host dev servers (recommended on macOS)
- Run the frontend and backend dev servers on your host (fast iteration).
- Use Docker only for the database and optionally for production images.

Commands:
```bash
# Start DB only with compose (uses docker-compose.db.yml)
docker compose -f docker-compose.db.yml up -d

# Frontend (host): in workspace/frontend
npm install
npm start

# Backend (host): in workspace/backend
npm install
npm run dev
```

B) Dev-in-container using a file-sync tool (recommended if you must run dev servers in containers)
- Use Mutagen to sync your local files into a container-friendly filesystem to avoid macOS bind-mount I/O issues.
- Requires installing Mutagen: https://mutagen.io/

Example Mutagen YAML (mutagen.yml):
```yaml
sync:
  defaults:
    mode: two-way-resolved
  frontend:
    alpha: ./frontend
    beta: 'docker://plataforma-idebrasil/frontend-dev/volume:/app'
  backend:
    alpha: ./backend
    beta: 'docker://plataforma-idebrasil/backend/volume:/app'
```

Once installed, start a Mutagen session and then the containers. This mirrors files inside the container file system so npm can read/write normally.

C) Debug and adjust Docker Desktop / file sharing permissions
- Sometimes Docker Desktop's file sharing causes `Unknown system error -35` or EACCES when containers attempt to read/mutate files from host mounts.
- Actions to try:
  - Ensure the project directory is in Docker Desktop > Settings > Resources > File Sharing (or allow the drive).
  - If permission errors persist, `chown -R $(id -u):$(id -g) frontend backend` on the host may help (be mindful of repo ACLs).

Which to choose?
- If you want the fastest, least-friction setup on macOS: pick A (host dev servers + Docker DB). I'll help wire a small `docker-compose.db.yml` (already added) and a tiny README (this file).
- If you MUST run dev servers in containers (CI parity or team standard) pick B — I can set up a Mutagen example and a small script to orchestrate it.

If you'd like, tell me "Do A", "Do B", or "Do C" and I will implement that path now (apply patches and run the appropriate verification steps).