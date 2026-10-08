# ReChat Git

This repository contains a lightweight static Git browser designed for GitHub Pages. It is a custom interface inspired by the idea of a minimal "Gitea/GitLab-lite" experience, while staying compatible with GitHub Pages' static hosting limitations.

Features:
- repository card with metadata
- quick stats panel
- repository tree rendering
- recent commit history
- repo switcher input
- GitHub Pages-ready static deployment

Important note:
GitHub Pages cannot host a server-side Git service like the real Gitea or GitLab backend. This project is a front-end UI that reads repo data from the GitHub API and renders it as a custom ReChat Git portal.

Files:
- `index.html` — main UI
- `styles.css` — theme and layout
- `app.js` — GitHub API data loading
- `.github/workflows/pages.yml` — GitHub Pages deployment

To deploy:
1. Push these files to the `main` branch.
2. Go to GitHub repo Settings → Pages.
3. Select GitHub Actions as the source.
4. The workflow will deploy the site.
